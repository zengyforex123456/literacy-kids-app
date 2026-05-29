import type { InputEvent } from './System'

export class InputManager {
  private element: HTMLElement | null = null
  private events: InputEvent[] = []
  private boundHandlers: { type: string; fn: EventListener }[] = []

  attach(element: HTMLElement): void {
    this.element = element
    const onDown = (e: Event) => {
      const pos = this.getPos(e as MouseEvent | TouchEvent)
      this.events.push({ type: 'tap', x: pos.x, y: pos.y })
    }
    const onMove = (e: Event) => {
      const pos = this.getPos(e as MouseEvent | TouchEvent)
      this.events.push({ type: 'drag', x: pos.x, y: pos.y })
    }
    const onUp = (e: Event) => {
      const pos = this.getPos(e as MouseEvent | TouchEvent)
      this.events.push({ type: 'release', x: pos.x, y: pos.y })
    }

    element.addEventListener('mousedown', onDown)
    element.addEventListener('mousemove', onMove)
    element.addEventListener('mouseup', onUp)
    element.addEventListener('touchstart', onDown, { passive: false })
    element.addEventListener('touchmove', onMove, { passive: false })
    element.addEventListener('touchend', onUp)

    this.boundHandlers = [
      { type: 'mousedown', fn: onDown },
      { type: 'mousemove', fn: onMove },
      { type: 'mouseup', fn: onUp },
      { type: 'touchstart', fn: onDown },
      { type: 'touchmove', fn: onMove },
      { type: 'touchend', fn: onUp },
    ]
  }

  detach(): void {
    this.boundHandlers.forEach(({ type, fn }) =>
      this.element?.removeEventListener(type, fn)
    )
    this.boundHandlers = []
    this.element = null
  }

  flush(): InputEvent[] {
    const e = [...this.events]
    this.events = []
    return e
  }

  private getPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
    const rect = this.element?.getBoundingClientRect()
    if ('touches' in e) {
      const t = (e as TouchEvent).touches[0] || (e as TouchEvent).changedTouches[0]
      return { x: t.clientX - (rect?.left ?? 0), y: t.clientY - (rect?.top ?? 0) }
    }
    return { x: (e as MouseEvent).clientX - (rect?.left ?? 0), y: (e as MouseEvent).clientY - (rect?.top ?? 0) }
  }
}
