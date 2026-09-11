import { describe, it, expect } from 'vitest'
import {
  splitRow,
  parseMarkdownCards,
  parseJsonCards,
  tryParseCards,
  generateJson,
  generateMarkdown,
  normalizeBackup
} from './cards'

describe('splitRow', () => {
  it('découpe les cellules simples', () => {
    expect(splitRow('| a | b |')).toEqual(['a', 'b'])
  })

  it('gère les pipes échappées (\\|)', () => {
    expect(splitRow('| a\\|b | c |')).toEqual(['a|b', 'c'])
  })
})

describe('parseMarkdownCards', () => {
  it('parse un tableau Markdown valide', () => {
    const md = '| Clé | Valeur |\n| --- | --- |\n| chat | cat |\n| chien | dog |'
    expect(parseMarkdownCards(md)).toEqual([
      { key: 'chat', value: 'cat' },
      { key: 'chien', value: 'dog' }
    ])
  })

  it('ignore un contenu qui ne ressemble pas à un tableau', () => {
    expect(parseMarkdownCards('juste du texte')).toEqual([])
  })

  it('déséchappe les pipes dans les cellules', () => {
    const md = '| Clé | Valeur |\n| --- | --- |\n| a\\|b | c |'
    expect(parseMarkdownCards(md)).toEqual([
      { key: 'a|b', value: 'c' }
    ])
  })

  it('préserve les clés dupliquées sur plusieurs lignes', () => {
    const md = '| Clé | Valeur |\n| --- | --- |\n| x | 1 |\n| x | 2 |'
    expect(parseMarkdownCards(md)).toEqual([
      { key: 'x', value: '1' },
      { key: 'x', value: '2' }
    ])
  })
})

describe('parseJsonCards', () => {
  it('parse un objet clé -> valeur', () => {
    expect(parseJsonCards({ chat: 'cat', chien: 'dog' })).toEqual([
      { key: 'chat', value: 'cat' },
      { key: 'chien', value: 'dog' }
    ])
  })

  it('parse un tableau d\'objets {key,value}', () => {
    expect(parseJsonCards([{ key: 'a', value: '1' }, { key: 'b', value: '2' }])).toEqual([
      { key: 'a', value: '1' },
      { key: 'b', value: '2' }
    ])
  })

  it('parse un tableau de paires', () => {
    expect(parseJsonCards([['a', '1'], ['b', '2']])).toEqual([
      { key: 'a', value: '1' },
      { key: 'b', value: '2' }
    ])
  })

  it('préserve les clés dupliquées en tableau', () => {
    expect(parseJsonCards([{ key: 'x', value: '1' }, { key: 'x', value: '2' }])).toEqual([
      { key: 'x', value: '1' },
      { key: 'x', value: '2' }
    ])
  })

  it('retourne un tableau vide pour les primitives', () => {
    expect(parseJsonCards(42)).toEqual([])
  })
})

describe('tryParseCards', () => {
  it('parse du JSON avec un BOM', () => {
    const json = '\uFEFF{"chat":"cat"}'
    expect(tryParseCards(json)).toEqual([{ key: 'chat', value: 'cat' }])
  })

  it('bascule sur le Markdown quand le JSON est invalide', () => {
    const md = '| Clé | Valeur |\n| --- | --- |\n| chat | cat |'
    expect(tryParseCards(md)).toEqual([{ key: 'chat', value: 'cat' }])
  })
})

describe('round-trip generate/parse', () => {
  it('JSON', () => {
    const cards = [{ key: 'a', value: '1' }, { key: 'b', value: '2' }]
    const parsed = tryParseCards(generateJson(cards))
    expect(parsed).toEqual(cards)
  })

  it('Markdown avec pipe échappée', () => {
    const cards = [{ key: 'a|b', value: 'c' }]
    const parsed = tryParseCards(generateMarkdown(cards))
    expect(parsed).toEqual(cards)
  })
})

describe('normalizeBackup', () => {
  const setA = { id: 'a', name: 'A', cards: [{ key: 'k', value: 'v' }] }

  it('accepte le format de sauvegarde {app, datasets}', () => {
    const result = normalizeBackup({ app: 'flashcards', version: 1, datasets: [setA] })
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({ id: 'a', name: 'A', cards: [{ key: 'k', value: 'v' }] })
  })

  it('accepte un tableau de jeux', () => {
    expect(normalizeBackup([setA])).toHaveLength(1)
  })

  it('accepte un jeu seul', () => {
    expect(normalizeBackup(setA)).toHaveLength(1)
  })

  it('régénère les ids dupliqués ou manquants', () => {
    const result = normalizeBackup([{ ...setA }, { ...setA }, { name: 'B', cards: [] }])
    const ids = new Set(result.map(s => s.id))
    expect(ids.size).toBe(3)
  })

  it('retourne un tableau vide pour un contenu invalide', () => {
    expect(normalizeBackup('garbage')).toEqual([])
    expect(normalizeBackup([1, 2, 3])).toEqual([])
    expect(normalizeBackup(null)).toEqual([])
  })

  it('assainit les cartes et les noms', () => {
    const result = normalizeBackup([{ name: '', cards: [{ k: 5 }, null, { key: 'a', value: 'b' }] }])
    expect(result[0].name).toBe('Sans nom')
    expect(result[0].cards).toEqual([{ key: '', value: '' }, { key: 'a', value: 'b' }])
  })
})