import pygame, json, math

class CharacterCard:
    def __init__(self, word_data, x, y, size=60):
        self.data = word_data
        self.x, self.y = x, y
        self.size = size
        self.mastery = word_data.get("mastery_level", 0)
        self.hover = False
        self.scale = 1.0
        self.anim_timer = 0

    def update(self, delta):
        if self.hover: self.scale = min(1.15, self.scale + 0.02)
        else: self.scale = max(1.0, self.scale - 0.02)
        self.anim_timer += delta

    def draw(self, screen, font, small_font):
        s = int(self.size * self.scale)
        cx, cy = self.x + s//2, self.y + s//2

        if self.mastery >= 4:
            color = (46, 204, 113)    # Green: mastered
            border = (39, 174, 96)
        elif self.mastery >= 2:
            color = (241, 196, 15)    # Yellow: learning
            border = (243, 156, 18)
        elif self.mastery >= 1:
            color = (230, 126, 34)    # Orange: started
            border = (211, 84, 0)
        else:
            color = (180, 180, 180)   # Gray: locked
            border = (140, 140, 140)

        # Card background
        pygame.draw.rect(screen, color, (self.x, self.y, s, s), border_radius=12)
        pygame.draw.rect(screen, border, (self.x, self.y, s, s), 3, border_radius=12)

        # Character
        char = self.data.get("character", "?")
        c_size = int(s * 0.5)
        try: c_font = pygame.font.SysFont("simhei", c_size)
        except: c_font = font
        c_surf = c_font.render(char, True, (255,255,255))
        screen.blit(c_surf, (cx - c_surf.get_width()//2, cy - c_surf.get_height()//2 - 5))

        # Pinyin below
        py_surf = small_font.render(self.data.get("pinyin",""), True, (255,255,255))
        screen.blit(py_surf, (cx - py_surf.get_width()//2, self.y + s - 22))

        # Mastery stars
        for i in range(5):
            star_x = self.x + 8 + i * 12
            star_y = self.y + s - 36
            star_color = (255, 215, 0) if i < self.mastery else (100, 100, 100)
            pygame.draw.circle(screen, star_color, (star_x, star_y), 4)

        # Lock for unlearned
        if self.mastery == 0:
            pygame.draw.rect(screen, (255,255,255,100), (self.x, self.y, s, s), border_radius=12)

    def contains(self, mx, my):
        s = int(self.size * self.scale)
        return self.x <= mx <= self.x + s and self.y <= my <= self.y + s


class GalleryScene:
    def __init__(self, screen, font, small_font, progress_tracker=None):
        self.screen = screen; self.font = font; self.small_font = small_font
        self.tracker = progress_tracker
        self.cards = []
        self.scroll_y = 0
        self.selected_card = None
        self.showing_detail = False
        self._build_grid()

    def _build_grid(self):
        self.cards.clear()
        if not self.tracker: return
        words = self.tracker.data.get("mastered", {})
        cols, row, size = 6, 0, 80
        margin_x, margin_y = 60, 20
        for i, (char, mastery) in enumerate(sorted(words.items())):
            col = i % cols
            if col == 0 and i > 0: row += 1
            x = margin_x + col * (size + 16)
            y = margin_y + row * (size + 20) - self.scroll_y
            card = CharacterCard(
                {"character": char, "mastery_level": mastery, "pinyin": ""},
                x, y, size
            )
            self.cards.append(card)

    def handle_click(self, mx, my):
        if self.showing_detail:
            self.showing_detail = False; self.selected_card = None; return

        for card in self.cards:
            if card.contains(mx, my):
                self.selected_card = card
                self.showing_detail = True
                return

    def handle_scroll(self, dy):
        self.scroll_y = max(0, self.scroll_y + dy)

    def update(self, delta):
        mx, my = pygame.mouse.get_pos()
        for card in self.cards:
            card.hover = card.contains(mx, my)
            card.update(delta)

    def draw(self):
        w, h = self.screen.get_size()

        # Title bar
        title = self.font.render("汉字图鉴 Character Gallery", True, (255,215,0))
        self.screen.blit(title, (w//2 - title.get_width()//2, 10))

        # Stats
        if self.tracker:
            stats = self.tracker.report()
            st = self.small_font.render(stats, True, (200,200,200))
            self.screen.blit(st, (w//2 - st.get_width()//2, 45))

        # Cards
        for card in self.cards:
            card.draw(self.screen, self.font, self.small_font)

        # Detail popup
        if self.showing_detail and self.selected_card:
            self._draw_detail(self.selected_card)

    def _draw_detail(self, card):
        w, h = 500, 400
        x, y = 250, 100
        # Overlay
        s = pygame.Surface((1000, 600), pygame.SRCALPHA)
        s.fill((0,0,0,180))
        self.screen.blit(s, (0,0))
        # Card
        pygame.draw.rect(self.screen, (30,30,40), (x, y, w, h), border_radius=20)
        pygame.draw.rect(self.screen, (100,100,120), (x, y, w, h), 2, border_radius=20)

        # Character big
        char = card.data.get("character", "?")
        try: big_font = pygame.font.SysFont("simhei", 80)
        except: big_font = self.font
        c_surf = big_font.render(char, True, (255,215,0))
        self.screen.blit(c_surf, (x + 60, y + 30))

        # Info
        info = [
            f"Pinyin: {card.data.get('pinyin','N/A')}",
            f"Radical: {card.data.get('radical','N/A')}",
            f"Strokes: {card.data.get('stroke_count','N/A')}",
            f"Mastery: {'*'*card.mastery}{'o'*(5-card.mastery)}/5",
            f"Family: {card.data.get('word_family','N/A')}",
        ]
        for i, line in enumerate(info):
            t = self.small_font.render(line, True, (200,200,200))
            self.screen.blit(t, (x + 180, y + 40 + i * 30))

        # Close button
        pygame.draw.rect(self.screen, (200,50,50), (x + w - 50, y + 10, 35, 35), border_radius=8)
        cls = self.font.render("X", True, (255,255,255))
        self.screen.blit(cls, (x + w - 40, y + 12))


print("GalleryScene + CharacterCard ready")
print("Usage: gallery = GalleryScene(screen, font, small_font, progress_tracker)")