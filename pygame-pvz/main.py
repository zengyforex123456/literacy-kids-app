import pygame
import sys

# === 常量配置 (settings.py) ===
WIDTH, HEIGHT = 1000, 600
ROWS, COLS = 5, 9
CELL_W, CELL_H = 90, 100
START_X, START_Y = 80, 70
FPS = 60

# 颜色
GREEN = (45, 90, 44)
LIGHT_GREEN = (60, 120, 55)
DARK_GREEN = (30, 70, 30)
WHITE = (255, 255, 255)
GRAY = (100, 100, 100)
YELLOW = (255, 215, 0)
BROWN = (139, 69, 19)
BLACK = (0, 0, 0)

# === 游戏状态机 ===
class Game:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((WIDTH, HEIGHT))
        pygame.display.set_caption("汉字保卫战 - 植物大战僵尸")
        self.clock = pygame.time.Clock()
        self.state = "menu"  # menu → playing → paused
        self.running = True
        self.font = pygame.font.SysFont("simhei", 24)
        self.small_font = pygame.font.SysFont("simhei", 14)

    def run(self):
        while self.running:
            self.handle_events()
            self.update()
            self.draw()
            self.clock.tick(FPS)
        pygame.quit()
        sys.exit()

    # === 事件处理 ===
    def handle_events(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.running = False

            if self.state == "menu":
                if event.type == pygame.MOUSEBUTTONDOWN or event.type == pygame.KEYDOWN:
                    self.state = "playing"

            elif self.state == "playing":
                if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
                    self.state = "paused"
                elif event.type == pygame.MOUSEBUTTONDOWN:
                    self.handle_click(event.pos)

            elif self.state == "paused":
                if event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE:
                    self.state = "playing"

    # === 网格点击 ===
    def handle_click(self, pos):
        mx, my = pos
        col = (mx - START_X) // CELL_W
        row = (my - START_Y) // CELL_H
        if 0 <= row < ROWS and 0 <= col < COLS:
            print(f"Grid: row={row}, col={col}, pixel=({mx},{my})")
            self.last_click = (row, col)

    # === 更新 ===
    def update(self):
        pass

    # === 绘制 ===
    def draw(self):
        if self.state == "menu":
            self.draw_menu()
        elif self.state == "playing":
            self.draw_game()
        elif self.state == "paused":
            self.draw_game()
            self.draw_pause_overlay()
        pygame.display.flip()

    def draw_menu(self):
        self.screen.fill(DARK_GREEN)
        # Title
        title = self.font.render("汉字保卫战", True, YELLOW)
        self.screen.blit(title, (WIDTH//2 - title.get_width()//2, 180))

        subtitle = self.small_font.render("植物大战僵尸 - 用汉字击败错字兽", True, GRAY)
        self.screen.blit(subtitle, (WIDTH//2 - subtitle.get_width()//2, 230))

        hint = self.small_font.render("点击屏幕开始", True, WHITE)
        self.screen.blit(hint, (WIDTH//2 - hint.get_width()//2, 350))

    def draw_game(self):
        self.screen.fill(GREEN)

        # === 草地网格 ===
        for row in range(ROWS):
            for col in range(COLS):
                x = START_X + col * CELL_W
                y = START_Y + row * CELL_H
                # Cell background (alternating shades)
                color = LIGHT_GREEN if (row + col) % 2 == 0 else GREEN
                pygame.draw.rect(self.screen, color, (x, y, CELL_W, CELL_H))
                # Grid lines
                pygame.draw.rect(self.screen, DARK_GREEN, (x, y, CELL_W, CELL_H), 1)

        # === UI ===
        sun_text = self.font.render(f"阳光: 150", True, YELLOW)
        self.screen.blit(sun_text, (10, 10))

        wave_text = self.small_font.render("第 1 波", True, WHITE)
        self.screen.blit(wave_text, (10, 40))

        score_text = self.font.render("得分: 0", True, WHITE)
        self.screen.blit(score_text, (WIDTH - 150, 10))

        # === Plant Bar ===
        bar_y = HEIGHT - 70
        pygame.draw.rect(self.screen, BROWN, (0, bar_y - 10, WIDTH, 90))

        plants = [
            ("豌豆射手", "豌", 50),
            ("向日葵", "日", 50),
            ("坚果墙", "坚", 50),
            ("火爆辣椒", "火", 100),
        ]
        for i, (name, word, cost) in enumerate(plants):
            bx = 30 + i * 130
            by = bar_y
            pygame.draw.rect(self.screen, BLACK, (bx, by, 110, 55), border_radius=8)
            pygame.draw.rect(self.screen, GRAY, (bx, by, 110, 55), 2, border_radius=8)

            name_txt = self.small_font.render(name, True, WHITE)
            self.screen.blit(name_txt, (bx + 55 - name_txt.get_width()//2, by + 5))

            cost_txt = self.small_font.render(f"{word} ¥{cost}", True, YELLOW)
            self.screen.blit(cost_txt, (bx + 55 - cost_txt.get_width()//2, by + 30))

        # === Highlight last clicked cell ===
        if hasattr(self, 'last_click'):
            r, c = self.last_click
            x = START_X + c * CELL_W
            y = START_Y + r * CELL_H
            pygame.draw.rect(self.screen, YELLOW, (x, y, CELL_W, CELL_H), 3)

    def draw_pause_overlay(self):
        overlay = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
        overlay.fill((0, 0, 0, 180))
        self.screen.blit(overlay, (0, 0))

        pause_text = self.font.render("已暂停 - 按 ESC 继续", True, WHITE)
        self.screen.blit(pause_text, (WIDTH//2 - pause_text.get_width()//2, HEIGHT//2))


if __name__ == "__main__":
    game = Game()
    game.run()
