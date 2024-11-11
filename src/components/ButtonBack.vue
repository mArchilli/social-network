<template>
    <button class="flex items-center text-green-400 rounded hover:text-green-600 transition duration-200 ease-in-out">
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
      </svg>
      <slot />
    </button>
  </template>
  
  <script>
  export default {
    name: 'ButtonBack',
  }
  </script>
  
  <style scoped>
  </style>