<template>
  <h1 class="text-center">Jeu de FlashCards</h1>
  <p class="text-center">Nombre de cartes : {{ listKeysValues.length }}</p>
  <div 
    class="m-auto flex items-center justify-center size-80 rounded-3xl bg-amber-300 shadow-2xl shadow-amber-100">
    <h4 class="text-center px-4"></h4>
  </div>
    
  <div class="flex justify-center gap-10 pt-5">
    <button :disabled="true">Retour</button>
    <button>Suivant</button>
  </div>

  <button @click="returnHome">Revenir au Menu</button>

</template>

<script setup>
const returnHome = defineModel('returnHome')

</script>