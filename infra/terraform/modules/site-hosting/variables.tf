variable "site_id" {
  type        = string
  description = "Unique site identifier (used in resource names)"
}

variable "environment" {
  type        = string
  description = "Deployment environment: test, uat, or prod"
}

variable "domain_name" {
  type        = string
  description = "Primary hostname for the site (apex or subdomain)"
}

variable "hosted_zone_id" {
  type        = string
  description = "Route53 hosted zone ID for domain_name"
}

variable "www_redirect_to_apex" {
  type        = bool
  default     = true
  description = "When true, www.{domain} redirects to apex; when false, apex redirects to www"
}

variable "price_class" {
  type    = string
  default = "PriceClass_100"
}

variable "tags" {
  type    = map(string)
  default = {}
}
