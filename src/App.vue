<template>
  <div class="min-h-screen">
    <ToastHost />
    <button
      class="btn-icon btn-icon-btn fixed right-4 top-4 z-40"
      :title="isDark ? 'Passer en clair' : 'Passer en sombre'"
      @click="toggleTheme">
      <svg v-if="isDark" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      </svg>
      <svg v-else class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>

    <div v-if="pageSelection === 'home'" class="wrap pt-14 pb-16">
      <header class="mb-12 text-center">
        <div class="mx-auto mb-5 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg shadow-amber-300/50">
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
            <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
            <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
          </svg>
        </div>
        <h1 class="text-4xl font-extrabold tracking-tight text-neutral-900 sm:text-5xl dark:text-neutral-100">FlashCards</h1>
        <p class="mt-3 text-neutral-500 dark:text-neutral-400">Créez vos jeux de cartes et révisez-les où que vous soyez.</p>
      </header>

      <div class="grid gap-4 sm:grid-cols-2">
        <button class="tile" @click="pageSelection = 'data'">
          <span class="tile-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5v14a9 3 0 0 0 18 0V5" />
              <path d="M3 12a9 3 0 0 0 18 0" />
            </svg>
          </span>
          <span class="text-lg font-bold text-neutral-900 dark:text-neutral-100">Données</span>
          <span class="text-sm text-neutral-500 dark:text-neutral-400">Créer, modifier et exporter vos jeux de cartes.</span>
        </button>

        <button class="tile" :disabled="datasets.length === 0" @click="pageSelection = 'memrise'">
          <span class="tile-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5 2 10l10 5 10-5-10-5Z" />
              <path d="M2 15l10 5 10-5" />
            </svg>
          </span>
          <span class="text-lg font-bold text-neutral-900 dark:text-neutral-100">Mémoriser</span>
          <span class="text-sm text-neutral-500 dark:text-neutral-400">Réviser un jeu en mode Simple, Désordre ou Interrogation.</span>
        </button>
      </div>

      <div v-if="datasets.length === 0" class="callout">
        <p>Aucun jeu de données pour le moment.</p>
        <button class="btn btn-primary mt-3" @click="loadDemoData">Charger les données démo</button>
      </div>

      <button v-if="installAvailable" class="btn btn-outline mx-auto mt-8 flex" @click="installApp">
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 3v12" />
          <path d="m7 10 5 5 5-5" />
          <path d="M5 21h14" />
        </svg>
        Installer l'app
      </button>
    </div>

    <div v-else-if="pageSelection === 'data'">
      <DataSets v-model="datasets" v-model:returnHome="pageSelection" />
    </div>

    <div v-else-if="pageSelection === 'memrise'">
      <Memrise v-model:datasets="datasets" @return-home="pageSelection = $event" />
    </div>
  </div>
</template>

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { ref, onMounted, watch } from 'vue'
import Memrise from './components/Memrise.vue'
import DataSets from './components/DataSets.vue'
import ToastHost from './components/ToastHost.vue'
import { demoDatasets } from './utils/demoData'
import { useToast } from './composables/useToast'

const STORAGE_KEY = 'flashCardDatasets'
const THEME_KEY = 'flashCardsTheme'

let datasets = ref([])
const pageSelection = ref('home')

const isDark = ref(document.documentElement.classList.contains('dark'))

const installAvailable = ref(false)
let installPrompt = null

const installApp = async () => {
  if (!installPrompt) return
  installPrompt.prompt()
  await installPrompt.userChoice
  installPrompt = null
  installAvailable.value = false
}

const toggleTheme = () => {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
}

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

onMounted(() => {
  loadDatasets()
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault()
    installPrompt = event
    installAvailable.value = true
  })
  window.addEventListener('appinstalled', () => {
    installPrompt = null
    installAvailable.value = false
  })
})

const { toast } = useToast()

const loadDemoData = () => {
  if (datasets.value.length > 0) return
  datasets.value = demoDatasets()
  toast('Données démo chargées', 'success')
}

/**
 * Sauvegarder les jeux de données dans localStorage dès qu'ils changent
 */
watch(datasets, () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(datasets.value))
}, { deep: true })
</script>