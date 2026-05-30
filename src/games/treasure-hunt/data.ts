import { getAllFamilies, getSiblingsOfChar, getRadicalOfChar, type RadicalFamily } from '../../shared/utils/radicalQuery'

export type { RadicalFamily }
export { getAllFamilies, getSiblingsOfChar, getRadicalOfChar }

// Compound characters (会意字) - manually curated
export interface CompoundChar {
  result: string
  parts: string[]
  story: string
  oracle: string
}

export const COMPOUND_CHARS: CompoundChar[] = [
  { result:'林',parts:['木','木'],story:'两棵树站在一起，变成小树林',oracle:'木木' },
  { result:'森',parts:['木','林'],story:'树木更多更密了，成了大森林',oracle:'木木木' },
  { result:'休',parts:['人','木'],story:'一个人靠在树旁休息',oracle:'人木' },
  { result:'明',parts:['日','月'],story:'太阳和月亮在一起，世界很明亮',oracle:'日月' },
  { result:'看',parts:['手','目'],story:'把手放在眼睛上望远看',oracle:'手目' },
  { result:'好',parts:['女','子'],story:'妈妈抱着孩子，多么美好',oracle:'女子' },
  { result:'从',parts:['人','人'],story:'一个人跟着另一个人',oracle:'人人' },
  { result:'众',parts:['人','从'],story:'三个人在一起，很多人',oracle:'人人人' },
]

// Evolution examples
export interface EvolutionChar {
  modern: string
  oracle: string
  bronze: string
  seal: string
  meaning: string
}

export const EVOLUTION_CHARS: EvolutionChar[] = [
  { modern:'日',oracle:'日',bronze:'日',seal:'日',meaning:'太阳' },
  { modern:'月',oracle:'月',bronze:'月',seal:'月',meaning:'月亮' },
  { modern:'山',oracle:'山',bronze:'山',seal:'山',meaning:'大山' },
  { modern:'水',oracle:'水',bronze:'水',seal:'水',meaning:'水流' },
  { modern:'木',oracle:'木',bronze:'木',seal:'木',meaning:'树木' },
  { modern:'人',oracle:'人',bronze:'人',seal:'人',meaning:'人' },
]
