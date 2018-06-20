import Vue from 'vue'
import VueI18n from 'vue-i18n'

import sv from './sv-SE.json'
import en from './en-US.json'

Vue.use(VueI18n)

const locale = 'sv'

const messages = {
  sv,
  en
}

export default new VueI18n({
  locale,
  fallbackLocale: 'en',
  messages
})
