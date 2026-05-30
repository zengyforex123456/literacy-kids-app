import pygame

class Plant:
    def __init__(self,row,col,config):
        self.row=row;self.col=col;self.config=config
        self.hp=config['hp'];self.max_hp=config['hp'];self.fire_timer=0;self.alive=True
        self.x=80+col*90+45;self.y=70+row*100+50
    def draw(self,screen,font):
        c=self.config['color']
        pygame.draw.rect(screen,(0,100,0),(self.x-4,self.y+8,8,28))
        pygame.draw.circle(screen,c,(self.x,self.y-3),18)
        pygame.draw.circle(screen,(255,255,255),(self.x-6,self.y-9),5)
        pygame.draw.circle(screen,(255,255,255),(self.x+6,self.y-9),5)
        pygame.draw.circle(screen,(0,0,0),(self.x-5,self.y-10),2)
        pygame.draw.circle(screen,(0,0,0),(self.x+5,self.y-10),2)
        pygame.draw.rect(screen,c,(self.x+7,self.y-11,20,12))
        w=font.render(self.config['word'],True,(255,215,0))
        screen.blit(w,(self.x-w.get_width()//2,self.y+38))
    def update(self,delta):self.fire_timer+=delta
    def can_fire(self):
        if self.fire_timer>=self.config['fire_rate']:self.fire_timer=0;return True
        return False
    def take_damage(self,a):self.hp-=a;if self.hp<=0:self.alive=False

class Peashooter(Plant):
    def __init__(self,r,c):super().__init__(r,c,{'name':'豌豆射手','word':'豌','cost':50,'hp':300,'color':(34,139,34),'fire_rate':1200,'damage':25})
    def update(self,delta,bullets):
        super().update(delta)
        if self.can_fire():bullets.append({'x':self.x+22,'y':self.y-10,'row':self.row,'damage':self.config['damage']})

class Sunflower(Plant):
    def __init__(self,r,c):super().__init__(r,c,{'name':'向日葵','word':'日','cost':50,'hp':100,'color':(255,215,0),'fire_rate':5000,'damage':0})
    def update(self,delta,game):super().update(delta);game.sun+=25 if self.can_fire() else 0

class WallNut(Plant):
    def __init__(self,r,c):super().__init__(r,c,{'name':'坚果墙','word':'坚','cost':50,'hp':800,'color':(139,69,19),'fire_rate':99999,'damage':0})
    def draw(self,screen,font):
        c=self.config['color']
        pygame.draw.circle(screen,c,(self.x,self.y),22)
        pygame.draw.circle(screen,(160,82,45),(self.x-5,self.y-5),8)
        pygame.draw.circle(screen,(160,82,45),(self.x+5,self.y-5),8)
        pygame.draw.circle(screen,(0,0,0),(self.x-4,self.y-6),3)
        pygame.draw.circle(screen,(0,0,0),(self.x+4,self.y-6),3)
        pygame.draw.rect(screen,(255,255,255),(self.x-4,self.y+2,8,3))
        w=font.render(self.config['word'],True,(255,215,0))
        screen.blit(w,(self.x-w.get_width()//2,self.y+35))

class Zombie:
    def __init__(self,row,config):
        self.row=row;self.config=config;self.hp=config['hp'];self.max_hp=config['hp']
        self.speed=config['speed'];self.damage=config['damage'];self.x=940
        self.y=70+row*100+50;self.alive=True
    def draw(self,screen,font):
        c=self.config['color'];x,y=int(self.x),int(self.y)
        pygame.draw.rect(screen,c,(x-15,y-10,30,50))
        pygame.draw.circle(screen,(85,107,47),(x,y-20),14)
        pygame.draw.circle(screen,(255,0,0),(x-4,y-25),3)
        pygame.draw.circle(screen,(255,0,0),(x+4,y-25),3)
        pygame.draw.rect(screen,(255,255,255),(x-5,y-18,10,3))
        pygame.draw.rect(screen,c,(x-25,y,12,6));pygame.draw.rect(screen,c,(x+13,y,12,6))
        bar_w=int(30*(self.hp/self.max_hp))
        pygame.draw.rect(screen,(255,0,0),(x-15,y-54,30,4))
        pygame.draw.rect(screen,(0,255,0),(x-15,y-54,bar_w,4))
        w=font.render(self.config['word'],True,(255,255,255))
        screen.blit(w,(x-w.get_width()//2,y-48))
    def update(self,delta):
        if self.alive:self.x-=self.speed*delta/16
    def take_damage(self,a):self.hp-=a;if self.hp<=0:self.alive=False;return self.hp<=0
    def get_col(self):return int((self.x-80)/90)

def create_plant(n,r,c):return{'pea':Peashooter,'sun':Sunflower,'nut':WallNut}.get(n,Peashooter)(r,c)
def create_zombie(n,r,w):
    c={'basic':{'name':'错字兽','hp':100,'speed':0.3,'damage':20,'color':(128,128,128),'word':w},'cone':{'name':'路障','hp':200,'speed':0.25,'damage':25,'color':(160,82,45),'word':w},'boss':{'name':'Boss','hp':500,'speed':0.15,'damage':50,'color':(255,0,0),'word':w}}
    return Zombie(r,c.get(n,c['basic']))