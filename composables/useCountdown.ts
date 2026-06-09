/**
 * 高考倒计时 composable。
 * 首次加载时获取目标时间戳，之后客户端本地每秒更新。
 */
export function useCountdown() {
  const totalDays = ref(0);
  const hours = ref(0);
  const minutes = ref(0);
  const seconds = ref(0);
  const gaokaoLabel = ref('');
  const isToday = ref(false);
  const isAfterGaokao = ref(false);
  const loading = ref(true);

  let targetTimestamp = 0;
  let timer: ReturnType<typeof setInterval> | null = null;

  function tick() {
    if (!targetTimestamp) return;
    const now = Date.now();
    const diffMs = targetTimestamp - now;

    if (diffMs <= 0) {
      totalDays.value = 0;
      hours.value = 0;
      minutes.value = 0;
      seconds.value = 0;
      isToday.value = true;
      isAfterGaokao.value = true;
      return;
    }

    totalDays.value = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    hours.value = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    minutes.value = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    seconds.value = Math.floor((diffMs % (1000 * 60)) / 1000);
    isToday.value = false;
    isAfterGaokao.value = false;
  }

  async function fetchTargetDate() {
    try {
      const data = await $fetch<{
        targetTimestamp: number;
        gaokaoLabel: string;
      }>('/api/countdown');
      targetTimestamp = data.targetTimestamp;
      gaokaoLabel.value = data.gaokaoLabel;
      tick();
    } catch (err) {
      console.error('获取高考日期失败:', err);
    } finally {
      loading.value = false;
    }
  }

  onMounted(() => {
    fetchTargetDate();
    timer = setInterval(tick, 1000);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  return {
    totalDays,
    hours,
    minutes,
    seconds,
    gaokaoLabel,
    isToday,
    isAfterGaokao,
    loading,
  };
}
