<template>
  <div class="p-4 border border-[#ddd] bg-[#f9f9f9] w-full">
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
      comment: {
          type: Object,
          required: false
      }
  }
}
</script>

<style scoped>

</style>