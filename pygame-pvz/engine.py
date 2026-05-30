import json, os
from collections import defaultdict
from datetime import datetime, timedelta

class ReviewScheduler:
    def __init__(self, path="review_state.json"):
        self.path = path; self.ef = 2.5; self.state = self._load()
    def _load(self):
        if os.path.exists(self.path):
            with open(self.path, encoding="utf-8") as f: return json.load(f)
        return {}
    def save(self):
        with open(self.path, "w", encoding="utf-8") as f: json.dump(self.state, f, ensure_ascii=False, indent=2)
    def schedule(self, word, quality):
        w = self.state.get(word, {"rep":0,"int":1,"ef":2.5,"next":None})
        w["int"] = 1 if quality < 3 else 1 if w["rep"]==0 else 3 if w["rep"]==1 else int(w["int"]*w["ef"])
        w["rep"] = w["rep"]+1 if quality>=3 else 0
        w["ef"] = max(1.3, w["ef"]+(0.1-(5-quality)*(0.08+(5-quality)*0.02)))
        w["next"] = (datetime.now()+timedelta(days=w["int"])).isoformat()
        self.state[word] = w; self.save()
        return w["int"]
    def get_due(self):
        today = datetime.now().isoformat()[:10]
        return sorted([w for w,d in self.state.items() if d["next"] and d["next"][:10]<=today], key=lambda x:self.state[x]["next"])
    def get_daily_quiz(self, bank, n=5):
        due = self.get_due()
        learned = set(self.state.keys())
        new = [c for c in bank if c not in learned][:n-len(due)]
        return (due+new)[:n]
    def stats(self):
        d = len(self.get_due())
        return {"total":len(self.state),"due":d,"mastered":sum(1 for w in self.state.values() if w["rep"]>=4)}

class LearningProgressTracker:
    def __init__(self, user_id="default", path="progress.json"):
        self.uid = user_id; self.path = path
        self.data = self._load()
    def _load(self):
        if os.path.exists(self.path):
            with open(self.path, encoding="utf-8") as f: return json.load(f)
        return {"mastered":{},"history":[],"levels_done":[],"coins":0,"streak":0}
    def save(self):
        with open(self.path, "w", encoding="utf-8") as f: json.dump(self.data, f, ensure_ascii=False, indent=2)
    def record(self, level_id, words, scores):
        for word, score in zip(words, scores):
            old = self.data["mastered"].get(word, 0)
            self.data["mastered"][word] = min(5, old + (1 if score>0.6 else 0))
        self.data["history"].append({"level":level_id,"words":words,"scores":scores,"time":datetime.now().isoformat()})
        if level_id not in self.data["levels_done"]:
            self.data["levels_done"].append(level_id)
        self.save()
    def mastery(self, word):
        return self.data["mastered"].get(word, 0)
    def next_level(self):
        return max(self.data["levels_done"])+1 if self.data["levels_done"] else 1
    def weakest(self, n=10):
        return sorted([(w,m) for w,m in self.data["mastered"].items() if m<3], key=lambda x:x[1])[:n]
    def report(self):
        h = self.data["history"]
        if not h: return "No data"
        total = len(self.data["mastered"])
        mastered = sum(1 for m in self.data["mastered"].values() if m>=4)
        today = sum(1 for r in h if r["time"][:10]==datetime.now().isoformat()[:10])
        return f"Total:{total} Mastered:{mastered} Today:{today} sessions"

class WordFamilyManager:
    def __init__(self, path=None):
        self.words = []; self._r = defaultdict(list); self._p = {}
        if path: self.load(path)
    def load(self, path):
        with open(path, encoding="utf-8") as f: data = json.load(f)
        self.words = data if isinstance(data, list) else []; self._build()
        return len(self.words)
    def load_from_list(self, lst):
        self.words = lst; self._build()
        return len(self.words)
    def _build(self):
        self._r.clear()
        self._p = {k:list(v) for k,v in {"青":"清晴睛情蜻请精静猜","包":"抱跑炮泡饱苞胞雹","方":"放房防访仿芳妨纺","工":"功攻贡红虹江空巩","可":"何河呵苛柯阿哥歌","白":"百拍怕帕伯迫泊魄","艮":"根跟很恨狠恳垦痕","各":"格客路洛落略络骆","且":"组祖阻租助粗宜谊","乔":"桥轿侨娇骄矫荞","肖":"消销削宵逍霄悄哨","元":"远院园完玩顽阮","胡":"湖糊蝴胡葫瑚煳","古":"故估姑固苦枯湖胡","丁":"打订叮盯钉顶厅灯","寸":"村对过时讨付射封","分":"份粉纷芬汾盆盼颁","羊":"样洋氧养痒详祥翔","马":"妈吗码骂蚂玛犸"}.items()}
        for w in self.words:
            r = w.get("radical","")
            if r: self._r[r].append(w)
            ch = w.get("character","")
            for root, fam in self._p.items():
                if ch in fam: self._r[root].append(w)
    def family(self, root):
        if root in self._p: return sorted(self._p[root])
        if root in self._r: return sorted([w["character"] for w in self._r[root]])
        return sorted(set([w["character"] for w in self.words if root in w.get("character","") and w["character"]!=root]))
    def related(self, word, n=10):
        r = []
        for root, fam in self._p.items():
            if word in fam or word==root: r.extend(fam)
        rad = self._rad(word)
        if rad and rad in self._r: r.extend([w["character"] for w in self._r[rad]])
        return list(dict.fromkeys(r))[:n]
    def chain(self, word):
        root = None
        for r, fam in self._p.items():
            if word in fam or word==r: root=r; break
        rad = self._rad(word)
        fam = self.family(root) if root else []
        b = [c for c in fam if self._strokes(c)<=8]
        a = [c for c in fam if self._strokes(c)>8]
        return {"word":word,"root":root,"radical":rad,"family":fam,"order":([root]+b[:4]+a[:4]) if root else []}
    def suggest(self, learned, n=5):
        c = []
        for w in learned:
            for r in self.related(w,20):
                if r not in learned and r not in c: c.append(r)
        c.sort(key=lambda x: self._strokes(x))
        return c[:n]
    def _rad(self, char):
        for w in self.words:
            if w.get("character")==char: return w.get("radical","")
        return ""
    def _strokes(self, char, d=99):
        for w in self.words:
            if w.get("character")==char: return w.get("stroke_count",d)
        return d
    def stats(self):
        return {"total":len(self.words),"roots":len(self._p),"radicals":len(self._r)}