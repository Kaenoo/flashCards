<template>
  <!-- 1. Sélection du jeu de données -->
  <div v-if="stage === 'sets'" class="wrap pt-16 pb-16">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Mémoriser</h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">Quel jeu de données voulez-vous réviser ?</p>
      </div>
      <button class="btn btn-outline" @click="goHome">Menu</button>
    </div>

    <p v-if="datasets.length === 0" class="empty-state">
      Aucun jeu de données. Créez-en un dans « Données ».
    </p>

    <div v-else class="flex flex-col gap-3">
      <button v-for="set in datasets" :key="set.id" class="set-row" @click="selectSet(set.id)">
        <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-sm font-bold text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
          {{ set.name.charAt(0).toUpperCase() }}
        </span>
        <span class="set-name" :title="set.name">{{ set.name }}</span>
        <span class="badge">{{ set.cards.length }} carte{{ set.cards.length > 1 ? 's' : '' }}</span>
        <svg class="size-5 shrink-0 text-neutral-400 dark:text-neutral-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  </div>

  <!-- 2. Choix du mode de jeu -->
  <div v-else-if="stage === 'mode'" class="wrap pt-16 pb-16">
    <div class="mb-6 flex items-center justify-between">
      <button class="btn-icon btn-icon-btn" title="Retour" @click="stage = 'sets'">
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </button>
      <div class="min-w-0 flex-1 px-3 text-center">
        <h2 class="truncate text-2xl font-bold text-neutral-900 dark:text-neutral-100" :title="selectedSet?.name">{{ selectedSet?.name }}</h2>
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
        <span class="text-lg font-bold text-neutral-900 dark:text-neutral-100">Simple</span>
        <span class="text-sm text-neutral-500 dark:text-neutral-400">Les cartes défilent dans leur ordre d'origine.</span>
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
        <span class="text-lg font-bold text-neutral-900 dark:text-neutral-100">Désordre</span>
        <span class="text-sm text-neutral-500 dark:text-neutral-400">Les cartes sont mélangées aléatoirement.</span>
      </button>
      <button class="tile" @click="startSession('quiz')">
        <span class="tile-icon">
          <svg class="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
        </span>
        <span class="text-lg font-bold text-neutral-900 dark:text-neutral-100">Interrogation</span>
        <span class="text-sm text-neutral-500 dark:text-neutral-400">Chaque carte est notée : « Je savais » ou « À revoir », avec récapitulatif en fin de partie.</span>
      </button>
    </div>
  </div>

  <!-- 3. Session terminée (dernière carte supprimée) -->
  <div v-else-if="deck.length === 0" class="wrap pt-16 pb-16">
    <div class="empty-state py-14">
      <p class="mb-6 text-base font-semibold text-neutral-700 dark:text-neutral-300">Toutes les cartes de ce jeu ont été supprimées.</p>
      <div class="flex flex-col items-center gap-3">
        <button class="btn btn-primary" @click="stage = 'mode'">Choisir un autre mode</button>
        <button class="btn btn-outline" @click="stage = 'sets'">Changer de jeu</button>
        <button class="btn btn-ghost" @click="goHome">Revenir au menu</button>
      </div>
    </div>
  </div>

  <!-- 4. Récapitulatif (mode Interrogation) -->
  <div v-else-if="stage === 'summary'" class="wrap pt-16 pb-16">
    <div class="mb-6 flex items-center justify-between">
      <button class="btn-icon btn-icon-btn" title="Retour" @click="goToMode">
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </button>
      <div class="min-w-0 flex-1 px-3 text-center">
        <h2 class="truncate text-2xl font-bold text-neutral-900 dark:text-neutral-100">Résultats</h2>
      </div>
      <span class="size-10 shrink-0"></span>
    </div>

    <div class="card mb-6 flex flex-col items-center py-10">
      <p
        class="text-5xl font-extrabold tracking-tight"
        :class="successPct === 100 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'">
        {{ successPct }}<span class="text-3xl">%</span>
      </p>
      <p class="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
        {{ totalRated }} carte{{ totalRated > 1 ? 's' : '' }} notée{{ totalRated > 1 ? 's' : '' }}
      </p>
    </div>

    <div class="mb-6 flex flex-col gap-3">
      <div class="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 dark:border-emerald-800 dark:bg-emerald-950/40">
        <span class="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Réussies</span>
        <span class="text-lg font-bold text-emerald-700 dark:text-emerald-300">{{ correctCount }}</span>
      </div>
      <div class="flex items-center justify-between rounded-2xl border border-red-200 bg-red-50 px-5 py-4 dark:border-red-800 dark:bg-red-950/40">
        <span class="text-sm font-semibold text-red-700 dark:text-red-300">À revoir</span>
        <span class="text-lg font-bold text-red-700 dark:text-red-300">{{ wrongCount }}</span>
      </div>
    </div>

    <div class="flex flex-col items-center gap-3">
      <button v-if="wrongCount > 0" class="btn btn-primary w-full" @click="startReview">
        Revoir {{ wrongCount }} carte{{ wrongCount > 1 ? 's' : '' }}
      </button>
      <button v-else class="btn btn-primary w-full" @click="goToMode">Choisir un autre mode</button>
      <button class="btn btn-ghost" @click="stage = 'sets'">Changer de jeu</button>
      <button class="btn btn-ghost" @click="goHome">Revenir au menu</button>
    </div>
  </div>

  <!-- 5. Session de mémorisation -->
  <div v-else class="wrap pt-16 pb-16">
    <div class="mb-6 flex items-center justify-between">
      <button class="btn-icon btn-icon-btn" title="Retour" @click="goToMode">
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </button>
      <span class="counter-pill">
        {{ isQuiz ? `${ratedEntries.length} / ${deck.length}` : `Carte ${currentIndex + 1} / ${deck.length}` }}
      </span>
      <span class="size-10 shrink-0"></span>
    </div>

    <div class="mb-8 h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
      <div
        class="h-full rounded-full bg-amber-400 transition-all duration-300"
        :style="{ width: `${progressPct}%` }"></div>
    </div>

    <div class="flex flex-col items-center">
      <div class="relative">
        <div
          class="flip-card h-80 w-72 cursor-pointer select-none sm:h-96 sm:w-80"
          :class="{ 'is-flipped': flipped }"
          @click="flipCard">
          <div class="flip-inner" @transitionend="onFlipTransitionEnd">
            <div class="flip-face bg-gradient-to-br from-amber-300 to-amber-400 shadow-xl shadow-neutral-400/30">
              <p class="break-words px-8 text-center text-2xl font-bold text-amber-950" v-text="frontText"></p>
            </div>
            <div class="flip-face flip-back border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
              <p class="break-words px-8 text-center text-2xl font-bold text-neutral-800 dark:text-neutral-100" v-text="displayBackText"></p>
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

      <template v-if="isQuiz">
        <p class="mt-7 mb-3 text-sm text-neutral-500 dark:text-neutral-400">
          Retournez la carte puis notez votre réponse.
        </p>
        <div class="flex w-full max-w-sm items-center gap-3">
          <button class="btn btn-outline flex-1" :disabled="!flipped" @click="rateCard(false)">
            À revoir
          </button>
          <button class="btn btn-primary flex-1" :disabled="!flipped" @click="rateCard(true)">
            Je savais
          </button>
        </div>
      </template>

      <template v-else>
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
      </template>
    </div>
  </div>

  <Teleport to="body">
    <div v-if="confirmingDelete" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="confirmingDelete = false">
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl dark:bg-neutral-900">
        <h4 class="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">Supprimer cette carte ?</h4>
        <p class="mb-6 break-words text-neutral-600 dark:text-neutral-300">
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

  <Teleport to="body">
    <div v-if="showResumeModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="showResumeModal = false; resumeSession = null">
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl dark:bg-neutral-900">
        <h4 class="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">Interrogation en pause</h4>
        <p class="mb-6 text-neutral-600 dark:text-neutral-300">
          Une interrogation est en cours sur ce jeu
          (<span class="font-bold">{{ resumeSession?.ratedEntries.length ?? 0 }} / {{ resumeSession?.deck.length ?? 0 }}</span> cartes
          notées). Voulez-vous la reprendre ?
        </p>
        <div class="flex flex-col items-stretch gap-3">
          <button class="btn btn-primary" @click="resumeInterrogation">Reprendre</button>
          <button class="btn btn-outline" @click="restartInterrogation">Recommencer</button>
          <button class="btn btn-ghost" @click="showResumeModal = false; resumeSession = null">Annuler</button>
        </div>
      </div>
    </div>
  </Teleport>

  <Teleport to="body">
    <div v-if="showFocusModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="showFocusModal = false; focusInfo = null">
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl dark:bg-neutral-900">
        <h4 class="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">Cartes à revoir</h4>
        <p class="mb-6 text-neutral-600 dark:text-neutral-300">
          <span class="font-bold">{{ focusInfo?.cards.length }}</span>
          carte{{ focusInfo?.cards.length > 1 ? 's' : '' }} restent à revoir depuis votre dernière interrogation
          <template v-if="focusInfo?.date"> ({{ focusInfo.date }}).</template>
          <template v-else>.</template>
        </p>
        <div class="flex flex-col items-stretch gap-3">
          <button class="btn btn-primary" @click="startFocusReview">Revoir ces cartes</button>
          <button class="btn btn-outline" @click="startNewInterrogation">Nouvelle partie</button>
          <button class="btn btn-ghost" @click="showFocusModal = false; focusInfo = null">Annuler</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import imgDelete from '../assets/delete.png'
import { useToast } from '../composables/useToast'
import { filterWrongCards, buildReviewRecord } from '../utils/reviews'

const { toast } = useToast()

const datasets = defineModel('datasets', { type: Array })

const emit = defineEmits(['return-home'])

const stage = ref('sets')
const selectedSetId = ref(null)
const mode = ref(null)
const deck = ref([])
const currentIndex = ref(0)
const flipped = ref(false)
const facingBack = ref('')
const inverted = ref(false)
const confirmingDelete = ref(false)
const cardToDelete = ref(null)
const ratedEntries = ref([])
const resumeSession = ref(null)
const showResumeModal = ref(false)
const focusInfo = ref(null)
const showFocusModal = ref(false)

const QUIZ_KEY = 'flashCardsQuizSession'

/**
 * Charge la session d'interrogation mise en pause (null si aucune/illisible)
 */
const loadQuizSession = () => {
  try {
    return JSON.parse(localStorage.getItem(QUIZ_KEY))
  } catch {
    return null
  }
}

/**
 * Ne conserve que l'essentiel (copies) pour reprendre plus tard
 */
const saveQuizSession = () => {
  localStorage.setItem(QUIZ_KEY, JSON.stringify({
    datasetId: selectedSetId.value,
    currentIndex: currentIndex.value,
    ratedEntries: ratedEntries.value.map(e => ({ card: { key: e.card.key, value: e.card.value }, ok: e.ok })),
    deck: deck.value.map(card => ({ key: card.key, value: card.value })),
    inverted: inverted.value
  }))
}

const clearQuizSession = () => {
  localStorage.removeItem(QUIZ_KEY)
}

const REVIEWS_KEY = 'flashCardsReviews'

const loadReviews = () => {
  try {
    return JSON.parse(localStorage.getItem(REVIEWS_KEY)) ?? {}
  } catch {
    return {}
  }
}

const saveReviews = (reviews) => {
  localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews))
}

const selectedSet = computed(() => datasets.value.find(s => s.id === selectedSetId.value))

const selectedCards = computed(() => selectedSet.value?.cards ?? [])

const isQuiz = computed(() => mode.value === 'quiz')

const progressPct = computed(() => {
  if (deck.value.length === 0) return 0
  const done = isQuiz.value ? ratedEntries.value.length : currentIndex.value + 1
  return Math.min(100, Math.round((done / deck.value.length) * 100))
})

const wrongCards = computed(() => ratedEntries.value.filter(e => !e.ok).map(e => e.card))
const correctCount = computed(() => ratedEntries.value.filter(e => e.ok).length)
const wrongCount = computed(() => wrongCards.value.length)
const totalRated = computed(() => ratedEntries.value.length)
const successPct = computed(() => {
  if (totalRated.value === 0) return 0
  return Math.round((correctCount.value / totalRated.value) * 100)
})

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

/**
 * Texte du dos tel qu'affiché : pendant un retournement (navigation, inversion…),
 * on gèle l'ancienne valeur pour ne pas révéler celle de la carte suivante.
 */
const displayBackText = computed(() => facingBack.value || backText.value)

/**
 * Focus « à revoir » valide pour le jeu courant : cartes toujours présentes,
 * non vide. Retourne { cards, date } ou null.
 */
const getReviewFocus = () => {
  if (!selectedSet.value) return null
  const reviews = loadReviews()
  const rec = reviews[selectedSetId.value]
  if (!rec || !Array.isArray(rec.wrong) || rec.wrong.length === 0) return null
  const cards = filterWrongCards(rec.wrong, selectedCards.value)
  if (cards.length === 0) return null
  let date = ''
  if (rec.date) {
    try {
      date = new Date(rec.date).toLocaleDateString('fr-FR')
    } catch {
      date = ''
    }
  }
  return { cards, date }
}

/**
 * Persiste le focus « à revoir » après une interrogation terminée
 * (modèle : le focus = les cartes ratées de la dernière interrogation).
 */
const persistReviewResult = () => {
  const reviews = loadReviews()
  const record = buildReviewRecord({
    wrong: filterWrongCards(wrongCards.value, selectedCards.value),
    total: totalRated.value,
    correct: correctCount.value
  })
  if (record) {
    reviews[selectedSetId.value] = record
  } else {
    delete reviews[selectedSetId.value]
  }
  saveReviews(reviews)
}

/**
 * Lance une interrogation restreinte aux cartes à revoir persistées.
 */
const startFocusReview = () => {
  const cards = focusInfo.value?.cards ?? []
  showFocusModal.value = false
  focusInfo.value = null
  if (cards.length === 0) return
  beginSession('quiz', cards)
}

/**
 * Ferme le focus et démarre une nouvelle interrogation complète
 * (l'écrasement du focus aura lieu à la fin de la partie).
 */
const startNewInterrogation = () => {
  showFocusModal.value = false
  focusInfo.value = null
  beginSession('quiz')
}

const selectSet = (id) => {
  selectedSetId.value = id
  stage.value = 'mode'
}

const startSession = (selectedMode) => {
  if (selectedCards.value.length === 0) return
  if (selectedMode === 'quiz') {
    const session = loadQuizSession()
    if (session
        && session.datasetId === selectedSetId.value
        && Array.isArray(session.deck) && session.deck.length > 0
        && Array.isArray(session.ratedEntries) && session.ratedEntries.length < session.deck.length) {
      resumeSession.value = session
      showResumeModal.value = true
      return
    }
    const focus = getReviewFocus()
    if (focus) {
      focusInfo.value = focus
      showFocusModal.value = true
      return
    }
  }
  beginSession(selectedMode)
}

const beginSession = (selectedMode, initialDeck = null) => {
  mode.value = selectedMode
  deck.value = initialDeck ? [...initialDeck] : [...selectedCards.value]
  if (selectedMode === 'disorder' && !initialDeck) {
    shuffleDeck()
  }
  currentIndex.value = 0
  flipped.value = false
  facingBack.value = ''
  inverted.value = false
  ratedEntries.value = []
  stage.value = 'game'
}

/**
 * Reprend l'interrogation mise en pause là où elle s'était arrêtée
 */
const resumeInterrogation = () => {
  const session = resumeSession.value
  if (!session) {
    beginSession('quiz')
    return
  }
  mode.value = 'quiz'
  deck.value = (session.deck ?? []).map(card => ({ key: card.key, value: card.value }))
  currentIndex.value = Math.min(session.currentIndex ?? 0, Math.max(0, deck.value.length - 1))
  ratedEntries.value = (session.ratedEntries ?? [])
    .filter(e => e && e.card)
    .map(e => ({ card: { key: e.card.key, value: e.card.value }, ok: e.ok }))
  inverted.value = !!session.inverted
  flipped.value = false
  facingBack.value = ''
  resumeSession.value = null
  showResumeModal.value = false
  stage.value = 'game'
}

/**
 * Repart de zéro (abandonne la session mise en pause)
 */
const restartInterrogation = () => {
  clearQuizSession()
  resumeSession.value = null
  showResumeModal.value = false
  beginSession('quiz')
}

const goToMode = () => {
  if (isQuiz.value && stage.value === 'game' && deck.value.length > 0 && ratedEntries.value.length < deck.value.length) {
    saveQuizSession()
    toast('Interrogation mise en pause. Vous pourrez la reprendre.', 'info')
  }
  stage.value = 'mode'
  flipped.value = false
  ratedEntries.value = []
}

const shuffleDeck = () => {
  deck.value = [...deck.value].sort(() => Math.random() - 0.5)
}

/**
 * Inverse clés/valeurs du jeu pendant la partie
 */
const invertDeck = () => {
  if (flipped.value) {
    facingBack.value = backText.value
  }
  inverted.value = !inverted.value
  flipped.value = false
}

const flipCard = () => {
  flipped.value = !flipped.value
}

const onFlipTransitionEnd = () => {
  facingBack.value = ''
}

/**
 * Noter la carte courante (mode Interrogation) puis avancer ou passer au récapitulatif
 * @param ok {boolean} vrai si « Je savais »
 */
const rateCard = (ok) => {
  const card = deck.value[currentIndex.value]
  if (!card) return
  ratedEntries.value.push({ card, ok })
  if (flipped.value) {
    facingBack.value = backText.value
  }
  flipped.value = false
  if (currentIndex.value < deck.value.length - 1) {
    currentIndex.value++
  } else {
    clearQuizSession()
    persistReviewResult()
    stage.value = 'summary'
  }
}

/**
 * Relance une session d'interrogation sur les cartes ratées
 */
const startReview = () => {
  if (wrongCards.value.length === 0) return
  deck.value = [...wrongCards.value]
  currentIndex.value = 0
  flipped.value = false
  facingBack.value = ''
  inverted.value = false
  ratedEntries.value = []
  stage.value = 'game'
}

const nextCard = () => {
  if (currentIndex.value < deck.value.length - 1) {
    if (flipped.value) {
      facingBack.value = backText.value
    }
    currentIndex.value++
    flipped.value = false
  }
}

const prevCard = () => {
  if (currentIndex.value > 0) {
    if (flipped.value) {
      facingBack.value = backText.value
    }
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

  if (flipped.value) {
    facingBack.value = backText.value
  }
  deck.value = deck.value.filter(card => card !== cardToDelete.value)
  ratedEntries.value = ratedEntries.value.filter(e => e.card !== cardToDelete.value)
  if (currentIndex.value > nextDeckIndex || currentIndex.value >= deck.value.length) {
    currentIndex.value = Math.max(0, currentIndex.value - 1)
  }

  const setIndex = datasets.value.findIndex(s => s.id === selectedSetId.value)
  if (setIndex !== -1) {
    const nextCards = datasets.value[setIndex].cards.filter(
      card => !(card.key === cardToDelete.value.key && card.value === cardToDelete.value.value)
    )
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
  ratedEntries.value = []
  confirmingDelete.value = false
  cardToDelete.value = null
  focusInfo.value = null
  showFocusModal.value = false
  emit('return-home', 'home')
}

const onKeydown = (event) => {
  if (stage.value !== 'game' || deck.value.length === 0) return
  if (event.key === 'ArrowRight' && !isQuiz.value) nextCard()
  else if (event.key === 'ArrowLeft' && !isQuiz.value) prevCard()
  else if (event.key === ' ') {
    event.preventDefault()
    flipCard()
  }
}

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>