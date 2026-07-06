#!/usr/bin/env bash
# =============================================================================
# Banner API — End-to-End curl tests
# Run from the project root:  bash scripts/test-banners-e2e.sh
#
# Prerequisites:
#   - pnpm dev running on localhost:3000
#   - Admin cookie in the ADMIN_COOKIE env var, OR the script prompts for it.
#     To get it: log in at http://localhost:3000/admin/login, then copy the
#     cookie value from browser DevTools → Application → Cookies → mk_admin_session
#
# Usage:
#   ADMIN_COOKIE="<value>" bash scripts/test-banners-e2e.sh
#   bash scripts/test-banners-e2e.sh          # will prompt for cookie
# =============================================================================

set -euo pipefail

BASE="http://localhost:3000"
PASS=0
FAIL=0

# ── Colour helpers ──────────────────────────────────────────────────────────
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ok()   { echo -e "${GREEN}  ✓ $*${NC}"; (( PASS++ )); }
fail() { echo -e "${RED}  ✗ $*${NC}"; (( FAIL++ )); }
info() { echo -e "${YELLOW}  → $*${NC}"; }

# ── Cookie ──────────────────────────────────────────────────────────────────
if [[ -z "${ADMIN_COOKIE:-}" ]]; then
  echo "Paste your mk_admin_session cookie value (from DevTools → Cookies):"
  read -r ADMIN_COOKIE
fi
COOKIE="mk_admin_session=${ADMIN_COOKIE}"

echo ""
echo "============================================================"
echo "  Banner API — E2E Tests"
echo "  Base: $BASE"
echo "============================================================"

# ── Helper: call API and capture HTTP status ─────────────────────────────────
api() {
  local method="$1"
  local path="$2"
  shift 2
  curl -s -o /tmp/banner_resp.json -w "%{http_code}" \
    -X "$method" \
    -H "Cookie: $COOKIE" \
    "$@" \
    "${BASE}${path}"
}

# ── Test 1: GET /api/admin/banners ───────────────────────────────────────────
echo ""
echo "1. GET /api/admin/banners — list all banners"
STATUS=$(api GET /api/admin/banners)
BODY=$(cat /tmp/banner_resp.json)

if [[ "$STATUS" == "200" ]]; then
  ok "HTTP 200"
else
  fail "Expected 200, got $STATUS"
fi

if echo "$BODY" | grep -q '"banners"'; then
  ok "Response contains 'banners' key"
else
  fail "Missing 'banners' key in response"
fi

if echo "$BODY" | grep -q '"blob_configured"'; then
  ok "Response contains 'blob_configured' key"
else
  fail "Missing 'blob_configured' key"
fi

COUNT=$(echo "$BODY" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('banners',[])))" 2>/dev/null || echo "?")
info "Banner count: $COUNT"

# ── Test 2: Upload-local — desktop image ─────────────────────────────────────
echo ""
echo "2. POST /api/admin/banners/upload-local — desktop file upload (no DB write)"

# Create a tiny 1x1 PNG test image
python3 -c "
import base64, sys
# Minimal 1x1 white PNG (67 bytes)
b64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwADhQGAWjR9awAAAABJRU5ErkJggg=='
sys.stdout.buffer.write(base64.b64decode(b64))
" > /tmp/test_banner_desktop.png

STATUS=$(api POST /api/admin/banners/upload-local \
  -F "file=@/tmp/test_banner_desktop.png;type=image/png" \
  -F "prefix=banners/")
BODY=$(cat /tmp/banner_resp.json)

if [[ "$STATUS" == "200" ]]; then
  ok "HTTP 200"
else
  fail "Expected 200, got $STATUS — $BODY"
fi

if echo "$BODY" | grep -q '"url"'; then
  ok "Response contains 'url' key"
  DESKTOP_URL=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['url'])" 2>/dev/null || echo "")
  info "Desktop URL: $DESKTOP_URL"
else
  fail "Missing 'url' key in response"
  DESKTOP_URL=""
fi

# ── Test 3: Upload-local — mobile image ──────────────────────────────────────
echo ""
echo "3. POST /api/admin/banners/upload-local — mobile file upload (no DB write)"

cp /tmp/test_banner_desktop.png /tmp/test_banner_mobile.png

STATUS=$(api POST /api/admin/banners/upload-local \
  -F "file=@/tmp/test_banner_mobile.png;type=image/png" \
  -F "prefix=banners/mobile/")
BODY=$(cat /tmp/banner_resp.json)

if [[ "$STATUS" == "200" ]]; then
  ok "HTTP 200"
else
  fail "Expected 200, got $STATUS — $BODY"
fi

if echo "$BODY" | grep -q '"url"'; then
  ok "Response contains 'url' key"
  MOBILE_URL=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['url'])" 2>/dev/null || echo "")
  info "Mobile URL: $MOBILE_URL"
else
  fail "Missing 'url' key in response"
  MOBILE_URL=""
fi

# ── Test 4: POST /api/admin/banners — desktop + mobile together ───────────────
echo ""
echo "4. POST /api/admin/banners — save desktop + mobile banner record"

if [[ -n "$DESKTOP_URL" && -n "$MOBILE_URL" ]]; then
  STATUS=$(api POST /api/admin/banners \
    -H "Content-Type: application/json" \
    -d "{\"src\":\"$DESKTOP_URL\",\"src_mobile\":\"$MOBILE_URL\",\"alt\":\"E2E test — desktop + mobile\"}")
  BODY=$(cat /tmp/banner_resp.json)

  if [[ "$STATUS" == "201" ]]; then
    ok "HTTP 201 Created"
  else
    fail "Expected 201, got $STATUS — $BODY"
  fi

  if echo "$BODY" | grep -q '"success":true'; then
    ok "success=true"
    BANNER_ID=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['banner']['id'])" 2>/dev/null || echo "")
    info "Created banner ID: $BANNER_ID"
  else
    fail "success != true"
    BANNER_ID=""
  fi
else
  fail "Skipped — desktop or mobile URL missing from previous steps"
  BANNER_ID=""
fi

# ── Test 5: POST /api/admin/banners — mobile-only (no desktop src) ────────────
echo ""
echo "5. POST /api/admin/banners — save mobile-only banner (src empty, src_mobile set)"

if [[ -n "$MOBILE_URL" ]]; then
  STATUS=$(api POST /api/admin/banners \
    -H "Content-Type: application/json" \
    -d "{\"src\":\"\",\"src_mobile\":\"$MOBILE_URL\",\"alt\":\"E2E test — mobile only\"}")
  BODY=$(cat /tmp/banner_resp.json)

  if [[ "$STATUS" == "201" ]]; then
    ok "HTTP 201 Created"
  else
    fail "Expected 201, got $STATUS — $BODY"
  fi

  if echo "$BODY" | grep -q '"success":true'; then
    ok "success=true"
    MOBILE_ONLY_ID=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['banner']['id'])" 2>/dev/null || echo "")
    info "Created mobile-only banner ID: $MOBILE_ONLY_ID"
  else
    fail "success != true — $BODY"
    MOBILE_ONLY_ID=""
  fi
else
  fail "Skipped — mobile URL missing"
  MOBILE_ONLY_ID=""
fi

# ── Test 6: POST /api/admin/banners — desktop-only (no mobile src) ────────────
echo ""
echo "6. POST /api/admin/banners — save desktop-only banner (src set, src_mobile null)"

if [[ -n "$DESKTOP_URL" ]]; then
  STATUS=$(api POST /api/admin/banners \
    -H "Content-Type: application/json" \
    -d "{\"src\":\"$DESKTOP_URL\",\"src_mobile\":null,\"alt\":\"E2E test — desktop only\"}")
  BODY=$(cat /tmp/banner_resp.json)

  if [[ "$STATUS" == "201" ]]; then
    ok "HTTP 201 Created"
  else
    fail "Expected 201, got $STATUS — $BODY"
  fi

  if echo "$BODY" | grep -q '"success":true'; then
    ok "success=true"
    DESKTOP_ONLY_ID=$(echo "$BODY" | python3 -c "import sys,json; print(json.load(sys.stdin)['banner']['id'])" 2>/dev/null || echo "")
    info "Created desktop-only banner ID: $DESKTOP_ONLY_ID"
  else
    fail "success != true — $BODY"
    DESKTOP_ONLY_ID=""
  fi
else
  fail "Skipped — desktop URL missing"
  DESKTOP_ONLY_ID=""
fi

# ── Test 7: POST validation — no alt text ────────────────────────────────────
echo ""
echo "7. POST /api/admin/banners — should reject missing alt text"

STATUS=$(api POST /api/admin/banners \
  -H "Content-Type: application/json" \
  -d "{\"src\":\"$DESKTOP_URL\",\"src_mobile\":null,\"alt\":\"\"}")
BODY=$(cat /tmp/banner_resp.json)

if [[ "$STATUS" == "400" ]]; then
  ok "HTTP 400 (correctly rejected)"
else
  fail "Expected 400, got $STATUS"
fi

# ── Test 8: POST validation — neither src nor src_mobile ─────────────────────
echo ""
echo "8. POST /api/admin/banners — should reject when both src and src_mobile empty"

STATUS=$(api POST /api/admin/banners \
  -H "Content-Type: application/json" \
  -d "{\"src\":\"\",\"src_mobile\":null,\"alt\":\"test\"}")
BODY=$(cat /tmp/banner_resp.json)

if [[ "$STATUS" == "400" ]]; then
  ok "HTTP 400 (correctly rejected)"
else
  fail "Expected 400, got $STATUS — $BODY"
fi

# ── Test 9: PATCH — update alt text ──────────────────────────────────────────
echo ""
echo "9. PATCH /api/admin/banners — update alt text"

if [[ -n "${BANNER_ID:-}" ]]; then
  STATUS=$(api PATCH /api/admin/banners \
    -H "Content-Type: application/json" \
    -d "{\"id\":$BANNER_ID,\"alt\":\"E2E updated alt text\"}")
  BODY=$(cat /tmp/banner_resp.json)

  if [[ "$STATUS" == "200" ]]; then
    ok "HTTP 200"
  else
    fail "Expected 200, got $STATUS — $BODY"
  fi

  if echo "$BODY" | grep -q '"success":true'; then
    ok "success=true"
  else
    fail "success != true"
  fi
else
  info "Skipped — no banner ID from Test 4"
fi

# ── Test 10: PATCH — toggle active state ─────────────────────────────────────
echo ""
echo "10. PATCH /api/admin/banners — toggle is_active"

if [[ -n "${BANNER_ID:-}" ]]; then
  STATUS=$(api PATCH /api/admin/banners \
    -H "Content-Type: application/json" \
    -d "{\"id\":$BANNER_ID,\"is_active\":false}")
  BODY=$(cat /tmp/banner_resp.json)

  if [[ "$STATUS" == "200" ]]; then
    ok "HTTP 200"
  else
    fail "Expected 200, got $STATUS — $BODY"
  fi
else
  info "Skipped — no banner ID from Test 4"
fi

# ── Test 11: DELETE — remove test banners ────────────────────────────────────
echo ""
echo "11. DELETE /api/admin/banners — clean up test records"

for ID_VAR in BANNER_ID MOBILE_ONLY_ID DESKTOP_ONLY_ID; do
  ID="${!ID_VAR:-}"
  if [[ -n "$ID" ]]; then
    STATUS=$(api DELETE /api/admin/banners \
      -H "Content-Type: application/json" \
      -d "{\"id\":$ID}")
    BODY=$(cat /tmp/banner_resp.json)

    if [[ "$STATUS" == "200" ]]; then
      ok "Deleted banner $ID"
    else
      fail "Delete $ID failed (status $STATUS) — $BODY"
    fi
  fi
done

# ── Test 12: GET /api/banners (public) ────────────────────────────────────────
echo ""
echo "12. GET /api/banners — public banner list"

STATUS=$(curl -s -o /tmp/banner_resp.json -w "%{http_code}" "${BASE}/api/banners")
BODY=$(cat /tmp/banner_resp.json)

if [[ "$STATUS" == "200" ]]; then
  ok "HTTP 200"
else
  fail "Expected 200, got $STATUS"
fi

if echo "$BODY" | grep -q '"banners"'; then
  ok "Response contains 'banners' key"
else
  fail "Missing 'banners' key"
fi

# Check no empty src slips through
if echo "$BODY" | python3 -c "
import sys, json
d = json.load(sys.stdin)
bad = [b for b in d.get('banners', []) if b.get('src') == '' and b.get('src_mobile') is None]
if bad:
    print(f'FAIL: {len(bad)} banners with empty src AND no src_mobile')
    sys.exit(1)
print('OK: no banners with empty src and no src_mobile')
" 2>/dev/null; then
  ok "No invalid banner records in public API"
else
  fail "Found banner records with empty src and no src_mobile"
fi

# ── Summary ──────────────────────────────────────────────────────────────────
echo ""
echo "============================================================"
echo -e "  Results: ${GREEN}${PASS} passed${NC}  ${RED}${FAIL} failed${NC}"
echo "============================================================"

[[ $FAIL -eq 0 ]]
