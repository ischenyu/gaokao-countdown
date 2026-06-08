/**
 * POST /api/admin/logout
 * 清除 admin cookie，实现退出登录。
 */
export default defineEventHandler(async (event) => {
  setHeader(event, 'Set-Cookie',
    'gaokao_admin_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax');
  return { success: true };
});
