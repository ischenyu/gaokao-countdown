<template>
  <div class="bing-bg">
    <!-- Bing 每日壁纸作为背景层 -->
    <div
      class="bing-bg__image"
      :style="{ backgroundImage: `url(${bgUrl})` }"
    ></div>
    <!-- 蓝调暗色叠加层, 保证文字可读性 -->
    <div class="bing-bg__overlay"></div>
    <!-- 底部渐隐 — 让 footer 区域更柔和 -->
    <div class="bing-bg__vignette"></div>
  </div>
</template>

<script setup lang="ts">
/**
 * Bing 每日壁纸背景组件。
 * 替代之前的粒子背景，使用高清每日壁纸 + 蓝调毛玻璃叠加层。
 */

const bgUrl = 'https://bing.img.run/1920x1080.php';
</script>

<style scoped>
.bing-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}

.bing-bg__image {
  position: absolute;
  inset: -20px; /* 扩大区域隐藏模糊边缘 */
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #0a0e24; /* fallback — 冷调深蓝 */
  filter: blur(12px) brightness(0.85);
  transition: background-image 0.8s ease;
}

.bing-bg__overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(10, 14, 36, 0.60) 0%,
    rgba(10, 14, 36, 0.45) 50%,
    rgba(10, 14, 36, 0.60) 100%
  );
}

.bing-bg__vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 50%,
    rgba(10, 14, 36, 0.35) 100%
  );
  pointer-events: none;
}
</style>
