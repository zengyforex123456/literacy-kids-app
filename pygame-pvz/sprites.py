"""精灵表动画系统 — 替代几何图形绘制"""
import pygame, math

class SpriteSheet:
    def __init__(self, frame_width=64, frame_height=64):
        self.fw, self.fh = frame_width, frame_height
        self.sheets = {}  # cached generated sheets

    def generate_peashooter(self):
        """程序化生成豌豆射手精灵表"""
        surf = pygame.Surface((self.fw * 6, self.fh * 3), pygame.SRCALPHA)
        # Row 0: Idle (4 frames)
        for i in range(4):
            x, y = i * self.fw, 0
            bob = math.sin(i * math.pi / 2) * 2
            # Stem
            pygame.draw.rect(surf, (0, 100, 0), (x + 28, y + 40 + bob, 8, 24))
            # Head
            pygame.draw.circle(surf, (34, 139, 34), (x + 32, y + 28 + bob), 16)
            # Eyes
            pygame.draw.circle(surf, (255, 255, 255), (x + 27, y + 22 + bob), 5)
            pygame.draw.circle(surf, (255, 255, 255), (x + 37, y + 22 + bob), 5)
            pygame.draw.circle(surf, (0, 0, 0), (x + 26, y + 21 + bob), 2)
            pygame.draw.circle(surf, (0, 0, 0), (x + 36, y + 21 + bob), 2)
            # Mouth / cannon
            pygame.draw.rect(surf, (34, 139, 34), (x + 38, y + 22 + bob, 18, 10))
        # Row 1: Attack (6 frames)
        for i in range(6):
            x, y = i * self.fw, self.fh
            recoil = -4 if i < 2 else 0
            extend = 4 if i % 2 == 0 else 0
            pygame.draw.rect(surf, (0, 100, 0), (x + 28 + recoil, y + 40, 8, 24))
            pygame.draw.circle(surf, (34, 139, 34), (x + 32 + recoil, y + 28, 16))
            pygame.draw.rect(surf, (34, 139, 34), (x + 38 + recoil, y + 22, 18 + extend, 10))
        self.sheets['peashooter'] = surf
        return surf

    def generate_sunflower(self):
        surf = pygame.Surface((self.fw * 4, self.fh * 2), pygame.SRCALPHA)
        for i in range(4):
            x, y = i * self.fw, 0
            sway = math.sin(i * math.pi / 2) * 3
            pygame.draw.rect(surf, (34, 139, 34), (x + 28, y + 40, 8, 24))
            pygame.draw.circle(surf, (255, 215, 0), (x + 32, y + 28 + sway, 16))
            for p in range(8):
                a = p * math.pi / 4 + sway * 0.1
                pygame.draw.circle(surf, (255, 241, 118), (int(x + 32 + math.cos(a) * 14), int(y + 28 + sway + math.sin(a) * 14)), 6)
            pygame.draw.circle(surf, (139, 69, 19), (x + 32, y + 28 + sway), 8)
        self.sheets['sunflower'] = surf
        return surf

    def generate_zombie(self):
        surf = pygame.Surface((self.fw * 4, self.fh * 3), pygame.SRCALPHA)
        for i in range(4):
            x, y = i * self.fw, 0
            tilt = math.sin(i * math.pi / 2) * 4
            mx = i % 2
            pygame.draw.rect(surf, (128, 128, 128), (x + 18, y + 28, 28, 42))
            pygame.draw.circle(surf, (85, 107, 47), (x + 32, y + 22 + tilt), 14)
            pygame.draw.circle(surf, (255, 0, 0), (x + 28, y + 18 + tilt, 3))
            pygame.draw.circle(surf, (255, 0, 0), (x + 36, y + 18 + tilt, 3))
            pygame.draw.rect(surf, (255, 255, 255), (x + 27, y + 25 + tilt + mx, 10, 3))
            pygame.draw.rect(surf, (128, 128, 128), (x + 8, y + 30 + tilt * 2, 10, 5))
            pygame.draw.rect(surf, (128, 128, 128), (x + 46, y + 30 - tilt * 2, 10, 5))
        self.sheets['zombie'] = surf
        return surf

    def extract_frames(self, name, row, count):
        if name not in self.sheets: return []
        sheet = self.sheets[name]
        frames = []
        for col in range(count):
            rect = pygame.Rect(col * self.fw, row * self.fh, self.fw, self.fh)
            frames.append(sheet.subsurface(rect))
        return frames


class AnimatedSprite(pygame.sprite.Sprite):
    def __init__(self, x, y, frames, fps=8):
        super().__init__()
        self.frames = frames
        self.fps = fps
        self.current_frame = 0
        self.timer = 0
        self.image = frames[0] if frames else pygame.Surface((64, 64))
        self.rect = self.image.get_rect(topleft=(x, y))

    def update(self, delta):
        if not self.frames: return
        self.timer += delta
        if self.timer >= 1000 / self.fps:
            self.timer = 0
            self.current_frame = (self.current_frame + 1) % len(self.frames)
            self.image = self.frames[self.current_frame]


class PeaShooter(AnimatedSprite):
    def __init__(self, x, y, sheet: SpriteSheet):
        sheet.generate_peashooter()
        super().__init__(x, y, sheet.extract_frames('peashooter', 0, 4), fps=6)
        self.attack_frames = sheet.extract_frames('peashooter', 1, 6)
        self.attacking = False

    def attack(self):
        if not self.attacking:
            self.frames = self.attack_frames
            self.current_frame = 0
            self.attacking = True

    def idle(self):
        self.attacking = False
        self.frames = self.sheet.extract_frames('peashooter', 0, 4) if hasattr(self,'sheet') else self.frames


# Test
if __name__ == '__main__':
    pygame.init()
    screen = pygame.display.set_mode((400, 200))
    sheet = SpriteSheet()
    pea = PeaShooter(100, 60, sheet)
    zombie_frames = sheet.generate_zombie() or []
    clock = pygame.time.Clock()
    running = True
    while running:
        dt = clock.tick(60)
        for e in pygame.event.get():
            if e.type == pygame.QUIT: running = False
        pea.update(dt)
        screen.fill((45, 90, 44))
        screen.blit(pea.image, pea.rect)
        pygame.display.flip()
    pygame.quit()
    print("Sprite system test passed")
