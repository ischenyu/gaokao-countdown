<template>
  <section class="countdown-section">
    <div v-if="loading" class="countdown-loading">⏳</div>
    <template v-else>
      <div class="countdown-glass">
        <!-- 天 — 单独一行，大号展示 -->
        <div class="countdown-days">
          <div class="countdown-days__number">{{ pad(totalDays) }}</div>
          <div class="countdown-days__label">天</div>
        </div>

        <!-- 装饰分隔线 -->
        <div class="countdown-divider"></div>

        <!-- 时 · 分 · 秒 -->
        <div class="countdown-sub-grid">
          <div class="countdown-sub-item">
            <div class="countdown-sub-item__number">{{ pad(hours) }}</div>
            <div class="countdown-sub-item__label">时</div>
          </div>
          <div class="countdown-sub-item">
            <div class="countdown-sub-item__number">{{ pad(minutes) }}</div>
            <div class="countdown-sub-item__label">分</div>
          </div>
          <div class="countdown-sub-item">
            <div class="countdown-sub-item__number">{{ pad(seconds) }}</div>
            <div class="countdown-sub-item__label">秒</div>
          </div>
        </div>
      </div>

      <p v-if="isToday" class="countdown-date countdown-date--today">
        🎉 就是今天！祝所有考生金榜题名！
      </p>
      <p v-else class="countdown-date">
        距离 <strong>{{ gaokaoLabel }}</strong> 还有
      </p>
    </template>
  </section>
</template>

<script setup lang="ts">
const {
  totalDays,
  hours,
  minutes,
  seconds,
  gaokaoLabel,
  isToday,
  loading,
} = useCountdown();

function pad(n: number) {
  return String(n).padStart(2, '0');
}
</script>

<style scoped>
.countdown-loading {
  text-align: center;
  font-size: 3rem;
  animation: float 2s ease-in-out infinite;
  padding: 60px 0;
}
</style>
