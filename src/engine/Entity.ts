export interface Entity {
  id: string
  type: string
  x: number
  y: number
  width: number
  height: number
  active: boolean
  data: Record<string, unknown>
  components: Map<string, Component>
}

export interface Component {
  type: string
  data: Record<string, unknown>
}

export function createEntity(
  type: string, x: number, y: number,
  w: number, h: number, data: Record<string, unknown> = {}
): Entity {
  return {
    id: `${type}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    type, x, y, width: w, height: h, active: true, data,
    components: new Map(),
  }
}
