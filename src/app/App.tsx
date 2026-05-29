import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { HomeScreen } from '../screens/home/HomeScreen'
import { TreasureHuntGame } from '../games/treasure-hunt/TreasureHuntGame'
import { BubblePopGame } from '../games/bubble-pop/BubblePopGame'
import { MatchingGame } from '../games/matching/MatchingGame'
import { WritingGame } from '../games/writing/WritingGame'
import { RewardsScreen } from '../screens/rewards/RewardsScreen'
import { ParentScreen } from '../screens/parent/ParentScreen'
import { ReportScreen } from '../screens/report/ReportScreen'
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen'
import { EyeCareOverlay } from '../shared/components/EyeCareOverlay'
import { seedWords } from '../shared/db/repository'

export default function App() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    seedWords().then(n => {
      console.log(`Seed: ${n} words loaded`)
      setReady(true)
    })
  }, [])

  if (!ready) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
        background: 'var(--bg)', color: 'var(--text)',
      }}>
        <div style={{ fontSize: 64, animation: 'bob 1s ease-in-out infinite' }}>📚</div>
        <div style={{ fontFamily: 'var(--font-heading)', fontSize: 22 }}>字库加载中...</div>
        <div style={{ fontSize: 14, color: '#999' }}>正在准备 500 个汉字</div>
      </div>
    )
  }

  return (
    <BrowserRouter>
      <EyeCareOverlay />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/game/treasure-hunt" element={<TreasureHuntGame />} />
        <Route path="/game/bubble-pop" element={<BubblePopGame />} />
        <Route path="/game/matching" element={<MatchingGame />} />
        <Route path="/game/writing" element={<WritingGame />} />
        <Route path="/rewards" element={<RewardsScreen />} />
        <Route path="/parent" element={<ParentScreen />} />
        <Route path="/report" element={<ReportScreen />} />
      </Routes>
    </BrowserRouter>
  )
}
