#!/usr/bin/env bash
# start-tunnel.sh — nyalakan KORTA (HTML PWA statis) + Cloudflare Tunnel ke padel.myansenriadi.com
# Ringan: server statis (python http.server) + cloudflared. Idempoten & aman dijalankan ulang.
#
#   ./start-tunnel.sh           # start server :3300 + tunnel
#   ./start-tunnel.sh status    # cek status + cek URL publik
#   ./start-tunnel.sh stop      # matikan server + tunnel
#   ./start-tunnel.sh logs      # tail log
#
# Domain : padel.myansenriadi.com  (akun Cloudflare = cert-myansenriadi.pem)
# Pertama kali: skrip otomatis buat tunnel "padel", route DNS, tulis config.
set -euo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITE="$REPO/site"
PORT=3300
TUNNEL="padel"
HOST="padel.myansenriadi.com"
CF_DIR="$HOME/.cloudflared"
CF_CONFIG="$CF_DIR/${TUNNEL}.yml"
ORIGIN_CERT="$CF_DIR/cert-myansenriadi.pem"
APP_LOG="/tmp/padel-app.log"
TUNNEL_LOG="/tmp/padel-tunnel.log"

c_grn=$'\033[32m'; c_red=$'\033[31m'; c_dim=$'\033[2m'; c_off=$'\033[0m'
ok(){ echo "  ${c_grn}OK${c_off}  $*"; }
no(){ echo "  ${c_red}!!${c_off}  $*"; }
dim(){ echo "  ${c_dim}$*${c_off}"; }

app_up(){ lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; }
tunnel_up(){ pgrep -f "cloudflared.*run ${TUNNEL}" >/dev/null 2>&1; }

start_app(){
  if app_up; then ok "server statis sudah jalan di :$PORT"; return; fi
  [ -f "$SITE/index.html" ] || { no "site tak ditemukan: $SITE/index.html"; exit 1; }
  ( cd "$SITE" && nohup python3 -m http.server "$PORT" --bind 127.0.0.1 >"$APP_LOG" 2>&1 & )
  for _ in $(seq 1 20); do app_up && break; sleep 0.3; done
  if app_up; then ok "KORTA (PWA statis) start di :$PORT  ${c_dim}(log: $APP_LOG)${c_off}"
  else no "server GAGAL start — lihat $APP_LOG"; exit 1; fi
}

bootstrap_tunnel(){
  [ -f "$CF_CONFIG" ] && return 0
  [ -f "$ORIGIN_CERT" ] || { no "cert tak ada: $ORIGIN_CERT"; exit 1; }
  export TUNNEL_ORIGIN_CERT="$ORIGIN_CERT"
  dim "bootstrap tunnel '$TUNNEL' (pakai cert-myansenriadi) ..."
  if ! cloudflared tunnel list 2>/dev/null | awk '{print $2}' | grep -qx "$TUNNEL"; then
    cloudflared tunnel create "$TUNNEL" >/tmp/padel-tunnel-create.log 2>&1 \
      && ok "tunnel '$TUNNEL' dibuat" || { no "gagal buat tunnel — lihat /tmp/padel-tunnel-create.log"; exit 1; }
  fi
  local uuid
  uuid="$(cloudflared tunnel list 2>/dev/null | awk -v n="$TUNNEL" '$2==n{print $1; exit}')"
  [ -n "$uuid" ] || { no "UUID tunnel '$TUNNEL' tak ditemukan"; exit 1; }
  cloudflared tunnel route dns --overwrite-dns "$uuid" "$HOST" >/tmp/padel-route.log 2>&1 \
    && ok "DNS route $HOST -> $TUNNEL ($uuid)" || dim "route DNS sudah ada / dilewati (/tmp/padel-route.log)"
  cat > "$CF_CONFIG" <<YAML
# KORTA padel — named tunnel (config terpisah dari default config.yml).
# Jalankan: cloudflared tunnel --config $CF_CONFIG run $TUNNEL
tunnel: $uuid
credentials-file: $CF_DIR/$uuid.json

ingress:
  - hostname: $HOST
    service: http://127.0.0.1:$PORT
  - service: http_status:404
YAML
  ok "config ditulis: $CF_CONFIG"
}

start_tunnel(){
  if tunnel_up; then ok "tunnel $TUNNEL sudah jalan"; return; fi
  bootstrap_tunnel
  nohup cloudflared tunnel --config "$CF_CONFIG" run "$TUNNEL" >"$TUNNEL_LOG" 2>&1 &
  for _ in $(seq 1 30); do grep -q "Registered tunnel connection" "$TUNNEL_LOG" 2>/dev/null && break; sleep 1; done
  if grep -q "Registered tunnel connection" "$TUNNEL_LOG" 2>/dev/null; then
    local n; n=$(grep -c "Registered tunnel connection" "$TUNNEL_LOG" 2>/dev/null || echo 0)
    ok "tunnel $TUNNEL terhubung ($n koneksi edge)  ${c_dim}(log: $TUNNEL_LOG)${c_off}"
  else no "tunnel $TUNNEL belum terhubung — lihat $TUNNEL_LOG"; exit 1; fi
}

verify(){
  local code; code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 15 "https://$HOST/" || echo "ERR")
  [ "$code" = "200" ] && ok "publik https://$HOST/ -> 200" \
    || no "publik https://$HOST/ -> $code (DNS propagasi? coba lagi sebentar)"
}

status(){
  echo "Status KORTA ($HOST):"
  app_up && ok "server :$PORT aktif" || dim "server :$PORT mati"
  tunnel_up && ok "tunnel $TUNNEL aktif" || dim "tunnel $TUNNEL mati"
  if app_up && tunnel_up; then verify; fi
}

stop(){
  echo "Mematikan KORTA:"
  if tunnel_up; then pkill -f "cloudflared.*run ${TUNNEL}" && ok "tunnel dihentikan"; else dim "tunnel sudah mati"; fi
  if app_up; then pkill -f "http.server ${PORT}" 2>/dev/null && ok "server dihentikan" || dim "server: proses tak ketemu"; else dim "server sudah mati"; fi
}

case "${1:-start}" in
  status) status ;;
  stop)   stop ;;
  logs)   tail -n 40 "$APP_LOG" "$TUNNEL_LOG" 2>/dev/null ;;
  start)
    echo "Menyalakan KORTA ($HOST):"
    start_app
    start_tunnel
    verify
    echo
    echo "URL publik:  https://$HOST/"
    ;;
  *) echo "pakai: $0 [start|status|stop|logs]"; exit 2 ;;
esac
