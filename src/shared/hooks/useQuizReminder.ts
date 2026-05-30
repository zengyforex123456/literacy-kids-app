import { useState, useEffect } from 'react'

export function useQuizReminder(learnedCount: number) {
  const [showQuiz, setShowQuiz] = useState(false)
  const [lastQuizAt, setLastQuizAt] = useState(0)

  useEffect(() => {
    const threshold = Math.floor(learnedCount / 20) * 20
    if (threshold > 0 && threshold > lastQuizAt && learnedCount >= threshold) {
      setShowQuiz(true)
      setLastQuizAt(threshold)
    }
  }, [learnedCount])

  return { showQuiz, dismissQuiz: () => setShowQuiz(false) }
}
