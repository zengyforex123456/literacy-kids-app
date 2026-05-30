import { motion, AnimatePresence } from 'framer-motion'
import { usePurchaseStore } from '../stores/purchaseStore'

interface Props {
  show: boolean
  charIndex: number
  onClose: () => void
}

export function PaywallModal({ show, charIndex, onClose }: Props) {
  const unlockProduct = usePurchaseStore(s => s.unlockProduct)

  const handlePurchase = (product: 'full_unlock' | 'pack_201_300') => {
    // In production: redirect to WeChat/Alipay H5 payment
    // For now: simulate successful purchase
    unlockProduct(product)
    onClose()
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 500, padding: 16,
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 20 }}
            onClick={e => e.stopPropagation()}
            style={{
              background: 'white', borderRadius: 24, padding: 32,
              maxWidth: 360, width: '100%', textAlign: 'center',
              boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 8 }}>🔓</div>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: 22,
              color: 'var(--bbaby-red)', marginBottom: 4,
            }}>
              解锁更多汉字!
            </h2>
            <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
              你已经学了 {charIndex} 个字，太棒了!<br/>
              解锁后可以继续学习全部200个字
            </p>

            {/* Full unlock */}
            <div
              onClick={() => handlePurchase('full_unlock')}
              style={{
                background: 'linear-gradient(135deg, var(--bbaby-red), var(--bbaby-orange))',
                borderRadius: 16, padding: '16px 20px', color: 'white',
                cursor: 'pointer', marginBottom: 12,
                boxShadow: '0 4px 16px rgba(255,107,107,0.3)',
              }}
            >
              <div style={{ fontSize: 20, fontWeight: 700 }}>永久解锁 ¥39.90</div>
              <div style={{ fontSize: 13, opacity: 0.9 }}>全部200字，一次付费，永久使用</div>
            </div>

            {/* Word pack */}
            <div
              onClick={() => handlePurchase('pack_201_300')}
              style={{
                background: 'white', borderRadius: 16, padding: '14px 20px',
                cursor: 'pointer', border: '2px solid #EEE',
              }}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--bbaby-text)' }}>
                字包 ¥6.90
              </div>
              <div style={{ fontSize: 13, color: '#999' }}>解锁下一个100字</div>
            </div>

            <button
              onClick={onClose}
              style={{
                marginTop: 12, background: 'none', border: 'none',
                color: '#999', fontSize: 14, cursor: 'pointer',
              }}
            >
              继续免费学习
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
