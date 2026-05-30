// 汉字学习系统 — 核心集成
class ChineseWordSystem {
  constructor() {
    this.wordBank = '山水火木人口手日月田力子女门车马虫鱼鸟王贝竹草土石金言目心禾米雨足走大小多少上下左右中'.split('');
    this.learned = JSON.parse(localStorage.getItem('pvz_learned') || '[]');
    this.quizActive = false;
    this.onCorrect = null;
    this.onWrong = null;
    this.streak = 0;         // 连击
    this.totalCorrect = 0;   // 累计正确
    this.totalQuestions = 0; // 累计答题
  }

  // === 植物召唤题: 选出指定汉字 ===
  generatePlantQuiz(plantWord) {
    const correct = plantWord;
    const options = [correct, ...this.pickRandom(3, this.wordBank.filter(w => w !== correct))].sort(() => Math.random() - 0.5);
    return {
      type: 'plant',
      prompt: '选择「' + correct + '」来召唤植物!',
      options: options,
      correct: correct,
      correctIndex: options.indexOf(correct),
      hint: '看字形，找相同的字',
    };
  }

  // === 射击题: 匹配偏旁/拼音 ===
  generateShootQuiz(zombieWord) {
    const correct = zombieWord;
    const options = [correct, ...this.pickRandom(3, this.wordBank.filter(w => w !== correct))].sort(() => Math.random() - 0.5);
    return {
      type: 'shoot',
      prompt: '找到「' + correct + '」来射击错字兽!',
      options: options,
      correct: correct,
      correctIndex: options.indexOf(correct),
    };
  }

  // === Boss造句题 ===
  generateSentenceQuiz(word) {
    const prompts = {
      '美': { correct: '美丽', options: ['美丽','美国','美好','美化'] },
      '大': { correct: '大山', options: ['大山','大小','大人','大方'] },
      '小': { correct: '小心', options: ['小心','小草','小鸟','小溪'] },
      '好': { correct: '好人', options: ['好人','好学','好心','好处'] },
      '火': { correct: '火车', options: ['火车','大火','火光','火苗'] },
    };
    const q = prompts[word] || { correct: word, options: [word, this.pickRandom(2, this.wordBank), '?'] };
    return {
      type: 'sentence',
      prompt: '用「' + word + '」能组成什么词?',
      options: q.options,
      correct: q.correct,
      correctIndex: q.options.indexOf(q.correct),
    };
  }

  // === 答对处理 ===
  handleCorrect(char) {
    this.streak++;
    this.totalCorrect++;
    this.totalQuestions++;
    if (!this.learned.includes(char)) {
      this.learned.push(char);
      localStorage.setItem('pvz_learned', JSON.stringify(this.learned));
    }
    // 连击加成: 3连击双倍阳光, 7连击3倍
    const bonus = this.streak >= 7 ? 3 : this.streak >= 3 ? 2 : 1;
    if (this.onCorrect) this.onCorrect(char, bonus);
    return bonus;
  }

  // === 答错处理 ===
  handleWrong() {
    this.streak = 0;
    this.totalQuestions++;
    if (this.onWrong) this.onWrong();
  }

  // === 间隔复习: 优先出薄弱字 ===
  getReviewWords(count) {
    // 还没学会的字优先
    const unlearned = this.wordBank.filter(w => !this.learned.includes(w));
    const needReview = [...unlearned, ...this.pickRandom(Math.min(count, this.learned.length), this.learned)];
    return this.pickRandom(count, needReview);
  }

  // === 工具 ===
  pickRandom(n, arr) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, n);
  }

  getStats() {
    return {
      learned: this.learned.length,
      total: this.wordBank.length,
      accuracy: this.totalQuestions > 0 ? Math.round(this.totalCorrect / this.totalQuestions * 100) : 0,
      streak: this.streak,
    };
  }

  // === 动态难度调整 ===
  getDifficulty() {
    const accuracy = this.getStats().accuracy;
    if (accuracy > 90 && this.learned.length > 10) return 'hard';
    if (accuracy > 70) return 'normal';
    return 'easy';
  }

  getOptionsCount() {
    const d = this.getDifficulty();
    return d === 'easy' ? 2 : d === 'normal' ? 3 : 4;
  }
}