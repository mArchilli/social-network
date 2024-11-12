<template>
  <div class="mb-4">
    <textarea
      id="comment"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @input="updateComment($event.target.value)"
      :value="comment"
      class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline transition duration-200 ease-in-out"
      :class="{
        'border-gray-300': !isFocused,
        'border-[#ca8e5e]': isFocused,
        'hover:border-[#a87049]': !isFocused,
        'hover:shadow-lg': !isFocused
      }"
      rows="5"
      maxlength="140"
    ></textarea>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isFocused: false
    };
  },
  computed: {
    comment: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  methods: {
    updateComment(value) {
      this.comment = value;
    }
  }
}
</script>

<style scoped>
</style>
