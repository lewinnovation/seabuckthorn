variable "environment" {
  type = string
}

variable "site_ids" {
  type        = list(string)
  description = "Site IDs allowed in this environment for CORS and routing"
}

variable "allowed_origins" {
  type        = list(string)
  description = "HTTPS origins for API Gateway CORS"
}
