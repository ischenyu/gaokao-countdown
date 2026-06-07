<template>
  <div>
    <div v-if="loading" class="empty-state">加载留言中…</div>

    <div v-else-if="messages.length === 0" class="empty-state">
      还没有留言，快来写下第一条祝福吧 ✨
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
  created_at: string;
}

const messages = ref<MessageItem[]>([]);
const loading = ref(true);
const page = ref(1);
const hasMore = ref(false);

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

function formatTime(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function refresh() {
  fetchMessages(true);
}

onMounted(() => fetchMessages(true));

defineExpose({ refresh });
</script>
