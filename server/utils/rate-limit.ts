/**
 * 简易内存限流 —— 同一 IP 每分钟最多 3 条留言。
 * 服务端是多实例部署时，这只是尽力而为的防护。
 */

const store = new Map<string, { count: number; resetAt: number }>();

const WINDOW_MS = 60_000; // 1 分钟
const MAX_REQUESTS = 3;

function getClientIP(event: H3Event): string {
  const headers = getRequestHeaders(event);
  const forwarded = headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return (headers['x-real-ip'] as string) || 'unknown';
}

export function checkRateLimit(event: H3Event): boolean {
  const ip = getClientIP(event);
  const now = Date.now();
  const entry = store.get(ip);

  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  if (entry.count >= MAX_REQUESTS) {
    return false;
  }

  entry.count++;
  return true;
}
