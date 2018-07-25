<template>
  <div v-if="isAuthenticated" class="vfooter d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center bg-dark mx-auto">

      <div class="d-flex flex-column flex-lg-row left-container">
        <div class="d-flex flex-column text-left">
          <div class="text-white logo-text">{{ $t('footer.logo') }}</div>
          <div class="text-gray copyright-text">{{ $t('footer.copyright') }}</div>
        </div>

        <ul class="d-flex flex-column flex-sm-row justify-content-center align-items-start text-white m-sm-auto">
          <li class="my-2 my-sm-0 mx-lg-2">{{ $t('footer.footer_menu.about_us') }}</li>
          <li class="my-2 my-sm-0 mx-sm-2">{{ $t('footer.footer_menu.toc') }}</li>
          <li class="my-2 my-sm-0 mx-sm-2">{{ $t('footer.footer_menu.privacy_policy') }}</li>
          <li class="my-2 my-sm-0 mx-sm-2">{{ $t('footer.footer_menu.get_in_touch') }}</li>
        </ul>
      </div>

      <div class="right-container align-self-start align-self-lg-center">
        <button class="fa fa-facebook facebook social-btn"></button>
        <button class="fa fa-twitter twitter social-btn"></button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'vfooter',
  computed: {
    isAuthenticated () {
      return this.$store.getters.isAuthenticated
    }
  }
}
</script>

<style lang="scss" scoped>
  .vfooter {
    max-width: 1440px;
    padding: 50px 36px;
    @media (max-width: 575.98px) {
      padding: 32px 36px;
    }

    .left-container {
      @media (min-width: 992px) {
        width: 80%;
      }

      > div {
        @media (max-width: 991.98px) {
          margin-bottom: 40px;
        }
      }

      .logo-text {
        height: 29px;
        width: 89px;
        color: #FFFFFF;
        font-size: 24px;
        font-weight: bold;
        letter-spacing: 1.2px;
        line-height: 29px;
      }

      .copyright-text {
        height: 20px;
        font-size: 14px;
        line-height: 20px;
      }

    }

    ul {
      list-style: none;
      font-size: 14px;
      line-height: 20px;
      padding: 0;
      margin-right: 100px;
    }

    .right-container {

      .social-btn {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: white;
        font-size: 20px;
      }
    }
  }
</style>
