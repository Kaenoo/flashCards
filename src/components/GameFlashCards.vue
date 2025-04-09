<template>
  <div v-if="selectMode === 'null'">
    
    <div class="flex flex-col gap-5 mt-10 mx-8 lg:mx-60 xl:mx-72 2xl:mx-96">
      <button @click="selectMode = 'simple'">Simple</button>
      <button  @click="selectMode = 'disorder'">Désordre</button>
      <!-- <button>Intelligent</button> -->
    </div>
  </div>

  <div v-else>
    <div class="flex items-center justify-between mb-4">
      <div class="flex-1">
        <!-- Slot gauche vide ou autre chose -->
      </div>
      <p class="text-center flex-1">Nombre de cartes : {{ listKeysValues.length }}</p>
      <div class="flex-1 flex justify-end ">
        <img
          @click="InvertCards" 
          class="size-11 rounded active:scale-110 active:bg-amber-200 mr-2 lg:mr-60 xl:mr-80 2xl:mr-96" src="../assets/return.svg" alt="">
      </div>
    </div>
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

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { ref } from 'vue'
const listKeysValues = defineModel({ type: Array})
const goHome = defineModel('returnHome')

const selectMode = ref('null')
const returnCards = ref(false)
const currentIndex = ref(0)

const InvertCards = () => {
  listKeysValues.value.forEach(element => {
    const tempkey = element.key
    element.key = element.value
    element.value = tempkey
  });
}

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