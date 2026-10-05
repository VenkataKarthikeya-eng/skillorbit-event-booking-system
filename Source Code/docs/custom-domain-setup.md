# Custom Domain Configuration Guide: SkillOrbit

This guide provides step-by-step instructions to connect a custom domain to the SkillOrbit Event Booking System deployed across Vercel (Frontend) and Render (Backend API).

---

## 1. Prerequisites
- A registered domain name through any DNS provider (Namecheap, GoDaddy, Cloudflare, Google Domains/Squarespace, etc.).
- Admin access to your Vercel project (Frontend).
- Admin access to your Render web service (Backend API).

---

## 2. Frontend Domain Setup (Vercel)

### Step 2.1: Add Domain in Vercel
1. Log in to your [Vercel Dashboard](https://vercel.com).
2. Select your `skillorbit-frontend` project.
3. Navigate to **Settings > Domains**.
4. Enter your custom domain:
   - For a root/apex domain: `yourdomain.com` (and optionally `www.yourdomain.com`).
   - For an application subdomain: `events.yourdomain.com` or `tickets.yourdomain.com`.
5. Click **Add**.

### Step 2.2: Configure DNS Records in Your Registrar
Vercel will display the required DNS records:

| Record Type | Host / Name | Target / Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** (for apex `yourdomain.com`) | `@` | `76.76.21.21` | Auto / 300 |
| **CNAME** (for `www.yourdomain.com`) | `www` | `cname.vercel-dns.com` | Auto / 300 |
| **CNAME** (for subdomain `events.yourdomain.com`) | `events` | `cname.vercel-dns.com` | Auto / 300 |

### Step 2.3: Verification and SSL
- Once DNS records propagate (typically 2 to 30 minutes), Vercel automatically issues an SSL certificate via Let's Encrypt.
- Verify by visiting `https://yourdomain.com` (or `https://events.yourdomain.com`).

---

## 3. Backend API Domain Setup (Render)

### Step 3.1: Add Custom Domain in Render
1. Log in to your [Render Dashboard](https://dashboard.render.com).
2. Select your backend Web Service (`skillorbit-backend`).
3. Navigate to **Settings > Custom Domains**.
4. Click **Add Custom Domain** and enter:
   - `api.yourdomain.com`
5. Click **Save**.

### Step 3.2: Configure DNS in Your Registrar
Render will display the target hostname:

| Record Type | Host / Name | Target / Value | TTL |
| :--- | :--- | :--- | :--- |
| **CNAME** | `api` | `skillorbit-backend.onrender.com` (your exact service address) | Auto / 300 |

### Step 3.3: Verify API Health
Once DNS records propagate, verify the backend health endpoint:
```bash
curl -I https://api.yourdomain.com/api/health
```
Expected response: HTTP 200 OK with `{"status":"OK","database":"connected"}`.

---

## 4. Environment Variables Synchronization

After both custom domains are active, update the environment variables to lock in CORS and API routing:

### In Render (Backend Environment Variables):
- `CLIENT_URL`: `https://events.yourdomain.com` (or `https://yourdomain.com`)
- `NODE_ENV`: `production`

### In Vercel (Frontend Environment Variables):
- `VITE_API_URL`: `https://api.yourdomain.com/api`

After updating, trigger a Redeploy on both services so the new origins take effect.

---

## 5. Verification Checklist

- [ ] `https://events.yourdomain.com` loads the SkillOrbit catalog with valid SSL (padlock icon).
- [ ] `https://api.yourdomain.com/api/health` returns status 200.
- [ ] User login and registration work with sessions stored securely.
- [ ] Ticket booking, atomic decrements, and digital pass generation function seamlessly over the custom domain.
- [ ] CSV report downloads and cancellation rollbacks execute without CORS errors.
