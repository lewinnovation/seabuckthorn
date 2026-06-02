variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "site_id" {
  type = string
}

variable "domain_name" {
  type        = string
  description = "e.g. uat-demo.bepossible.dev"
}

variable "hosted_zone_id" {
  type = string
}

variable "www_redirect_to_apex" {
  type    = bool
  default = true
}

variable "tags" {
  type    = map(string)
  default = {}
}
