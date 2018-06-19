import Vue from 'vue'
import VueI18n from 'vue-i18n'

import se from './se.json'
import en from './en.json'

Vue.use(VueI18n)

const locale = 'en'

const messages = {
  se,
  en
}

export default new VueI18n({
  locale,
  fallbackLocale: 'en',
  messages
})
