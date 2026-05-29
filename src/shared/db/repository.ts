import { db, type Word } from './database'
import wordData from './words_all.json'

export async function seedWords(): Promise<number> {
  const count = await db.words.count()
  if (count > 0) return count

  const allWords: Omit<Word, 'id'>[] = wordData.map(w => ({
    ...w,
    difficulty: w.difficulty as 1 | 2 | 3,
    learned: false,
    mastered: false,
    reviewCount: 0,
    correctCount: 0,
  }))

  await db.words.bulkAdd(allWords as Word[])
  return allWords.length
}

export async function getWordsByCategory(category: string): Promise<Word[]> {
  return db.words.where('category').equals(category).toArray()
}

export async function getWordsByDifficulty(difficulty: 1 | 2 | 3): Promise<Word[]> {
  return db.words.where('difficulty').equals(difficulty).toArray()
}

export async function getUnlearnedWords(limit = 10): Promise<Word[]> {
  const all = await db.words.toArray()
  return all.filter(w => !w.learned).slice(0, limit)
}

export async function getReviewWords(limit = 10): Promise<Word[]> {
  const all = await db.words.toArray()
  return all.filter(w => w.learned)
    .sort((a, b) => (a.correctCount - a.reviewCount) - (b.correctCount - b.reviewCount))
    .slice(0, limit)
}

export async function markWordLearned(id: number): Promise<void> {
  await db.words.update(id, {
    learned: true,
    learnedAt: Date.now(),
  })
}

export async function recordWordAttempt(id: number, correct: boolean): Promise<void> {
  const word = await db.words.get(id)
  if (!word) return
  await db.words.update(id, {
    reviewCount: word.reviewCount + 1,
    correctCount: word.correctCount + (correct ? 1 : 0),
  })
}

export async function getWordStats() {
  const total = await db.words.count()
  const learned = await db.words.toArray().then(w => w.filter(x => x.learned).length)
  const mastered = await db.words.toArray().then(w => w.filter(x => x.mastered).length)
  return { total, learned, mastered }
}

export async function getCategories(): Promise<string[]> {
  const all = await db.words.toArray()
  return [...new Set(all.map(w => w.category))]
}
