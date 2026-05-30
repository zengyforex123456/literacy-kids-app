import families from '../db/radical_families_v1.json'

export interface RadicalFamily {
  radical: string
  name: string
  members: string[]
  count: number
}

const familyByRadical = new Map<string, RadicalFamily>()
const charToRadical = new Map<string, string>()

for (const f of families as RadicalFamily[]) {
  familyByRadical.set(f.radical, f)
  for (const ch of f.members) {
    if (!charToRadical.has(ch)) {
      charToRadical.set(ch, f.radical)
    }
  }
}

export function getAllFamilies(): RadicalFamily[] {
  return families as RadicalFamily[]
}

export function getFamilyByRadical(radical: string): RadicalFamily | undefined {
  return familyByRadical.get(radical)
}

export function getRadicalOfChar(char: string): string | undefined {
  return charToRadical.get(char)
}

export function getSiblingsOfChar(char: string): string[] {
  const radical = charToRadical.get(char)
  if (!radical) return []
  const family = familyByRadical.get(radical)
  return family ? family.members.filter(m => m !== char) : []
}

export function searchFamilies(query: string): RadicalFamily[] {
  const q = query.toLowerCase()
  return (families as RadicalFamily[]).filter(
    f => f.name.includes(q) || f.radical.includes(q)
  )
}
