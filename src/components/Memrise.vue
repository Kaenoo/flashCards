<template>
  <!-- 1. Sélection du jeu de données -->
  <div v-if="stage === 'sets'" class="wrap pt-10 pb-16">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-neutral-900">Mémoriser</h2>
        <p class="text-sm text-neutral-500">Quel jeu de données voulez-vous réviser ?</p>
      </div>
      <button class="btn btn-outline" @click="goHome">Menu</button>
    </div>

    <p v-if="datasets.length === 0" class="empty-state">
      Aucun jeu de données. Créez-en un dans « Données ».
    </p>

    <div v-else class="flex flex-col gap-3">
      <button v-for="set in datasets" :key="set.id" class="set-row" @click="selectSet(set.id)">
        <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-sm font-bold text-amber-600">
          {{ set.name.charAt(0).toUpperCase() }}
        </span>
        <span class="set-name" :title="set.name">{{ set.name }}</span>
        <span class="badge">{{ set.cards.length }} carte{{ set.cards.length > 1 ? 's' : '' }}</span>
        <svg class="size-5 shrink-0 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  </div>

  <!-- 2. Choix du mode de jeu -->
  <div v-else-if="stage === 'mode'" class="wrap pt-10 pb-16">
    <div class="mb-6 flex items-center justify-between">
      <button class="btn-icon btn-icon-btn" title="Retour" @click="stage = 'sets'">
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </button>
      <div class="min-w-0 flex-1 px-3 text-center">
        <h2 class="truncate text-2xl font-bold text-neutral-900" :title="selectedSet?.name">{{ selectedSet?.name }}</h2>
      </div>
      <span class="size-10 shrink-0"></span>
    </div>

    <p v-if="selectedSet?.cards.length === 0" class="empty-state">
      Ce jeu est vide. Ajoutez des cartes dans « Données ».
    </p>

    <div v-else class="grid gap-4">
      <button class="tile" @click="startSession('simple')">
        <span class="tile-icon">
          <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
        </span>
        <span class="text-lg font-bold text-neutral-900">Simple</span>
        <span class="text-sm text-neutral-500">Les cartes défilent dans leur ordre d'origine.</span>
      </button>
      <button class="tile" @click="startSession('disorder')">
        <span class="tile-icon">
          <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.6-8.6c.8-1.1 2-1.7 3.3-1.7H22" />
            <path d="m18 2 4 4-4 4" />
            <path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2" />
            <path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8" />
            <path d="m18 14 4 4-4 4" />
          </svg>
        </span>
        <span class="text-lg font-bold text-neutral-900">Désordre</span>
        <span class="text-sm text-neutral-500">Les cartes sont mélangées aléatoirement.</span>
      </button>
    </div>
  </div>

  <!-- 3. Session terminée (dernière carte supprimée) -->
  <div v-else-if="deck.length === 0" class="wrap pt-10 pb-16">
    <div class="empty-state py-14">
      <p class="mb-6 text-base font-semibold text-neutral-700">Toutes les cartes de ce jeu ont été supprimées.</p>
      <div class="flex flex-col items-center gap-3">
        <button class="btn btn-primary" @click="stage = 'mode'">Choisir un autre mode</button>
        <button class="btn btn-outline" @click="stage = 'sets'">Changer de jeu</button>
        <button class="btn btn-ghost" @click="goHome">Revenir au menu</button>
      </div>
    </div>
  </div>

  <!-- 4. Session de mémorisation -->
  <div v-else class="wrap pt-10 pb-16">
    <div class="mb-8 flex items-center justify-between">
      <button class="btn-icon btn-icon-btn" title="Retour" @click="stage = 'mode'">
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </button>
      <span class="counter-pill">Carte {{ currentIndex + 1 }} / {{ deck.length }}</span>
      <span class="size-10 shrink-0"></span>
    </div>

    <div class="flex flex-col items-center">
      <div class="relative">
        <div
          class="flip-card h-80 w-72 cursor-pointer select-none sm:h-96 sm:w-80"
          :class="{ 'is-flipped': flipped }"
          @click="flipCard">
          <div class="flip-inner">
            <div class="flip-face bg-gradient-to-br from-amber-300 to-amber-400 shadow-xl shadow-neutral-400/20">
              <p class="break-words px-8 text-center text-2xl font-bold text-amber-950" v-text="frontText"></p>
            </div>
            <div class="flip-face flip-back border border-neutral-200 bg-white">
              <p class="break-words px-8 text-center text-2xl font-bold text-neutral-800" v-text="backText"></p>
            </div>
          </div>
        </div>

        <button
          class="chip absolute top-3 left-3"
          :class="{ 'is-active': inverted }"
          :title="inverted ? 'Repasser clés/valeurs' : 'Inverser clés/valeurs'"
          @click.stop="invertDeck">
          <img class="size-5" src="../assets/return.svg" alt="Inverser clés/valeurs">
        </button>
        <button class="chip absolute top-3 right-3" title="Supprimer cette carte" @click.stop="deleteCurrent">
          <img class="size-5" :src="imgDelete" alt="Supprimer cette carte">
        </button>
      </div>

      <div class="mt-8 flex items-center gap-4">
        <button class="btn btn-outline" :disabled="currentIndex === 0" @click="prevCard">
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
          Précédent
        </button>
        <button class="btn btn-primary" :disabled="currentIndex >= deck.length - 1" @click="nextCard">
          Suivant
          <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m12 5 7 7-7 7" />
            <path d="M5 12h14" />
          </svg>
        </button>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="confirmingDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="confirmingDelete = false">
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
        <h4 class="mb-2 text-lg font-bold text-neutral-900">Supprimer cette carte ?</h4>
        <p class="mb-6 break-words text-neutral-600">
          <span class="font-bold">{{ cardToDelete?.key }}</span>
          <span class="mx-2">→</span>
          <span class="font-bold">{{ cardToDelete?.value }}</span>
        </p>
        <div class="flex justify-center gap-3">
          <button class="btn btn-outline" @click="confirmingDelete = false">Annuler</button>
          <button class="btn btn-danger" @click="confirmDelete">Supprimer</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import imgDelete from '../assets/delete.png'

const datasets = defineModel('datasets', { type: Array })

const emit = defineEmits(['return-home'])

const stage = ref('sets')
const selectedSetId = ref(null)
const mode = ref(null)
const deck = ref([])
const currentIndex = ref(0)
const flipped = ref(false)
const inverted = ref(false)
const confirmingDelete = ref(false)
const cardToDelete = ref(null)

const selectedSet = computed(() => datasets.value.find(s => s.id === selectedSetId.value))

const selectedCards = computed(() => selectedSet.value?.cards ?? [])

/**
 * Faces de la carte selon l'inversion (clé-valeur <-> valeur-clé, session uniquement)
 */
const frontText = computed(() => {
  const card = deck.value[currentIndex.value]
  if (!card) return ''
  return inverted.value ? card.value : card.key
})

const backText = computed(() => {
  const card = deck.value[currentIndex.value]
  if (!card) return ''
  return inverted.value ? card.key : card.value
})

const selectSet = (id) => {
  selectedSetId.value = id
  stage.value = 'mode'
}

const startSession = (selectedMode) => {
  if (selectedCards.value.length === 0) return
  mode.value = selectedMode
  deck.value = [...selectedCards.value]
  if (selectedMode === 'disorder') {
    shuffleDeck()
  }
  currentIndex.value = 0
  flipped.value = false
  inverted.value = false
  stage.value = 'game'
}

const shuffleDeck = () => {
  deck.value = [...deck.value].sort(() => Math.random() - 0.5)
}

/**
 * Inverse clés/valeurs du jeu pendant la partie
 */
const invertDeck = () => {
  inverted.value = !inverted.value
  flipped.value = false
}

const flipCard = () => {
  flipped.value = !flipped.value
}

const nextCard = () => {
  if (currentIndex.value < deck.value.length - 1) {
    currentIndex.value++
    flipped.value = false
  }
}

const prevCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    flipped.value = false
  }
}

const deleteCurrent = () => {
  cardToDelete.value = deck.value[currentIndex.value]
  confirmingDelete.value = true
}

const confirmDelete = () => {
  if (!cardToDelete.value) return

  let nextDeckIndex = deck.value.indexOf(cardToDelete.value)

  deck.value = deck.value.filter(card => card !== cardToDelete.value)
  if (currentIndex.value > nextDeckIndex || currentIndex.value >= deck.value.length) {
    currentIndex.value = Math.max(0, currentIndex.value - 1)
  }

  const setIndex = datasets.value.findIndex(s => s.id === selectedSetId.value)
  if (setIndex !== -1) {
    const nextCards = datasets.value[setIndex].cards.filter(card => card !== cardToDelete.value)
    datasets.value[setIndex].cards = nextCards
  }

  confirmingDelete.value = false
  cardToDelete.value = null
  flipped.value = false
}

const goHome = () => {
  stage.value = 'sets'
  selectedSetId.value = null
  mode.value = null
  deck.value = []
  currentIndex.value = 0
  flipped.value = false
  inverted.value = false
  confirmingDelete.value = false
  cardToDelete.value = null
  emit('return-home', 'home')
}

const onKeydown = (event) => {
  if (stage.value !== 'game' || deck.value.length === 0) return
  if (event.key === 'ArrowRight') nextCard()
  else if (event.key === 'ArrowLeft') prevCard()
  else if (event.key === ' ') {
    event.preventDefault()
    flipCard()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>