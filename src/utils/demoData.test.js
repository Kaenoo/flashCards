import { describe, it, expect } from 'vitest'
import { demoDatasets } from './demoData'

describe('demoDatasets', () => {
  const datasets = demoDatasets()

  it('fournit plusieurs jeux de données', () => {
    expect(datasets.length).toBeGreaterThanOrEqual(3)
  })

  it('chaque jeu possède un id unique, un nom et des cartes', () => {
    const ids = new Set()
    datasets.forEach(set => {
      expect(typeof set.id).toBe('string')
      expect(set.id).not.toBe('')
      expect(ids.has(set.id)).toBe(false)
      ids.add(set.id)
      expect(typeof set.name).toBe('string')
      expect(set.name.trim()).not.toBe('')
      expect(Array.isArray(set.cards)).toBe(true)
      expect(set.cards.length).toBeGreaterThan(0)
    })
  })

  it('chaque carte possède une clé et une valeur non vides', () => {
    datasets.forEach(set => {
      set.cards.forEach(card => {
        expect(typeof card.key).toBe('string')
        expect(card.key.trim()).not.toBe('')
        expect(typeof card.value).toBe('string')
        expect(card.value.trim()).not.toBe('')
      })
    })
  })
})