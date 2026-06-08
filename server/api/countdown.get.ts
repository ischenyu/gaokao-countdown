/**
 * GET /api/countdown
 * 返回下一次高考的目标日期时间戳。客户端自行计算倒计时。
 */
export default defineEventHandler(() => {
  const config = useRuntimeConfig();
  const month = config.public.gaokaoMonth as number;
  const day = config.public.gaokaoDay as number;

  const now = new Date();

  // 计算下一次高考日期（默认 6 月 7 日 9:00）
  let gaokaoDate = new Date(now.getFullYear(), month - 1, day, 9, 0, 0);

  // 如果今年高考已过，使用明年
  if (now > gaokaoDate) {
    gaokaoDate = new Date(now.getFullYear() + 1, month - 1, day, 9, 0, 0);
  }

  return {
    targetTimestamp: gaokaoDate.getTime(),
    gaokaoLabel: `${gaokaoDate.getFullYear()}年${month}月${day}日`,
  };
});
