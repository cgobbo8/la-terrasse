# Story 9.2: Deployment Pipeline & Auto-Rebuild

Status: ready-for-dev

## Story

As the site operator,
I want CMS changes to automatically trigger a site rebuild and deploy,
so that content I publish through Keystatic goes live within minutes without needing a developer.

## Acceptance Criteria

1. Keystatic is configured in `github` storage mode — content edits are committed to the GitHub repository via the GitHub API
2. A GitHub webhook notifies the VPS when new commits are pushed to the `main` branch
3. The VPS deployment script executes: `git pull` → `pnpm install` → `pnpm build` → restart Node process
4. Zero downtime during rebuild: Nginx continues serving the previous build until the new build is ready, then swaps atomically
5. Nginx serves static files from the build output directory directly (no Node overhead for static pages)
6. Nginx proxies `/keystatic/*` requests to the Node SSR process (Astro running in standalone/node mode)
7. HTTPS is configured via Let's Encrypt / Certbot with automatic certificate renewal
8. Full pipeline latency: operator publishes in Keystatic → site is live with changes in under 2 minutes
9. The Node SSR process is managed by PM2 or systemd for automatic restarts on crash

## Tasks / Subtasks

- [ ] Migrate Keystatic to GitHub storage mode (AC: #1)
  - [ ] Update `keystatic.config.ts`: change `storage: { kind: 'local' }` to `storage: { kind: 'github', repo: 'owner/repo-name' }`
  - [ ] Configure GitHub authentication: create a GitHub App or Personal Access Token with repo write permissions
  - [ ] Set environment variable for Keystatic GitHub token (e.g., `KEYSTATIC_GITHUB_CLIENT_ID`, `KEYSTATIC_SECRET`)
  - [ ] Test: edit content in `/keystatic` admin → verify commit appears in GitHub repo
  - [ ] Update `.env.example` with required environment variables for documentation

- [ ] Configure Astro for hybrid/SSR output (AC: #6)
  - [ ] Ensure `astro.config.mjs` has `output: 'hybrid'` or `output: 'server'` (needed for Keystatic SSR routes)
  - [ ] Ensure `@astrojs/node` adapter is installed and configured: `adapter: node({ mode: 'standalone' })`
  - [ ] Verify Keystatic routes (`/keystatic`, `/api/keystatic/*`) are server-rendered while content pages are pre-rendered (static)
  - [ ] Verify `pnpm build` produces both static files in `dist/client/` and a Node server entry in `dist/server/`

- [ ] Create VPS deployment script (AC: #3, #4)
  - [ ] Create `scripts/deploy.sh` (or `deploy/deploy.sh`) with the following steps:
    ```bash
    #!/bin/bash
    set -e
    cd /var/www/laterrasse-saintferreol
    git pull origin main
    pnpm install --frozen-lockfile
    pnpm build
    # Atomic swap: new build replaces old
    pm2 restart laterrasse || pm2 start dist/server/entry.mjs --name laterrasse
    ```
  - [ ] Implement atomic build swap: build into a temp directory, then `mv` to replace the live directory
  - [ ] Add error handling: if build fails, do not swap — keep serving the previous version
  - [ ] Add logging: write deployment timestamps and outcomes to a log file
  - [ ] Make script executable: `chmod +x scripts/deploy.sh`

- [ ] Set up GitHub webhook handler on VPS (AC: #2, #8)
  - [ ] Create a lightweight webhook listener script (Node.js or shell-based)
  - [ ] Listen on a dedicated port (e.g., 9000) for POST requests from GitHub
  - [ ] Verify webhook signature using the configured secret to prevent unauthorized triggers
  - [ ] On valid webhook for `main` branch push: execute `scripts/deploy.sh`
  - [ ] Alternative (simpler initial approach): use a cron job that polls `git fetch` every 2 minutes and deploys if there are new commits
  - [ ] Register the webhook URL in the GitHub repository settings (Settings → Webhooks)

- [ ] Configure Nginx (AC: #4, #5, #6, #7)
  - [ ] Create Nginx config file: `/etc/nginx/sites-available/laterrasse-saintferreol`
  - [ ] Configure static file serving:
    ```nginx
    location / {
        root /var/www/laterrasse-saintferreol/dist/client;
        try_files $uri $uri/index.html @node;
    }
    ```
  - [ ] Configure SSR proxy for Keystatic:
    ```nginx
    location /keystatic {
        proxy_pass http://127.0.0.1:4321;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location /api/keystatic {
        proxy_pass http://127.0.0.1:4321;
        # same proxy headers
    }
    ```
  - [ ] Configure fallback `@node` location for any SSR routes
  - [ ] Add caching headers for static assets (images, CSS, JS): `Cache-Control: public, max-age=31536000, immutable` for hashed assets
  - [ ] Enable gzip/brotli compression for text-based assets
  - [ ] Symlink to sites-enabled and test: `nginx -t && systemctl reload nginx`

- [ ] Set up HTTPS with Let's Encrypt (AC: #7)
  - [ ] Install certbot: `apt install certbot python3-certbot-nginx`
  - [ ] Obtain certificate: `certbot --nginx -d laterrasse-saintferreol.fr -d www.laterrasse-saintferreol.fr`
  - [ ] Verify auto-renewal: `certbot renew --dry-run`
  - [ ] Confirm Nginx config was updated with SSL directives
  - [ ] Test HTTPS access and HTTP→HTTPS redirect

- [ ] Set up Node process manager (AC: #9)
  - [ ] Install PM2 globally: `npm install -g pm2`
  - [ ] Create PM2 ecosystem file `ecosystem.config.cjs`:
    ```javascript
    module.exports = {
      apps: [{
        name: 'laterrasse',
        script: 'dist/server/entry.mjs',
        cwd: '/var/www/laterrasse-saintferreol',
        env: {
          NODE_ENV: 'production',
          HOST: '127.0.0.1',
          PORT: 4321,
        },
      }],
    };
    ```
  - [ ] Start process: `pm2 start ecosystem.config.cjs`
  - [ ] Enable startup on boot: `pm2 startup && pm2 save`
  - [ ] Alternative: use systemd service file instead of PM2

- [ ] End-to-end testing (AC: #8)
  - [ ] Test full flow: edit content in Keystatic admin → content is committed to GitHub → webhook fires → VPS rebuilds → new content is live
  - [ ] Measure total pipeline latency (target: under 2 minutes)
  - [ ] Test failure scenario: introduce a build error → verify old site remains live
  - [ ] Test Node process crash recovery: `pm2 kill` the process → verify PM2 restarts it
  - [ ] Verify static pages are served by Nginx (no Node overhead)
  - [ ] Verify `/keystatic` admin is accessible and functional in production

## Dev Notes

### Project Structure Notes

- Keystatic config: `keystatic.config.ts` (project root) — storage mode change happens here
- Astro config: `astro.config.mjs` — output mode and adapter config
- Deployment script: `scripts/deploy.sh` (new file)
- PM2 config: `ecosystem.config.cjs` (new file, project root)
- Nginx config: `/etc/nginx/sites-available/laterrasse-saintferreol` (on VPS, not in repo)
- Environment variables: `.env` on VPS with GitHub token and other secrets

### Architecture Overview

```
[Operator] → /keystatic admin (Svelte UI in browser)
     ↓
[Keystatic GitHub mode] → commits content changes to GitHub repo
     ↓
[GitHub webhook] → POST to VPS webhook endpoint
     ↓
[VPS deploy script] → git pull → pnpm build → pm2 restart
     ↓
[Nginx] → serves static pages from dist/client/
        → proxies /keystatic to Node SSR on :4321
     ↓
[Visitors] → fast static pages via Nginx
```

### Keystatic GitHub Mode Configuration

```typescript
// keystatic.config.ts
import { config } from '@keystatic/core';

export default config({
  storage: import.meta.env.DEV
    ? { kind: 'local' }
    : {
        kind: 'github',
        repo: 'owner/base-de-loisir-saint-ferreol',
      },
  // ... collections and singletons
});
```

This pattern uses local mode during development and GitHub mode in production. The condition `import.meta.env.DEV` is `true` during `astro dev` and `false` during `astro build`.

### Atomic Build Swap Strategy

To achieve zero downtime, the deployment script should:
1. Build into a temporary directory (e.g., `dist-new/`)
2. If build succeeds: `mv dist dist-old && mv dist-new dist`
3. Restart the Node process
4. Clean up: `rm -rf dist-old`
5. If build fails: do nothing — the old `dist/` remains active

### Deferrable Items

This story covers significant infrastructure work. The following can be implemented incrementally:

- **Phase 1 (critical):** Keystatic github mode + Astro hybrid output + manual `git pull && pnpm build` on VPS
- **Phase 2 (important):** Nginx config + PM2 setup + HTTPS
- **Phase 3 (automation):** GitHub webhook + automatic rebuild script
- **Phase 4 (polish):** Atomic swap, monitoring, logging

Initial deployment can use manual SSH + `git pull` while the webhook automation is being set up.

### Security Considerations

- Keystatic admin at `/keystatic` should be protected in production — consider IP restriction or HTTP basic auth in Nginx for the `/keystatic` path
- GitHub webhook secret must be verified to prevent unauthorized deploys
- Environment variables (GitHub tokens) must never be committed to the repo — use `.env` files on the VPS only
- The Node process should run as a non-root user

### Domain and DNS

- Domain: to be confirmed (e.g., `laterrasse-saintferreol.fr` or similar)
- DNS: A record pointing to VPS IP address
- Both root domain and `www` subdomain should be configured
- Consider redirect: `www` → root (or vice versa) for canonical URL consistency

### References

- Keystatic GitHub mode docs: https://keystatic.com/docs/github-mode
- Astro Node adapter: https://docs.astro.build/en/guides/integrations-guide/node/
- PM2 docs: https://pm2.keymetrics.io/docs/usage/quick-start/
- Nginx reverse proxy: https://nginx.org/en/docs/http/ngx_http_proxy_module.html
- Certbot: https://certbot.eff.org/instructions
- GitHub webhooks: https://docs.github.com/en/webhooks

## Dev Agent Record

### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
