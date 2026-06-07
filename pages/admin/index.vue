<template>
  <div class="admin-dashboard">
    <header class="admin-header">
      <h1 class="admin-header__title">📋 留言管理</h1>
      <div class="admin-header__actions">
        <span class="admin-header__count">共 {{ total }} 条留言</span>
        <button class="admin-header__logout" @click="handleLogout">退出登录</button>
      </div>
    </header>

    <div class="admin-filter">
      <a href="/" class="admin-filter__link" target="_blank">← 回到首页</a>
    </div>

    <AdminMessageList
      :messages="messages"
      :loading="loading"
      @toggle="handleToggle"
      @remove="handleDelete"
    />

    <div v-if="totalPages > 1" class="admin-pagination">
      <button
        :disabled="page <= 1"
        class="admin-pagination__btn"
        @click="changePage(page - 1)"
      >
        上一页
      </button>
      <span class="admin-pagination__info">{{ page }} / {{ totalPages }}</span>
      <button
        :disabled="page >= totalPages"
        class="admin-pagination__btn"
        @click="changePage(page + 1)"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false });

interface Message {
  id: string;
  author: string;
  content: string;
  approved: boolean;
  created_at: string;
}

const messages = ref<Message[]>([]);
const loading = ref(true);
const page = ref(1);
const total = ref(0);
const totalPages = ref(0);

async function fetchMessages() {
  loading.value = true;
  try {
    const data = await $fetch<{
      messages: Message[];
      total: number;
      totalPages: number;
      page: number;
    }>('/api/admin/messages', { query: { page: page.value, pageSize: 20 } });
    messages.value = data.messages;
    total.value = data.total;
    totalPages.value = data.totalPages;
  } catch (err: unknown) {
    if ((err as { statusCode?: number }).statusCode === 401) {
      await navigateTo('/admin/login');
    }
  } finally {
    loading.value = false;
  }
}

async function handleToggle(msg: Message) {
  try {
    const data = await $fetch<{ approved: boolean }>(
      `/api/admin/messages/${msg.id}`,
      { method: 'PATCH' },
    );
    msg.approved = data.approved;
  } catch {
    // ignore
  }
}

async function handleDelete(msg: Message) {
  if (!confirm(`确定删除「${msg.author}」的留言吗？此操作不可恢复。`)) return;
  try {
    await $fetch(`/api/admin/messages/${msg.id}`, { method: 'DELETE' });
    messages.value = messages.value.filter((m) => m.id !== msg.id);
    total.value--;
  } catch {
    // ignore
  }
}

async function handleLogout() {
  // 清除 cookie 是 HttpOnly 的，前端无法直接删除。
  // 最简单的方式：发一个不带 token 的请求触发 401，然后跳转。
  await navigateTo('/admin/login');
}

function changePage(p: number) {
  page.value = p;
  fetchMessages();
}

onMounted(fetchMessages);
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: var(--bg-deep);
  padding: 24px 20px 60px;
  max-width: 900px;
  margin: 0 auto;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.admin-header__title {
  font-family: var(--font-serif);
  color: var(--gold);
  font-size: 1.5rem;
}

.admin-header__actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.admin-header__count {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.admin-header__logout {
  background: transparent;
  border: 1px solid var(--border-card);
  color: var(--text-secondary);
  padding: 6px 16px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: background 0.2s;
}

.admin-header__logout:hover {
  background: rgba(255, 255, 255, 0.05);
}

.admin-filter {
  margin-bottom: 20px;
}

.admin-filter__link {
  font-size: 0.9rem;
  color: var(--gold);
}

.admin-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.admin-pagination__btn {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  color: var(--gold);
  padding: 8px 20px;
  border-radius: 16px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
}

.admin-pagination__btn:hover:not(:disabled) {
  background: rgba(212, 168, 83, 0.1);
}

.admin-pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.admin-pagination__info {
  color: var(--text-secondary);
  font-size: 0.9rem;
}
</style>
