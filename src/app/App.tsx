import { HashRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { HomeScreen } from '../screens/home/HomeScreen'
import { TreasureHuntGame } from '../games/treasure-hunt/TreasureHuntGame'
import { ReadAloudCourse } from '../courses/read-aloud/ReadAloudCourse'
import { BridgeCourse } from '../courses/bridge/BridgeCourse'
import { DigCourse } from '../courses/dig/DigCourse'
import { BrainCourse } from '../courses/brain/BrainCourse'
import { RewardsScreen } from '../screens/rewards/RewardsScreen'
import { ParentScreen } from '../screens/parent/ParentScreen'
import { ReportScreen } from '../screens/report/ReportScreen'
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen'
import { EyeCareOverlay } from '../shared/components/EyeCareOverlay'
import { seedWords } from '../shared/db/repository'

const QUIZ_WORDS = [
  { chinese:'山',pinyin:'shan',emoji:'⛰️' },
  { chinese:'水',pinyin:'shui',emoji:'💧' },
  { chinese:'火',pinyin:'huo',emoji:'🔥' },
  { chinese:'木',pinyin:'mu',emoji:'🌳' },
  { chinese:'人',pinyin:'ren',emoji:'🧍' },
]

export default function App() {
  useEffect(() => { seedWords().catch(() => {}) }, [])

  return (
    <HashRouter>
      <EyeCareOverlay />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/onboarding" element={<OnboardingScreen />} />
        <Route path="/game/treasure-hunt" element={<TreasureHuntGame />} />
        <Route path="/game/bubble-pop" element={<ReadAloudCourse />} />
        <Route path="/game/matching" element={<BridgeCourse />} />
        <Route path="/game/writing" element={<DigCourse />} />
        <Route path="/game/quiz" element={<BrainCourse words={QUIZ_WORDS} onComplete={(c:number,t:number) => alert(c+'/'+t+' correct!')} />} />
        <Route path="/rewards" element={<RewardsScreen />} />
        <Route path="/parent" element={<ParentScreen />} />
        <Route path="/report" element={<ReportScreen />} />
      </Routes>
    </HashRouter>
  )
}
