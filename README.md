# 高考倒计时 🎓

精美的全栈高考倒计时网站，支持留言祝福 + reCAPTCHA 防护 + 后台管理。

## 技术栈

- **前端**: Nuxt 3 + Vue 3 (Composition API)
- **后端**: Nitro Server (TypeScript)
- **数据库**: PostgreSQL
- **验证**: Google reCAPTCHA v2
- **部署**: 腾讯云 EdgeOne Pages / Node.js 服务器

## 快速开始

### 1. 克隆 & 安装

```bash
cd gaokao-countdown
npm install
```

### 2. 配置环境变量

```bash
cp .env.example .env
```

编辑 `.env`，填入真实值：

| 变量 | 说明 |
|------|------|
| `DATABASE_URL` | PostgreSQL 连接串，如 `postgresql://user:pass@host:5432/dbname` |
| `RECAPTCHA_SITE_KEY` | reCAPTCHA 站点密钥（[申请地址](https://www.google.com/recaptcha/admin)） |
| `RECAPTCHA_SECRET` | reCAPTCHA 服务端密钥 |
| `ADMIN_PASSWORD` | 后台登录密码（明文或 `$sha256$<hash>` 格式） |
| `JWT_SECRET` | 随机字符串（至少 32 位），用于签发管理 token |

### 3. 初始化数据库

数据表会在 Nitro 服务启动时自动创建（`messages` 表）。确保 PostgreSQL 已运行且 `DATABASE_URL` 正确。

### 4. 本地开发

```bash
npm run dev
```

打开 http://localhost:3000 即可看到倒计时页面。

### 5. 生产构建

```bash
npm run build
npm run preview   # 预览生产版本
```

## 功能说明

### 公开页面 `/`

- 高考倒计时（天 / 时 / 分 / 秒），自动计算下一次 6 月 7 日
- 金色粒子动画背景
- 留言板（查看已审核通过的留言）
- 留言表单（reCAPTCHA 防 spam）

### 后台管理 `/admin`

1. 访问 `/admin/login` 输入管理员密码
2. 登录后进入留言管理面板
3. 审核通过 / 隐藏留言、删除留言、分页浏览

### API 接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/countdown` | 获取倒计时信息 |
| GET | `/api/messages?page=1` | 获取已审核留言（公开） |
| POST | `/api/messages` | 提交留言（需 reCAPTCHA） |
| POST | `/api/admin/login` | 管理员登录 |
| GET | `/api/admin/messages` | 获取全部留言（需认证） |
| PATCH | `/api/admin/messages/:id` | 切换审核状态 |
| DELETE | `/api/admin/messages/:id` | 删除留言 |

## 部署到 EdgeOne Pages

1. 在 EdgeOne Pages 控制台创建项目，关联 Git 仓库
2. 框架自动检测为 **Nuxt**，构建命令 `npm run build`，输出目录 `.output/public`
3. 在控制台配置环境变量（同 `.env.example` 中的各项）
4. 部署后，EdgeOne 会自动运行 Nitro Server 处理 SSR 和 API

> 项目根目录的 `edgeone.json` 包含了推荐配置。如果使用其他平台（Vercel / Cloudflare / 自有服务器），同样适用 — Nitro 会自动适配。

## 自定义高考日期

默认高考日期为 **6 月 7 日 上午 9:00**。如需修改，在 `.env` 中设置：

```bash
NUXT_PUBLIC_GAOKAO_MONTH=6
NUXT_PUBLIC_GAOKAO_DAY=7
```

## License

MIT
