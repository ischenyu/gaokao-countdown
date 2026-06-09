<template>
  <div class="admin-login-wrapper">
    <form class="admin-login-card" @submit.prevent="handleLogin">
      <h1 class="admin-login__title">🔐 管理员登录</h1>
      <input
        v-model="password"
        type="password"
        class="admin-login__input"
        placeholder="请输入管理密码"
        autocomplete="current-password"
      />
      <p v-if="error" class="admin-login__error">{{ error }}</p>
      <button class="admin-login__btn" :disabled="loading">
        {{ loading ? '登录中…' : '登 录' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

const password = ref('');
const error = ref('');
const loading = ref(false);

async function handleLogin() {
  error.value = '';
  if (!password.value.trim()) {
    error.value = '请输入密码。';
    return;
  }
  loading.value = true;
  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: { password: password.value },
    });
    await navigateTo('/admin');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : '登录失败';
    // Nitro createError 会作为 fetch 错误抛出
    error.value = (err as { statusMessage?: string }).statusMessage || (err as { data?: { statusMessage?: string } }).data?.statusMessage || msg;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.admin-login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-deep);
  padding: 20px;
}

.admin-login-card {
  background: var(--bg-glass);
  border: 1px solid var(--border-glass);
  border-radius: var(--radius-lg);
  padding: 40px 32px;
  width: 100%;
  max-width: 380px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--shadow-glass);
  text-align: center;
}

.admin-login__title {
  font-family: var(--font-serif);
  color: var(--primary-light);
  font-size: 1.4rem;
  margin-bottom: 24px;
}

.admin-login__input {
  width: 100%;
  padding: 12px 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 1rem;
  outline: none;
  margin-bottom: 12px;
}

.admin-login__input:focus {
  border-color: var(--primary-dim);
}

.admin-login__error {
  color: #e06060;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.admin-login__btn {
  width: 100%;
  padding: 12px 0;
  background: linear-gradient(135deg, var(--primary-dim), var(--primary));
  border: none;
  border-radius: var(--radius-sm);
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.admin-login__btn:hover {
  opacity: 0.9;
}

.admin-login__btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
