<template>
  <div class="vfooter d-flex justify-content-between align-items-center">

      <div class="d-flex flex-column text-left left-container">
        <div class="text-white logo-text">{{ $t('footer.logo') }}</div>
        <div class="text-gray copyright-text">{{ $t('footer.copyright') }}</div>
      </div>

      <ul class="text-white m-auto">
        <li class="mx-2">{{ $t('footer.footer_menu.about_us') }}</li>
        <li class="mx-2">{{ $t('footer.footer_menu.toc') }}</li>
        <li class="mx-2">{{ $t('footer.footer_menu.privacy_policy') }}</li>
        <li class="mx-2">{{ $t('footer.footer_menu.get_in_touch') }}</li>
      </ul>

      <div class="right-container">
        <button class="fa fa-facebook facebook social-btn"></button>
        <button class="fa fa-twitter twitter social-btn"></button>
      </div>
  </div>
</template>

<script>
export default {
  name: 'vfooter'
}
</script>

<style lang="scss" scoped>
  .vfooter {
    height: 150px;
    margin-bottom: 24px;
    padding: 0 2.25rem;
    @media (max-width: 767.98px) {
      padding: 0 1rem;
    }

    .left-container {
      @media (max-width: 767.98px) {
        flex: 0 0 140px;
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
        color: #84888F;
        font-size: 14px;
        line-height: 20px;
      }

    }

    ul {
      flex: 1;
      display: flex !important;
      justify-content: center;
      flex-wrap: wrap;
      list-style: none;
      font-size: 14px;
      line-height: 20px;
      padding: 0;
      margin-right: 100px;
    }

    .right-container {
      flex: 0 0 80px;

      .social-btn {
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
  }
</style>
