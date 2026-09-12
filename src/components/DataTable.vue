<template>
  <div class="card overflow-hidden p-0">
    <div class="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
      <h4 class="font-bold text-neutral-900 dark:text-neutral-100">Modifier les clés-valeurs</h4>
      <span class="badge">{{ modelValue.length }} carte{{ modelValue.length > 1 ? 's' : '' }}</span>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr class="bg-neutral-50 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
            <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Clés</th>
            <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Valeurs</th>
            <th class="w-16 px-4 py-3 text-right text-xs font-bold uppercase tracking-wide">−</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in modelValue" :key="item" class="border-t border-neutral-100 dark:border-neutral-800">
            <td class="px-4 py-2">
              <input type="text" class="input-table" v-model="item.key">
            </td>
            <td class="px-4 py-2">
              <input type="text" class="input-table" v-model="item.value">
            </td>
            <td class="px-4 py-2 text-right">
              <button type="button" class="btn-icon" title="Supprimer" @click="deleteItem(item)">
                <img class="size-5" :src="imgDelete" alt="Supprimer">
              </button>
            </td>
          </tr>
          <tr v-if="modelValue.length === 0">
            <td colspan="3" class="px-4 py-14 text-center text-neutral-500 dark:text-neutral-400">Aucune carte dans ce jeu.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-wrap items-center justify-center gap-3 border-t border-neutral-200 px-6 py-4 dark:border-neutral-800">
      <button class="btn btn-outline" @click="resetChanges">Annuler</button>
      <button class="btn btn-primary" :disabled="!verifyChangeInData()" @click="saveChanges">Sauvegarder</button>
      <button v-if="modelValue.length > 0" class="btn btn-danger" @click="confirmDeleteAll = true">Tout supprimer</button>
    </div>
  </div>

  <button
    v-if="showScrollBtn"
    class="btn-icon btn-icon-btn fixed right-6 bottom-6 z-40 shadow-lg"
    :title="nearTop ? 'Aller en bas de la liste' : 'Revenir en haut'"
    @click="jumpScroll">
    <svg v-if="nearTop" class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m5 12 7 7 7-7" />
      <path d="M12 19V5" />
    </svg>
    <svg v-else class="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  </button>

  <Teleport to="body">
    <div v-if="confirmDeleteAll" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="confirmDeleteAll = false">
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl dark:bg-neutral-900">
        <h4 class="mb-2 text-lg font-bold text-neutral-900 dark:text-neutral-100">Tout supprimer ?</h4>
        <p class="mb-6 text-neutral-600 dark:text-neutral-300">
          Les <span class="font-bold">{{ modelValue.length }}</span> carte{{ modelValue.length > 1 ? 's' : '' }} de ce jeu
          seront supprimée{{ modelValue.length > 1 ? 's' : '' }} définitivement.
        </p>
        <div class="flex justify-center gap-3">
          <button class="btn btn-outline" @click="confirmDeleteAll = false">Annuler</button>
          <button class="btn btn-danger" @click="deleteAll">Tout supprimer</button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useToast } from '../composables/useToast'
import imgDelete from '../assets/delete.png'

const { toast } = useToast()

const LONG_LIST_THRESHOLD = 20
const NEAR_TOP_PX = 100

const modelValue = defineModel({ type: Array})
const modify = defineModel('modify')

const originalData = ref(JSON.parse(JSON.stringify(modelValue.value)))

const hasChanged = ref(false)
const confirmDeleteAll = ref(false)

const pageScrollable = ref(false)
const nearTop = ref(true)

const showScrollBtn = computed(() => (
  modelValue.value.length >= LONG_LIST_THRESHOLD && pageScrollable.value
))

const updateScroll = () => {
  const el = document.documentElement
  pageScrollable.value = el.scrollHeight > el.clientHeight + 1
  nearTop.value = window.scrollY < NEAR_TOP_PX
}

const jumpScroll = () => {
  window.scrollTo({
    top: nearTop.value ? document.documentElement.scrollHeight : 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  updateScroll()
  window.addEventListener('scroll', updateScroll, { passive: true })
  window.addEventListener('resize', updateScroll)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', updateScroll)
  window.removeEventListener('resize', updateScroll)
})

watch(() => modelValue.value.length, updateScroll)

const verifyChangeInData = () => hasChanged.value

//S'il clique sur annuler, annule les changements s'il y en a eu
const resetChanges = () => {
  modelValue.value = JSON.parse(JSON.stringify(originalData.value))
  modify.value = false
  hasChanged.value = false
  confirmDeleteAll.value = false
}

// Surveille modelValue pour détecter tout changement
watch(modelValue, (newVal) => {
  hasChanged.value = JSON.stringify(newVal) !== JSON.stringify(originalData.value)
}, { deep: true })

const saveChanges = () => {
  originalData.value = JSON.parse(JSON.stringify(modelValue.value))
  modify.value = false
  hasChanged.value = false
  confirmDeleteAll.value = false
}

const deleteItem = (itemDelete) => {
  modelValue.value = modelValue.value.filter(item => item !== itemDelete)
}

const deleteAll = () => {
  const count = modelValue.value.length
  modelValue.value = []
  confirmDeleteAll.value = false
  modify.value = false
  toast(`${count} carte${count > 1 ? 's' : ''} supprimée${count > 1 ? 's' : ''}`, 'success')
}
</script>