/**
 * Lightweight GitHub webhook handler.
 * Listens for push events on `main` and triggers deploy.sh.
 *
 * Usage:  node scripts/webhook.mjs
 * Env:    DEPLOY_WEBHOOK_SECRET — GitHub webhook secret
 *         DEPLOY_SCRIPT — path to deploy script (default: ./scripts/deploy.sh)
 *         WEBHOOK_PORT — port to listen on (default: 9000)
 */
import { createServer } from 'node:http';
import { createHmac } from 'node:crypto';
import { execFile } from 'node:child_process';

const SECRET = process.env.DEPLOY_WEBHOOK_SECRET;
const DEPLOY_SCRIPT = process.env.DEPLOY_SCRIPT || './scripts/deploy.sh';
const PORT = parseInt(process.env.WEBHOOK_PORT || '9000', 10);

if (!SECRET) {
  console.error('DEPLOY_WEBHOOK_SECRET is required');
  process.exit(1);
}

function verifySignature(payload, signature) {
  const expected = 'sha256=' + createHmac('sha256', SECRET).update(payload).digest('hex');
  return signature === expected;
}

const server = createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/webhook') {
    res.writeHead(404);
    res.end('Not found');
    return;
  }

  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    const body = Buffer.concat(chunks);
    const signature = req.headers['x-hub-signature-256'];

    if (!signature || !verifySignature(body, signature)) {
      console.warn(`[${new Date().toISOString()}] Invalid signature — rejected`);
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    let payload;
    try {
      payload = JSON.parse(body.toString());
    } catch {
      res.writeHead(400);
      res.end('Bad request');
      return;
    }

    // Only deploy on pushes to main
    if (payload.ref !== 'refs/heads/main') {
      console.log(`[${new Date().toISOString()}] Push to ${payload.ref} — skipping`);
      res.writeHead(200);
      res.end('Skipped');
      return;
    }

    console.log(`[${new Date().toISOString()}] Push to main — triggering deploy…`);
    res.writeHead(200);
    res.end('Deploying');

    execFile(DEPLOY_SCRIPT, (error, stdout, stderr) => {
      if (error) {
        console.error(`Deploy failed: ${error.message}`);
        console.error(stderr);
      } else {
        console.log(stdout);
      }
    });
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Webhook handler listening on 127.0.0.1:${PORT}/webhook`);
});
