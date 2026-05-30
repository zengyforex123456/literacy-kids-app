# 汉字学习系统 (Pygame)
import random, json, os

class ChineseWordSystem:
    def __init__(self):
        self.word_bank = list('山水火木人口手日月田力子女门车马虫鱼鸟王贝竹草土石金言目心禾米雨足走大小多少上下左右中')
        self.learned = self._load_learned()
        self.streak = 0
        self.total_correct = 0
        self.total_questions = 0

    def _load_learned(self):
        try:
            with open('learned.json','r',encoding='utf-8') as f:
                return json.load(f)
        except: return []

    def _save_learned(self):
        with open('learned.json','w',encoding='utf-8') as f:
            json.dump(self.learned, f, ensure_ascii=False)

    def generate_plant_quiz(self, plant_word):
        correct = plant_word
        others = [w for w in self.word_bank if w != correct]
        random.shuffle(others)
        options = [correct] + others[:3]
        random.shuffle(options)
        return {'type':'plant','prompt':'选「'+correct+'」召唤植物!','options':options,'correct':correct,'correct_idx':options.index(correct)}

    def generate_shoot_quiz(self, zombie_word):
        return self.generate_plant_quiz(zombie_word)

    def generate_sentence_quiz(self, word):
        prompts = {'美':{'correct':'美丽','options':['美丽','美国','美好','美化']},'大':{'correct':'大山','options':['大山','大小','大方','大人']},'小':{'correct':'小心','options':['小心','小草','小鸟','小溪']}}
        q = prompts.get(word, {'correct':word,'options':[word]+random.sample([w for w in self.word_bank if w!=word],3)})
        return {'type':'sentence','prompt':'用「'+word+'」组成什么词?','options':q['options'],'correct':q['correct'],'correct_idx':q['options'].index(q['correct'])}

    def handle_correct(self, char):
        self.streak += 1; self.total_correct += 1; self.total_questions += 1
        if char not in self.learned: self.learned.append(char); self._save_learned()
        bonus = 3 if self.streak >= 7 else 2 if self.streak >= 3 else 1
        return bonus

    def handle_wrong(self): self.streak = 0; self.total_questions += 1

    def get_review_words(self, count):
        unlearned = [w for w in self.word_bank if w not in self.learned]
        return random.sample(unlearned + random.sample(self.learned, min(count, len(self.learned))), count)

    def get_stats(self):
        return {'learned':len(self.learned),'total':len(self.word_bank),'accuracy':int(self.total_correct/self.total_questions*100) if self.total_questions>0 else 0,'streak':self.streak}

    def get_difficulty(self):
        acc = self.get_stats()['accuracy']
        if acc > 90 and len(self.learned) > 10: return 'hard'
        if acc > 70: return 'normal'
        return 'easy'

    def get_options_count(self):
        d = self.get_difficulty()
        return 2 if d == 'easy' else 3 if d == 'normal' else 4