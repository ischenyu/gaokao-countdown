import { query } from '../../../db';

/**
 * POST /api/messages/:id/like
 * 为留言点赞。
 * 简单实现：每次请求 +1，基于本地存储防重复。
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少留言 ID' });
  }

  const result = await query<{ id: string; likes: number }>(
    `UPDATE messages
     SET likes = likes + 1
     WHERE id = $1 AND approved = TRUE
     RETURNING id, likes`,
    [id],
  );

  if (result.length === 0) {
    throw createError({ statusCode: 404, statusMessage: '留言不存在或未审核' });
  }

  return { id: result[0].id, likes: result[0].likes };
});
