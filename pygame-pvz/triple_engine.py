"""WordFamily + ReviewScheduler + ProgressTracker — 三合一引擎"""
import json, os
from collections import defaultdict
from datetime import datetime, timedelta

# ===== WordFamilyManager =====
class WordFamilyManager:
    def __init__(self, path=None):
        self.words=[];self._by_char={};self._by_radical=defaultdict(list);self._by_phonetic=defaultdict(list)
        self._roots={}
        if path and os.path.exists(path): self.load(path)
    def load(self,path):
        with open(path,encoding="utf-8") as f:d=json.load(f);self.words=d if isinstance(d,list) else [];self._index();return len(self.words)
    def load_list(self,lst):self.words=lst;self._index();return len(self.words)
    def _index(self):
        self._by_char.clear();self._by_radical.clear();self._by_phonetic.clear()
        self._roots={k:list(v) for k,v in {"青":"清晴睛情蜻请精静猜","包":"抱跑炮泡饱苞胞雹","方":"放房防访仿芳妨纺","工":"功攻贡红虹江空巩","可":"何河呵苛柯阿哥歌","白":"百拍怕帕伯迫泊魄","艮":"根跟很恨狠恳垦痕","各":"格客路洛落略络骆","且":"组祖阻租助粗宜谊","乔":"桥轿侨娇骄矫荞","肖":"消销削宵逍霄悄哨","元":"远院园完玩顽阮","胡":"湖糊蝴胡葫瑚煳","古":"故估姑固苦枯湖胡","丁":"打订叮盯钉顶厅灯","寸":"村对过时讨付射封","分":"份粉纷芬汾盆盼颁","羊":"样洋氧养痒详祥翔","马":"妈吗码骂蚂玛犸"}.items()}
        for w in self.words:
            ch=w.get("character","");self._by_char[ch]=w
            rad=w.get("radical","")
            if rad:self._by_radical[rad].append(ch)
            for root,fam in self._roots.items():
                if ch in fam:self._by_phonetic[root].append(ch)
    def family(self,root):
        if root in self._roots:return sorted(set(self._roots[root]))
        if root in self._by_radical:return sorted(set(self._by_radical[root]))
        return sorted(set(c for c in self._by_char if root in c and c!=root))
    def path(self,word,depth=2):
        root=None
        for r,fam in self._roots.items():
            if word in fam or word==r:root=r;break
        fam=self.family(root) if root else self.family(word)
        s=sorted([c for c in fam if self._st(c)<=8],key=lambda x:self._freq(x))
        a=sorted([c for c in fam if self._st(c)>8],key=lambda x:self._freq(x))
        p=[root] if root and root!=word else [];p.extend(s[:depth*2]);p.extend(a[:depth])
        if word not in p:p.append(word)
        return list(dict.fromkeys(p))
    def confusable(self,word):
        r=[]
        for root,fam in self._roots.items():
            if word in fam:r.extend(fam);break
        rad=self._by_char.get(word,{}).get("radical","")
        if rad:r.extend(self._by_radical.get(rad,[]))
        st=self._st(word)
        for ch in self._by_char:
            if ch!=word and abs(self._st(ch)-st)<=2:
                if any(c in ch for c in word) or any(c in word for c in ch):r.append(ch)
        return [c for c in list(dict.fromkeys(r)) if c!=word][:8]
    def suggest(self,mastered,count=5):
        ms=set(mastered);c=defaultdict(int)
        for w in mastered:
            for ch in self.family(w):
                if ch not in ms:c[ch]+=2
            for ch in self.confusable(w):
                if ch not in ms:c[ch]+=1
        return [x for x,_ in sorted(c.items(),key=lambda x:(-x[1],self._freq(x[0])))][:count]
    def tree(self):
        t={}
        for root,fam in self._roots.items():
            b=defaultdict(list)
            for ch in fam:
                rad=self._by_char.get(ch,{}).get("radical","other");b[rad].append(ch)
            t[root]={"size":len(fam),"branches":{r:sorted(c) for r,c in b.items()}}
        return t
    def export(self,path):
        with open(path,"w",encoding="utf-8") as f:json.dump(self.tree(),f,ensure_ascii=False,indent=2)
    def plan(self,target=50,mastered=None):
        mastered=mastered or [];p=list(mastered)
        while len(p)<target+len(mastered):
            s=self.suggest(p,5)
            if not s:break
            for c in s:
                if c not in p:p.append(c)
        return p[len(mastered):target+len(mastered)]
    def stats(self):
        return {"total":len(self.words),"roots":len(self._roots),"radicals":len(self._by_radical)}
    def _st(self,ch):return self._by_char.get(ch,{}).get("stroke_count",len(ch)*3)
    def _freq(self,ch):return self._by_char.get(ch,{}).get("frequency_rank",9999)

# ===== ReviewScheduler (SM-2) =====
class ReviewScheduler:
    def __init__(self,path="reviews.json"):self.path=path;self.data=self._load()
    def _load(self):
        if os.path.exists(self.path):
            with open(self.path,encoding="utf-8") as f:return json.load(f)
        return {}
    def save(self):
        with open(self.path,"w",encoding="utf-8") as f:json.dump(self.data,f,ensure_ascii=False,indent=2)
    def review(self,word,quality):
        w=self.data.get(word,{"rep":0,"int":1,"ef":2.5,"next":None,"history":[]})
        if quality>=3:w["int"]=1 if w["rep"]==0 else 3 if w["rep"]==1 else int(w["int"]*w["ef"]);w["rep"]+=1
        else:w["rep"]=0;w["int"]=1
        w["ef"]=max(1.3,w["ef"]+(0.1-(5-quality)*(0.08+(5-quality)*0.02)))
        w["next"]=(datetime.now()+timedelta(days=w["int"])).isoformat()
        w["last"]=datetime.now().isoformat()
        w["history"].append(quality)
        self.data[word]=w;self.save()
        return {"interval":w["int"],"next":w["next"],"ef":w["ef"]}
    def due(self):
        today=datetime.now().isoformat()[:10]
        return sorted([w for w,d in self.data.items() if d.get("next","")[:10]<=today],key=lambda x:self.data[x].get("next",""))
    def daily(self,bank,n=5):
        due=self.due();learned=set(self.data.keys());new=[c for c in bank if c not in learned][:n-len(due)]
        return (due+new)[:n]
    def stats(self):
        d=len(self.due());return {"total":len(self.data),"due":d,"mastered":sum(1 for v in self.data.values() if v["rep"]>=4)}
    def migrate(self,old_path):
        if os.path.exists(old_path):
            with open(old_path,encoding="utf-8") as f:self.data.update(json.load(f));self.save()

# ===== ProgressTracker =====
class ProgressTracker:
    def __init__(self,path="progress.json"):self.path=path;self.data=self._load()
    def _load(self):
        if os.path.exists(self.path):
            with open(self.path,encoding="utf-8") as f:return json.load(f)
        return {"mastered":{},"history":[],"levels":[],"coins":0,"streak":0}
    def save(self):
        with open(self.path,"w",encoding="utf-8") as f:json.dump(self.data,f,ensure_ascii=False,indent=2)
    def record(self,lid,words,scores):
        for w,s in zip(words,scores):
            old=self.data["mastered"].get(w,0);self.data["mastered"][w]=min(5,old+(1 if s>0.6 else 0))
        self.data["history"].append({"level":lid,"words":words,"scores":scores,"time":datetime.now().isoformat()})
        if lid not in self.data["levels"]:self.data["levels"].append(lid)
        self.save()
    def mastery(self,w):return self.data["mastered"].get(w,0)
    def next_level(self):return max(self.data["levels"])+1 if self.data["levels"] else 1
    def weakest(self,n=10):
        return sorted([(w,m) for w,m in self.data["mastered"].items() if m<3],key=lambda x:x[1])[:n]
    def report(self):
        h=self.data["history"]
        if not h:return "No data"
        t=len(self.data["mastered"]);m=sum(1 for v in self.data["mastered"].values() if v>=4)
        today=sum(1 for r in h if r["time"][:10]==datetime.now().isoformat()[:10])
        return f"Total:{t} Mastered:{m} Today:{today}"
    def recommend(self,mgr,count=10):
        m=[w for w,v in self.data["mastered"].items() if v>=3]
        d=[w for w,v in self.data["mastered"].items() if v<2]
        s=mgr.suggest(m,count-len(d)) if m else []
        return (d+s)[:count]
    def export(self):
        return {"mastered":self.data["mastered"],"levels_done":len(self.data["levels"]),"history_len":len(self.data["history"]),"coins":self.data["coins"]}
    def predict_completion(self,total=2500):
        h=self.data["history"]
        if len(h)<3:return None
        d1=datetime.fromisoformat(h[0]["time"]);d2=datetime.fromisoformat(h[-1]["time"])
        days=(d2-d1).days or 1
        rate=len(self.data["mastered"])/days
        remaining=total-len(self.data["mastered"])
        days_left=int(remaining/rate) if rate>0 else 999
        return {"rate":round(rate,1),"remaining":remaining,"days":days_left,"date":(datetime.now()+timedelta(days=days_left)).strftime("%Y-%m-%d")}