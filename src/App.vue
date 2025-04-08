<template>
  <div v-if="!gameStarted && modifyData === false">
    
    <h1 class="text-center">FlashCards</h1>
    <h4 class="text-center">Entrez les clés-valeurs que vous souhaitez réviser !</h4>

  <form action="" @submit.prevent>
      <div class="flex justify-center gap-5 mb-5">
        <button @click="selectedMode = 'json_md'">JSON ou Tableau Markdown</button>
        <button @click="selectedMode = 'manual'">Manuellement</button>
      </div>

      <!-- Entrée Json ou Markdown -->
      <div v-if="selectedMode === 'json_md'">
        <textarea v-model="jsonMdInput">{{ jsonMdInput }}</textarea>
        <button :disabled="jsonMdInput.length === 0" @click="verifyPattern(jsonMdInput)">Enregistrer</button>
          <span
              v-show="listKeysValues.length > 0"
              class="ml-5">
               Nombre de cartes : {{ listKeysValues.length }}
            </span>
            <div class="flex justify-center m-10 gap-5">
              <button v-show="listKeysValues.length > 0" @click="modifyData = true">Modifier</button>
              <button v-show="listKeysValues.length > 0" @click="startGame">Commencer</button>
            </div>
      </div>
      
      <!-- Entrée Manuel -->
      <div v-else>
        <form action="" @submit.prevent>
          <input type="text" v-model="keyName" placeholder="Clé">
          <input type="text" v-model="valueName" placeholder="Valeur">
          <div class="inline-block align-middle gap 5">
            <button :disabled="!keyName || !valueName" class="mr-10" @click="addKeyValue">Ajouter</button> 
            <span
              v-show="listKeysValues.length > 0"
              class="ml-5">
               Nombre de cartes : {{ listKeysValues.length }}
            </span>
          </div>
        </form>
        <div class="flex justify-center m-10 gap-5">
          <button v-show="listKeysValues.length > 0" @click="modifyData = true">Modifier</button>
          <button v-show="listKeysValues.length > 0" @click="startGame">Commencer</button>
        </div>
      </div>

    </form>
  </div>
  
  <div v-show="gameStarted">
    <h1 class="text-center">Jeu de FlashCards</h1>
    <p class="text-center">Nombre de cartes : {{ listKeysValues.length }}</p>
    <div 
    class="m-auto flex items-center justify-center size-80 rounded-3xl bg-amber-300 shadow-2xl shadow-amber-100"
    @click="returnCards = !returnCards">
    <h4 
      class="text-center px-4" 
      v-if="listKeysValues.length > 0" 
      v-text="returnCards ? listKeysValues[currentIndex].key : listKeysValues[currentIndex].value"></h4>
  </div>
  <div class="flex justify-center gap-10 pt-5 pb-8">
    <button @click="prevCard" :disabled="currentIndex === 0">Retour</button>
    <button @click="nextCard" :disabled="currentIndex >= listKeysValues.length - 1">Suivant</button>
  </div>
  <div class="flex justify-center">
    <button  @click="returnHome">Revenir au Menu</button>
  </div>
</div>

<DataTable v-if="modifyData === true" v-model="listKeysValues" v-model:modify="modifyData"/>

</template>

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { computed, ref } from 'vue';
import DataTable from './components/DataTable.vue';
import GameFlashCards from './components/GameFlashCards.vue'

const selectedMode = ref('json_md')

const jsonMdInput = ref('')

//Instancie les variables de l'option manuel
const keyName = ref('')
const valueName = ref('')
let listKeysValues = ref([])

const gameStarted = ref(false)
const modifyData = ref(false)
const returnCards = ref(false)
const currentIndex = ref(0)


const startGame = () => gameStarted.value = true
const returnHome = () => gameStarted.value = false



/**
 * Ajoute une clé-valeur depuis l'onglet manuel
 */
const addKeyValue = computed(() => {
  listKeysValues.value.push({
    key: keyName.value,
    value: valueName.value
  })
  keyName.value = ''
  valueName.value = ''
  console.log(listKeysValues.value)
})

/**
 * Transforme le format markdown au format json dans un array
 * @param markdown string ordonné du textarea
 */
const convertMarkdownToJson = (markdown) => {

  // Parcourir les lignes à partir de la 3e (en ignorant les deux premières)
  markdown.slice(2).forEach(line => {
    const columns = line.split("|").map(col => col.trim()).filter(col => col);
    
    if (columns.length >= 2) {
      listKeysValues.value.push({
        key: columns[0],
        value: columns[1],
      })
      jsonMdInput.value = ''
    }
  });
    return listKeysValues
}

const verifyPattern = (e) => {
    try {
      // Vérifier si c'est un JSON valide
      const parsed = Object.entries(JSON.parse(e))
      const tempArray = ref([])

      parsed.forEach(([key, value]) => {
      tempArray.value.push({ key, value })
    })

      listKeysValues.value.push(...tempArray.value)
      jsonMdInput.value = ''
    }
    catch{
      const lines = e.trim().split("\n")
      if (
        lines.length >= 2 && 
        lines[0].includes("|") && 
        lines[1].match(/^[-| ]+$/)
      ) {
          listKeysValues = convertMarkdownToJson(lines)
        }
        else {
          return { error: "Format Markdown invalide" }
        }
    }
  }

const nextCard = () => {
  if (currentIndex.value < listKeysValues.value.length - 1) {
    currentIndex.value++
    returnCards.value = false // réinitialise le côté de la carte
  }
}

const prevCard = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
    returnCards.value = false
  }
}

</script>

<style>

</style>