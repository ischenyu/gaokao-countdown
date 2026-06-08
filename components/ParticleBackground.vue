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
 * 增强版：粒子大小、颜色差异化，更有层次感。
 */

interface ParticleData {
  id: number;
  style: Record<string, string>;
}

const particles = ref<ParticleData[]>([]);
const prefersReduced = ref(false);

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function generateParticles(count: number): ParticleData[] {
  return Array.from({ length: count }, (_, i) => {
    const size = randomBetween(2, 8);
    const left = randomBetween(0, 100);
    const delay = randomBetween(0, 25);
    const duration = randomBetween(12, 24);
    const opacity = randomBetween(0.15, 0.5);

    // 在金色暖色系中随机取色 (hsl 38-48°)
    const hue = [38, 42, 45, 48][Math.floor(Math.random() * 4)];
    const sat = Math.round(randomBetween(55, 95));
    const lit = Math.round(randomBetween(55, 85));

    return {
      id: i,
      style: {
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        opacity: String(opacity),
        background: `radial-gradient(circle, hsla(${hue}, ${sat}%, ${lit}%, 0.8) 0%, transparent 70%)`,
      },
    };
  });
}

onMounted(() => {
  prefersReduced.value = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;
  if (prefersReduced.value) return;
  const count = window.innerWidth < 768 ? 25 : 50;
  particles.value = generateParticles(count);
});
</script>

<style scoped>
.particle {
  position: absolute;
  bottom: -10px;
  border-radius: 50%;
  animation: particleDrift linear infinite;
  will-change: transform, opacity;
}
</style>
