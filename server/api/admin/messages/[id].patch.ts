import { queryOne } from '../../../db';

/**
 * PATCH /api/admin/messages/[id]
 * 切换留言的审核状态。
 * 受 admin 中间件保护。
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '无效的 ID。' });
  }

  const row = await queryOne<{ approved: boolean }>(
    `UPDATE messages
     SET approved = NOT approved
     WHERE id = $1
     RETURNING approved`,
    [id],
  );

  if (!row) {
    throw createError({ statusCode: 404, statusMessage: '留言不存在。' });
  }

  return { success: true, approved: row.approved };
});
