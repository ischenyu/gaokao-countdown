<template>
  <!-- 粒子背景 -->
  <ParticleBackground />

  <!-- 主内容 -->
  <main class="main-content">
    <!-- 标题 -->
    <!-- 标题区 -->
    <header class="hero">
      <h1 class="hero__title">高考倒计时</h1>
      <p class="hero__subtitle">以梦为马 · 不负韶华</p>
    </header>

    <!-- 倒计时 -->
    <CountdownTimer />

    <!-- 留言板 -->
    <section class="board-section">
      <h2 class="board-section__title">
        <span class="board-section__icon">💬</span>
        留言祝福
      </h2>
      <MessageForm @submitted="onMessageSubmitted" />
      <MessageBoard ref="boardRef" />
    </section>

    <!-- Footer -->
    <footer class="footer">
      <p>© {{ currentYear }} 高考倒计时 · 为每一位学子加油</p>
    </footer>
  </main>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
const boardRef = ref<InstanceType<typeof MessageBoard> | null>(null);

function onMessageSubmitted() {
  boardRef.value?.refresh();
}
</script>
