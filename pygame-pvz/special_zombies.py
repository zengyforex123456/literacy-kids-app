import pygame, random
from entities import Zombie, Plant

# ===== 字族错字兽 =====
class WordFamilyZombie(Zombie):
    def __init__(self, row, word_family="青", config_override=None):
        config = config_override or {
            "name": f"字族兽-{word_family}",
            "hp": 150, "speed": 0.2, "damage": 15,
            "color": (100, 100, 200), "word": word_family,
        }
        super().__init__(row, config)
        self.word_family = word_family
        self.display_words = self._get_family_words(word_family)
        self.current_word = self.display_words[0]
        self.word_timer = 0
        self.word_interval = 3000  # 3秒换一次字

    def _get_family_words(self, root):
        families = {
            "青": ["清","晴","睛","情","请"],
            "包": ["抱","跑","炮","泡","饱"],
            "方": ["放","房","防","访","仿"],
            "工": ["功","攻","红","虹","江"],
            "可": ["何","河","呵","哥","歌"],
            "白": ["百","拍","怕","伯","迫"],
        }
        return families.get(root, [root, root+"子", root+"儿"])

    def update(self, delta):
        super().update(delta)
        self.word_timer += delta
        if self.word_timer >= self.word_interval:
            self.word_timer = 0
            self.current_word = random.choice(self.display_words)
            self.config["word"] = self.current_word  # Update displayed word

    def draw(self, screen, font):
        super().draw(screen, font)
        # Extra visual: color indicator for word family
        x, y = int(self.x), int(self.y)
        pygame.draw.circle(screen, (255,255,0), (x, y-45), 8, 2)

# ===== 限时错字兽 =====
class TimedZombie(Zombie):
    def __init__(self, row, word="急", config_override=None):
        config = config_override or {
            "name": "限时兽", "hp": 100, "speed": 0.4,
            "damage": 10, "color": (255, 100, 50), "word": word,
        }
        super().__init__(row, config)
        self.time_limit = 5000  # 5 seconds
        self.timer = 0
        self.accelerated = False

    def update(self, delta):
        super().update(delta)
        self.timer += delta
        if self.timer >= self.time_limit and not self.accelerated:
            self.accelerated = True
            self.speed *= 2  # Double speed after time limit
            self.config["color"] = (255, 0, 0)  # Turn red

# ===== Boss错字王 =====
class BossZombie(Zombie):
    def __init__(self, row, word="造句"):
        config = {"name":"Boss错字王","hp":500,"speed":0.1,"damage":50,"color":(200,0,0),"word":word}
        super().__init__(row, config)
        self.questions = [
            {"q":"用「好」造句子","a":"好","options":["好人","好学","好坏","好处"]},
            {"q":"用「花」说句话","a":"花","options":["花园","花朵","开花","鲜花"]},
            {"q":"「学」可以组什么词","a":"学","options":["学习","学校","上学","同学"]},
        ]
        self.current_q = 0
        self.answered = 0

    def get_question(self):
        if self.current_q < len(self.questions):
            return self.questions[self.current_q]
        return None

    def answer(self, correct):
        if correct:
            self.answered += 1
            self.hp -= 100
            self.current_q += 1
            return True
        return False

    def is_defeated(self):
        return self.answered >= len(self.questions) or self.hp <= 0


# ===== 汉字射击机制 =====
class ChineseShootingMechanism:
    def __init__(self, screen, font):
        self.screen = screen
        self.font = font
        self.active = False
        self.correct_word = ""
        self.options = []
        self.selected = -1
        self.feedback = ""
        self.feedback_timer = 0
        self.word_bank = "山水火木人口手日月田力子女门车马虫鱼鸟".split()

    def show_options(self, correct_word):
        self.active = True
        self.correct_word = correct_word
        self.selected = -1
        self.feedback = ""
        # Generate 4 options including the correct one
        others = [w for w in self.word_bank if w != correct_word]
        random.shuffle(others)
        self.options = [correct_word] + others[:3]
        random.shuffle(self.options)

    def handle_click(self, mx, my):
        if not self.active: return None
        # Check if any option button was clicked
        for i, opt in enumerate(self.options):
            bx = 350 + i * 90
            by = 320
            if bx <= mx <= bx + 70 and by <= my <= by + 70:
                self.selected = i
                return opt
        return None

    def check_hit(self, selected_char, zombie):
        if selected_char == self.correct_word:
            zombie.take_damage(25)
            self.feedback = "Correct!"
            self.active = False
            return True
        else:
            self.feedback = "Try again!"
            return False

    def draw(self):
        if not self.active: return
        # Semi-transparent overlay
        s = pygame.Surface((1000, 600), pygame.SRCALPHA)
        s.fill((0, 0, 0, 180))
        self.screen.blit(s, (0, 0))

        # Question text
        q_text = self.font.render(f"Select: {self.correct_word}", True, (255, 215, 0))
        self.screen.blit(q_text, (500 - q_text.get_width()//2, 240))

        # Option buttons
        for i, opt in enumerate(self.options):
            bx = 350 + i * 90
            by = 320
            color = (100, 100, 100)
            if self.selected == i:
                color = (0, 200, 0) if opt == self.correct_word else (200, 0, 0)
            pygame.draw.rect(self.screen, color, (bx, by, 70, 70), border_radius=10)
            pygame.draw.rect(self.screen, (255, 255, 255), (bx, by, 70, 70), 2, border_radius=10)
            txt = self.font.render(opt, True, (255, 255, 255))
            self.screen.blit(txt, (bx + 35 - txt.get_width()//2, by + 25))

        # Feedback
        if self.feedback:
            fb_color = (0, 255, 0) if self.feedback == "Correct!" else (255, 100, 100)
            fb_text = self.font.render(self.feedback, True, fb_color)
            self.screen.blit(fb_text, (500 - fb_text.get_width()//2, 420))


# ===== 游戏主循环集成示例 =====
def integrate_with_game(game):
    """集成到现有游戏主循环"""
    # Initialize
    shooting = ChineseShootingMechanism(game.screen, game.font)

    # In game.update():
    def update_integrated(delta):
        # Update all zombies
        for z in game.battle.zombies:
            z.update(delta)
            # Check if zombie reached a plant
            col = z.get_col()
            if 0 <= col < 9 and game.battle.grid[z.row][col]:
                z.speed = 0
                game.battle.grid[z.row][col].take_damage(z.damage * delta / 1000)
                if not game.battle.grid[z.row][col].alive:
                    game.battle.grid[z.row][col] = None
                    z.speed = z.config.get("speed", 0.3)
            # Check if zombie reached house
            if z.x < 30:
                game.battle.game_over = True

        # Special zombie interactions
        for z in game.battle.zombies:
            if isinstance(z, WordFamilyZombie):
                # Show shooting quiz when WordFamilyZombie enters screen
                if 200 < z.x < 700 and not shooting.active:
                    shooting.show_options(z.current_word)

    # In game.draw():
    def draw_integrated():
        for z in game.battle.zombies:
            if z.alive:
                z.draw(game.screen, game.small_font)
        for p in game.battle.plants:
            if p.alive:
                p.draw(game.screen, game.font)
        for b in game.battle.bullets:
            if b.get("alive", True):
                pygame.draw.circle(game.screen, (0, 255, 0), (int(b["x"]), int(b["y"])), 5)
        shooting.draw()

    # In game.handle_events():
    def handle_click_integrated(pos):
        mx, my = pos
        # Check quiz clicks
        if shooting.active:
            selected = shooting.handle_click(mx, my)
            if selected:
                for z in game.battle.zombies:
                    if isinstance(z, WordFamilyZombie) and z.current_word == shooting.correct_word:
                        shooting.check_hit(selected, z)
                        break

    return update_integrated, draw_integrated, handle_click_integrated

print("SpecialZombie + ShootingMechanism module ready")
print("Classes: WordFamilyZombie, TimedZombie, BossZombie, ChineseShootingMechanism")