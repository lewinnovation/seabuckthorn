# LEW-271 scaffold — extend with Lambda integrations and DynamoDB tables.

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

resource "aws_apigatewayv2_api" "shared" {
  name          = "seabuckthorn-${var.environment}"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = var.allowed_origins
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["content-type", "authorization", "x-site-id"]
  }

  tags = {
    environment = var.environment
  }
}

output "api_endpoint" {
  value = aws_apigatewayv2_api.shared.api_endpoint
}
