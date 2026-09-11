<template>
    <div v-if="modifyData === false">
        <div class="card">
            <div class="mb-6 text-center">
                <p class="text-lg font-bold text-neutral-900">Entrez les clés-valeurs à réviser</p>
                <p class="text-sm text-neutral-500">Collez un JSON ou tableau Markdown, importez un fichier ou saisissez manuellement.</p>
            </div>

            <div class="seg mb-5">
                <button type="button" class="seg-btn" :class="{ 'seg-btn-active': selectedMode === 'json_md' }" @click="selectedMode = 'json_md'">JSON ou Markdown</button>
                <button type="button" class="seg-btn" :class="{ 'seg-btn-active': selectedMode === 'manual' }" @click="selectedMode = 'manual'">Manuellement</button>
            </div>

            <!-- Entrée JSON ou Markdown -->
            <div v-if="selectedMode === 'json_md'" class="mb-5">
                <textarea v-model="jsonMdInput" rows="8" class="input" placeholder='Ex : {"chat":"cat"} ou un tableau Markdown…'></textarea>
                <div class="mt-3 flex flex-wrap items-center gap-3">
                    <button type="button" class="btn btn-primary" :disabled="jsonMdInput.length === 0" @click="verifyPattern(jsonMdInput)">Enregistrer</button>
                    <input ref="fileInput" type="file" accept=".json,.md,.markdown,.txt" class="hidden" @change="importFile">
                    <button type="button" class="btn btn-outline" @click="fileInput.click()">Importer un fichier</button>
                    <span v-show="listKeysValues.length > 0" class="badge">Nombre de cartes : {{ listKeysValues.length }}</span>
                </div>
            </div>

            <!-- Entrée manuelle -->
            <div v-else class="mb-5">
                <div class="grid gap-3 sm:grid-cols-2">
                    <input ref="keyInput" v-model="keyName" type="text" class="input" placeholder="Clé" @keydown.enter.prevent="valueInput?.focus()">
                    <input ref="valueInput" v-model="valueName" type="text" class="input" placeholder="Valeur" @keydown.enter.prevent="addKeyValue">
                </div>
                <div class="mt-3 flex flex-wrap items-center gap-3">
                    <button type="button" class="btn btn-primary" :disabled="!keyName || !valueName" @click="addKeyValue">Ajouter</button>
                    <span v-show="listKeysValues.length > 0" class="badge">Nombre de cartes : {{ listKeysValues.length }}</span>
                </div>
            </div>

            <div class="flex flex-wrap items-center justify-center gap-3 border-t border-neutral-200 pt-5">
                <button v-show="listKeysValues.length > 0" class="btn btn-outline" @click="modifyData = true">Modifier</button>
                <button v-show="listKeysValues.length > 0" class="btn btn-outline" @click="exportData('json')">Exporter JSON</button>
                <button v-show="listKeysValues.length > 0" class="btn btn-outline" @click="exportData('markdown')">Exporter Markdown</button>
            </div>
        </div>
    </div>

    <DataTable v-else v-model="listKeysValues" v-model:modify="modifyData"/>
</template>

<!-- ******************************** SCRIPT PART ******************************** -->

<script setup>
import { ref } from 'vue'
import DataTable from './DataTable.vue'
let listKeysValues = defineModel({type: Array})

const selectedMode = ref('json_md')

const jsonMdInput = ref('')

//Instancie les variables de l'option manuel
const keyName = ref('')
const valueName = ref('')

const modifyData = ref(false)
const fileInput = ref(null)
const keyInput = ref(null)
const valueInput = ref(null)

/**
 * Ajoute une clé-valeur depuis l'onglet manuel
 */
const addKeyValue = () => {
  listKeysValues.value.push({
    key: keyName.value,
    value: valueName.value
  })
  keyName.value = ''
  valueName.value = ''
}

/**
 * Découpe une ligne de tableau Markdown en cellules,
 * en respectant les `|` échappées (\|).
 * @param line {string}
 * @returns {string[]}
 */
const splitRow = (line) => {
  const cells = []
  let current = ''
  for (let i = 0; i < line.length; i++) {
    if (line[i] === '\\' && line[i + 1] === '|') {
      current += '|'
      i++
    } else if (line[i] === '|') {
      cells.push(current)
      current = ''
    } else {
      current += line[i]
    }
  }
  cells.push(current)
  return cells.map(cell => cell.trim()).filter(cell => cell !== '')
}

/**
 * Transforme un tableau Markdown en liste de cartes [{key, value}]
 * @param content {string} texte du tableau markdown
 * @returns {Array<{key: string, value: string}>}
 */
const parseMarkdownCards = (content) => {
  const lines = content.trim().split("\n")
  if (
    lines.length < 2 ||
    !lines[0].includes("|") ||
    !lines[1].match(/^[-| ]+$/)
  ) return []

  const cards = []
  lines.slice(2).forEach(line => {
    if (line.trim() === '') return
    const columns = splitRow(line)
    if (columns.length >= 2) {
      cards.push({ key: columns[0], value: columns[1] })
    }
  })
  return cards
}

/**
 * Convertit une valeur JSON (objet, tableau d'objets ou de paires) en cartes
 * @param data {*} valeur JSON parsée
 * @returns {Array<{key: string, value: string}>}
 */
const parseJsonCards = (data) => {
  if (Array.isArray(data)) {
    return data
      .map(item => {
        if (Array.isArray(item)) {
          return { key: String(item[0] ?? ''), value: String(item[1] ?? '') }
        }
        if (item && typeof item === 'object') {
          return { key: String(item.key ?? ''), value: String(item.value ?? '') }
        }
        return null
      })
      .filter(card => card !== null)
  }
  if (data && typeof data === 'object') {
    return Object.entries(data).map(([key, value]) => ({ key, value: String(value) }))
  }
  return []
}

/**
 * Tente d'interpréter le contenu comme du JSON puis comme du Markdown
 * @param text {string}
 * @returns {Array<{key: string, value: string}>}
 */
const tryParseCards = (text) => {
  try {
    return parseJsonCards(JSON.parse(text))
  } catch {
    return parseMarkdownCards(text)
  }
}

/**
 * Vérifie si le pattern JSON ou markdown est respecté puis ajoute les cartes
 * @param content {string} contenu du textarea
 */
const verifyPattern = (content) => {
  const text = String(content).replace(/^\uFEFF/, '').trim()
  if (text === '') return

  const cards = tryParseCards(text)
  if (cards.length > 0) {
    listKeysValues.value.push(...cards)
    jsonMdInput.value = ''
  } else {
    alert("Format invalide : entrez un JSON ou un tableau Markdown.")
  }
}

/**
 * Lecture d'un fichier .json/.md sélectionné puis import des cartes
 * @param event {Event}
 */
const importFile = (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    const content = String(reader.result ?? '')
    jsonMdInput.value = content
    verifyPattern(content)
    event.target.value = ''
  }
  reader.readAsText(file)
}
  /**
   * Génère un JSON (tableau de paires) depuis listKeysValues.
   * Le format tableau préserve les clés dupliquées et réimporte sans erreur.
   * @returns {string}
   */
  const generateJson = () => {
    return JSON.stringify(
      listKeysValues.value.map(item => ({ key: item.key, value: item.value })),
      null,
      2
    );
};

/**
 * Génère le contenu Markdown (tableau) à partir de listKeysValues
 * @returns {string} Le contenu Markdown
 */
const escapeMd = (text) => String(text).replace(/\|/g, '\\|').replace(/\n/g, ' ')

const generateMarkdown = () => {
    let markdown = "| Clé | Valeur |\n";
    markdown += "| --- | --- |\n"; // Ligne de séparation pour le tableau Markdown

    listKeysValues.value.forEach(item => {
        const key = escapeMd(item.key);
        const value = escapeMd(item.value);
        markdown += `| ${key} | ${value} |\n`;
    });

    return markdown;
};

/**
 * Déclenche le téléchargement du contenu exporté
 * @param {string} format 'json' ou 'markdown'
 */
const exportData = (format) => {
    if (listKeysValues.value.length === 0) {
        alert("Aucune donnée à exporter.");
        return;
    }

    let content, filename, mimeType;

    if (format === 'json') {
        content = generateJson();
        filename = 'export_cles_valeurs.json';
        mimeType = 'application/json';
    } else if (format === 'markdown') {
        content = generateMarkdown();
        filename = 'export_cles_valeurs.md';
        mimeType = 'text/markdown';
    } else {
        return; 
    }

    // Créer un élément <a> temporaire pour le téléchargement
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Libérer l'objet URL
};
</script>