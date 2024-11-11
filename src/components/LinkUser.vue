<template>
  <button
    class="text-green-400 hover:underline hover:text-green-600 transition duration-200 ease-in-out focus:outline-none"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'LinkUser'
}
</script>

<style scoped>
</style>