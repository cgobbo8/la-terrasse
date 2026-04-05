/** @type {import('pm2').StartOptions[]} */
module.exports = {
  apps: [
    {
      name: 'laterrasse',
      script: 'dist/server/entry.mjs',
      cwd: '/var/www/baseloisirs-saintferreol',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        HOST: '127.0.0.1',
        PORT: 4321,
      },
      // Restart policy
      max_restarts: 10,
      min_uptime: '10s',
      // Logs
      error_file: 'logs/pm2-error.log',
      out_file: 'logs/pm2-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};
