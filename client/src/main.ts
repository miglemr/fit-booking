import './assets/style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'
import * as config from './config'
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

import App from './App.vue'
import router from './router'

const app = createApp(App)
const dsn = config.sentryDsn

if (dsn) {
  Sentry.init({
    app,
    dsn,
    integrations: [Sentry.browserTracingIntegration({ router }), Sentry.replayIntegration()],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  })
}

app.use(createPinia())
app.use(router)
app.component('VueDatePicker', VueDatePicker)

app.mount('#app')
