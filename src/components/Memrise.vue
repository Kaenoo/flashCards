<template>
  <!-- 1. Sélection du jeu de données -->
  <div v-if="stage === 'sets'">
    <h4 class="text-center">Quel jeu de données voulez-vous mémoriser ?</h4>

    <p v-if="datasets.length === 0" class="text-center text-neutral-500 italic mt-10">
      Aucun jeu de données. Créez-en un dans l'onglet « Données ».
    </p>

    <div v-else class="flex flex-col gap-3 mt-10 mx-8 lg:mx-60 xl:mx-72 2xl:mx-96">
      <button v-for="set in datasets" :key="set.id" @click="selectSet(set.id)">
        {{ set.name }}
        <span class="opacity-70">({{ set.cards.length }} carte{{ set.cards.length > 1 ? 's' : '' }})</span>
      </button>
    </div>

    <div class="flex justify-center pt-8">
      <button @click="goHome">Revenir au Menu</button>
    </div>
  </div>

  <!-- 2. Choix du mode de jeu -->
  <div v-else-if="stage === 'mode'">
    <div class="flex items-center justify-between mb-4">
      <button @click="stage = 'sets'" class="p-0 border-0">
        <img class="size-11 rounded active:scale-110 active:bg-amber-200" src="../assets/return.svg" alt="Retour à la sélection du jeu">
      </button>
      <h4 class="text-center flex-1 break-words">{{ selectedSet?.name }}</h4>
      <span class="size-11"></span>
    </div>

    <p v-if="selectedSet?.cards.length === 0" class="text-center text-neutral-500 italic">
      Ce jeu est vide. Ajoutez des cartes dans l'onglet « Données ».
    </p>

    <div class="flex flex-col gap-5 mt-10 mx-8 lg:mx-60 xl:mx-72 2xl:mx-96">
      <button :disabled="selectedSet.cards.length === 0" @click="startSession('simple')">Simple</button>
      <button :disabled="selectedSet.cards.length === 0" @click="startSession('disorder')">Désordre</button>
    </div>
  </div>

  <!-- 3. Session terminée (dernière carte supprimée) -->
  <div v-else-if="deck.length === 0">
    <h4 class="text-center">Toutes les cartes de ce jeu ont été supprimées.</h4>
    <div class="flex flex-col items-center gap-3 pt-10">
      <button @click="stage = 'mode'">Choisir un autre mode</button>
      <button @click="stage = 'sets'">Changer de jeu de données</button>
      <button @click="goHome">Revenir au Menu</button>
    </div>
  </div>

  <!-- 4. Session de mémorisation -->
  <div v-else>
    <div class="flex items-center justify-between mb-4">
      <button @click="stage = 'mode'" class="p-0 border-0">
        <img class="size-11 rounded active:scale-110 active:bg-amber-200" src="../assets/return.svg" alt="Retour au choix du mode">
      </button>
      <p class="text-center flex-1">Carte {{ currentIndex + 1 }} / {{ deck.length }}</p>
      <div class="flex-1 flex justify-end gap-2">
        <button @click="deleteCurrent" class="p-1">
          <img class="size-8 opacity-70 hover:opacity-100 hover:scale-110 transition duration-100" :src="imgDelete" alt="Supprimer cette carte">
        </button>
      </div>
    </div>

    <div class="flex flex-col items-center">
      <div
        class="flex items-center justify-center size-80 rounded-3xl bg-amber-300 shadow-2xl shadow-amber-100 cursor-pointer select-none"
        @click="flipCard">
        <h4 class="text-center px-6 break-words" v-text="cardFace"></h4>
      </div>

      <div class="flex justify-center gap-10 pt-6">
        <button @click="prevCard" :disabled="currentIndex === 0">Retour</button>
        <button @click="flipCard">Retourner</button>
        <button @click="nextCard" :disabled="currentIndex >= deck.length - 1">Suivant</button>
      </div>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="confirmingDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="confirmingDelete = false">
      <div class="rounded-2xl bg-white p-6 text-center shadow-2xl">
        <h4 class="mb-2">Supprimer cette carte ?</h4>
        <p class="mb-6 break-words text-neutral-600">
          <span class="font-bold">{{ cardToDelete?.key }}</span>
          <span class="mx-2">→</span>
          <span class="font-bold">{{ cardToDelete?.value }}</span>
        </p>
        <div class="flex justify-center gap-6">
          <button @click="confirmingDelete = false">Annuler</button>
          <button class="bg-red-600 text-white" @click="confirmDelete">Supprimer</button>
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
const confirmingDelete = ref(false)
const cardToDelete = ref(null)

const selectedSet = computed(() => datasets.value.find(s => s.id === selectedSetId.value))

const selectedCards = computed(() => selectedSet.value?.cards ?? [])

const cardFace = computed(() => {
  const card = deck.value[currentIndex.value]
  return card ? (flipped.value ? card.value : card.key) : ''
})

const selectSet = (id) => {
  selectedSetId.value = id
  stage.value = 'mode'
}

const startSession = (selectedMode) => {
  if (selectedCards.value.length === 0) return
  mode.value = selectedMode
  deck.value = selectedCards.value.map(card => ({ ...card }))
  if (selectedMode === 'disorder') {
    deck.value.sort(() => Math.random() - 0.5)
  }
  currentIndex.value = 0
  flipped.value = false
  stage.value = 'game'
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