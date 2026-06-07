import { verifyToken } from '../utils/auth';

/**
 * Nitro 中间件：保护 /api/admin/* 路由。
 * 除 /api/admin/login 外均需要有效 JWT cookie。
 */
export default defineEventHandler((event) => {
  const path = event.path;

  // 仅拦截管理 API
  if (!path.startsWith('/api/admin/') || path === '/api/admin/login') {
    return;
  }

  const cookies = parseCookies(event);
  const token = cookies['gaokao_admin_token'];

  if (!token || !verifyToken(token)) {
    throw createError({
      statusCode: 401,
      statusMessage: '未授权，请先登录。',
    });
  }
});
