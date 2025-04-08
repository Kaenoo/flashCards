<template>
  <div v-if="selectMode === 'null'">
    
    <div class="flex flex-col gap-5 mt-10 mx-8 lg:mx-60 xl:mx-72 2xl:mx-96">
      <button @click="selectMode = 'simple'">Simple</button>
      <button  @click="selectMode = 'disorder'">Désordre</button>
      <!-- <button>Intelligent</button> -->
    </div>
  </div>

  <div v-else>
    <p class="text-center">Nombre de cartes : {{ listKeysValues.length }}</p>
    <div 
      class="m-auto flex items-center justify-center size-80 rounded-3xl bg-amber-300 shadow-2xl shadow-amber-100"
      @click="returnCards = !returnCards">
      <h4 
      class="text-center px-4" 
      v-if="listKeysValues.length > 0" 
      v-text="returnCards ? listKeysValues[currentIndex].key : listKeysValues[currentIndex].value"></h4>
    </div>
    
    <div class="flex justify-center gap-10 pt-5">
      <button @click="prevCard" :disabled="currentIndex === 0">Retour</button>
      <button @click="nextCard" :disabled="currentIndex >= listKeysValues.length - 1">Suivant</button>
    </div>
  </div>
  
  <div class="flex justify-center pt-8">
    <button @click="goHome = 'home'">Revenir au Menu</button>
  </div>

</template>

<script setup>
import { ref } from 'vue'
const listKeysValues = defineModel({ type: Array})
const goHome = defineModel('returnHome')

const selectMode = ref('null')
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