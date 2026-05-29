export interface Scene {
  name: string
  enter(ctx: SceneContext): void
  update(dt: number, ctx: SceneContext): void
  exit(ctx: SceneContext): void
}

export interface SceneContext {
  canvas: HTMLCanvasElement | null
  deltaTime: number
  elapsed: number
  sceneData: Map<string, unknown>
}
