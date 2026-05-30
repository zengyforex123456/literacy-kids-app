"""WordFamilyManager + ReviewScheduler - SM-2 algorithm"""
import json, os
from collections import defaultdict
from datetime import datetime, timedelta

class ReviewScheduler:
    """SM-2 间隔复习调度器"""
    def __init__(self, storage_path='review_state.json'):
        self.storage_path = storage_path
        self.easiness_factor = 2.5
        self.intervals = [1, 3, 7, 14, 30, 60, 120]
        self.state = self._load()

    def _load(self):
        if os.path.exists(self.storage_path):
            with open(self.storage_path, encoding='utf-8') as f:
                return json.load(f)
        return {}

    def save(self):
        with open(self.storage_path, 'w', encoding='utf-8') as f:
            json.dump(self.state, f, ensure_ascii=False, indent=2)

    def schedule_review(self, word, quality):
        """quality 0-5: 0=完全忘 3=部分 5=完美"""
        w = self.state.get(word, {'repetitions':0, 'interval':1, 'ef':2.5, 'next_review':None, 'last_quality':0})
        if quality >= 3:
            if w['repetitions'] == 0: w['interval'] = 1
            elif w['repetitions'] == 1: w['interval'] = 3
            else: w['interval'] = int(w['interval'] * w['ef'])
            w['repetitions'] += 1
        else:
            w['repetitions'] = 0
            w['interval'] = 1
        w['ef'] = max(1.3, w['ef'] + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)))
        w['last_quality'] = quality
        w['next_review'] = (datetime.now() + timedelta(days=w['interval'])).isoformat()
        self.state[word] = w
        self.save()
        return w['interval']

    def get_due_words(self):
        """获取今天需要复习的字"""
        today = datetime.now().isoformat()[:10]
        due = []
        for word, w in self.state.items():
            if w['next_review'] and w['next_review'][:10] <= today:
                due.append(word)
        return sorted(due, key=lambda x: self.state[x]['next_review'])

    def get_daily_quiz(self, word_bank, count=5):
        """生成每日复习关卡"""
        due = self.get_due_words()
        review = due[:count]
        new_count = count - len(review)
        if new_count > 0:
            learned = set(self.state.keys())
            new = [w for w in word_bank if w not in learned][:new_count]
            review.extend(new)
        return review[:count]

    def get_stats(self):
        if not self.state: return {'total':0, 'due_today':0, 'mastered':0}
        due = len(self.get_due_words())
        return {'total':len(self.state), 'due_today':due, 'mastered':sum(1 for w in self.state.values() if w['repetitions']>=4)}


class WordFamilyManager:
    """字族管理器"""
    def __init__(self, wordbank_path=None):
        self.words = []
        self._radical_index = defaultdict(list)
        self._phonetic_roots = {}
        if wordbank_path: self.load(wordbank_path)

    def load(self, path):
        with open(path, encoding='utf-8') as f: data = json.load(f)
        self.words = data if isinstance(data, list) else []
        self._build_indexes()
        return len(self.words)

    def load_from_list(self, lst):
        self.words = lst; self._build_indexes()
        return len(self.words)

    def _build_indexes(self):
        self._radical_index.clear()
        self._phonetic_roots = {k:list(v) for k,v in {'青':'清晴睛情蜻请精静猜','包':'抱跑炮泡饱苞胞雹','方':'放房防访仿芳妨纺','工':'功攻贡红虹江空巩','可':'何河呵苛柯阿哥歌','白':'百拍怕帕伯迫泊魄','艮':'根跟很恨狠恳垦痕','各':'格客路洛落略络骆','且':'组祖阻租助粗宜谊','乔':'桥轿侨娇骄矫荞','肖':'消销削宵逍霄悄哨','元':'远院园完玩顽阮','胡':'湖糊蝴胡葫瑚煳','古':'故估姑固苦枯湖胡','丁':'打订叮盯钉顶厅灯','寸':'村对过时讨付射封','分':'份粉纷芬汾盆盼颁','羊':'样洋氧养痒详祥翔','马':'妈吗码骂蚂玛犸'}.items()}
        for w in self.words:
            rad = w.get('radical','')
            if rad: self._radical_index[rad].append(w)
            ch = w.get('character','')
            for root, family in self._phonetic_roots.items():
                if ch in family: self._phonetic_index[root].append(w)

    def get_family(self, root):
        if root in self._phonetic_roots: return sorted(self._phonetic_roots[root])
        if root in self._radical_index: return sorted([w['character'] for w in self._radical_index[root]])
        return sorted(set([w['character'] for w in self.words if root in w.get('character','') and w['character']!=root]))

    def get_related_words(self, word, max_results=10):
        results = []
        for root, family in self._phonetic_roots.items():
            if word in family or word == root: results.extend(family)
        rad = self._get_radical(word)
        if rad and rad in self._radical_index: results.extend([w['character'] for w in self._radical_index[rad]])
        return list(dict.fromkeys(results))[:max_results]

    def get_word_family_chain(self, word):
        root = None
        for r, family in self._phonetic_roots.items():
            if word in family or word == r: root = r; break
        rad = self._get_radical(word)
        family = self.get_family(root) if root else []
        basic = [c for c in family if self._get_stroke_count(c)<=8]
        advanced = [c for c in family if self._get_stroke_count(c)>8]
        return {'word':word,'phonetic_root':root,'radical':rad,'core_family':family,'suggested_order':([root]+basic[:4]+advanced[:4]) if root else [],'learning_path':[f'Step1-root:{root}',f'Step2-basic:{",".join(basic[:5])}',f'Step3-adv:{",".join(advanced[:5])}'] if root else []}

    def get_family_tree(self, root):
        family = self.get_family(root)
        by_radical = defaultdict(list)
        for ch in family: by_radical[self._get_radical(ch)].append(ch)
        branches = [{'radical':r,'characters':sorted(c),'count':len(c)} for r,c in sorted(by_radical.items())]
        return {'root':root,'branches':branches,'total_chars':sum(b['count'] for b in branches)}

    def suggest_next_words(self, learned, count=5):
        candidates = []
        for word in learned:
            for r in self.get_related_words(word,20):
                if r not in learned and r not in candidates: candidates.append(r)
        candidates.sort(key=lambda c: self._get_stroke_count(c))
        return candidates[:count]

    def _get_radical(self, char):
        for w in self.words:
            if w.get('character')==char: return w.get('radical','')
        return ''

    def _get_stroke_count(self, char, default=99):
        for w in self.words:
            if w.get('character')==char: return w.get('stroke_count',default)
        return default

    def get_stats(self):
        return {'total_chars':len(self.words),'phonetic_roots':len(self._phonetic_roots),'radical_groups':len(self._radical_index)}


# ===== TEST =====
if __name__ == '__main__':
    test_data = [{'word_id':str(i).zfill(4),'character':c,'pinyin':'','radical':r,'stroke_count':s,'word_family':'','grade_level':1}
        for i,(c,r,s) in enumerate([('清','氵',11),('晴','日',12),('睛','目',13),('情','忄',11),('请','讠',10),('青',
