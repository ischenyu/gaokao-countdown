/**
 * GET /api/countdown
 * 返回下一次高考的日期与剩余时间信息。
 */
export default defineEventHandler(() => {
  const config = useRuntimeConfig();
  const month = config.public.gaokaoMonth as number;
  const day = config.public.gaokaoDay as number;

  const now = new Date();

  // 计算下一次高考日期（默认 6 月 7 日）
  let gaokaoDate = new Date(now.getFullYear(), month - 1, day, 9, 0, 0);

  // 如果今年高考已过，使用明年
  if (now > gaokaoDate) {
    gaokaoDate = new Date(now.getFullYear() + 1, month - 1, day, 9, 0, 0);
  }

  const diffMs = gaokaoDate.getTime() - now.getTime();

  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return {
    gaokaoDate: gaokaoDate.toISOString(),
    gaokaoLabel: `${gaokaoDate.getFullYear()}年${month}月${day}日`,
    totalDays,
    hours,
    minutes,
    seconds,
    isToday: totalDays === 0,
  };
});
