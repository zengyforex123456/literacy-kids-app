// 字族：同偏旁字
export interface RadicalFamily {
  radical: string
  name: string
  emoji: string
  words: { word: string; pinyin: string; en: string; emoji: string }[]
}

export const RADICAL_FAMILIES: RadicalFamily[] = [
  {
    radical: '木', name: '树木家族', emoji: '🌳',
    words: [
      { word:'树',pinyin:'shu',en:'tree',emoji:'🌳' },
      { word:'林',pinyin:'lin',en:'woods',emoji:'🌲' },
      { word:'森',pinyin:'sen',en:'forest',emoji:'🌴' },
      { word:'松',pinyin:'song',en:'pine',emoji:'🎄' },
      { word:'柏',pinyin:'bai',en:'cypress',emoji:'🌿' },
      { word:'杨',pinyin:'yang',en:'poplar',emoji:'🌳' },
      { word:'柳',pinyin:'liu',en:'willow',emoji:'🌿' },
      { word:'枫',pinyin:'feng',en:'maple',emoji:'🍁' },
    ],
  },
  {
    radical: '氵', name: '水之家族', emoji: '💧',
    words: [
      { word:'河',pinyin:'he',en:'river',emoji:'🏞️' },
      { word:'海',pinyin:'hai',en:'sea',emoji:'🌊' },
      { word:'江',pinyin:'jiang',en:'river',emoji:'🏞️' },
      { word:'湖',pinyin:'hu',en:'lake',emoji:'🪷' },
      { word:'洋',pinyin:'yang',en:'ocean',emoji:'🌊' },
      { word:'洗',pinyin:'xi',en:'wash',emoji:'🧼' },
      { word:'泪',pinyin:'lei',en:'tear',emoji:'💧' },
    ],
  },
  {
    radical: '口', name: '嘴巴家族', emoji: '👄',
    words: [
      { word:'吃',pinyin:'chi',en:'eat',emoji:'🍽️' },
      { word:'喝',pinyin:'he',en:'drink',emoji:'🥤' },
      { word:'唱',pinyin:'chang',en:'sing',emoji:'🎤' },
      { word:'叫',pinyin:'jiao',en:'call',emoji:'📢' },
      { word:'听',pinyin:'ting',en:'listen',emoji:'👂' },
      { word:'说',pinyin:'shuo',en:'speak',emoji:'🗣️' },
    ],
  },
  {
    radical: '女', name: '女子家族', emoji: '👧',
    words: [
      { word:'妈',pinyin:'ma',en:'mom',emoji:'👩' },
      { word:'姐',pinyin:'jie',en:'sister',emoji:'👧' },
      { word:'妹',pinyin:'mei',en:'sister',emoji:'👶' },
      { word:'奶',pinyin:'nai',en:'grandma',emoji:'👵' },
      { word:'好',pinyin:'hao',en:'good',emoji:'👍' },
    ],
  },
]

// 会意字：组合造字
export interface CompoundChar {
  result: string
  parts: string[]
  story: string
  oracle: string  // 甲骨文描述
}

export const COMPOUND_CHARS: CompoundChar[] = [
  { result:'林',parts:['木','木'],story:'两棵树站在一起，变成小树林',oracle:'🌲🌲' },
  { result:'森',parts:['木','木','木'],story:'三棵树在一起，成了大森林',oracle:'🌲🌲🌲' },
  { result:'休',parts:['人','木'],story:'一个人靠在树旁休息',oracle:'🧍🌳' },
  { result:'明',parts:['日','月'],story:'太阳和月亮在一起，世界很明亮',oracle:'☀️🌙' },
  { result:'看',parts:['手','目'],story:'把手放在眼睛上望远看',oracle:'✋👁️' },
  { result:'好',parts:['女','子'],story:'妈妈抱着孩子，多么美好',oracle:'👩👶' },
  { result:'森',parts:['木','林'],story:'树林更密了，变成森林',oracle:'🌲🌲🌲' },
]

// 字形演变示例
export interface EvolutionChar {
  modern: string
  oracle: string
  bronze: string
  seal: string
  meaning: string
}

export const EVOLUTION_CHARS: EvolutionChar[] = [
  { modern:'日',oracle:'⊙',bronze:'⊙',seal:'日',meaning:'太阳' },
  { modern:'月',oracle:'🌙',bronze:'🌙',seal:'月',meaning:'月亮' },
  { modern:'山',oracle:'⛰️',bronze:'⛰️',seal:'山',meaning:'大山' },
  { modern:'水',oracle:'💧',bronze:'💧',seal:'水',meaning:'水流' },
  { modern:'木',oracle:'🌱',bronze:'🌿',seal:'木',meaning:'树木' },
  { modern:'人',oracle:'🧍',bronze:'🧍',seal:'人',meaning:'人' },
]
