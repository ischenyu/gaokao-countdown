<template>
  <form class="message-form" @submit.prevent="handleSubmit">
    <div class="message-form__row">
      <label class="message-form__label" for="msg-author">昵称</label>
      <input
        id="msg-author"
        v-model="author"
        class="message-form__input"
        type="text"
        maxlength="50"
        placeholder="你的名字或昵称"
        required
      />
    </div>

    <div class="message-form__row">
      <label class="message-form__label" for="msg-content">祝福语</label>
      <textarea
        id="msg-content"
        v-model="content"
        class="message-form__textarea"
        maxlength="1000"
        placeholder="写下你对考生的祝福…"
        required
      ></textarea>
    </div>

    <!-- reCAPTCHA v2 复选框 -->
    <div
      v-if="publicKey"
      id="recaptcha-container"
      class="message-form__recaptcha"
    ></div>

    <p v-if="errorMsg" class="message-form__error">{{ errorMsg }}</p>
    <p v-if="successMsg" class="message-form__success">{{ successMsg }}</p>

    <button
      class="message-form__submit"
      type="submit"
      :disabled="submitting || !recaptchaReady"
    >
      {{ submitting ? '提交中…' : !recaptchaReady ? '加载验证…' : '✨ 送出祝福' }}
    </button>
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits<{ submitted: [] }>();

const config = useRuntimeConfig();
const publicKey = config.public.recaptchaSiteKey as string;

const author = ref('');
const content = ref('');
const errorMsg = ref('');
const successMsg = ref('');
const submitting = ref(false);
const recaptchaReady = ref(false);

let widgetId: number | null = null;

function initRecaptcha() {
  if (!publicKey) {
    recaptchaReady.value = true;
    return;
  }

  const container = document.getElementById('recaptcha-container');
  if (!container) return;

  const g = window.grecaptcha;
  if (!g) {
    // 脚本还没加载完，轮询等
    let attempts = 0;
    const interval = setInterval(() => {
      if (window.grecptcha) {
        clearInterval(interval);
        doRender();
      } else if (++attempts >= 30) {
        clearInterval(interval);
      }
    }, 200);
    return;
  }

  doRender();

  function doRender() {
    if (!window.grecaptcha) return;
    try {
      widgetId = window.grecaptcha.render('recaptcha-container', {
        sitekey: publicKey,
      });
      recaptchaReady.value = true;
    } catch {
      // 容器就绪后重试一次
      setTimeout(() => {
        try {
          widgetId = window.grecaptcha!.render('recaptcha-container', {
            sitekey: publicKey,
          });
          recaptchaReady.value = true;
        } catch { /* ignore */ }
      }, 500);
    }
  }
}

function getRecaptchaToken(): string {
  if (!publicKey) return 'dev-bypass';
  if (!window.grecaptcha || widgetId === null) return '';
  return window.grecaptcha.getResponse(widgetId) || '';
}

async function handleSubmit() {
  errorMsg.value = '';
  successMsg.value = '';

  if (!author.value.trim()) {
    errorMsg.value = '请输入昵称。';
    return;
  }
  if (!content.value.trim()) {
    errorMsg.value = '请输入祝福语。';
    return;
  }

  const token = getRecaptchaToken();
  if (publicKey && !token) {
    errorMsg.value = '请先完成人机验证。';
    return;
  }

  submitting.value = true;
  try {
    await $fetch('/api/messages', {
      method: 'POST',
      body: {
        author: author.value.trim(),
        content: content.value.trim(),
        recaptchaToken: token,
      },
    });
    successMsg.value = '✅ 留言提交成功！审核通过后将显示。';
    author.value = '';
    content.value = '';
    // 重置 reCAPTCHA 以便再次提交
    if (window.grecaptcha && widgetId !== null) {
      window.grecaptcha.reset(widgetId);
    }
    emit('submitted');
  } catch (err: unknown) {
    const msg =
      (err as { statusMessage?: string }).statusMessage ||
      (err as { data?: { statusMessage?: string } }).data?.statusMessage ||
      '提交失败，请重试。';
    errorMsg.value = msg;
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  setTimeout(initRecaptcha, 200);
});
</script>

<style scoped>
.message-form__recaptcha {
  margin: 12px 0;
  display: flex;
  justify-content: center;
}
</style>
