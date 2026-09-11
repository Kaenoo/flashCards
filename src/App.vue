<template>
  <div>
    <h1 class="text-center">FlashCards</h1>
  </div>

  <div v-if="pageSelection === 'home'">
    <div class="flex flex-col gap-5 mt-10 mx-8 lg:mx-60 xl:mx-72 2xl:mx-96">
      <button @click="pageSelection = 'data'">Données</button>
      <button :disabled="datasets.length === 0" @click="pageSelection = 'memrise'">Mémoriser</button>
      <p v-if="datasets.length === 0" class="text-center text-neutral-500 italic">
        Aucun jeu de données pour le moment. Créez-en un dans « Données » pour pouvoir mémoriser.
      </p>
    </div>
  </div>

  <div v-if="pageSelection === 'data'">
    <DataSets v-model="datasets" v-model:returnHome="pageSelection"/>
  </div>

  <div v-if="pageSelection === 'memrise'">
    <Memrise v-model:datasets="datasets" @return-home="pageSelection = $event"/>
  </div>
</template>

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { ref, onMounted, watch } from 'vue'
import Memrise from './components/Memrise.vue'
import DataSets from './components/DataSets.vue'

const STORAGE_KEY = 'flashCardDatasets'

let datasets = ref([])
const pageSelection = ref('home')

const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

/**
 * Charger les jeux de données depuis localStorage.
 * Migre l'ancien format (listKeysValues) s'il existe.
 */
const loadDatasets = () => {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    try {
      datasets.value = JSON.parse(saved)
    } catch {
      datasets.value = []
    }
    return
  }

  const legacy = localStorage.getItem('listKeysValues')
  if (legacy) {
    try {
      const cards = JSON.parse(legacy)
      datasets.value = [{ id: makeId(), name: 'Jeu 1', cards }]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(datasets.value))
    } catch {
      datasets.value = []
    }
  }
}

onMounted(loadDatasets)

/**
 * Sauvegarder les jeux de données dans localStorage dès qu'ils changent
 */
watch(datasets, () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(datasets.value))
}, { deep: true })
</script>