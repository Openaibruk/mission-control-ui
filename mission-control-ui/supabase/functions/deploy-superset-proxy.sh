#!/usr/bin/env bash
set -e

# Supabase Edge Function Deploy: superset-proxy
# Requirements: supabase CLI installed and authenticated

echo "Deploying superset-proxy function to Supabase..."

# Navigate to function directory
cd "$(dirname "$0")/../.."

# Check if supabase is available
if ! command -v supabase &> /dev/null; then
  echo "Error: supabase CLI not found. Install from https://supabase.com/docs/guides/cli"
  exit 1
fi

# Determine project ref from .env.local
PROJECT_REF=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d'/' -f4 | tr -d '\r')
if [ -z "$PROJECT_REF" ]; then
  echo "Could not determine project ref from .env.local. Please set manually."
  exit 1
fi

echo "Project ref: $PROJECT_REF"

# Deploy function
supabase functions deploy superset-proxy \
  --project-ref "$PROJECT_REF" \
  --no-verify-jwt \
  --import-map ./import-map.json 2>/dev/null || supabase functions deploy superset-proxy --project-ref "$PROJECT_REF"

echo "Deployment complete. Set secrets on Supabase dashboard:"
echo "  SUPERSET_URL"
echo "  SUPERSET_API_TOKEN"
