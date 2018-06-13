<template>
  <div class="vfooter d-flex justify-content-between align-items-center">

      <div class="d-flex flex-column align-items-start">
        <span class="text-white logo-text">LIVSPLAN</span>
        <span class="copyright-text text-gray">Livsplan.se 2018 All Right Reserved</span>
      </div>

      <ul class="d-flex text-white">
        <li class="mx-2">About Us</li>
        <li class="mx-2">Terms of Service</li>
        <li class="mx-2">Privacy Policy</li>
        <li class="mx-2">Get in Touch</li>
      </ul>

      <div>
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
    padding: 0 2.25rem;

    .logo-text {
      font-size: 24px;
      letter-spacing: 1.2px;
    }

    .copyright-text {
      font-size: 14px;
      line-height: 20px;
    }

    ul {
      list-style: none;
      font-size: 14px;
      line-height: 20px;
      padding: 0;
      margin-right: 100px;
    }

    .social-btn {
      width: 30px;
      height: 30px;
      border-radius: 50%;
    }
  }
</style>
