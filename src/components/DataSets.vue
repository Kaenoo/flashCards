<template>
  <div v-if="view === 'list'">
    <h4 class="text-center">Gérez vos jeux de données</h4>

    <form action="" @submit.prevent="createSet" class="flex justify-center gap-3 mb-6 mt-6">
      <input v-model="newSetName" type="text" placeholder="Nom du nouveau jeu" style="max-width: 20rem;">
      <button type="submit" :disabled="!newSetName.trim()">Créer un jeu</button>
    </form>

    <p v-if="sets.length === 0" class="text-center text-neutral-500 italic">
      Aucun jeu de données. Créez-en un ci-dessus.
    </p>

    <div v-else class="flex flex-col gap-3 mt-6 mx-8 lg:mx-60 xl:mx-72 2xl:mx-96">
      <div
        v-for="set in sets"
        :key="set.id"
        class="flex items-center justify-between gap-3 border rounded-xl p-3">
        <div class="flex-1 min-w-0">
          <strong class="break-words">{{ set.name }}</strong>
          <span class="ml-2 text-neutral-500">{{ set.cards.length }} carte{{ set.cards.length > 1 ? 's' : '' }}</span>
        </div>
        <div class="flex items-center gap-2">
          <button @click="editSet(set.id)">Modifier</button>
          <button v-if="pendingDeleteId !== set.id" @click="pendingDeleteId = set.id">Supprimer</button>
          <template v-else>
            <span class="text-red-600 text-sm font-bold">Tout supprimer ?</span>
            <button @click="confirmDelete(set.id)">Oui</button>
            <button @click="pendingDeleteId = null">Non</button>
          </template>
        </div>
      </div>
    </div>

    <div class="flex justify-center m-10 gap-5">
      <button @click="returnHome = 'home'">Revenir au Menu</button>
    </div>
  </div>

  <div v-else>
    <h4 class="text-center break-words">{{ editingSet?.name }}</h4>
    <InsertData v-model="currentSetCards" @back="view = 'list'"/>
  </div>
</template>

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { computed, ref } from 'vue'
import InsertData from './InsertData.vue'

const sets = defineModel({ type: Array })
const returnHome = defineModel('returnHome')

const newSetName = ref('')
const view = ref('list')
const editingSetId = ref(null)
const pendingDeleteId = ref(null)

const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

const editingSet = computed(() => sets.value.find(s => s.id === editingSetId.value))

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

const confirmDelete = (id) => {
  sets.value = sets.value.filter(s => s.id !== id)
  pendingDeleteId.value = null
  if (editingSetId.value === id) {
    editingSetId.value = null
    view.value = 'list'
  }
}
</script>