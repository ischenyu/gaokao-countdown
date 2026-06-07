import { query } from '../../db';

/**
 * GET /api/messages
 * 返回已审核通过的留言列表（公开）。
 */
export default defineEventHandler(async (event) => {
  const q = getQuery(event);
  const page = Math.max(1, parseInt(String(q.page) || '1', 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(String(q.pageSize) || '20', 10)));
  const offset = (page - 1) * pageSize;

  const [rows, countResult] = await Promise.all([
    query<{ id: string; author: string; content: string; created_at: string }>(
      `SELECT id, author, content, created_at
       FROM messages
       WHERE approved = TRUE
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [pageSize, offset],
    ),
    query<{ total: string }>(
      `SELECT COUNT(*) AS total FROM messages WHERE approved = TRUE`,
    ),
  ]);

  const total = parseInt(countResult[0]?.total ?? '0', 10);

  return {
    messages: rows,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
});
