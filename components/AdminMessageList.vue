<template>
  <div v-if="loading" class="admin-loading">加载中…</div>

  <div v-else-if="messages.length === 0" class="empty-state">
    暂无留言。
  </div>

  <template v-else>
    <!-- 统计栏 -->
    <div class="admin-stats">
      <span class="admin-stats__item">📊 共 {{ messages.length }} 条</span>
      <span class="admin-stats__item">❤️ {{ totalLikes }} 个赞</span>
    </div>

    <!-- 列表 -->
    <div class="admin-message-list">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="admin-message-card"
        :class="{ 'admin-message-card--pending': !msg.approved }"
      >
        <div class="admin-message-card__body">
          <div class="admin-message-card__meta">
            <strong>{{ msg.author }}</strong>
            <span class="admin-message-card__time">{{ formatTime(msg.created_at) }}</span>
            <span class="admin-message-card__likes">❤️ {{ msg.likes }}</span>
            <span
              class="admin-message-card__status"
              :class="msg.approved ? 'is-approved' : 'is-pending'"
            >
              {{ msg.approved ? '✅ 已审核' : '⏳ 待审核' }}
            </span>
          </div>
          <p class="admin-message-card__content">{{ msg.content }}</p>
        </div>
        <div class="admin-message-card__actions">
          <button
            class="admin-btn admin-btn--toggle"
            @click="$emit('toggle', msg)"
          >
            {{ msg.approved ? '隐藏' : '通过' }}
          </button>
          <button
            class="admin-btn admin-btn--delete"
            @click="$emit('remove', msg)"
          >
            删除
          </button>
        </div>
      </div>
    </div>
  </template>
</template>

<script setup lang="ts">
interface Message {
  id: string;
  author: string;
  content: string;
  approved: boolean;
  likes: number;
  created_at: string;
}

const props = defineProps<{
  messages: Message[];
  loading: boolean;
}>();

const totalLikes = computed(() =>
  props.messages.reduce((sum, m) => sum + (m.likes || 0), 0),
);

defineEmits<{
  toggle: [msg: Message];
  remove: [msg: Message];
}>();

function formatTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
</script>

<style scoped>
.admin-loading {
  text-align: center;
  color: var(--text-muted);
  padding: 40px;
}

.admin-stats {
  display: flex;
  gap: 16px;
  padding: 12px 16px;
  margin-bottom: 16px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.admin-stats__item {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.admin-message-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.admin-message-card {
  background: var(--bg-glass);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 16px 18px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  flex-wrap: wrap;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.admin-message-card--pending {
  border-left: 3px solid #e0a030;
}

.admin-message-card__body {
  flex: 1;
  min-width: 200px;
}

.admin-message-card__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 6px;
  font-size: 0.9rem;
}

.admin-message-card__time {
  color: var(--text-muted);
  font-size: 0.8rem;
}

.admin-message-card__likes {
  font-size: 0.78rem;
  color: rgba(96, 165, 250, 0.7);
}

.admin-message-card__status {
  font-size: 0.78rem;
  padding: 2px 10px;
  border-radius: 10px;
}

.admin-message-card__status.is-approved {
  background: rgba(96, 192, 128, 0.15);
  color: #60c080;
}

.admin-message-card__status.is-pending {
  background: rgba(224, 160, 48, 0.15);
  color: #e0a030;
}

.admin-message-card__content {
  font-size: 0.93rem;
  color: var(--text-secondary);
  line-height: 1.6;
}

.admin-message-card__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.admin-btn {
  padding: 6px 14px;
  border-radius: 14px;
  font-size: 0.82rem;
  cursor: pointer;
  border: none;
  transition: background 0.2s;
}

.admin-btn--toggle {
  background: rgba(59, 130, 246, 0.12);
  color: var(--primary-light);
}

.admin-btn--toggle:hover {
  background: rgba(59, 130, 246, 0.25);
}

.admin-btn--delete {
  background: rgba(224, 96, 96, 0.12);
  color: #e06060;
}

.admin-btn--delete:hover {
  background: rgba(224, 96, 96, 0.25);
}
</style>
