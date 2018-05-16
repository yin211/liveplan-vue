<template>
    <v-app>
        <v-navigation-drawer
            :clipped="$vuetify.breakpoint.lgAndUp"
            v-model="drawer"
            fixed
            app
        >
            <v-list dense>
                <template v-for="item in items">
                    <v-layout
                        v-if="item.heading"
                        :key="item.heading"
                        row
                        align-center
                    >
                        <v-flex xs6>
                            <v-subheader v-if="item.heading">
                                {{ item.heading }}
                            </v-subheader>
                        </v-flex>
                        <v-flex xs6 class="text-xs-center">
                            <a href="#!" class="body-2 black--text">EDIT</a>
                        </v-flex>
                    </v-layout>
                    <v-list-group
                        v-else-if="item.children"
                        v-model="item.model"
                        :key="item.text"
                        :prepend-icon="item.model ? item.icon : item['icon-alt']"
                        append-icon=""
                    >
                        <v-list-tile slot="activator">
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ item.text }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                        <v-list-tile
                            v-for="(child, i) in item.children"
                            :key="i"
                            @click=""
                        >
                            <v-list-tile-action v-if="child.icon">
                                <v-icon>{{ child.icon }}</v-icon>
                            </v-list-tile-action>
                            <v-list-tile-content>
                                <v-list-tile-title>
                                    {{ child.text }}
                                </v-list-tile-title>
                            </v-list-tile-content>
                        </v-list-tile>
                    </v-list-group>
                    <v-list-tile v-else :key="item.text" @click="">
                        <v-list-tile-action>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                                {{ item.text }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                </template>
            </v-list>
        </v-navigation-drawer>
        <v-toolbar
            :clipped-left="$vuetify.breakpoint.lgAndUp"
            color="blue darken-3"
            dark
            app
            fixed
        >
            <v-toolbar-title style="width: 300px" class="ml-0 pl-3">
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <span class="hidden-sm-and-down">livsplan.se</span>
            </v-toolbar-title>

            <v-spacer></v-spacer>

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
                    

            <v-btn icon large>
                <v-avatar size="32px" tile>
                    <img
                        src="https://vuetifyjs.com/static/doc-images/logo.svg"
                        alt="Vuetify"
                    >
                </v-avatar>
            </v-btn>
        </v-toolbar>
        <v-content>
            <v-container fluid fill-height>
                <v-layout justify-center align-center>
                </v-layout>
            </v-container>
        </v-content>
        <v-btn
            fab
            bottom
            right
            color="pink"
            dark
            fixed
            @click.stop="dialog = !dialog"
        >
            <v-icon>add</v-icon>
        </v-btn>
        <v-dialog v-model="dialog" width="800px">
            <v-card>
                <v-card-title
                        class="grey lighten-4 py-4 title"
                >
                    Create contact
                </v-card-title>
                <v-container grid-list-sm class="pa-4">
                    <v-layout row wrap>
                        <v-flex xs12 align-center justify-space-between>
                            <v-layout align-center>
                                <v-avatar size="40px" class="mr-3">
                                    <img
                                        src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                                        alt=""
                                    >
                                </v-avatar>
                                <v-text-field
                                        placeholder="Name"
                                ></v-text-field>
                            </v-layout>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field
                                    prepend-icon="business"
                                    placeholder="Company"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs6>
                            <v-text-field
                                    placeholder="Job title"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    prepend-icon="mail"
                                    placeholder="Email"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    type="tel"
                                    prepend-icon="phone"
                                    placeholder="(000) 000 - 0000"
                                    mask="phone"
                            ></v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-text-field
                                    prepend-icon="notes"
                                    placeholder="Notes"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                </v-container>
                <v-card-actions>
                    <v-btn flat color="primary">More</v-btn>
                    <v-spacer></v-spacer>
                    <v-btn flat color="primary" @click="dialog = false">Cancel</v-btn>
                    <v-btn flat @click="dialog = false">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-app>
</template>
<script>
    import languages from '@/lang/languages'
    import {SET_LANG} from '@/store/actions/lang'

    export default {
      name: 'Dashboard',
      data: () => {
        return {
          dialog: false,
          drawer: null,
          items: [
            {icon: 'dashboard', text: 'Dashboard'},
            {divider: false, inset: true},
            {icon: 'list', text: 'Income'},
            {icon: 'credit_card', text: 'Expenses'},
            {icon: 'work', text: 'Assets'},
            {icon: 'home', text: 'Debts'},
            {divider: false, inset: true},
            {icon: 'dashboard', text: 'Reports'},
            {icon: 'timeline', text: 'Scenarios'},
            {divider: false, inset: true},
            {icon: 'settings', text: 'Settings', style: 'border:1px solid black;'}
          ],
          languages: languages
        }
      },
      props: {
        source: String
      },
      computed: {
        currentLanguage () {
          return this.languages.find(l => l.locale === this.$i18n.locale)
        }
      },
      methods: {
        setLang: function (lang) {
          this.$store.dispatch(SET_LANG, lang)
        }
      }
    }
</script>
