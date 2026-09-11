<template>
  <!--
  <div v-if="showArrow" @click="scrollToBottom" class="fixed size-12 md:size-10 bg-white rounded-4xl bottom-5 right-5 cursor-pointer transition duration-200 hover:scale-110">
    <img src="../assets/arrow_down.png" alt="Bas de page">
  </div>
  -->

  <h4 class="text-center">Modifiez les clés-valeurs que vous souhaitez réviser !</h4>

  <table>
    <thead>
      <tr data-theme="dark">
        <th>Clés</th>
        <th>Valeurs</th>
        <th>Supprimer</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in modelValue" :key="item">
        <td>
          <input type="text" v-model="item.key">
        </td>
        <td>
          <input type="text" v-model="item.value">
        </td>
        <td>
          <div class="flex justify-center align-middle">
            <button type="button" @click="deleteItem(item)">
              <img class="size-7 sm:size-6 hover:scale-110 transition duration-100" :src="imgDelete" alt="Supprimer">
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <div class="flex justify-center m-10 gap-5">
    <button @click="resetChanges">Annuler</button>
    <button :disabled="!verifyChangeInData()" @click="saveChanges">Sauvegarder</button>
    <button v-if="modelValue.length > 0 && confirmDeleteAll === false" @click="confirmDeleteAll = true">Supprimer tout</button>
    <template v-if="confirmDeleteAll === true">
      <span class="self-center text-red-600 font-bold">Tout supprimer ?</span>
      <button @click="deleteAll">Oui</button>
      <button @click="confirmDeleteAll = false">Non</button>
    </template>
  </div>
</template>

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { ref, watch, onMounted } from 'vue'
import imgDelete from '../assets/delete.png'

const modelValue = defineModel({ type: Array})
const modify = defineModel('modify')

const originalData = ref(JSON.parse(JSON.stringify(modelValue.value)))

const hasChanged = ref(false)
const confirmDeleteAll = ref(false)

const showArrow = ref(false)  // Variable pour afficher la flèche

// Vérifier si la page est assez longue pour afficher la flèche
const checkPageLength = () => {
  const pageHeight = document.documentElement.scrollHeight
  const screenHeight = window.innerHeight
  showArrow.value = pageHeight > screenHeight * 2  // Afficher la flèche si la page est deux fois plus longue que l'écran
}

// Fonction pour faire défiler la page vers le bas
const scrollToBottom = () => {
  window.scrollTo({
    top: document.body.scrollHeight,  // Défiler jusqu'en bas de la page
    behavior: 'smooth'  // Défilement fluide
  })
}

// Appel initial pour vérifier la longueur de la page
onMounted(() => {
  checkPageLength()

  // Vérifier la longueur de la page à chaque fois que la taille de la fenêtre change
  window.addEventListener('resize', checkPageLength)
})

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
  modify.value = false
}
</script>