import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type ProductId = 'full_unlock' | 'pack_201_300' | 'pack_301_400' | 'pack_401_500'
type VerifyStatus = 'free' | 'verifying' | 'unlocked' | 'degraded'

interface PurchaseState {
  token: string | null
  status: VerifyStatus
  unlockedProducts: ProductId[]
  verifyFailCount: number
  setToken: (token: string) => void
  unlockProduct: (product: ProductId) => void
  degradeToFree: () => void
  incrementFailCount: () => void
  resetFailCount: () => void
  isProductUnlocked: (product: ProductId) => boolean
  canAccessChar: (charIndex: number) => boolean
}

const FREE_CHAR_LIMIT = 100
const FULL_UNLOCK_LIMIT = 200

export const usePurchaseStore = create<PurchaseState>()(
  persist(
    (set, get) => ({
      token: null,
      status: 'free',
      unlockedProducts: [],
      verifyFailCount: 0,

      setToken: (token) => set({ token, status: 'unlocked', verifyFailCount: 0 }),
      unlockProduct: (product) => set((s) => ({
        unlockedProducts: [...new Set([...s.unlockedProducts, product])],
        status: 'unlocked',
      })),
      degradeToFree: () => set({ status: 'degraded' }),
      incrementFailCount: () => {
        const count = get().verifyFailCount + 1
        if (count >= 3) {
          set({ verifyFailCount: count, status: 'degraded' })
        } else {
          set({ verifyFailCount: count })
        }
      },
      resetFailCount: () => set({ verifyFailCount: 0 }),

      isProductUnlocked: (product) => {
        const { unlockedProducts, status } = get()
        if (status === 'unlocked') return true
        return unlockedProducts.includes(product)
      },
      canAccessChar: (charIndex) => {
        const { status, unlockedProducts } = get()
        if (status === 'unlocked' || unlockedProducts.includes('full_unlock')) {
          return charIndex < FULL_UNLOCK_LIMIT
        }
        return charIndex < FREE_CHAR_LIMIT
      },
    }),
    { name: 'purchase-store' }
  )
)
