<template>
    <div class="fixed inset-0 flex items-center justify-center z-50" v-if="show">
      <div class="bg-black bg-opacity-50 absolute inset-0" @click="close"></div>
      <div class="bg-white rounded-lg shadow-lg p-6 z-10">
        <h3 class="text-lg font-semibold mb-4">{{ title }}</h3>
        <p class="mb-6">{{ message }}</p>
        <div class="flex justify-end">
          <button class="bg-[#808080] hover:bg-[#4B4B4B] text-white px-4 py-2 rounded mr-2" @click="close">Cancelar</button>
          <button class="bg-[#E60000] hover:bg-[#8B0000] text-white px-4 py-2 rounded" @click="confirm">Confirmar</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'Modal',
    props: {
      show: {
        type: Boolean,
        required: true
      },
      title: {
        type: String,
        default: 'Confirmación'
      },
      message: {
        type: String,
        default: '¿Estás seguro de que deseas eliminas el post?'
      }
    },
    methods: {
      close() {
        this.$emit('close');
      },
      confirm() {
        this.$emit('confirm');
      }
    }
  };
  </script>