<template>
  <h1 class="text-center">FlashCards</h1>

  <div v-if="pageSelection === 'home'">
    <div class="flex flex-col gap-5 mt-10 mx-8 lg:mx-60 xl:mx-72 2xl:mx-96">
      <button @click="pageSelection = 'data'">Données</button>
      <button :disabled="listKeysValues.length === 0" @click="pageSelection = 'memrise'">Mémoriser</button>
      <!-- <button>Intelligent</button> -->
    </div>
  </div>

  <div v-if="pageSelection === 'data'">
    <InsertData v-model="listKeysValues" v-model:returnHome="pageSelection"/>
  </div>

  <div v-if="pageSelection === 'memrise'">
    <GameFlashCards v-model="listKeysValues" v-model:returnHome="pageSelection"/>
  </div>
</template>

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { ref } from 'vue'
import DataTable from './components/DataTable.vue'
import GameFlashCards from './components/GameFlashCards.vue'
import InsertData from './components/InsertData.vue'

let listKeysValues = ref([])
const pageSelection = ref('home')
const gameStarted = ref(false)

const startGame = () => gameStarted.value = true

</script>

<style>

</style>