<template>
  <notify-me
    close="bootstrap"
    :event-bus="bus"
  >
    <template slot="content" slot-scope="{data}">
        <div>
            <h4><b>{{data.title}}</b></h4>
            <p style="margin: 0">{{data.text}}</p>
        </div>
    </template>
  </notify-me>
</template>

<script>
import Notify from 'vue-notify-me'
import Vue from 'vue'
import EventBus from '../../event-bus.js'
const bus = new Vue()

export default {
  name: 'vnotify',
  components: {
    'notify-me': Notify
  },
  created () {
    EventBus.$on('notify-me', res => {
      this.bus.$emit('notify-me', {
        status: res.status,
        data: {
          title: res.title,
          text: res.text
        }
      })
    })
  },
  data () {
    return {
      bus
    }
  }
}
</script>

<style lang="scss">
  .notification {
    padding: 1.25rem 1.5rem;
    color: #fff;
    text-align: left;

    @media (max-width: 575.98px) {
      width: 270px !important;
    }

    &.is-success {
      background-color: #23d160;
    }

    &.is-danger {
      background-color: #ff3860;
    }

    .close {
      position: absolute;
      right: .5em;
      top: .5em;
    }
  }
</style>
