#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT_DIR"

need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

need gcloud
need git
need openssl
need python3

PROJECT_ID="${GOOGLE_CLOUD_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || true)}"
REGION="${GOOGLE_CLOUD_REGION:-europe-west3}"
SERVICE_NAME="${CLOUD_RUN_SERVICE:-kleinkunst-dashboard}"
ARTIFACT_REPO="${ARTIFACT_REGISTRY_REPOSITORY:-kleinkunst}"
SQL_INSTANCE_NAME="${GOOGLE_CLOUD_SQL_INSTANCE_NAME:-kleinkunst-postgres}"
SQL_DATABASE="${GOOGLE_CLOUD_SQL_DATABASE:-kleinkunst}"
SQL_USER="${GOOGLE_CLOUD_SQL_USER:-kleinkunst_app}"
RUNTIME_SERVICE_ACCOUNT_NAME="${GOOGLE_CLOUD_RUN_SERVICE_ACCOUNT:-kleinkunst-run}"
MIGRATION_BUCKET="${GOOGLE_CLOUD_MIGRATION_BUCKET:-${PROJECT_ID}-kleinkunst-migrations}"
DATABASE_PASSWORD_SECRET="${DATABASE_PASSWORD_SECRET:-kleinkunst-db-password}"
DATABASE_URL_SECRET="${DATABASE_URL_SECRET:-kleinkunst-database-url}"
RUN_MIGRATIONS="${RUN_MIGRATIONS:-true}"

if [[ -z "$PROJECT_ID" || "$PROJECT_ID" == "(unset)" ]]; then
  echo "GOOGLE_CLOUD_PROJECT_ID or gcloud config project is required." >&2
  exit 1
fi

if ! gcloud auth list --filter='status:ACTIVE' --format='value(account)' | grep -q .; then
  echo "No active gcloud account. Run: gcloud auth login" >&2
  exit 1
fi

PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
INSTANCE_CONNECTION_NAME="${PROJECT_ID}:${REGION}:${SQL_INSTANCE_NAME}"
RUNTIME_SERVICE_ACCOUNT="${RUNTIME_SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
CLOUD_BUILD_SERVICE_ACCOUNT="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"
IMAGE_TAG="$(git rev-parse --short HEAD)"
IMAGE_URI="${REGION}-docker.pkg.dev/${PROJECT_ID}/${ARTIFACT_REPO}/${SERVICE_NAME}:${IMAGE_TAG}"
MIGRATION_OBJECT="gs://${MIGRATION_BUCKET}/migrations/202607080001_core_schema-${IMAGE_TAG}.sql"

echo "Project: ${PROJECT_ID}"
echo "Region: ${REGION}"
echo "Cloud Run service: ${SERVICE_NAME}"
echo "Cloud SQL instance: ${INSTANCE_CONNECTION_NAME}"
echo "Image: ${IMAGE_URI}"

gcloud config set project "$PROJECT_ID" >/dev/null
gcloud config set run/region "$REGION" >/dev/null

gcloud services enable \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  iam.googleapis.com \
  run.googleapis.com \
  secretmanager.googleapis.com \
  sqladmin.googleapis.com \
  storage.googleapis.com

if ! gcloud iam service-accounts describe "$RUNTIME_SERVICE_ACCOUNT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$RUNTIME_SERVICE_ACCOUNT_NAME" \
    --display-name="Kleinkunst Cloud Run runtime"
fi

for role in roles/cloudsql.client roles/secretmanager.secretAccessor; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${RUNTIME_SERVICE_ACCOUNT}" \
    --role="$role" \
    --quiet >/dev/null
done

gcloud projects add-iam-policy-binding "$PROJECT_ID" \
  --member="serviceAccount:${CLOUD_BUILD_SERVICE_ACCOUNT}" \
  --role="roles/artifactregistry.writer" \
  --quiet >/dev/null

if ! gcloud artifacts repositories describe "$ARTIFACT_REPO" --location="$REGION" >/dev/null 2>&1; then
  gcloud artifacts repositories create "$ARTIFACT_REPO" \
    --repository-format=docker \
    --location="$REGION" \
    --description="Container images for Kleinkunst Dashboard"
fi

if ! gcloud sql instances describe "$SQL_INSTANCE_NAME" >/dev/null 2>&1; then
  gcloud sql instances create "$SQL_INSTANCE_NAME" \
    --database-version=POSTGRES_16 \
    --region="$REGION" \
    --tier="${GOOGLE_CLOUD_SQL_TIER:-db-f1-micro}" \
    --storage-type=SSD \
    --storage-size="${GOOGLE_CLOUD_SQL_STORAGE_GB:-10}" \
    --availability-type=zonal \
    --backup-start-time=03:00
fi

if ! gcloud sql databases describe "$SQL_DATABASE" --instance="$SQL_INSTANCE_NAME" >/dev/null 2>&1; then
  gcloud sql databases create "$SQL_DATABASE" --instance="$SQL_INSTANCE_NAME"
fi

if gcloud secrets describe "$DATABASE_PASSWORD_SECRET" >/dev/null 2>&1; then
  DB_PASSWORD="$(gcloud secrets versions access latest --secret="$DATABASE_PASSWORD_SECRET")"
else
  DB_PASSWORD="$(openssl rand -base64 36 | tr -d '\n')"
  printf "%s" "$DB_PASSWORD" | gcloud secrets create "$DATABASE_PASSWORD_SECRET" --data-file=-
fi

if gcloud sql users describe "$SQL_USER" --instance="$SQL_INSTANCE_NAME" >/dev/null 2>&1; then
  gcloud sql users set-password "$SQL_USER" \
    --instance="$SQL_INSTANCE_NAME" \
    --password="$DB_PASSWORD"
else
  gcloud sql users create "$SQL_USER" \
    --instance="$SQL_INSTANCE_NAME" \
    --password="$DB_PASSWORD"
fi

DATABASE_URL="$(python3 - "$SQL_USER" "$DB_PASSWORD" "$SQL_DATABASE" "$INSTANCE_CONNECTION_NAME" <<'PY'
import sys
from urllib.parse import quote

user, password, database, instance = sys.argv[1:]
print(
    f"postgresql://{quote(user)}:{quote(password)}@localhost/{quote(database)}"
    f"?host={quote('/cloudsql/' + instance, safe='')}"
)
PY
)"

if gcloud secrets describe "$DATABASE_URL_SECRET" >/dev/null 2>&1; then
  printf "%s" "$DATABASE_URL" | gcloud secrets versions add "$DATABASE_URL_SECRET" --data-file=-
else
  printf "%s" "$DATABASE_URL" | gcloud secrets create "$DATABASE_URL_SECRET" --data-file=-
fi

if [[ "$RUN_MIGRATIONS" == "true" ]]; then
  if ! gcloud storage buckets describe "gs://${MIGRATION_BUCKET}" >/dev/null 2>&1; then
    gcloud storage buckets create "gs://${MIGRATION_BUCKET}" \
      --location="$REGION" \
      --uniform-bucket-level-access
  fi

  SQL_SERVICE_ACCOUNT="$(gcloud sql instances describe "$SQL_INSTANCE_NAME" --format='value(serviceAccountEmailAddress)')"
  gcloud storage buckets add-iam-policy-binding "gs://${MIGRATION_BUCKET}" \
    --member="serviceAccount:${SQL_SERVICE_ACCOUNT}" \
    --role="roles/storage.objectViewer" \
    --quiet >/dev/null

  gcloud storage cp db/migrations/202607080001_core_schema.sql "$MIGRATION_OBJECT"
  gcloud sql import sql "$SQL_INSTANCE_NAME" "$MIGRATION_OBJECT" \
    --database="$SQL_DATABASE" \
    --user="$SQL_USER" \
    --quiet
fi

gcloud builds submit --tag "$IMAGE_URI" .

gcloud run deploy "$SERVICE_NAME" \
  --image="$IMAGE_URI" \
  --platform=managed \
  --region="$REGION" \
  --service-account="$RUNTIME_SERVICE_ACCOUNT" \
  --allow-unauthenticated \
  --add-cloudsql-instances="$INSTANCE_CONNECTION_NAME" \
  --set-env-vars="BACKEND_PROVIDER=google-cloud,GOOGLE_CLOUD_PROJECT_ID=${PROJECT_ID},GOOGLE_CLOUD_REGION=${REGION},GOOGLE_CLOUD_SQL_INSTANCE=${INSTANCE_CONNECTION_NAME},GOOGLE_CLOUD_SQL_DATABASE=${SQL_DATABASE},GOOGLE_CLOUD_SQL_USER=${SQL_USER},NEXT_PUBLIC_APP_NAME=Kleinkunst Dashboard" \
  --set-secrets="DATABASE_URL=${DATABASE_URL_SECRET}:latest"

SERVICE_URL="$(gcloud run services describe "$SERVICE_NAME" --region="$REGION" --format='value(status.url)')"

echo
echo "Deployment complete:"
echo "$SERVICE_URL"
