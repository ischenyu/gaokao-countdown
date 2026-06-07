import jwt from 'jsonwebtoken';
import { createHash } from 'node:crypto';

const COOKIE_NAME = 'gaokao_admin_token';
const TOKEN_EXPIRES = '24h';

/**
 * 验证管理员密码（使用 SHA-256 哈希比对）。
 */
function verifyPassword(plain: string): boolean {
  const config = useRuntimeConfig();
  const storedHash = config.adminPassword;

  // 如果密码已经以 $sha256$ 开头，则按 hash 比对
  if (storedHash.startsWith('$sha256$')) {
    const hash = createHash('sha256').update(plain).digest('hex');
    return hash === storedHash.slice(8);
  }

  // 否则直接比对明文（兼容旧配置）
  return plain === storedHash;
}

/**
 * 签发 JWT token。
 */
export function signToken(): string {
  const config = useRuntimeConfig();
  return jwt.sign({ role: 'admin' }, config.jwtSecret || 'fallback-secret', {
    expiresIn: TOKEN_EXPIRES,
  });
}

/**
 * 验证 JWT token。
 */
export function verifyToken(token: string): boolean {
  const config = useRuntimeConfig();
  try {
    jwt.verify(token, config.jwtSecret || 'fallback-secret');
    return true;
  } catch {
    return false;
  }
}

/**
 * 校验密码，若成功则返回 Set-Cookie 所需的 token。
 */
export function login(password: string): string | null {
  if (!verifyPassword(password)) return null;
  return signToken();
}

/**
 * 从请求中提取并校验 admin token。
 */
export function getAdminToken(event: H3Event): string | null {
  const cookies = parseCookies(event);
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  return verifyToken(token) ? token : null;
}

/**
 * 生成设置认证 cookie 的 header 值。
 */
export function authCookieHeader(token: string): string {
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax`;
}

export function clearCookieHeader(): string {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`;
}
