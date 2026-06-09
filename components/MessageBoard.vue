<template>
  <div>
    <div v-if="loading" class="empty-state">加载留言中…</div>

    <div v-else-if="messages.length === 0" class="empty-state">
      还没有留言，快来写下第一条祝福吧 🧚✨
    </div>

    <div v-else class="message-list">
      <div
        v-for="(msg, i) in messages"
        :key="msg.id"
        class="message-card"
        :style="{ animationDelay: `${i * 0.06}s` }"
      >
        <div class="message-card__header">
          <span class="message-card__author">{{ msg.author }}</span>
          <span class="message-card__time">{{ formatTime(msg.created_at) }}</span>
        </div>
        <p class="message-card__content">{{ msg.content }}</p>
        <div class="message-card__actions">
          <button
            class="message-card__like"
            :class="{ 'message-card__like--active': likedSet.has(msg.id) }"
            :disabled="likingSet.has(msg.id)"
            @click="likeMessage(msg)"
          >
            <svg class="message-card__like-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            <span class="message-card__like-count">{{ msg.likes }}</span>
            <span class="message-card__like-label">赞</span>
          </button>
        </div>
      </div>
    </div>

    <div v-if="hasMore" class="load-more">
      <button class="load-more__btn" @click="loadMore">加载更多</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface MessageItem {
  id: string;
  author: string;
  content: string;
  likes: number;
  created_at: string;
}

const messages = ref<MessageItem[]>([]);
const loading = ref(true);
const page = ref(1);
const hasMore = ref(false);

// 点赞状态（localStorage 持久化，防重复点赞）
const likedSet = ref<Set<string>>(new Set());
const likingSet = ref<Set<string>>(new Set());

function loadLikedSet() {
  try {
    const raw = localStorage.getItem('gaokao-liked-messages');
    if (raw) likedSet.value = new Set(JSON.parse(raw));
  } catch { /* ignore */ }
}

function saveLikedSet() {
  try {
    localStorage.setItem('gaokao-liked-messages', JSON.stringify([...likedSet.value]));
  } catch { /* ignore */ }
}

async function fetchMessages(reset = false) {
  if (reset) page.value = 1;
  loading.value = true;

  try {
    const data = await $fetch<{
      messages: MessageItem[];
      totalPages: number;
      page: number;
    }>('/api/messages', { query: { page: page.value, pageSize: 20 } });
    if (reset) {
      messages.value = data.messages;
    } else {
      messages.value.push(...data.messages);
    }
    hasMore.value = data.page < data.totalPages;
  } catch (err) {
    console.error('加载留言失败:', err);
  } finally {
    loading.value = false;
  }
}

function loadMore() {
  page.value++;
  fetchMessages(false);
}

async function likeMessage(msg: MessageItem) {
  if (likedSet.value.has(msg.id) || likingSet.value.has(msg.id)) return;
  likingSet.value.add(msg.id);
  try {
    const result = await $fetch<{ id: string; likes: number }>(
      `/api/messages/${msg.id}/like`,
      { method: 'POST' },
    );
    msg.likes = result.likes;
    likedSet.value.add(msg.id);
    saveLikedSet();
  } catch (err) {
    console.error('点赞失败:', err);
  } finally {
    likingSet.value.delete(msg.id);
  }
}

function formatTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function refresh() {
  fetchMessages(true);
}

onMounted(() => {
  loadLikedSet();
  fetchMessages(true);
});

defineExpose({ refresh });
</script>

<style scoped>
.message-card__actions {
  margin-top: 10px;
  display: flex;
  align-items: center;
}

.message-card__like {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-muted);
  font-size: 0.82rem;
  cursor: pointer;
  transition: all 0.25s;
  font-family: inherit;
}

.message-card__like:hover {
  border-color: rgba(96, 165, 250, 0.25);
  background: rgba(96, 165, 250, 0.06);
  color: var(--primary-light);
}

.message-card__like--active {
  border-color: rgba(96, 165, 250, 0.3);
  background: rgba(96, 165, 250, 0.08);
  color: var(--primary-light);
}

.message-card__like:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.message-card__like-icon {
  flex-shrink: 0;
  transition: transform 0.2s;
}

.message-card__like:hover .message-card__like-icon {
  transform: scale(1.15);
}

.message-card__like--active .message-card__like-icon {
  transform: scale(1);
}

.message-card__like-count {
  font-weight: 600;
  min-width: 1.2em;
  text-align: center;
}

.message-card__like-label {
  opacity: 0.7;
}
</style>
