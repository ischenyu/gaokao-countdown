<template>
  <section class="timeline-section">
    <h2 class="board-section__title">
      <span class="board-section__icon">🧚</span>
     备考之旅 · 派蒙陪你走过
    </h2>

    <div class="timeline">
      <div
        v-for="(event, idx) in events"
        :key="event.label"
        class="timeline-item"
        :class="{
          'timeline-item--past': event.past,
          'timeline-item--today': event.isGaokaoDay,
        }"
        :style="{ animationDelay: `${idx * 0.12}s` }"
      >
        <!-- 左侧标志 -->
        <div class="timeline-item__dot">
          <div class="timeline-item__circle">
            <span v-if="event.past" class="timeline-item__check">✓</span>
            <span v-else-if="event.isGaokaoDay" class="timeline-item__icon">🎓</span>
            <span v-else class="timeline-item__number">{{ idx + 1 }}</span>
          </div>
          <div v-if="idx < events.length - 1" class="timeline-item__line"
            :class="{ 'timeline-item__line--done': event.past }"
          ></div>
        </div>

        <!-- 右侧卡片 -->
        <div class="timeline-item__card">
          <div class="timeline-item__header">
            <span class="timeline-item__label">{{ event.label }}</span>
            <span class="timeline-item__date"
              :class="{ 'timeline-item__date--past': event.past }"
            >{{ event.dateStr }}</span>
          </div>
          <p class="timeline-item__desc">{{ event.desc }}</p>
          <div v-if="event.daysToGo !== null" class="timeline-item__count">
            <span v-if="event.past" class="timeline-item__status timeline-item__status--done">✅ 已过</span>
            <span v-else-if="event.isGaokaoDay" class="timeline-item__status timeline-item__status--today">🎉 就是今天！</span>
            <span v-else class="timeline-item__status">还有 <strong>{{ event.daysToGo }}</strong> 天</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface TimelineEvent {
  label: string;
  dateStr: string;
  desc: string;
  timestamp: number;
  past: boolean;
  isGaokaoDay: boolean;
  daysToGo: number | null;
}

const config = useRuntimeConfig();
const month = config.public.gaokaoMonth as number;
const day = config.public.gaokaoDay as number;

const now = Date.now();
const thisYear = new Date().getFullYear();
let gaokaoDate = new Date(thisYear, month - 1, day, 9, 0, 0);
if (now > gaokaoDate.getTime()) {
  gaokaoDate = new Date(thisYear + 1, month - 1, day, 9, 0, 0);
}
const gaokaoTs = gaokaoDate.getTime();

function dateStr(m: number, d: number): string {
  return `${m}月${d}日`;
}

function ts(y: number, m: number, d: number): number {
  return new Date(y, m - 1, d, 9, 0, 0).getTime();
}

function daysDiff(target: number): number {
  return Math.max(0, Math.ceil((target - now) / (1000 * 60 * 60 * 24)));
}

const events = computed<TimelineEvent[]>(() => {
  const gYear = gaokaoDate.getFullYear();

  // 相对于高考日期推算各节点（sensible defaults）
  const nodes: { label: string; m: number; d: number; desc: string }[] = [
    {
      label: '百日誓师',
      m: month === 6 && day === 7 ? 2 : Math.max(1, month - 3),
      d: day === 7 ? 27 : Math.min(28, day),
      desc: '百日冲刺，誓言铿锵。最后的百日，全力以赴！',
    },
    // {
    //   label: '第一次模拟考试',
    //   m: Math.max(1, month - 3),
    //   d: Math.min(28, day + 10),
    //   desc: '一模是高考的"预演"，检验一轮复习成果，调整备考方向。',
    // },
    // {
    //   label: '第二次模拟考试',
    //   m: Math.max(1, month - 2),
    //   d: Math.min(28, day - 5),
    //   desc: '二模难度接近高考，查漏补缺的关键节点。',
    // },
    // {
    //   label: '第三次模拟考试',
    //   m: Math.max(1, month - 1),
    //   d: Math.min(28, day - 10),
    //   desc: '三模相对简单，旨在帮助建立考前信心。',
    // },
    {
      label: '🎯 高考',
      m: month,
      d: day,
      desc: '以梦为马，不负韶华。祝所有考生金榜题名！',
    },
    {
      label: '成绩查询',
      m: month,
      d: Math.min(30, day + 18),
      desc: '各省陆续公布高考成绩及各批次分数线。',
    },
    {
      label: '志愿填报',
      m: month,
      d: Math.min(30, day + 23),
      desc: '合理填报志愿，选择心仪的大学与专业。',
    },
  ];

  return nodes.map((n) => {
    const t = ts(gYear, n.m, n.d);
    const past = now > t;
    const isGaokaoDay = n.label.includes('🎯') && now >= gaokaoTs && now < gaokaoTs + 86400000;
    return {
      label: n.label,
      dateStr: dateStr(n.m, n.d),
      desc: n.desc,
      timestamp: t,
      past,
      isGaokaoDay,
      daysToGo: past ? null : daysDiff(t),
    };
  });
});
</script>

<style scoped>
.timeline-section {
  width: 100%;
  max-width: 680px;
  margin: 0 auto 56px;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
}

.timeline-item {
  display: flex;
  gap: 18px;
  animation: fadeInUp 0.6s ease both;
}

.timeline-item__dot {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 32px;
  flex-shrink: 0;
  padding-top: 4px;
}

.timeline-item__circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 600;
  border: 2px solid rgba(59, 130, 246, 0.3);
  background: rgba(10, 14, 36, 0.8);
  color: var(--primary);
  transition: all 0.3s;
  flex-shrink: 0;
}

.timeline-item--today .timeline-item__circle {
  border-color: var(--primary);
  background: var(--primary);
  color: #fff;
  box-shadow: 0 0 20px var(--primary-glow);
}

.timeline-item--past .timeline-item__circle {
  border-color: rgba(96, 192, 128, 0.4);
  background: rgba(96, 192, 128, 0.12);
  color: #60c080;
}

.timeline-item__check {
  font-size: 1rem;
}

.timeline-item__icon {
  font-size: 1.1rem;
}

.timeline-item__number {
  font-size: 0.82rem;
}

.timeline-item__line {
  width: 2px;
  flex: 1;
  min-height: 24px;
  background: linear-gradient(180deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05));
  transition: background 0.5s;
}

.timeline-item__line--done {
  background: linear-gradient(180deg, rgba(96, 192, 128, 0.35), rgba(59, 130, 246, 0.05));
}

.timeline-item__card {
  flex: 1;
  background: var(--bg-glass);
  border: 1px solid rgba(255, 255, 255, 0.04);
  border-radius: var(--radius-lg);
  padding: 16px 20px;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: border-color 0.3s, background 0.3s, transform 0.25s;
  margin-bottom: 12px;
}

.timeline-item__card:hover {
  border-color: var(--border-glass);
  background: var(--bg-glass-strong);
  transform: translateY(-2px);
}

.timeline-item--today .timeline-item__card {
  border-color: var(--border-glass-hover);
  box-shadow: 0 0 30px var(--primary-glow);
}

.timeline-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.timeline-item__label {
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-primary);
}

.timeline-item--today .timeline-item__label {
  color: var(--primary-light);
}

.timeline-item__date {
  font-size: 0.78rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.timeline-item__date--past {
  color: rgba(96, 192, 128, 0.7);
}

.timeline-item__desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 8px;
}

.timeline-item__count {
  font-size: 0.82rem;
}

.timeline-item__status {
  color: var(--text-muted);
}

.timeline-item__status strong {
  color: var(--primary-light);
  font-weight: 600;
}

.timeline-item__status--done {
  color: rgba(96, 192, 128, 0.7);
}

.timeline-item__status--today {
  color: var(--primary-light);
  font-weight: 600;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 500px) {
  .timeline-item__card {
    padding: 14px 16px;
  }
  .timeline-item__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
