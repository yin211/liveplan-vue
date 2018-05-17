<template>
  <v-app id="login">
    <v-toolbar dense height="58px" color="blue lighten-5">
        <v-avatar size="40px" class="mr-3">
            <v-avatar size="32px" tile>
                <img
                    src="https://vuetifyjs.com/static/doc-images/logo.svg"
                    alt="Vuetify"
                >
            </v-avatar>
        </v-avatar>
        <v-toolbar-title>Livsplan</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
            <v-menu offset-y>
                <v-btn slot="activator" flat>
                  <img :src="`https://countryflags.io/${currentLanguage.country}/flat/32.png`" width="32px"/>
                </v-btn>
                <v-list>
                    <v-list-tile v-for="lang in languages" :key="lang.locale" @click="setLang(lang.locale)">
                        <v-list-tile-avatar size="24px">
                          <img :src="`https://countryflags.io/${lang.country}/flat/24.png`"  width="24px"/>
                        </v-list-tile-avatar>
                        <v-list-tile-title>{{lang.title}}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>{{ $t("login") }}</v-toolbar-title>
              </v-toolbar>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-card-text>
                  <v-text-field v-model="email" :rules="emailRules" prepend-icon="person" name="login" label="Login" type="text" required></v-text-field>
                  <v-text-field v-model="password" :rules="passwordRules" id="password" prepend-icon="lock" name="password" label="Password" type="password" required></v-text-field>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="primary" :disabled="!valid" @click="submit">{{ $t("login") }}</v-btn>
                </v-card-actions>
              </v-form>
            </v-card>
          </v-flex>
        </v-layout>
        <v-snackbar
            :timeout="5000"
            top
            right
            :color="'error'"
            v-model="snackbar"
        >
            {{errorMsg}}
            <v-btn dark flat @click.native="snackbar = false">Close</v-btn>
        </v-snackbar>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  import languages from '@/lang/languages'
  import {AUTH_REQUEST} from '@/store/actions/auth'
  import {SET_LANG} from '@/store/actions/lang'

  export default {
    name: 'Login',
    data: () => ({
      drawer: null,
      email: '',
      password: '',
      valid: true,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      passwordRules: [
        v => !!v || 'Password is required'
      ],
      snackbar: false,
      errorMsg: '',
      languages: languages
    }),

    props: {
      source: String
    },

    computed: {
      currentLanguage () {
        return this.languages.find(l => l.locale === this.$i18n.locale)
      }
    },

    methods: {
      submit () {
        if (this.$refs.form.validate()) {
          const { email, password } = this
          this.$store.dispatch(AUTH_REQUEST, { email, password }).then(() => {
            this.$router.push('/dashboard')
          }, () => {
            this.errorMsg = 'Invalid login, please try again.'
            this.snackbar = true
          })
        }
      },
      setLang: function (lang) {
        this.$store.dispatch(SET_LANG, lang)
      }
    }
  }
</script>

<style lang="css">
    #login {
        background: url('../assets/hero.jpeg');
    }
</style>
