import { queryOne } from '../../db';
import { verifyRecaptcha } from '../../utils/recaptcha';
import { checkRateLimit } from '../../utils/rate-limit';

/**
 * POST /api/messages
 * 提交一条新留言。需要通过 reCAPTCHA 验证，且需要限流。
 */
export default defineEventHandler(async (event) => {
  // 1. 限流检查
  if (!checkRateLimit(event)) {
    throw createError({
      statusCode: 429,
      statusMessage: '留言过于频繁，请一分钟后再试。',
    });
  }

  // 2. 解析请求体
  const body = await readBody<{
    author?: string;
    content?: string;
    recaptchaToken?: string;
  }>(event);

  const author = String(body.author || '').trim();
  const content = String(body.content || '').trim();
  const recaptchaToken = String(body.recaptchaToken || '');

  // 3. 字段校验
  if (!author || author.length > 50) {
    throw createError({
      statusCode: 400,
      statusMessage: '昵称不能为空且不超过 50 个字符。',
    });
  }

  if (!content || content.length > 1000) {
    throw createError({
      statusCode: 400,
      statusMessage: '留言内容不能为空且不超过 1000 个字符。',
    });
  }

  // 4. reCAPTCHA 验证
  const recaptchaOk = await verifyRecaptcha(recaptchaToken);
  if (!recaptchaOk) {
    throw createError({
      statusCode: 400,
      statusMessage: 'reCAPTCHA 验证失败，请重试。',
    });
  }

  // 5. 写入数据库（默认待审核）
  const row = await queryOne<{ id: string }>(
    `INSERT INTO messages (author, content) VALUES ($1, $2) RETURNING id`,
    [author, content],
  );

  return {
    success: true,
    id: row?.id,
    message: '留言已提交，审核通过后将显示。',
  };
});
