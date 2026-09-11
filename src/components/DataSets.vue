<template>
  <div v-if="view === 'list'" class="wrap pt-10 pb-16">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-neutral-900">Données</h2>
        <p class="text-sm text-neutral-500">Créez et gérez vos jeux de cartes.</p>
      </div>
      <button class="btn btn-outline" @click="returnHome = 'home'">Menu</button>
    </div>

    <form @submit.prevent="createSet" class="card mb-6 flex items-center gap-3 p-4">
      <input v-model="newSetName" type="text" class="input" placeholder="Nom du nouveau jeu" />
      <button type="submit" class="btn btn-primary shrink-0" :disabled="!newSetName.trim()">Créer un jeu</button>
    </form>

    <p v-if="sets.length === 0" class="empty-state">
      Aucun jeu de données. Créez-en un ci-dessus.
    </p>

    <div v-else class="flex flex-col gap-3">
      <div
        v-for="set in sets"
        :key="set.id"
        class="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-sm font-bold text-amber-600">
          {{ set.name.charAt(0).toUpperCase() }}
        </span>
        <div class="min-w-0 flex-1">
          <strong class="block truncate text-sm font-semibold text-neutral-800" :title="set.name">{{ set.name }}</strong>
          <span class="text-xs text-neutral-500">{{ set.cards.length }} carte{{ set.cards.length > 1 ? 's' : '' }}</span>
        </div>
        <button class="btn-icon btn-icon-btn" title="Modifier" @click="editSet(set.id)">
          <img class="size-5" :src="imgEdit" alt="Modifier">
        </button>
        <button class="btn-icon btn-icon-btn" title="Supprimer" @click="pendingDeleteId = set.id">
          <img class="size-5" :src="imgTrash" alt="Supprimer">
        </button>
      </div>
    </div>
  </div>

  <div v-else class="wrap pt-10 pb-16">
    <div class="mb-6 flex items-center justify-between">
      <button class="btn-icon btn-icon-btn" title="Retour à la sélection" @click="view = 'list'">
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </button>
      <div class="min-w-0 flex-1 px-3 text-center">
        <h2 class="truncate text-2xl font-bold text-neutral-900" :title="editingSet?.name">{{ editingSet?.name }}</h2>
      </div>
      <span class="size-10 shrink-0"></span>
    </div>
    <InsertData v-model="currentSetCards" />
  </div>

  <Teleport to="body">
    <div v-if="pendingDeleteId !== null" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="pendingDeleteId = null">
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
        <h4 class="mb-2 flex items-center justify-center gap-2 text-lg font-bold text-neutral-900">Supprimer ce jeu ?</h4>
        <p class="mb-6 break-words text-neutral-600">
          « <span class="font-bold">{{ pendingDelete?.name }}</span> » sera supprimé, ainsi que toutes ses cartes.
        </p>
        <div class="flex justify-center gap-3">
          <button class="btn btn-outline" @click="pendingDeleteId = null">Annuler</button>
          <button class="btn btn-danger" @click="confirmDelete">Supprimer</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { computed, ref } from 'vue'
import InsertData from './InsertData.vue'
import imgEdit from '../assets/edit.svg'
import imgTrash from '../assets/trash.svg'

const sets = defineModel({ type: Array })
const returnHome = defineModel('returnHome')

const newSetName = ref('')
const view = ref('list')
const editingSetId = ref(null)
const pendingDeleteId = ref(null)

const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

const editingSet = computed(() => sets.value.find(s => s.id === editingSetId.value))

const pendingDelete = computed(() => sets.value.find(s => s.id === pendingDeleteId.value))

const currentSetCards = computed({
  get: () => editingSet.value?.cards ?? [],
  set: (cards) => {
    const set = sets.value.find(s => s.id === editingSetId.value)
    if (set) set.cards = cards
  }
})

const createSet = () => {
  const name = newSetName.value.trim()
  if (!name) return
  sets.value.push({ id: makeId(), name, cards: [] })
  newSetName.value = ''
}

const editSet = (id) => {
  editingSetId.value = id
  view.value = 'editor'
}

const confirmDelete = () => {
  const id = pendingDeleteId.value
  if (id === null) return
  sets.value = sets.value.filter(s => s.id !== id)
  pendingDeleteId.value = null
  if (editingSetId.value === id) {
    editingSetId.value = null
    view.value = 'list'
  }
}
</script>