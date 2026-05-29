type Listener = (...args: any[]) => void

class EventBus {
  private listeners: Map<string, Set<Listener>> = new Map()

  on(event: string, fn: Listener): () => void {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set())
    this.listeners.get(event)!.add(fn)
    return () => this.listeners.get(event)?.delete(fn)
  }

  emit(event: string, ...args: any[]): void {
    this.listeners.get(event)?.forEach(fn => fn(...args))
  }

  off(event: string, fn: Listener): void {
    this.listeners.get(event)?.delete(fn)
  }

  clear(): void { this.listeners.clear() }
}

export const eventBus = new EventBus()
export { EventBus }
