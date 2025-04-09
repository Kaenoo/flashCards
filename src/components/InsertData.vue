<template>
    <div v-if="modifyData === false">
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
            </div>
        
            <div class="flex justify-center m-10 gap-5">
                <button @click="goHome = 'home'">Revenir au Menu</button>
                <button v-show="listKeysValues.length > 0" @click="modifyData = true">Modifier</button>
            </div>
        </form>
    </div>
  <DataTable v-if="modifyData" v-model="listKeysValues" v-model:modify="modifyData"/>

</template>

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { computed, ref } from 'vue'
import DataTable from './DataTable.vue'
const goHome = defineModel('returnHome')
const listKeysValues = defineModel({type: Array})

const selectedMode = ref('json_md')

const jsonMdInput = ref('')

//Instancie les variables de l'option manuel
const keyName = ref('')
const valueName = ref('')

const modifyData = ref(false)

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
})

/**
 * Transforme le format markdown au format json dans un array
 * @param markdown string ordonné du textarea
 */
const convertMarkdownToJson = (markdown) => {

  // Parcour les lignes à partir de la 3ème
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

/**
 * Vérifie si le pattern JSON ou markdown est respecté
 * @param e Content of textarea
 */
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
</script>

<style>

</style>