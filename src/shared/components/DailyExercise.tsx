import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'daily_exercise_progress';

interface Exercise {
  question: string;
  characters: string[];
  correctIndex: number;
}

const SAMPLE_EXERCISES: Exercise[] = [
  { question: '哪个是「山」？', characters: ['水', '山', '火', '木'], correctIndex: 1 },
  { question: '哪个是「日」？', characters: ['目', '田', '日', '口'], correctIndex: 2 },
  { question: '选出「人」字', characters: ['入', '八', '人', '大'], correctIndex: 2 },
  { question: '找到「鸟」', characters: ['乌', '马', '鱼', '鸟'], correctIndex: 3 },
  { question: '哪个是「花」？', characters: ['草', '花', '茶', '菜'], correctIndex: 1 },
];

export default function DailyExercise() {
  const [show, setShow] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    const last = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toDateString();
    if (last !== today) {
      // Show once per day
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const exercise = SAMPLE_EXERCISES[currentIdx];

  const handleSelect = (idx: number) => {
    if (selected !== null) return;
    setSelected(idx);
    const isCorrect = idx === exercise.correctIndex;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setScore(s => s + 1);
    }
    setTimeout(() => {
      if (currentIdx < SAMPLE_EXERCISES.length - 1) {
        setCurrentIdx(i => i + 1);
        setSelected(null);
        setFeedback(null);
      } else {
        setDone(true);
        localStorage.setItem(STORAGE_KEY, new Date().toDateString());
      }
    }, 800);
  };

  const handleClose = () => {
    setShow(false);
    localStorage.setItem(STORAGE_KEY, new Date().toDateString());
  };

  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 500, padding: 16,
        }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 20 }} animate={{ scale: 1, y: 0 }}
          onClick={e => e.stopPropagation()}
          style={{
            background: 'white', borderRadius: 24, padding: 32,
            maxWidth: 380, width: '100%', textAlign: 'center',
            boxShadow: '0 16px 48px rgba(0,0,0,0.2)',
          }}
        >
          {done ? (
            <>
              <div style={{ fontSize: 56 }}>🎉</div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 22, marginTop: 8 }}>
                今日练习完成!
              </h2>
              <p style={{ fontSize: 16, color: '#666', marginTop: 4 }}>
                得分: {score}/{SAMPLE_EXERCISES.length}
              </p>
              <button
                onClick={handleClose}
                style={{
                  marginTop: 16, padding: '12px 32px', borderRadius: 20,
                  border: 'none', background: 'var(--disney-gold)',
                  color: 'white', fontWeight: 700, fontSize: 16, cursor: 'pointer',
                }}
              >
                关闭
              </button>
            </>
          ) : (
            <>
              <div style={{ fontSize: 14, color: '#999', marginBottom: 4 }}>
                每日练习 {currentIdx + 1}/{SAMPLE_EXERCISES.length}
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, marginBottom: 20 }}>
                {exercise.question}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {exercise.characters.map((char, idx) => {
                  const isSelected = selected === idx;
                  const bg = isSelected
                    ? (idx === exercise.correctIndex ? '#4CAF50' : '#F44336')
                    : 'white';
                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSelect(idx)}
                      disabled={selected !== null}
                      style={{
                        padding: '16px', borderRadius: 16, border: '2px solid #EEE',
                        background: bg,
                        color: isSelected ? 'white' : '#333',
                        fontWeight: 700, fontSize: 32,
                        cursor: selected !== null ? 'default' : 'pointer',
                        opacity: selected !== null && !isSelected ? 0.5 : 1,
                      }}
                    >
                      {char}
                    </motion.button>
                  );
                })}
              </div>
              {feedback && (
                <div style={{
                  marginTop: 12, fontSize: 16, fontWeight: 600,
                  color: feedback === 'correct' ? '#4CAF50' : '#F44336',
                }}>
                  {feedback === 'correct' ? '✅ 正确!' : '❌ 再想想'}
                </div>
              )}
              <button
                onClick={handleClose}
                style={{
                  marginTop: 16, background: 'none', border: 'none',
                  color: '#999', cursor: 'pointer', fontSize: 14,
                }}
              >
                跳过
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
