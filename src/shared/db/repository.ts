import { db, type Word } from './database'
import wordData from './words_all.json'

const EMOJI_MAP: Record<string, string> = {
  我:'🙋',你:'👉',他:'👨',她:'👩',爸:'👨',妈:'👩',爷:'👴',奶:'👵',
  哥:'🧑',姐:'👧',弟:'👦',妹:'👶',儿:'👶',女:'👧',宝:'💎',
  一:'1',二:'2',三:'3',四:'4',五:'5',六:'6',七:'7',八:'8',九:'9',十:'10',
  上:'U',下:'D',左:'L',右:'R',前:'F',后:'B',里:'in',外:'out',
  大:'big',小:'small',高:'tall',矮:'short',
  红:'R',黄:'Y',蓝:'B',绿:'G',黑:'K',白:'W',粉:'P',彩:'rainbow',
  走:'walk',跑:'run',跳:'jump',坐:'sit',站:'stand',
  看:'eye',听:'ear',说:'say',吃:'eat',喝:'drink',
  玩:'play',笑:'smile',哭:'cry',拉:'pull',推:'push',
  开:'open',关:'close',拿:'take',放:'put',要:'want',
  水:'water',饭:'rice',菜:'veg',果:'fruit',衣:'cloth',
  鞋:'shoe',帽:'hat',床:'bed',桌:'desk',椅:'chair',
  门:'door',窗:'window',灯:'lamp',杯:'cup',碗:'bowl',
  勺:'spoon',球:'ball',车:'car',书:'book',笔:'pen',
  天:'sky',地:'earth',日:'sun',月:'moon',风:'wind',雨:'rain',云:'cloud',山:'mountain',石:'rock',花:'flower',
  狗:'dog',猫:'cat',鸡:'chicken',鸭:'duck',鸟:'bird',鱼:'fish',
  兔:'rabbit',猴:'monkey',熊:'bear',虎:'tiger',狮:'lion',象:'elephant',
  马:'horse',牛:'cow',羊:'sheep',猪:'pig',蛙:'frog',蛇:'snake',
  苹:'apple',梨:'pear',桃:'peach',橘:'orange',蕉:'banana',葡:'grape',莓:'berry',樱:'cherry',瓜:'melon',
  春:'spring',夏:'summer',秋:'autumn',冬:'winter',雪:'snow',
  火:'fire',电:'electric',飞:'fly',船:'ship',机:'plane',
  树:'tree',林:'forest',草:'grass',竹:'bamboo',星:'star',
  国:'flag',歌:'song',舞:'dance',
}

const CAT_EMOJI: Record<string, string> = {
  人称:'👤',数字:'🔢',方位:'🧭',颜色:'🎨',动作:'🏃',物品:'📦',自然:'🌿',
  身体:'🦵',家庭:'👨',情绪:'😊',时间:'🕐',动物:'🐾',水果:'🍎',食物:'🍽️',
  形状:'🔷',学习:'📚',交通:'🚗',场所:'🏠',职业:'👔',季节:'🌤️',反义:'↔️',
  童话:'🏰',品德:'💝',动词:'🤸',形容:'✨',助词:'📝',植物:'🌱',技能:'🔧',
  安全:'🛡️',社会:'🏛️',科学:'🔬',艺术:'🎭',
}

function getEmoji(ch: string, cat: string): string {
  return EMOJI_MAP[ch] || CAT_EMOJI[cat] || '📝'
}

export async function seedWords(): Promise<number> {
  const count = await db.words.count()
  if (count > 0) return count

  const allWords: Omit<Word, 'id'>[] = wordData.map(w => ({
    ...w,
    difficulty: w.difficulty as 1 | 2 | 3,
    imageUrl: getEmoji(w.chinese, w.category),
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
  await db.words.update(id, { learned: true, learnedAt: Date.now() })
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
