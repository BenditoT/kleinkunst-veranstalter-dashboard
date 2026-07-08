#!/usr/bin/env bash
set -euo pipefail

need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Missing required command: $1" >&2
    exit 1
  fi
}

need gcloud

PROJECT_ID="${GOOGLE_CLOUD_PROJECT_ID:-$(gcloud config get-value project 2>/dev/null || true)}"
GITHUB_REPOSITORY="${GITHUB_REPOSITORY:-BenditoT/kleinkunst-veranstalter-dashboard}"
POOL_ID="${GCP_WORKLOAD_IDENTITY_POOL:-github}"
PROVIDER_ID="${GCP_WORKLOAD_IDENTITY_PROVIDER:-github-actions}"
DEPLOY_SERVICE_ACCOUNT_NAME="${GCP_DEPLOY_SERVICE_ACCOUNT_NAME:-kleinkunst-github-deploy}"
RUNTIME_SERVICE_ACCOUNT_NAME="${GOOGLE_CLOUD_RUN_SERVICE_ACCOUNT:-kleinkunst-run}"

if [[ -z "$PROJECT_ID" || "$PROJECT_ID" == "(unset)" ]]; then
  echo "GOOGLE_CLOUD_PROJECT_ID or gcloud config project is required." >&2
  exit 1
fi

PROJECT_NUMBER="$(gcloud projects describe "$PROJECT_ID" --format='value(projectNumber)')"
DEPLOY_SERVICE_ACCOUNT="${DEPLOY_SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
RUNTIME_SERVICE_ACCOUNT="${RUNTIME_SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"
CLOUD_BUILD_SERVICE_ACCOUNT="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

gcloud services enable iamcredentials.googleapis.com iam.googleapis.com run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com

if ! gcloud iam service-accounts describe "$DEPLOY_SERVICE_ACCOUNT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$DEPLOY_SERVICE_ACCOUNT_NAME" \
    --display-name="Kleinkunst GitHub Actions deploy"
fi

if ! gcloud iam service-accounts describe "$RUNTIME_SERVICE_ACCOUNT" >/dev/null 2>&1; then
  gcloud iam service-accounts create "$RUNTIME_SERVICE_ACCOUNT_NAME" \
    --display-name="Kleinkunst Cloud Run runtime"
fi

for role in roles/run.admin roles/cloudbuild.builds.editor roles/artifactregistry.writer roles/iam.serviceAccountUser; do
  gcloud projects add-iam-policy-binding "$PROJECT_ID" \
    --member="serviceAccount:${DEPLOY_SERVICE_ACCOUNT}" \
    --role="$role" \
    --quiet >/dev/null
done

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

if ! gcloud iam workload-identity-pools describe "$POOL_ID" --location=global >/dev/null 2>&1; then
  gcloud iam workload-identity-pools create "$POOL_ID" \
    --project="$PROJECT_ID" \
    --location=global \
    --display-name="GitHub Actions Pool"
fi

if ! gcloud iam workload-identity-pools providers describe "$PROVIDER_ID" \
  --project="$PROJECT_ID" \
  --location=global \
  --workload-identity-pool="$POOL_ID" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers create-oidc "$PROVIDER_ID" \
    --project="$PROJECT_ID" \
    --location=global \
    --workload-identity-pool="$POOL_ID" \
    --display-name="GitHub Actions Provider" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
    --attribute-condition="assertion.repository == '${GITHUB_REPOSITORY}'"
fi

gcloud iam service-accounts add-iam-policy-binding "$DEPLOY_SERVICE_ACCOUNT" \
  --project="$PROJECT_ID" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/attribute.repository/${GITHUB_REPOSITORY}" \
  --quiet >/dev/null

WORKLOAD_IDENTITY_PROVIDER="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${POOL_ID}/providers/${PROVIDER_ID}"

cat <<EOF
GitHub OIDC is ready.

Set these GitHub repository secrets:

GCP_WORKLOAD_IDENTITY_PROVIDER=${WORKLOAD_IDENTITY_PROVIDER}
GCP_DEPLOY_SERVICE_ACCOUNT=${DEPLOY_SERVICE_ACCOUNT}

Set these GitHub repository variables:

GOOGLE_CLOUD_PROJECT_ID=${PROJECT_ID}
GOOGLE_CLOUD_REGION=europe-west3
CLOUD_RUN_SERVICE=kleinkunst-dashboard
ARTIFACT_REGISTRY_REPOSITORY=kleinkunst
GOOGLE_CLOUD_SQL_INSTANCE=${PROJECT_ID}:europe-west3:kleinkunst-postgres
GOOGLE_CLOUD_SQL_DATABASE=kleinkunst
GOOGLE_CLOUD_SQL_USER=kleinkunst_app
EOF
