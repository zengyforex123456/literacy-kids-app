import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
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
  useEffect(() => { seedWords().catch(() => {}) }, [])

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
