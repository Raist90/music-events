#!/bin/sh

set -e

BACKEND_SCHEMA_PATH="./apps/backend/model/openapi.gen.go"
FRONTEND_TYPES_OUTPUT_PATH="./apps/frontend/schema.d.ts"

echo "🔧 Generating Go types from OpenAPI schema..."
(cd ./apps/backend && go generate)

echo "🔧 Generating TypeScript types for frontend..."
(cd ./apps/frontend && npx openapi-typescript ../../openapi/api.yaml -o schema.d.ts)

echo "🔧 Formatting generated TypeScript types with ESLint..." 
cd ./apps/frontend/ && npx eslint --fix schema.d.ts

echo "✅ All types generated and formatted successfully!"
