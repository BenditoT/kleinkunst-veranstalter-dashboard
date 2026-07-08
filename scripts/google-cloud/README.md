# Google Cloud Scripts

## One-shot Provisioning

```bash
export GOOGLE_CLOUD_PROJECT_ID=<project-id>
gcloud auth login
bash scripts/google-cloud/provision-and-deploy.sh
```

The script creates or reuses:

- Artifact Registry Docker repository
- Cloud SQL for PostgreSQL instance, database and user
- Secret Manager entries for database password and `DATABASE_URL`
- Cloud Storage bucket for migration SQL imports
- Cloud Run runtime service account
- Cloud Run service connected to Cloud SQL

## GitHub Actions OIDC

```bash
export GOOGLE_CLOUD_PROJECT_ID=<project-id>
bash scripts/google-cloud/setup-github-oidc.sh
```

The script prints the exact GitHub repository secrets and variables needed by
the manual workflow `.github/workflows/deploy-google-cloud.yml`.
