terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}

module "site" {
  source = "../../modules/site-hosting"

  providers = {
    aws           = aws
    aws.us_east_1 = aws.us_east_1
  }

  site_id              = var.site_id
  environment          = "test"
  domain_name          = var.domain_name
  hosted_zone_id       = var.hosted_zone_id
  www_redirect_to_apex = var.www_redirect_to_apex
  tags                 = var.tags
}
