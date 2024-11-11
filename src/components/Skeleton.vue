<script>
export default {
    name: 'Skeleton',
}
</script>

<template>
  <div role="status" class="space-y-8 flex flex-col justify-center animate-pulse">

    <!-- Skeleton para el Post -->
    <div class="max-w-[470px] w-full border rounded-lg overflow-hidden shadow-lg mx-auto">
      
      <!-- Imagen del Post -->
      <div class="relative">
        <div class="w-full h-80 bg-beige-dark rounded-t-lg"></div>
      </div>

      <!-- Contenido del Post -->
      <div class="p-6 flex flex-col">
        <!-- Header: Título y Usuario -->
        <div class="mb-4">
          <div class="h-4 bg-beige-dark rounded-full dark:bg-gray-700 max-w-[300px] mb-2"></div> <!-- Título -->
          <div class="flex items-center text-gray-500 text-sm">
            <div class="h-3 bg-beige-dark rounded-full dark:bg-gray-700 max-w-[150px] mb-1 mr-2"></div> <!-- Usuario -->
            <span class="text-gray-400">•</span>
            <div class="h-3 bg-beige-dark rounded-full dark:bg-gray-700 max-w-[100px] mb-1 ml-2"></div> <!-- Fecha -->
          </div>
        </div>

        <!-- Contenido del Post -->
        <div class="h-2.5 bg-beige-dark rounded-full dark:bg-gray-700 max-w-[460px] mb-3"></div> <!-- Contenido -->
        <div class="h-2.5 bg-beige-dark rounded-full dark:bg-gray-700 max-w-[470px] mb-3"></div> <!-- Contenido -->
        <div class="h-2.5 bg-beige-dark rounded-full dark:bg-gray-700 max-w-[480px] mb-3"></div> <!-- Contenido -->

        <!-- Botón "Ver más" -->
        <div class="h-10 bg-beige-dark rounded-full dark:bg-gray-700 max-w-[150px] mt-4"></div>
      </div>
    </div>

  </div>
</template>

<style>
.bg-beige-dark {
  background-color: #e0d8c7; /* Cambiar este valor al tono deseado */
}
</style>
