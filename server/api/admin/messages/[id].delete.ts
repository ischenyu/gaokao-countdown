import { queryOne } from '../../../db';

/**
 * DELETE /api/admin/messages/[id]
 * 删除一条留言。
 * 受 admin 中间件保护。
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '无效的 ID。' });
  }

  const row = await queryOne(
    `DELETE FROM messages WHERE id = $1 RETURNING id`,
    [id],
  );

  if (!row) {
    throw createError({ statusCode: 404, statusMessage: '留言不存在。' });
  }

  return { success: true };
});
