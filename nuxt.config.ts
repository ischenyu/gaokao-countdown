// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',

  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

  modules: ['@edgeone/nuxt-pages'],

  runtimeConfig: {
    // 仅服务端可访问
    databaseUrl: '',
    recaptchaSecret: '',
    adminPassword: '',
    jwtSecret: '',
    // 客户端可访问
    public: {
      recaptchaSiteKey: '',
      gaokaoMonth: 6,
      gaokaoDay: 7,
      siteName: '高考倒计时',
    },
  },

  app: {
    head: {
      title: '高考倒计时 — 以梦为马，不负韶华',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: '高考倒计时，记录每一天的努力。留言为考生加油！',
        },
        { name: 'theme-color', content: '#0a0a1a' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      ],
      script: [
        {
          src: 'https://www.recaptcha.net/recaptcha/api.js?render=explicit',
          async: true,
          defer: true,
        },
      ],
    },
  },
});
