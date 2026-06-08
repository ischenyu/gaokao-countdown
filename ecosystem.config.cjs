const path = require('path');

module.exports = {
  apps: [
    {
      name: 'gaokao-countdown',
      // Nitro node-server preset 产物
      script: '.output/server/index.mjs',
      // 自动设为项目根目录
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NITRO_PORT: 3000,
        NITRO_HOST: '0.0.0.0',
      },
      max_memory_restart: '512M',
      restart_delay: 5000,
      max_restarts: 10,
      error_file: path.join(__dirname, 'logs', 'pm2-error.log'),
      out_file: path.join(__dirname, 'logs', 'pm2-out.log'),
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      kill_timeout: 10000,
      listen_timeout: 15000,
    },
  ],
};
