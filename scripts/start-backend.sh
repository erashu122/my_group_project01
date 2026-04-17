#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if [[ -f "${ROOT_DIR}/.env" ]]; then
  set -a
  # shellcheck disable=SC1091
  source "${ROOT_DIR}/.env"
  set +a
fi

SERVICES=(
  "configserver"
  "eureka"
  "userservice"
  "activityservice"
  "aiservice"
  "gateway"
)

PIDS=()

cleanup() {
  echo "[INFO] Stopping backend services..."
  for pid in "${PIDS[@]:-}"; do
    if kill -0 "$pid" >/dev/null 2>&1; then
      kill "$pid" >/dev/null 2>&1 || true
    fi
  done
}

trap cleanup EXIT INT TERM

for service in "${SERVICES[@]}"; do
  echo "[INFO] Starting ${service}..."
  (
    cd "${ROOT_DIR}/${service}"
    ./mvnw spring-boot:run
  ) &
  PIDS+=("$!")
  sleep 3
done

echo "[INFO] All backend services started. Press Ctrl+C to stop all."
wait
