#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

if [[ ! -f .env ]]; then
  echo ".env 파일이 없습니다. deploy/ec2/.env.example 을 복사해서 .env 를 먼저 만들어주세요." >&2
  exit 1
fi

set -a
source ./.env
set +a

if [[ -z "${GHCR_OWNER:-}" ]]; then
  echo "GHCR_OWNER 값이 비어 있습니다." >&2
  exit 1
fi

if [[ -z "${GHCR_USERNAME:-}" ]]; then
  GHCR_USERNAME="$GHCR_OWNER"
fi

if [[ -z "${GHCR_TOKEN:-}" ]]; then
  echo "GHCR_TOKEN 값이 비어 있습니다. .env 에 GitHub Personal Access Token 을 넣어주세요." >&2
  exit 1
fi

mkdir -p data

echo "$GHCR_TOKEN" | docker login ghcr.io -u "$GHCR_USERNAME" --password-stdin
docker compose pull
docker compose up -d
docker compose ps
