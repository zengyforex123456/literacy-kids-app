import type { Entity } from './Entity'

export interface System {
  name: string
  update(dt: number, entities: Entity[], ctx: SystemContext): void
}

export interface SystemContext {
  collisionPairs: [Entity, Entity][]
  inputEvents: InputEvent[]
}

export interface InputEvent {
  type: 'tap' | 'drag' | 'release'
  x: number
  y: number
  target?: Entity
}
