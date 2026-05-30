import pygame, random

class ConfusableWordsBoss:
    def __init__(self, row=2, hp=600):
        self.row = row; self.x = 800; self.y = 70 + row * 100 + 50
        self.hp = hp; self.max_hp = hp; self.speed = 0.08; self.damage = 30
        self.alive = True; self.color = (180, 0, 30)

        # Confusable word sets
        self.word_sets = {
            "青": ["晴","睛","清","请","蜻","精","静"],
            "包": ["抱","跑","炮","泡","饱","苞"],
            "方": ["放","房","防","访","仿","芳"],
        }
        self.current_set = random.choice(list(self.word_sets.keys()))
        self.confusable = self.word_sets[self.current_set]
        self.current_question = None
        self.question_timer = 0
        self.question_interval = 8000
        self.questions_asked = 0
        self.questions_required = 4  # Need 4 correct answers

        # Question bank
        self._generate_questions()

    def _generate_questions(self):
        sentences = {
            "晴": ("今天天气真(   )朗", "晴"),
            "睛": ("保护眼(   )很重要", "睛"),
            "清": ("小河的水真(   )澈", "清"),
            "请": ("(   )你帮帮我好吗", "请"),
            "蜻": ("(   )蜓在水面上飞", "蜻"),
            "抱": ("妈妈(   )着宝宝", "抱"),
            "跑": ("小明在操场上(   )步", "跑"),
            "炮": ("过年放鞭(   )", "炮"),
            "泡": ("热水(   )脚很舒服", "泡"),
            "放": ("把书(   )在桌子上", "放"),
            "房": ("我家住在高楼(   )里", "房"),
            "防": ("冬天要(   )寒保暖", "防"),
        }
        self.questions = []
        for word in self.confusable:
            if word in sentences:
                self.questions.append(sentences[word])
        random.shuffle(self.questions)

    def get_question(self):
        if not self.questions: return None
        self.current_question = self.questions.pop(0)
        self.question_timer = 10000  # 10 second time limit
        # Generate options: correct + 3 distractors
        correct = self.current_question[1]
        distractors = [w for w in self.confusable if w != correct]
        random.shuffle(distractors)
        options = [correct] + distractors[:3]
        random.shuffle(options)
        return {
            "sentence": self.current_question[0],
            "correct": correct,
            "options": options,
            "time_limit": 10,
        }

    def take_damage(self, selected_word):
        if not self.current_question: return False
        correct = self.current_question[1]
        if selected_word == correct:
            self.hp -= 150
            self.questions_asked += 1
            return True
        return False

    def is_defeated(self):
        return (self.questions_asked >= self.questions_required) or (self.hp <= 0)

    def update(self, delta):
        if not self.alive: return
        self.x -= self.speed * delta / 16
        if self.current_question:
            self.question_timer -= delta
            if self.question_timer <= 0:
                self.current_question = None  # Time's up, move to next

    def draw(self, screen, font, small_font):
        if not self.alive: return
        x, y = int(self.x), int(self.y)

        # Body (larger than normal zombie)
        pygame.draw.rect(screen, self.color, (x-22, y-15, 44, 70))
        pygame.draw.circle(screen, (100, 0, 20), (x, y-25), 20)
        pygame.draw.circle(screen, (255, 0, 0), (x-6, y-32), 5)
        pygame.draw.circle(screen, (255, 0, 0), (x+6, y-32), 5)
        pygame.draw.rect(screen, (255, 255, 255), (x-8, y-22, 16, 4))
        # Crown
        pygame.draw.polygon(screen, (255, 215, 0), [(x-14, y-48), (x+14, y-48), (x, y-65)])

        # HP bar
        bar_w = int(60 * (self.hp / self.max_hp))
        pygame.draw.rect(screen, (255, 0, 0), (x-30, y-52, 60, 6))
        pygame.draw.rect(screen, (0, 255, 0), (x-30, y-52, bar_w, 6))

        # Boss name
        name = small_font.render("形近字BOSS-"+self.current_set+"字族", True, (255, 215, 0))
        screen.blit(name, (x - name.get_width()//2, y-75))

    def get_col(self):
        return int((self.x - 80) / 90)


class BossQuizUI:
    def __init__(self, screen, font, big_font):
        self.screen = screen; self.font = font; self.big_font = big_font
        self.active = False; self.question = None; self.selected = -1
        self.timer = 0; self.feedback = ""; self.feedback_timer = 0

    def show(self, q_data):
        self.active = True; self.question = q_data
        self.selected = -1; self.timer = q_data.get("time_limit", 10) * 1000
        self.feedback = ""

    def handle_click(self, mx, my):
        if not self.active or not self.question: return None
        opts = self.question["options"]
        for i, opt in enumerate(opts):
            bx = 220 + i * 150
            by = 380
            if bx <= mx <= bx + 120 and by <= my <= by + 60:
                self.selected = opt
                return opt
        return None

    def update(self, delta):
        if self.active and self.timer > 0:
            self.timer -= delta

    def draw(self):
        if not self.active or not self.question: return

        # Overlay
        s = pygame.Surface((1000, 600), pygame.SRCALPHA)
        s.fill((0, 0, 0, 200))
        self.screen.blit(s, (0, 0))

        # Sentence
        sent = self.question["sentence"]
        s_text = self.big_font.render(sent, True, (255, 255, 255))
        self.screen.blit(s_text, (500 - s_text.get_width()//2, 200))

        # Timer bar
        time_pct = max(0, self.timer / 10000)
        pygame.draw.rect(self.screen, (60, 60, 60), (300, 280, 400, 10), border_radius=5)
        bar_color = (0, 255, 0) if time_pct > 0.3 else (255, 100, 0) if time_pct > 0.1 else (255, 0, 0)
        pygame.draw.rect(self.screen, bar_color, (300, 280, int(400 * time_pct), 10), border_radius=5)
        time_text = self.font.render(f"{max(0, int(self.timer/1000))}s", True, (255, 255, 255))
        self.screen.blit(time_text, (720, 275))

        # Options
        opts = self.question["options"]
        for i, opt in enumerate(opts):
            bx = 220 + i * 150
            by = 350
            color = (80, 80, 80)
            if self.selected == opt:
                color = (0, 180, 0) if opt == self.question["correct"] else (200, 0, 0)
            pygame.draw.rect(self.screen, color, (bx, by, 120, 60), border_radius=12)
            pygame.draw.rect(self.screen, (255, 255, 255), (bx, by, 120, 60), 2, border_radius=12)
            txt = self.font.render(opt, True, (255, 255, 255))
            self.screen.blit(txt, (bx + 60 - txt.get_width()//2, by + 18))

        # Feedback
        if self.feedback:
            fb_color = (0, 255, 0) if "Correct" in self.feedback else (255, 100, 100)
            fb = self.big_font.render(self.feedback, True, fb_color)
            self.screen.blit(fb, (500 - fb.get_width()//2, 450))

print("ConfusableWordsBoss + BossQuizUI ready")