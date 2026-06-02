# Seabuckthorn infrastructure (Terraform)

Provisioning for **LEW-269** (S3 + CloudFront + ACM + Route53) and **LEW-270** (isolated test / UAT / prod stacks).

## Layout

```
infra/terraform/
  modules/site-hosting/   # Reusable per-site stack
  live/test/              # test-{site}.bepossible.dev
  live/uat/               # uat-{site}.bepossible.dev
  live/prod/              # Client production domain
```

Each `live/{env}/` directory is an independent Terraform root with its own state. Do not share buckets or distributions across environments.

## Quick start

```bash
cd infra/terraform/live/test
cp terraform.tfvars.example terraform.tfvars
# Edit site_id, domain_name, hosted_zone_id
terraform init
terraform plan
terraform apply
```

Outputs `bucket_name` and `distribution_id` map to GitHub Environment secrets for deploy workflows.

## Module inputs

| Variable | Description |
|----------|-------------|
| `site_id` | Short site identifier used in resource names |
| `environment` | `test`, `uat`, or `prod` |
| `domain_name` | Primary hostname |
| `hosted_zone_id` | Route53 zone for DNS validation and aliases |
| `www_redirect_to_apex` | Preferred www vs apex behavior (see module) |

## Deploy static assets

After `terraform apply`, sync the Astro `dist/` output:

```bash
export AWS_S3_BUCKET="<bucket_name from output>"
export AWS_CLOUDFRONT_DISTRIBUTION_ID="<distribution_id>"
pnpm build
pnpm deploy:aws
```

See [docs/deploy.md](../../docs/deploy.md) for CI and OIDC setup.
