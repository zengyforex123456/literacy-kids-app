// 状态机: menu → playing ⇄ paused → level_complete → win/lose
const CONFIG = {
  // Grid
  ROWS: 5, COLS: 9, CELL_W: 90, CELL_H: 100, START_X: 80, START_Y: 70,
  // Sun economy
  START_SUN: 150, SUN_DROP_INTERVAL: 6000, SUN_DROP_AMOUNT: 25,
  // Quiz
  QUIZ_CORRECT_SUN: 25, QUIZ_OPTIONS_COUNT: 4,
  // Zombies
  ZOMBIE_SPAWN_INTERVAL: 5000, ZOMBIE_BASE_HP: 100, ZOMBIE_BASE_SPEED: 0.3,
  // Win condition
  WIN_SCORE: 100,
}
