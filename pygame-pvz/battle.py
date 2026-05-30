# Pygame 战斗系统扩展 - 子弹/碰撞/阳光/失败条件
import pygame, random, math

class Bullet:
    def __init__(self, x, y, row, damage, target=None):
        self.x=x; self.y=y; self.row=row; self.damage=damage; self.target=target; self.alive=True

    def update(self, delta):
        if self.target and self.target.alive:
            dx=self.target.x-self.x; dy=(self.target.y-20)-self.y
            dist=math.sqrt(dx*dx+dy*dy)
            if dist<30:self.target.take_damage(self.damage);self.alive=False;return
            self.x+=dx/dist*4;self.y+=dy/dist*4
        else:self.x+=4
        if self.x>1000:self.alive=False

class Sun:
    def __init__(self, x, y):self.x=x;self.y=y;self.alive=True;self.timer=0;self.target_y=y+40
    def update(self, delta):
        self.timer+=delta
        if self.timer<500:self.y-=0.5
        elif self.timer>5000:self.y+=1;if self.y>700:self.alive=False
    def draw(self, screen):pygame.draw.circle(screen,(255,215,0),(int(self.x),int(self.y)),15);pygame.draw.circle(screen,(255,255,0),(int(self.x),int(self.y)),10)
    def clicked(self, mx, my):return abs(mx-self.x)<20 and abs(my-self.y)<20

class BattleSystem:
    def __init__(self, game):
        self.game=game
        self.plants=[];self.zombies=[];self.bullets=[];self.suns=[]
        self.wave=1;self.zombies_to_spawn=0;self.zombie_timer=0;self.spawn_interval=5000
        self.sun_timer=0;self.sun_interval=8000
        self.grid=[[None for _ in range(9)] for _ in range(5)]
        self.score=0;self.game_over=False;self.won=False
        self.words='山水火木人口手日月田力子女门车马虫鱼鸟'.split('')

    def spawn_zombie(self):
        row=random.randint(0,4);word=self.words[self.wave%len(self.words)]
        from entities import create_zombie
        z=create_zombie('basic' if self.wave<=5 else 'cone',row,word)
        self.zombies.append(z)
        self.zombies_to_spawn-=1
        if self.wave%5==0 and self.zombies_to_spawn==0:
            from entities import create_zombie
            self.zombies.append(create_zombie('boss',2,'造句'))

    def place_plant(self, row, col, plant_type, game):
        if self.grid[row][col] is not None: return False
        from entities import create_plant
        p=create_plant(plant_type, row, col)
        if game.sun>=p.config['cost']:
            game.sun-=p.config['cost'];self.plants.append(p);self.grid[row][col]=p;return True
        return False

    def update(self, delta, game):
        if self.game_over: return
        now=pygame.time.get_ticks()

        # Spawn zombies
        if self.zombies_to_spawn<=0 and len(self.zombies)==0:
            self.wave+=1;self.zombies_to_spawn=3+self.wave
        self.zombie_timer+=delta
        if self.zombie_timer>=self.spawn_interval and self.zombies_to_spawn>0:
            self.zombie_timer=0;self.spawn_zombie()

        # Spawn suns
        self.sun_timer+=delta
        if self.sun_timer>=self.sun_interval:
            self.sun_timer=0;self.suns.append(Sun(random.randint(100,900),0))

        # Update plants
        for p in self.plants:
            if not p.alive: continue
            p.update(delta, self.bullets if hasattr(p,'config') and p.config.get('damage',0)>0 else game)

        # Update bullets
        for b in self.bullets[:]:
            b.update(delta)
            if not b.alive: self.bullets.remove(b)

        # Update zombies
        for z in self.zombies[:]:
            if not z.alive: self.zombies.remove(z);self.score+=10;game.sun+=25;continue
            z.update(delta)
            # Check plant collision
            col=z.get_col()
            if 0<=col<9 and self.grid[z.row][col]:
                if hasattr(self.grid[z.row][col],'alive') and self.grid[z.row][col].alive:
                    z.speed=0
                    self.grid[z.row][col].take_damage(z.damage*delta/1000)
                    if not self.grid[z.row][col].alive: self.grid[z.row][col]=None;z.speed=z.config['speed']
                else: z.speed=z.config['speed']
            # Game over: zombie reached house
            if z.x<30: self.game_over=True

        # Update suns
        for s in self.suns[:]:
            s.update(delta)
            if not s.alive: self.suns.remove(s)

        # Win condition
        if len(self.zombies)==0 and self.zombies_to_spawn<=0 and self.wave>3: self.won=True

    def click_sun(self, mx, my):
        for s in self.suns[:]:
            if s.clicked(mx,my):self.suns.remove(s);self.game.sun+=25;return True
        return False

    def draw(self, screen, font, small_font):
        for p in self.plants:
            if p.alive: p.draw(screen, font)
        for z in self.zombies:
            if z.alive: z.draw(screen, small_font)
        for s in self.suns:
            if s.alive: s.draw(screen)
        for b in self.bullets:
            if b.alive: pygame.draw.circle(screen,(0,255,0),(int(b.x),int(b.y)),5)