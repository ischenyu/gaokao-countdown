const path = require('path');
const fs = require('fs');

// 尝试从项目根 .env 读取变量，合并到 PM2 环境
function loadDotEnv() {
  const envFile = path.join(__dirname, '.env');
  const vars = {};
  if (fs.existsSync(envFile)) {
    const lines = fs.readFileSync(envFile, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const value = trimmed.slice(eq + 1).trim();
      if (key && value) vars[key] = value;
    }
  }
  return vars;
}

module.exports = {
  apps: [
    {
      name: 'gaokao-countdown',
      script: '.output/server/index.mjs',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      // 从 .env 文件自动读取 + 可手动覆盖
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NITRO_PORT: 3000,
        NITRO_HOST: '0.0.0.0',
        // ---- 以下从 .env 自动注入（如 .env 存在） ----
        // NUXT_DATABASE_URL    → 自动读取
        // NUXT_ADMIN_PASSWORD  → 自动读取
        // NUXT_JWT_SECRET      → 自动读取
        // NUXT_RECAPTCHA_SECRET→ 自动读取
        // NUXT_PUBLIC_RECAPTCHA_SITE_KEY → 自动读取
        ...loadDotEnv(),
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
