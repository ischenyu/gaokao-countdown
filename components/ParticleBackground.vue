<template>
  <div class="particle-layer" ref="layerRef">
    <span
      v-for="p in particles"
      :key="p.id"
      class="particle"
      :style="p.style"
    ></span>
  </div>
</template>

<script setup lang="ts">
/**
 * 纯 CSS 粒子动画层 —— 金色光点从下往上漂浮。
 * 不依赖 Canvas，对 SSR 友好。
 */

interface ParticleData {
  id: number;
  style: Record<string, string>;
}

const particles = ref<ParticleData[]>([]);

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function generateParticles(count: number): ParticleData[] {
  return Array.from({ length: count }, (_, i) => {
    const size = randomBetween(2, 6);
    const left = randomBetween(0, 100);
    const delay = randomBetween(0, 20);
    const duration = randomBetween(8, 18);
    const opacity = randomBetween(0.15, 0.5);

    return {
      id: i,
      style: {
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity: String(opacity),
      },
    };
  });
}

onMounted(() => {
  // 根据屏幕宽度调整粒子数量
  const count = window.innerWidth < 768 ? 20 : 40;
  particles.value = generateParticles(count);
});
</script>

<style scoped>
.particle {
  position: absolute;
  bottom: -10px;
  background: radial-gradient(circle, var(--gold-light) 0%, transparent 70%);
  border-radius: 50%;
  animation: particleDrift linear infinite;
  will-change: transform, opacity;
}
</style>
