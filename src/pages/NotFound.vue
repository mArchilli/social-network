<template>
    <div class="flex items-center justify-center min-h-screen ">
      <div class="text-center p-8 bg-white shadow-md rounded-lg max-w-sm w-full">
        <h1 class="text-6xl font-bold text-green-600 mb-4">404</h1>
        <p class="text-lg text-gray-600 mb-6">La página que buscas no existe.</p>
        
        <Button>
          <router-link to="/posts" class="text-white bg-green-500 hover:bg-green-600 py-2 px-4 rounded-md">Volver al inicio</router-link>
        </Button>
      </div>
    </div>
  </template>
  
  <script>
  import Button from '../components/Button.vue'; // Importar el componente Button
  
  export default {
    name: 'NotFound',
    components: {
      Button
    }
  }
  </script>
  
  <style scoped>
  /* Estilos adicionales */
  .bg-gradient-to-r {
    background: linear-gradient(to right, #d1fae5, #a7f3d0); /* Gradiente verde claro */
  }
  
  .text-green-600 {
    color: #4ade80; /* Verde más fuerte para el título */
  }
  
  .text-gray-600 {
    color: #4b5563; /* Gris más suave para el texto */
  }
  
  .bg-green-500 {
    background-color: #22c55e; /* Verde para el botón */
  }
  
  .bg-green-600 {
    background-color: #16a34a; /* Verde más oscuro para hover */
  }
  
  .text-white {
    color: white;
  }
  
  .py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  
  .px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  
  .rounded-md {
    border-radius: 0.375rem;
  }
  
  .shadow-md {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .max-w-sm {
    max-width: 24rem;
  }
  
  .w-full {
    width: 100%;
  }
  </style>
  