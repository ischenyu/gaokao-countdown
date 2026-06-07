import { query } from '../db';

export default defineNitroPlugin(async () => {
  try {
    // 1. 建表（如果不存在）
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        author      VARCHAR(100)  NOT NULL,
        content     TEXT          NOT NULL,
        approved    BOOLEAN       NOT NULL DEFAULT FALSE,
        created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      );
    `);

    // 2. 创建索引
    await query(`
      CREATE INDEX IF NOT EXISTS idx_messages_approved
        ON messages (approved, created_at DESC);
    `);

    console.log('[DB] 数据表初始化完成');
  } catch (err) {
    console.error('[DB] 数据表初始化失败:', err);
  }
});