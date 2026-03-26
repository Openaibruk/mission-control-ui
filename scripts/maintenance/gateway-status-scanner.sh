#!/bin/bash
# Gateway Status Scanner - runs on VPS, writes static JSON for Vercel
# Checks Paperclip (port 3100) and OpenClaw Gateway (port 18789)

OUTFILE="/home/ubuntu/.openclaw/workspace/mission-control-ui/public/api/gateway-status.json"

# Check OpenClaw Gateway
GW_STATUS="offline"
GW_UPTIME=0
GW_HEALTH=$(curl -s --connect-timeout 2 http://localhost:18789/health 2>/dev/null)
if echo "$GW_HEALTH" | python3 -c "import json,sys; d=json.load(sys.stdin); sys.exit(0 if d.get('ok') else 1)" 2>/dev/null; then
    GW_STATUS="online"
fi

# Check Paperclip
PP_STATUS="offline"
if curl -s -o /dev/null -w "%{http_code}" --connect-timeout 2 http://localhost:3100/health 2>/dev/null | grep -q "200"; then
    PP_STATUS="online"
fi

# Check VPS system info
CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'.' -f1 2>/dev/null || echo "0")
MEM_TOTAL=$(free -m | awk '/Mem:/ {print $2}' 2>/dev/null || echo "0")
MEM_USED=$(free -m | awk '/Mem:/ {print $3}' 2>/dev/null || echo "0")
MEM_PCT=$(awk "BEGIN {printf \"%.0f\", ($MEM_USED/$MEM_TOTAL)*100}" 2>/dev/null || echo "0")
DISK_PCT=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%' 2>/dev/null || echo "0")
LOAD=$(cat /proc/loadavg | awk '{print $1}' 2>/dev/null || echo "0")
UPTIME_SEC=$(cat /proc/uptime | awk '{print int($1)}' 2>/dev/null || echo "0")

# Get session count from gateway
SESSIONS=0
if [ "$GW_STATUS" = "online" ]; then
    GW_STATUS_JSON=$(curl -s --connect-timeout 2 http://localhost:18789/health 2>/dev/null)
    SESSIONS=$(echo "$GW_STATUS_JSON" | python3 -c "import json,sys; print(json.load(sys.stdin).get('sessions',0))" 2>/dev/null || echo 0)
fi

# Write JSON
cat > "$OUTFILE" << EOF
{
  "generatedAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "vps": {
    "status": "online",
    "uptime": $UPTIME_SEC,
    "cpu": $CPU_USAGE,
    "memory": { "total": $MEM_TOTAL, "used": $MEM_USED, "percent": $MEM_PCT },
    "disk": { "percent": $DISK_PCT },
    "load": "$LOAD"
  },
  "gateway": {
    "status": "$GW_STATUS",
    "uptime": $GW_UPTIME,
    "sessions": $SESSIONS
  },
  "paperclip": {
    "status": "$PP_STATUS"
  }
}
EOF

echo "✅ Gateway status written to $OUTFILE"
