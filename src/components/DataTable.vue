<template>
  <div class="card overflow-hidden p-0">
    <div class="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
      <h4 class="font-bold text-neutral-900">Modifier les clés-valeurs</h4>
      <span class="badge">{{ modelValue.length }} carte{{ modelValue.length > 1 ? 's' : '' }}</span>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full border-collapse text-sm">
        <thead>
          <tr class="bg-neutral-50 text-neutral-500">
            <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Clés</th>
            <th class="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Valeurs</th>
            <th class="w-16 px-4 py-3 text-right text-xs font-bold uppercase tracking-wide">−</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in modelValue" :key="item" class="border-t border-neutral-100">
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
            <td colspan="3" class="px-4 py-14 text-center text-neutral-500">Aucune carte dans ce jeu.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-wrap items-center justify-center gap-3 border-t border-neutral-200 px-6 py-4">
      <button class="btn btn-outline" @click="resetChanges">Annuler</button>
      <button class="btn btn-primary" :disabled="!verifyChangeInData()" @click="saveChanges">Sauvegarder</button>
      <template v-if="confirmDeleteAll === false && modelValue.length > 0">
        <span class="mx-1 hidden text-neutral-300 sm:inline">•</span>
        <button class="btn btn-danger" @click="confirmDeleteAll = true">Supprimer tout</button>
      </template>
      <template v-else-if="confirmDeleteAll === true">
        <span class="text-sm font-bold text-red-600">Tout supprimer ?</span>
        <button class="btn btn-danger" @click="deleteAll">Oui</button>
        <button class="btn btn-outline" @click="confirmDeleteAll = false">Non</button>
      </template>
    </div>
  </div>
</template>

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { ref, watch } from 'vue'
import imgDelete from '../assets/delete.png'

const modelValue = defineModel({ type: Array})
const modify = defineModel('modify')

const originalData = ref(JSON.parse(JSON.stringify(modelValue.value)))

const hasChanged = ref(false)
const confirmDeleteAll = ref(false)

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
  modelValue.value = []
  confirmDeleteAll.value = false
  modify.value = false
}
</script>