export const makeId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8)

/**
 * Découpe une ligne de tableau Markdown en cellules,
 * en respectant les `|` échappées (\|).
 * @param line {string}
 * @returns {string[]}
 */
export const splitRow = (line) => {
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
export const parseMarkdownCards = (content) => {
  const lines = content.trim().split('\n')
  if (
    lines.length < 2 ||
    !lines[0].includes('|') ||
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
export const parseJsonCards = (data) => {
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
export const tryParseCards = (text) => {
  const clean = String(text).replace(/^\uFEFF/, '').trim()
  try {
    return parseJsonCards(JSON.parse(clean))
  } catch {
    return parseMarkdownCards(clean)
  }
}

const escapeMd = (text) => String(text).replace(/\|/g, '\\|').replace(/\n/g, ' ')

/**
 * Génère le contenu Markdown (tableau) à partir de listKeysValues
 * @param cards {Array<{key: string, value: string}>}
 * @returns {string} Le contenu Markdown
 */
export const generateMarkdown = (cards) => {
  let markdown = '| Clé | Valeur |\n'
  markdown += '| --- | --- |\n'

  cards.forEach(item => {
    const key = escapeMd(item.key)
    const value = escapeMd(item.value)
    markdown += `| ${key} | ${value} |\n`
  })

  return markdown
}

/**
 * Génère un JSON (tableau de paires) depuis les cartes.
 * Le format tableau préserve les clés dupliquées et réimporte sans erreur.
 * @param cards {Array<{key: string, value: string}>}
 * @returns {string}
 */
export const generateJson = (cards) => {
  return JSON.stringify(
    cards.map(item => ({ key: item.key, value: item.value })),
    null,
    2
  )
}

/**
 * Normalise un fichier de sauvegarde en liste de jeux.
 * Accepte le format de sauvegarde ({app, datasets}), un tableau de jeux
 * ou un jeu seul. Les ids absents/dupliqués sont régénérés.
 * @param data {*} contenu parsé du fichier
 * @returns {Array<{id: string, name: string, cards: Array<{key: string, value: string}>}>}
 */
export const normalizeBackup = (data) => {
  let sets = []
  if (data && typeof data === 'object' && 'datasets' in data && Array.isArray(data.datasets)) {
    sets = data.datasets
  } else if (Array.isArray(data)) {
    if (data.every(item => item && typeof item === 'object' && 'cards' in item)) {
      sets = data
    } else {
      return []
    }
  } else if (data && typeof data === 'object' && 'cards' in data) {
    sets = [data]
  }

  const seen = new Set()
  return sets
    .filter(set => set && typeof set === 'object' && Array.isArray(set.cards))
    .reduce((acc, set) => {
      let id = set.id
      if (typeof id !== 'string' || id === '' || seen.has(id)) id = makeId()
      seen.add(id)
      acc.push({
        id,
        name: typeof set.name === 'string' && set.name.trim() ? set.name : 'Sans nom',
        cards: set.cards
          .filter(card => card && typeof card === 'object')
          .map(card => ({ key: String(card.key ?? ''), value: String(card.value ?? '') }))
      })
      return acc
    }, [])
}