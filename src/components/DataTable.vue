<template>
  <div v-if="gestConfirmDelete === 'show'">
    <ConfirmDelete v-model:confirmDelete="gestConfirmDelete"/>
  </div>
  <div v-else>
    <h4 class="text-center">Modifiez les clés-valeurs que vous souhaitez réviser !</h4>
    
    <table>
      <tr data-theme="dark">
        <th >Clés</th>
        <th>Valeurs</th>
        <th>Supprimer 
          <span class="ml-2"><input @click="gestConfirmDelete = 'show'" type="checkbox">
          </span>
        </th>
        
        <div class="">
        </div>
      </tr>
      <tr v-for="item in modelValue">
        <td>
          <input type="text" v-model="item.key">
        </td>
        <td>
          <input type="text" v-model="item.value">
        </td>
        <td>
          <div class="flex justify-center align-middle">
            <button @click="deleteItem(item)">
              <img class="size-16 sm:size-6" :src="imgDelete" alt="">
            </button>
          </div>
        </td>
      </tr>
    </table>
    
    <div class="flex justify-center m-10 gap-5">
      <button @click="resetChanges">Annuler</button>
      <button :disabled="!verifyChangeInData()" @click="saveChanges">Sauvegarder</button>
    </div>
  </div>
  </template>

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { ref, watch } from 'vue'
import imgDelete from '../assets/delete.png'
import ConfirmDelete from './ConfirmDelete.vue'

const gestConfirmDelete = ref('no')
const modelValue = defineModel({ type: Array})
const modify = defineModel('modify')

const originalData = ref(JSON.parse(JSON.stringify(modelValue.value)))

const hasChanged = ref(false)

const verifyChangeInData = () => hasChanged.value

//S'il clique sur annuler, annule les changements s'il y en a eu
const resetChanges = () => {
  modelValue.value = JSON.parse(JSON.stringify(originalData.value))
  modify.value = false
  hasChanged.value = false
}

// Surveille modelValue pour détecter tout changement
watch(modelValue, (newVal) => {
  hasChanged.value = JSON.stringify(newVal) !== JSON.stringify(originalData.value)
}, { deep: true })

watch(gestConfirmDelete, (val) => {
  if (val === 'yes') {
    modelValue.value = []
    modify.value = false
  }
})

const saveChanges = () => {
  originalData.value = JSON.parse(JSON.stringify(modelValue.value))
  modify.value = false
  hasChanged.value = false
}

const deleteItem = (itemDelete) => {
  modelValue.value = modelValue.value.filter(item => item !== itemDelete);
}

</script>