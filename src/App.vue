<template>
  <h1 class="text-center">FlashCards</h1>

  <div v-if="pageSelection === 'home'">
    <div class="flex flex-col gap-5 mt-10 mx-8 lg:mx-60 xl:mx-72 2xl:mx-96">
      <button @click="pageSelection = 'data'">Données</button>
      <button :disabled="emptyArray()" @click="pageSelection = 'memrise'">Mémoriser</button>
      <!-- <button :disabled="emptyArray()" @click="pageSelection = 'test'">Test</button> -->
    </div>
  </div>

  <div v-if="pageSelection === 'data'">
    <InsertData v-model="listKeysValues" v-model:returnHome="pageSelection"/>
  </div>

  <div v-if="pageSelection === 'memrise'">
    <Memrise v-model="listKeysValues" v-model:returnHome="pageSelection"/>
  </div>

  <!-- <div v-if="pageSelection === 'test'">
    <Test v-model="listKeysValues" v-model:returnHome="pageSelection"/>
  </div> -->
</template>

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { ref, onMounted, watch } from 'vue'
import Memrise from './components/Memrise.vue'
import InsertData from './components/InsertData.vue'
import Test from './components/Test.vue'

let listKeysValues = ref([])
const pageSelection = ref('home')
const gameStarted = ref(false)

/**
 * Charger les données depuis localStorage
 */
 onMounted(() => {
  const savedData = localStorage.getItem('listKeysValues')
  if (savedData) {
    listKeysValues.value = JSON.parse(savedData)
  }
})

/**
 * Sauvegarder listKeysValues dans localStorage dès qu'il change
 */
watch(listKeysValues, (newList) => {
  localStorage.setItem('listKeysValues', JSON.stringify(newList))
}, { deep: true })

const emptyArray = () => listKeysValues.value.length === 0 ? true : false
</script>