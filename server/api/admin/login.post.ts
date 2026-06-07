import { login, authCookieHeader } from '../../utils/auth';

/**
 * POST /api/admin/login
 * 用密码换取 JWT，通过 Set-Cookie 返回。
 */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ password?: string }>(event);
  const password = String(body.password || '').trim();

  if (!password) {
    throw createError({ statusCode: 400, statusMessage: '请输入密码。' });
  }

  const token = login(password);
  if (!token) {
    throw createError({ statusCode: 403, statusMessage: '密码错误。' });
  }

  setHeader(event, 'Set-Cookie', authCookieHeader(token));

  return { success: true, message: '登录成功。' };
});
