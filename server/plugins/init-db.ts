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
        likes       INTEGER       NOT NULL DEFAULT 0,
        created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW()
      );
    `);

    // 2. 创建索引
    await query(`
      CREATE INDEX IF NOT EXISTS idx_messages_approved
        ON messages (approved, created_at DESC);
    `);

    // 3. 兼容旧表 — 如果 likes 列不存在则添加
    await query(`
      ALTER TABLE messages
        ADD COLUMN IF NOT EXISTS likes INTEGER NOT NULL DEFAULT 0;
    `);

    console.log('[DB] 数据表初始化完成');
  } catch (err) {
    console.error('[DB] 数据表初始化失败:', err);
  }
});