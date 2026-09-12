import { describe, it, expect } from 'vitest'
import { filterWrongCards, buildReviewRecord } from './reviews'

describe('filterWrongCards', () => {
  const cards = [
    { key: 'chat', value: 'cat' },
    { key: 'chien', value: 'dog' }
  ]

  it('garde les cartes encore présentes dans le jeu', () => {
    const wrong = [
      { key: 'chat', value: 'cat' },
      { key: 'chauve-souris', value: 'bat' }
    ]
    expect(filterWrongCards(wrong, cards)).toEqual([{ key: 'chat', value: 'cat' }])
  })

  it('retourne une liste vide si rien ne correspond', () => {
    expect(filterWrongCards([{ key: 'lion', value: 'lion' }], cards)).toEqual([])
  })

  it('tolère les entrées invalides', () => {
    expect(filterWrongCards(null, cards)).toEqual([])
    expect(filterWrongCards([], 42)).toEqual([])
    expect(filterWrongCards([null, { key: 'chat', value: 'cat' }], cards)).toEqual([
      { key: 'chat', value: 'cat' }
    ])
  })
})

describe('buildReviewRecord', () => {
  it('crée un enregistrement avec des copies des cartes', () => {
    const wrong = [{ key: 'chat', value: 'cat' }]
    const rec = buildReviewRecord({
      wrong,
      total: 3,
      correct: 2,
      date: '2026-09-12T00:00:00.000Z'
    })
    expect(rec).toEqual({
      date: '2026-09-12T00:00:00.000Z',
      total: 3,
      correct: 2,
      wrong: [{ key: 'chat', value: 'cat' }]
    })
    expect(rec.wrong[0]).not.toBe(wrong[0])
  })

  it('retourne null si aucune carte à revoir', () => {
    expect(buildReviewRecord({ wrong: [], total: 5, correct: 5 })).toBeNull()
  })

  it('retourne null si la liste est absente ou non conforme', () => {
    expect(buildReviewRecord({})).toBeNull()
    expect(buildReviewRecord({ wrong: null, total: 5, correct: 5 })).toBeNull()
  })
})