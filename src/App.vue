<template>
  <div class="flex justify-between">
    <span></span>
    <h1 class="absolute left-1/2 transform -translate-x-1/2 text-center">FlashCards</h1>

    <div class="relative inline-block" @click="dropdownOpen = !dropdownOpen">
      <h6 class="text-right font-extrabold cursor-pointer hover:text-amber-300">
      | {{ selectedLang }}
      </h6>
    
    <!-- Liste déroulante -->
      <ul v-if="dropdownOpen == true" class="absolute right-0 mt-1 bg-white shadow-lg rounded text-black z-10">
        <p class="px-4 py-2 text-sm hover:bg-amber-100 cursor-pointer" @click.stop="selectedLang = 'FR'; dropdownOpen = false">Français</p>
        <p class="px-4 py-2 text-sm hover:bg-amber-100 cursor-pointer" @click.stop="selectedLang = 'EN'; dropdownOpen = false">English</p>
      </ul>
    </div>
  </div>
  


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
import fr from './locales/fr.json'
import en from './locales/en.json'

let listKeysValues = ref([])
const pageSelection = ref('home')

let dropdownOpen = ref(false)
let selectedLang = ref("FR")

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