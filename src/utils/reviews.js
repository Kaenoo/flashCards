/**
 * Helpers purs pour la persistance du focus « à revoir » (interrogation).
 */

/**
 * Ne garde que les cartes « à revoir » toujours présentes dans le jeu actuel
 * (match par clé + valeur ; les cartes supprimées/modifiées sont écartées).
 * @param {Array} wrongList liste de cartes {key, value} à filtrer
 * @param {Array} currentCards cartes actuelles {key, value} du jeu
 * @returns {Array}
 */
export function filterWrongCards(wrongList, currentCards) {
  if (!Array.isArray(wrongList) || !Array.isArray(currentCards)) return []
  return wrongList.filter(w => (
    w
    && typeof w.key === 'string'
    && currentCards.some(c => c && c.key === w.key && c.value === w.value)
  ))
}

/**
 * Construit l'enregistrement de focus à persister, ou null si aucune carte à revoir.
 * Les cartes sont copiées pour ne pas partager d'objets avec l'état en mémoire.
 * @param {{ wrong: Array, total: number, correct: number, date?: string }} params
 * @returns {{ date: string, total: number, correct: number, wrong: Array } | null}
 */
export function buildReviewRecord({ wrong, total, correct, date = new Date().toISOString() } = {}) {
  if (!Array.isArray(wrong) || wrong.length === 0) return null
  return {
    date,
    total,
    correct,
    wrong: wrong.map(c => ({ key: c.key, value: c.value }))
  }
}