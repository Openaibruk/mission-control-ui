# Postiz Self-Hosted Deployment Guide — Hostinger VPS

## What You're Deploying
Postiz — open-source social media scheduling platform with 28+ platform integrations.
Runs as Docker containers (app + PostgreSQL + Redis).

---

## Prerequisites
- Hostinger VPS with Docker & Docker Compose installed
- Domain or subdomain pointed to your VPS (e.g. `postiz.yourdomain.com`)
- At least 2GB RAM, 20GB disk

---

## Step 1: Install Docker (if not already)

```bash
# SSH into your Hostinger VPS
ssh root@your-hostinger-ip

# Install Docker
curl -fsSL https://get.docker.com | sh
systemctl enable --now docker

# Install Docker Compose
apt update && apt install -y docker-compose-plugin
```

---

## Step 2: Create Project Directory

```bash
mkdir -p /opt/postiz && cd /opt/postiz
```

---

## Step 3: Create docker-compose.yml

```yaml
version: '3.8'

services:
  postiz:
    image: ghcr.io/gitroomhq/postiz-app:latest
    container_name: postiz
    restart: unless-stopped
    ports:
      - "5000:5000"
    volumes:
      - postiz-uploads:/uploads/
      - postiz-config:/config/
    env_file:
      - .env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy

  postgres:
    image: postgres:16-alpine
    container_name: postiz-postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: postiz
      POSTGRES_PASSWORD: YOUR_SECURE_DB_PASSWORD
      POSTGRES_DB: postiz
    volumes:
      - postiz-db:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postiz"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: postiz-redis
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postiz-uploads:
  postiz-config:
  postiz-db:
```

---

## Step 4: Create .env File

```bash
cat > /opt/postiz/.env << 'EOF'
# === Database ===
DATABASE_URL=postgresql://postiz:YOUR_SECURE_DB_PASSWORD@postgres:5432/postiz
REDIS_URL=redis://redis:6379

# === Security ===
JWT_SECRET=GENERATE_A_RANDOM_STRING_HERE_AT_LEAST_32_CHARS

# === URLs (CHANGE THESE TO YOUR DOMAIN) ===
FRONTEND_URL=https://postiz.yourdomain.com
NEXT_PUBLIC_BACKEND_URL=https://postiz.yourdomain.com
BACKEND_INTERNAL_URL=http://postiz:5000

# === Storage (local for simplicity) ===
STORAGE_PROVIDER=local

# === Disable registration after setup ===
DISABLE_REGISTRATION=false

# === Required for Postiz ===
IS_GENERAL=true
API_LIMIT=30

# === Social Media APIs (add yours later) ===
# X_API_KEY=
# X_API_SECRET=
# LINKEDIN_CLIENT_ID=
# LINKEDIN_CLIENT_SECRET=
# FACEBOOK_APP_ID=
# FACEBOOK_APP_SECRET=
# etc...
EOF
```

**Important:** Replace `YOUR_SECURE_DB_PASSWORD` and `GENERATE_A_RANDOM_STRING_HERE_AT_LEAST_32_CHARS` with real values!

---

## Step 5: Start It Up

```bash
cd /opt/postiz
docker compose up -d
```

Check it's running:
```bash
docker compose logs -f postiz
```

---

## Step 6: Set Up Reverse Proxy (Nginx + SSL)

```bash
# Install Nginx and Certbot
apt install -y nginx certbot python3-certbot-nginx

# Create Nginx config
cat > /etc/nginx/sites-available/postiz << 'NGINX'
server {
    server_name postiz.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
        client_max_body_size 100M;
    }
}
NGINX

# Enable site
ln -s /etc/nginx/sites-available/postiz /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# Get SSL cert
certbot --nginx -d postiz.yourdomain.com
```

---

## Step 7: Initial Setup

1. Open `https://postiz.yourdomain.com` in your browser
2. Create your admin account
3. Go to **Settings → API** and generate an API key
4. **Save the API key** — you'll need it for OpenClaw integration

---

## Step 8: Connect Social Accounts

In the Postiz web dashboard:
1. Go to **Integrations**
2. Connect the platforms you need:
   - Twitter/X
   - LinkedIn
   - Instagram
   - Facebook
   - TikTok
   - Reddit
   - YouTube

Each platform will require OAuth authorization (click and approve).

---

## Step 9: Send API Key to Nova

Once you have the API key, send it to me along with your Postiz URL:
```
POSTIZ_URL=https://postiz.yourdomain.com
POSTIZ_API_KEY=your_key_here
```

I'll configure the CLI and create a skill for the marketing team.

---

## Maintenance

```bash
# Update Postiz
cd /opt/postiz
docker compose pull
docker compose up -d

# View logs
docker compose logs -f

# Backup database
docker exec postiz-postgres pg_dump -U postiz postiz > backup_$(date +%Y%m%d).sql
```

---

## Monthly Costs
- Hostinger VPS: (you already have this)
- Domain: (you already have this)
- Postiz: **Free** (open source)
- Social API keys: **Free** (just need developer accounts)

**Total additional cost: $0** 🎉
