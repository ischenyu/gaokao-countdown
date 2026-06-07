import { query } from '../../db';

/**
 * GET /api/admin/messages
 * 返回全部留言（含未审核），供管理后台使用。
 * 受 admin 中间件保护。
 */
export default defineEventHandler(async (event) => {
  const q = getQuery(event);
  const page = Math.max(1, parseInt(String(q.page) || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(String(q.pageSize) || '20', 10)));
  const offset = (page - 1) * pageSize;

  const [rows, countResult] = await Promise.all([
    query<{
      id: string;
      author: string;
      content: string;
      approved: boolean;
      created_at: string;
    }>(
      `SELECT id, author, content, approved, created_at
       FROM messages
       ORDER BY created_at DESC
       LIMIT $1 OFFSET $2`,
      [pageSize, offset],
    ),
    query<{ total: string }>(`SELECT COUNT(*) AS total FROM messages`),
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
