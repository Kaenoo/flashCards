<template>
  <div v-if="view === 'list'" class="wrap pt-16 pb-16">
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Données</h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-400">Créez et gérez vos jeux de cartes.</p>
      </div>
      <button class="btn btn-outline" @click="returnHome = 'home'">Menu</button>
    </div>

    <form @submit.prevent="createSet" class="card mb-5 flex items-center gap-3 p-4">
      <input v-model="newSetName" type="text" class="input" placeholder="Nom du nouveau jeu" />
      <button type="submit" class="btn btn-primary shrink-0" :disabled="!newSetName.trim()">Créer un jeu</button>
    </form>

    <div class="mb-6 flex flex-wrap items-center gap-3">
      <button class="btn btn-outline" @click="exportAll">
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m7 10 5 5 5-5" />
          <path d="M12 15V3" />
        </svg>
        Exporter tout
      </button>
      <input ref="backupInput" type="file" accept=".json" class="hidden" @change="importAll">
      <button class="btn btn-outline" @click="backupInput.click()">
        <svg class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <path d="m17 8-5-5-5 5" />
          <path d="M12 3v12" />
        </svg>
        Restaurer
      </button>
      <div class="ml-auto flex items-center gap-2">
        <span class="text-xs font-semibold text-neutral-500 dark:text-neutral-400">{{ sortLabel }}</span>
        <button class="btn-icon btn-icon-btn" :title="sortTitle" @click="cycleSort">
          <svg v-if="sortMode === 'az'" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m5 12 7-7 7 7" />
            <path d="M12 19V5" />
          </svg>
          <svg v-else-if="sortMode === 'desc'" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m5 12 7 7 7-7" />
            <path d="M12 5v14" />
          </svg>
          <svg v-else class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 6h16M7 12h10M10 18h4" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="sets.length === 0" class="empty-state">
      <p>Aucun jeu de données. Créez-en un ci-dessus.</p>
      <button class="btn btn-primary mt-3" @click="loadDemoData">Charger les données démo</button>
    </div>

    <div v-else class="flex flex-col gap-3">
      <div
        v-for="set in sortedSets"
        :key="set.id"
        class="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
        <span class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-sm font-bold text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
          {{ set.name.charAt(0).toUpperCase() }}
        </span>
        <div class="min-w-0 flex-1">
          <strong class="block truncate text-sm font-semibold text-neutral-800 dark:text-neutral-100" :title="set.name">{{ set.name }}</strong>
          <span class="text-xs text-neutral-500 dark:text-neutral-400">{{ set.cards.length }} carte{{ set.cards.length > 1 ? 's' : '' }}</span>
        </div>
        <button class="btn-icon btn-icon-btn" title="Dupliquer" @click="duplicateSet(set.id)">
          <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        </button>
        <button class="btn-icon btn-icon-btn" title="Modifier" @click="editSet(set.id)">
          <img class="size-5" :src="imgEdit" alt="Modifier">
        </button>
        <button class="btn-icon btn-icon-btn" title="Supprimer" @click="pendingDeleteId = set.id">
          <img class="size-5" :src="imgTrash" alt="Supprimer">
        </button>
      </div>
    </div>
  </div>

  <div v-else class="wrap pt-16 pb-16">
    <div class="mb-6 flex items-center justify-between">
      <button class="btn-icon btn-icon-btn" title="Retour à la sélection" @click="view = 'list'">
        <svg class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m12 19-7-7 7-7" />
          <path d="M19 12H5" />
        </svg>
      </button>
      <div class="min-w-0 flex-1 px-3 text-center">
        <h2 class="truncate text-2xl font-bold text-neutral-900 dark:text-neutral-100" :title="editingSet?.name">{{ editingSet?.name }}</h2>
      </div>
      <span class="size-10 shrink-0"></span>
    </div>
    <InsertData v-model="currentSetCards" />
  </div>

  <Teleport to="body">
    <div v-if="pendingDeleteId !== null" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="pendingDeleteId = null">
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl dark:bg-neutral-900">
        <h4 class="mb-2 flex items-center justify-center gap-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">Supprimer ce jeu ?</h4>
        <p class="mb-6 break-words text-neutral-600 dark:text-neutral-300">
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
import { normalizeBackup, makeId } from '../utils/cards'
import { demoDatasets } from '../utils/demoData'
import { useToast } from '../composables/useToast'
import imgEdit from '../assets/edit.svg'
import imgTrash from '../assets/trash.svg'

const { toast } = useToast()

const sets = defineModel({ type: Array })
const returnHome = defineModel('returnHome')

const newSetName = ref('')
const view = ref('list')
const editingSetId = ref(null)
const pendingDeleteId = ref(null)
const backupInput = ref(null)
const sortMode = ref('az')

const editingSet = computed(() => sets.value.find(s => s.id === editingSetId.value))

const pendingDelete = computed(() => sets.value.find(s => s.id === pendingDeleteId.value))

const currentSetCards = computed({
  get: () => editingSet.value?.cards ?? [],
  set: (cards) => {
    const set = sets.value.find(s => s.id === editingSetId.value)
    if (set) set.cards = cards
  }
})

const sortedSets = computed(() => {
  const list = [...sets.value]
  if (sortMode.value === 'az') list.sort((a, b) => a.name.localeCompare(b.name))
  else if (sortMode.value === 'desc') list.sort((a, b) => b.name.localeCompare(a.name))
  return list
})

const sortLabel = computed(() => {
  if (sortMode.value === 'az') return 'A → Z'
  if (sortMode.value === 'desc') return 'Z → A'
  return 'Création'
})

const sortTitle = computed(() => `Tri : ${sortLabel.value} (cliquer pour changer)`)

const cycleSort = () => {
  const order = ['az', 'desc', 'none']
  sortMode.value = order[(order.indexOf(sortMode.value) + 1) % order.length]
}

const loadDemoData = () => {
  if (sets.value.length > 0) return
  sets.value = demoDatasets()
  toast('Données démo chargées', 'success')
}

const createSet = () => {
  const name = newSetName.value.trim()
  if (!name) return
  sets.value.push({ id: makeId(), name, cards: [] })
  newSetName.value = ''
  toast('Jeu créé', 'success')
}

const editSet = (id) => {
  editingSetId.value = id
  view.value = 'editor'
}

const duplicateSet = (id) => {
  const set = sets.value.find(s => s.id === id)
  if (!set) return
  sets.value.push({
    id: makeId(),
    name: `${set.name} (copie)`,
    cards: set.cards.map(card => ({ key: card.key, value: card.value }))
  })
  toast('Jeu dupliqué', 'success')
}

/**
 * Exporter tous les jeux dans un fichier de sauvegarde
 */
const exportAll = () => {
  if (sets.value.length === 0) {
    toast('Rien à exporter.', 'error')
    return
  }
  const payload = {
    app: 'flashcards',
    version: 1,
    exportedAt: new Date().toISOString(),
    datasets: JSON.parse(JSON.stringify(sets.value))
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'flashcards_sauvegarde.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  toast(`Sauvegarde : ${sets.value.length} jeu(x) exporté(s)`, 'success')
}

/**
 * Restaurer des jeux depuis un fichier de sauvegarde (ajout à l'existant)
 * @param event {Event}
 */
const importAll = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    try {
      const imported = normalizeBackup(JSON.parse(String(reader.result ?? '').replace(/^\uFEFF/, '')))
      if (imported.length === 0) {
        toast('Fichier invalide ou aucun jeu de données détecté.', 'error')
      } else {
        sets.value.push(...imported)
        toast(`${imported.length} jeu(x) importé(s)`, 'success')
      }
    } catch {
      toast('Fichier JSON illisible.', 'error')
    }
    event.target.value = ''
  }
  reader.readAsText(file)
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
  toast('Jeu supprimé', 'success')
}
</script>