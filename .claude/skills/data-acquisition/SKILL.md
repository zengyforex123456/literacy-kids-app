---
name: data-acquisition
description: Multi-source data acquisition — identify data needs, find legal open data sources, fetch and structure data. NEVER scrape commercial sites. Prioritize open data, government sources, and CC-licensed datasets.
---

# Data Acquisition Workflow

## Core Principle

```
禁止: 商业网站爬虫(汉典/百度汉语/洪恩)
允许: 开源数据库、政府公开数据、CC授权数据、API
```

## Phase 1: Define Data Needs

Output a data spec before any acquisition:

```yaml
data_spec:
  name: "字族关系数据"
  fields: [radical, member_chars, verification_source]
  volume: "80 groups, ~200 chars"
  format: "JSON / CSV"
  usage: "App内置学习引擎，离线使用"
```

## Phase 2: Source Evaluation

For each potential source, score on:

| 维度 | 满分 | 说明 |
|------|------|------|
| 合法性 | 5 | 开源/政府/CC > API > 爬虫 |
| 完整性 | 5 | 覆盖80组的比例 |
| 准确性 | 5 | 有学术引用或官方背书 |
| 易获取 | 5 | 下载/API vs 需自行解析 |

### Ranked Sources for 字族数据

| 来源 | 合法性 | 完整性 | 准确性 | 易获取 | 总 | 推荐 |
|------|--------|--------|--------|--------|----|----|
| **Unihan Database** (Unicode.org) | 5 | 4 | 5 | 4 | 18 | ⭐ 首选 |
| **CHISE IDS** (GitLab) | 5 | 4 | 4 | 3 | 16 | ⭐ |
| **Make Me a Hanzi** (GitHub) | 5 | 5 | 3 | 5 | 18 | ⭐ 首选 |
| **教育部字表** (gov.cn) | 5 | 3 | 5 | 3 | 16 | ⭐ |
| Wiktionary dump | 5 | 4 | 3 | 3 | 15 | |
| ~~汉典网~~ | 1 | 5 | 5 | 2 | - | ❌ 禁止 |
| ~~百度汉语~~ | 1 | 5 | 4 | 1 | - | ❌ 禁止 |

## Phase 3: Fetch & Structure

### Source 1: Make Me a Hanzi (GitHub)

```bash
# Clone open-source character decomposition data
git clone https://github.com/skishore/makemeahanzi.git /tmp/mmah
# Contains: dictionary.txt (9000+ chars with decomposition)
# Format: character \t decomposition \t pinyin \t definition
```

```python
import csv

def extract_radical_groups(mmah_dict_path):
    """Extract characters sharing same radical component"""
    groups = {}
    with open(mmah_dict_path) as f:
        for line in f:
            char, decomposition, *_ = line.strip().split('\t')
            # Find radical (first component in decomposition)
            radical = decomposition.split()[0] if decomposition else None
            if radical:
                groups.setdefault(radical, []).append(char)
    # Filter: keep groups with 3+ members
    return {k: v for k, v in groups.items() if len(v) >= 3}
```

### Source 2: Unihan Database

```bash
# Download official Unicode Han database
curl -O https://www.unicode.org/Public/UCD/latest/ucd/Unihan.zip
unzip Unihan.zip

# Extract radical-stroke data
grep "kRSKangXi" Unihan_IRGSources.txt | head -20
```

### Source 3: 教育部字表 (Manual)

```
从PDF提取: 《义务教育语文课程标准》附录4《识字、写字教学基本字表》
300字，按年级排列，可直接用作V1.0字库
```

## Phase 4: Validate & Merge

```python
def validate_radical_group(radical, members, reference_source):
    """Cross-reference against至少2个来源"""
    checks = []
    # Check 1: All members share the radical in at least one decomposition
    for char in members:
        decomp = get_decomposition(char)
        checks.append(radical in decomp)
    
    confidence = sum(checks) / len(checks)
    return {
        'radical': radical,
        'members': members,
        'confidence': confidence,
        'verified': confidence >= 0.9,
        'source': reference_source
    }
```

## Phase 5: Output

Generate structured data file:

```json
{
  "radical_families": [
    {
      "radical": "木",
      "radical_name": "木字旁",
      "members": ["树","林","松","柏","杨","柳","枫"],
      "confidence": 0.95,
      "verified": true,
      "source": "Unihan+MakeMeAHanzi"
    }
  ]
}
```

Save to: `src/shared/db/radical_families.json`

## ⚠️ 禁止操作

- ❌ 爬取汉典网、百度汉语等商业网站
- ❌ 使用需要付费API key的数据
- ❌ 发布未验证的字族关系(错误率须<5%)
- ❌ 商业爬虫 — 法律风险极高
- ✅ 开源数据(GitHub/GitLab/Unicode.org)
- ✅ 政府公开数据(教育部/语委)
- ✅ CC授权数据(Wiktionary/Make Me a Hanzi)

## 快速开始

```bash
# 1分钟内获取基础字族数据
git clone --depth 1 https://github.com/skishore/makemeahanzi.git /tmp/mmah
python3 scripts/build_radical_groups.py /tmp/mmah/dictionary.txt > src/shared/db/radical_families.json
```

## 首选数据源: 《说文解字》公开版 ⭐⭐⭐⭐⭐

**版权状态**: 东汉许慎(公元100年)，版权完全过期，全球公共领域
**部首体系**: 540部首，8,953字，每个字有"从X，Y声"的形声分析
**权威性**: 中国文字学奠基之作，所有现代字族研究的源头

### 公开数字版本

| 来源 | URL | 格式 |
|------|-----|------|
| Project Gutenberg | https://www.gutenberg.org/ | 文本 |
| Chinese Text Project (ctext.org) | https://ctext.org/shuo-wen-jie-zi | 结构化文本 |
| GitHub 数字化版本 | github.com搜索 "shuowen" | JSON/CSV |
| 国学大师 (guoxuedashi.net) | 公开API | HTML |

### 提取字族数据脚本

```python
"""
从说文解字结构化数据提取字族关系
数据来源: ctext.org 或 GitHub 公开数字化版本
"""

SHUOWEN_PARSE_RULES = {
    # 格式: "X，从Y，Z声" → radical=Y, member=X
    # 格式: "X，Y省声" → radical=Y
    # 格式: "X，会意，从A从B" → compound ideograph
}

def extract_from_shuowen(entry: str) -> dict:
    """
    解析单条说文解字条目
    
    Example:
      "松，木也。从木，公声。" → {char:'松', radical:'木', type:'形声'}
      "休，息止也。从人依木。" → {char:'休', components:['人','木'], type:'会意'}
    """
    char = entry[0]
    
    # 形声字: 从X，Y声
    if '从' in entry:
        radical_part = entry.split('从')[1].split('，')[0].split('声')[0]
        return {
            'char': char,
            'radical': radical_part,
            'type': '形声',
            'verified': True,
            'source': '说文解字'
        }
    
    return None

# 示例: 构建"木"字族
def build_mu_family(shuowen_data):
    mu_family = []
    for entry in shuowen_data:
        parsed = extract_from_shuowen(entry)
        if parsed and parsed.get('radical') == '木':
            mu_family.append(parsed['char'])
    return mu_family
    # → ['松','柏','杨','柳','枫','梧','桐','桦','...']
```

### 预期产出

基于《说文解字》+ 教育部300字表交叉验证:

```
90组确定字族，覆盖约220字
  其中80组完全来自说文解字
  10组需教育部字表补充确认
  
置信度: 95%+ (经2源交叉验证)
```

### 数据流程

```
《说文解字》公开版
    ↓ parse
字族关系原型(90组)
    ↓ cross-validate  
教育部字表(300字)
    ↓ merge
确定字族(80组, 200字)
    ↓ manual QA
V1.0 发布
    ↓ 用户纠错反馈
V1.1 修正版
```
