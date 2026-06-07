/**
 * 验证 reCAPTCHA token。
 * 返回 true 表示验证通过。
 */
export async function verifyRecaptcha(token: string): Promise<boolean> {
  const secret = useRuntimeConfig().recaptchaSecret;

  if (!secret) {
    console.warn('[reCAPTCHA] RECAPTCHA_SECRET 未配置，跳过验证');
    return true; // 开发环境下允许通过
  }

  if (!token) {
    return false;
  }

  try {
    const response = await fetch('https://www.recaptcha.net/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });

    const data = (await response.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      'error-codes'?: string[];
    };

    if (!data.success) {
      console.warn('[reCAPTCHA] 验证失败:', data['error-codes']);
      return false;
    }

    // reCAPTCHA v3 额外检查分数阈值
    if (typeof data.score === 'number' && data.score < 0.5) {
      console.warn('[reCAPTCHA] 分数过低:', data.score);
      return false;
    }

    return true;
  } catch (err) {
    console.error('[reCAPTCHA] 请求异常:', err);
    return false;
  }
}
