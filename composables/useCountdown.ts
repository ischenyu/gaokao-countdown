/**
 * 高考倒计时 composable。
 * 客户端每秒轮询 /api/countdown，返回响应式倒计时数据。
 */
export function useCountdown() {
  const totalDays = ref(0);
  const hours = ref(0);
  const minutes = ref(0);
  const seconds = ref(0);
  const gaokaoLabel = ref('');
  const isToday = ref(false);
  const loading = ref(true);

  let timer: ReturnType<typeof setInterval> | null = null;

  async function fetchCountdown() {
    try {
      const data = await $fetch<{
        totalDays: number;
        hours: number;
        minutes: number;
        seconds: number;
        gaokaoLabel: string;
        isToday: boolean;
      }>('/api/countdown');
      totalDays.value = data.totalDays;
      hours.value = data.hours;
      minutes.value = data.minutes;
      seconds.value = data.seconds;
      gaokaoLabel.value = data.gaokaoLabel;
      isToday.value = data.isToday;
    } catch (err) {
      console.error('获取倒计时失败:', err);
    } finally {
      loading.value = false;
    }
  }

  // 客户端初始化
  onMounted(() => {
    fetchCountdown();
    timer = setInterval(fetchCountdown, 1000);
  });

  onUnmounted(() => {
    if (timer) clearInterval(timer);
  });

  // SSR / SSG 首屏数据
  if (import.meta.server) {
    // 服务端不做轮询，由客户端接管
  }

  return {
    totalDays,
    hours,
    minutes,
    seconds,
    gaokaoLabel,
    isToday,
    loading,
  };
}
