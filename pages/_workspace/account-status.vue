<template>
  <div style="background-color: #fff; width: 100%; height: 100vh">
    <SchoolTopnav />
    <div>
      <h1 class="account-wrapper">This account is suspended</h1>
    </div>
  </div>
</template>

<script>
import SchoolTopnav from '~/components/SchoolTopnav.vue'
export default {
  components: { SchoolTopnav },
  layout: 'auth',
  middleware: 'auth',
}
</script>

<style lang="scss" scoped>
.account-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
