<template>
  <section class="countdown-section">
    <div v-if="loading" class="countdown-loading">⏳</div>

    <!-- 考后庆祝模式 -->
    <template v-else-if="isAfterGaokao">
      <div class="countdown-glass countdown-glass--celebrate">
        <div class="celebrate">
          <div class="celebrate__emoji">🎉🎓🎉</div>
          <div class="celebrate__title">高考已结束</div>
          <div class="celebrate__subtitle">披星戴月的路，终将繁花满地</div>
          <div class="celebrate__msg">
            祝所有考生金榜题名，前程似锦！
          </div>
          <div class="celebrate__year">{{ gaokaoLabel }}</div>
        </div>
      </div>
    </template>

    <!-- 倒计时模式 -->
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
  isAfterGaokao,
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

/* ---- 庆祝模式 ---- */
.countdown-glass--celebrate {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.10) 0%,
    rgba(59, 130, 246, 0.03) 50%,
    rgba(96, 192, 128, 0.08) 100%
  );
  border-color: rgba(96, 192, 128, 0.2);
  animation: celebrateGlow 3s ease-in-out infinite;
}

.countdown-glass--celebrate:hover {
  border-color: rgba(96, 192, 128, 0.35);
  box-shadow: var(--shadow-glass),
              0 0 60px rgba(96, 192, 128, 0.10),
              inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.celebrate {
  text-align: center;
  padding: 20px 0 12px;
}

.celebrate__emoji {
  font-size: 3.5rem;
  line-height: 1;
  margin-bottom: 16px;
  animation: celebrateBounce 1.5s ease-in-out infinite;
}

.celebrate__title {
  font-family: var(--font-serif);
  font-size: clamp(2rem, 6vw, 3.5rem);
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #60c080 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.3;
  filter: drop-shadow(0 2px 12px rgba(59, 130, 246, 0.15));
}

.celebrate__subtitle {
  font-family: var(--font-serif);
  font-size: clamp(1rem, 3vw, 1.35rem);
  color: var(--text-secondary);
  margin-top: 14px;
  letter-spacing: 0.15em;
  line-height: 1.6;
}

.celebrate__msg {
  font-size: 1.1rem;
  color: var(--primary-light);
  margin-top: 18px;
  letter-spacing: 0.06em;
}

.celebrate__year {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 14px;
  letter-spacing: 0.1em;
}

@keyframes celebrateGlow {
  0%, 100% {
    box-shadow: var(--shadow-glass),
                0 0 30px rgba(96, 192, 128, 0.05);
  }
  50% {
    box-shadow: var(--shadow-glass),
                0 0 50px rgba(96, 192, 128, 0.12),
                0 0 80px rgba(59, 130, 246, 0.06);
  }
}

@keyframes celebrateBounce {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  25% {
    transform: translateY(-8px) scale(1.05);
  }
  50% {
    transform: translateY(0) scale(1);
  }
  75% {
    transform: translateY(-4px) scale(1.02);
  }
}
</style>
