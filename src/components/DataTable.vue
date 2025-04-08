<template>
  <h4 class="text-center">Modifiez les clés-valeurs que vous souhaitez réviser !</h4>
    
  <table>
    <tr data-theme="dark">
      <th >Clés</th>
      <th>Valeurs</th>
    </tr>
    <tr v-for="item in modelValue">
      <td>
        <input type="text" v-model="item.key">
      </td>
      <td>
        <input type="text" v-model="item.value">
      </td>
      <div class="flex align-baseline mt-2 ml-4">
        <button @click="deleteItem(item)">
          <img class="size-12 sm:size-6" src="../assets/delete.png" alt="">
        </button>
      </div>
      </tr>
  </table>
  
  <div class="flex justify-center m-10 gap-5">
    <button @click="resetChanges">Annuler</button>
    <button :disabled="!verifyChangeInData()" @click="saveChanges">Sauvegarder</button>
  </div>
</template>

<script setup>
import { ref, watch, toRaw } from 'vue'
const modelValue = defineModel({ type: Array})
const modify = defineModel('modify')

const originalData = ref(JSON.parse(JSON.stringify(modelValue.value)))

const hasChanged = ref(false)

const verifyChangeInData = () => hasChanged.value

const resetChanges = () => {
  modelValue.value = JSON.parse(JSON.stringify(originalData.value))
  modify.value = false
  hasChanged.value = false
}

// Surveille modelValue pour détecter tout changement
watch(modelValue, (newVal) => {
  hasChanged.value = JSON.stringify(newVal) !== JSON.stringify(originalData.value)
}, { deep: true })

const saveChanges = () => {
  originalData.value = JSON.parse(JSON.stringify(modelValue.value))
  modify.value = false
  hasChanged.value = false
}

const deleteItem = (itemDelete) => {
  modelValue.value = modelValue.value.filter(item => item !== itemDelete);
}

</script>