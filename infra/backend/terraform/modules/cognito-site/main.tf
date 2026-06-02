# LEW-273 optional scaffold — one user pool per site.

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

resource "aws_cognito_user_pool" "site" {
  name = "${var.site_id}-${var.environment}"

  schema {
    name                = "market"
    attribute_data_type = "String"
    mutable             = true
  }

  schema {
    name                = "registration_status"
    attribute_data_type = "String"
    mutable             = true
  }

  auto_verified_attributes = []
}

resource "aws_cognito_user_pool_client" "web" {
  name         = "${var.site_id}-web"
  user_pool_id = aws_cognito_user_pool.site.id

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
  ]
}

output "user_pool_id" {
  value = aws_cognito_user_pool.site.id
}

output "client_id" {
  value = aws_cognito_user_pool_client.web.id
}
