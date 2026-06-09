<template>
  <!-- Bing 每日壁纸背景 -->
  <ParticleBackground />

  <!-- 主内容 -->
  <main class="main-content">
    <!-- 标题区 -->
    <header class="hero">
      <h1 class="hero__title">高考倒计时</h1>
      <p class="hero__subtitle">以梦为马 · 不负韶华 ⭐</p>
    </header>

    <!-- 倒计时 / 考后庆祝 -->
    <CountdownTimer />

    <!-- 备考时间轴 -->
    <GaokaoTimeline />

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
      <div class="footer__dev">
        <span class="footer__dev-text">Developed by</span>
        <a
          href="https://github.com/ischenyu"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__dev-link"
          title="ischenyu on GitHub"
        >
          <svg class="footer__icon" viewBox="0 0 16 16" fill="currentColor" width="18" height="18">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          <span>ischenyu</span>
        </a>
      </div>
      <div class="footer__links">
        <a
          href="https://github.com/ischenyu/gaokao-countdown"
          target="_blank"
          rel="noopener noreferrer"
          class="footer__repo-link"
          title="查看项目源码"
        >
          <svg class="footer__icon" viewBox="0 0 16 16" fill="currentColor" width="15" height="15">
            <path d="M4 0h8v2H4V0zM1 3h14v2H1V3zm2 3h10v2H3V6zm1 3h8v2H4V9zm1 3h6v2H5v-2z"/>
          </svg>
          <span>项目源码</span>
        </a>
      </div>
      <p class="footer__copy">© {{ currentYear }} 高考倒计时 · 为每一位学子加油</p>
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
