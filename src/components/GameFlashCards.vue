<template>
  <h1 class="text-center">Jeu de FlashCards</h1>
  <p class="text-center">Nombre de cartes : {{ listKeysValues.length }}</p>
  <div 
    class="m-auto flex items-center justify-center size-80 rounded-3xl bg-amber-300 shadow-2xl shadow-amber-100"
    @click="returnCards = !returnCards">
    <h4 
      class="text-center px-4" 
      v-if="listKeysValues.length > 0" 
      v-text="returnCards ? listKeysValues[currentIndex].key : listKeysValues[currentIndex].value"></h4>
  </div>

  <div class="flex justify-center gap-10 pt-5 pb-8">
    <button @click="prevCard" :disabled="currentIndex === 0">Retour</button>
    <button @click="nextCard" :disabled="currentIndex >= listKeysValues.length - 1">Suivant</button>
  </div>
  
  <div class="flex justify-center">
    <button @click="returnHome = false">Revenir au Menu</button>
  </div>

</template>

<script setup>
import { ref } from 'vue'
const listKeysValues = defineModel({ type: Array})
const returnHome = defineModel('returnHome')

const returnCards = ref(false)
const currentIndex = ref(0)

const nextCard = () => {
  if (currentIndex.value < listKeysValues.value.length - 1) {
    currentIndex.value++
    returnCards.value = false // réinitialise le côté de la carte
  }
}

const prevCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    returnCards.value = false
  }
}

</script>