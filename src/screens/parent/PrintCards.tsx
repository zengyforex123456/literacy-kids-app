import { motion } from 'framer-motion'

interface Props {
  words: { char: string; pinyin: string; emoji: string }[]
  onClose: () => void
}

export function PrintCards({ words, onClose }: Props) {
  const handlePrint = () => {
    const content = words.map(w =>
      `<div style="
        display:inline-block;width:45%;margin:2%;padding:20px;
        border:2px dashed #CCC;border-radius:16px;text-align:center;
        page-break-inside:avoid;
      ">
        <div style="font-size:48px">${w.emoji}</div>
        <div style="font-size:40px;font-weight:bold;margin:8px 0">${w.char}</div>
        <div style="font-size:16px;color:#999">${w.pinyin}</div>
        <div style="border-top:1px dashed #EEE;margin-top:12px;padding-top:12px">
          <div style="color:#CCC;font-size:24px;letter-spacing:4px">${w.char}</div>
        </div>
      </div>`
    ).join('')

    const html = `
      <html><head><meta charset="utf-8"><title>识字字卡</title>
      <style>body{font-family:sans-serif;padding:16px}@media print{@page{size:A4;margin:10mm}}</style>
      </head><body>${content}</body></html>`

    const win = window.open('', '_blank', 'width=800,height=600')
    if (win) { win.document.write(html); win.document.close(); setTimeout(() => win.print(), 500) }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 400, padding: 16,
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white', borderRadius: 24, padding: 24,
          maxWidth: 400, width: '100%', textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 8 }}>🖨️</div>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, marginBottom: 8 }}>
          打印字卡
        </h3>
        <p style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
          以下 {words.length} 个字将打印为描红字卡
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 }}>
          {words.map(w => (
            <span key={w.char} style={{
              background: '#FFF8E1', borderRadius: 8, padding: '6px 12px',
              fontSize: 20, fontWeight: 700,
            }}>{w.char}</span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handlePrint} style={{
            flex: 1, padding: 12, borderRadius: 14, border: 'none',
            background: 'var(--bbaby-blue)', color: 'white',
            fontWeight: 700, fontSize: 16, cursor: 'pointer',
          }}>打印 🖨️</button>
          <button onClick={onClose} style={{
            flex: 1, padding: 12, borderRadius: 14, border: '2px solid #EEE',
            background: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer',
          }}>关闭</button>
        </div>
      </motion.div>
    </motion.div>
  )
}
