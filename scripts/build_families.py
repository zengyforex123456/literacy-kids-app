import json, re
from collections import defaultdict

radical_groups = defaultdict(list)

with open('src/shared/db/mmah_dict.jsonl') as f:
    for line in f:
        entry = json.loads(line)
        char = entry.get('character', '')
        decomp = entry.get('decomposition', '')
        radical = entry.get('radical', '')
        
        if not char or ord(char) < 0x4E00:
            continue
        
        if radical and len(radical) == 1:
            radical_groups[radical].append(char)
        
        if decomp and decomp not in ['？', '']:
            parts = re.findall(r'[一-鿿]', decomp)
            if parts:
                radical_groups[parts[0]].append(char)

family_groups = {}
for rad, members in radical_groups.items():
    unique = list(set(members))
    if len(unique) >= 3:
        family_groups[rad] = unique[:20]

EDU = set('的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与各关重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石记需段研界拉林律叫且究观越织装影算低持音众书布复容儿须际商非验连断深难近矿千周委素技备半办青省列习响约支般史感劳便团往酸历市克何除消构府称太准精值号率族维划选标写存候毛亲快效斯院查江型眼王按格养易置派层片始却专状育厂京识适属圆包火住调满县局照参红细引听该铁价严')

RADICAL_NAMES = {
    '木':'木字旁','水':'三点水','氵':'三点水','火':'火字旁','灬':'四点底',
    '口':'口字旁','人':'单人旁','亻':'单人旁','女':'女字旁',
    '手':'提手旁','扌':'提手旁','心':'心字底','忄':'竖心旁',
    '日':'日字旁','月':'月字旁','目':'目字旁','石':'石字旁',
    '金':'金字旁','钅':'金字旁','言':'言字旁','讠':'言字旁',
    '虫':'虫字旁','鱼':'鱼字旁','鸟':'鸟字旁','马':'马字旁',
    '艹':'草字头','竹':'竹字头','雨':'雨字头','山':'山字旁',
    '土':'提土旁','王':'王字旁','贝':'贝字旁',
    '车':'车字旁','辶':'走之底','足':'足字旁',
    '禾':'禾木旁','米':'米字旁','田':'田字旁','力':'力字旁',
    '子':'子字旁','宀':'宝盖头','门':'门字框','囗':'国字框',
    '阝':'耳刀旁','刂':'立刀旁','冫':'两点水',
    '彳':'双人旁','犭':'反犬旁','纟':'绞丝旁',
    '衤':'衣字旁','礻':'示字旁','疒':'病字头',
}

result = []
for radical, members in sorted(family_groups.items(), key=lambda x: -len(x[1])):
    edu_members = [m for m in members if m in EDU]
    if len(edu_members) >= 3:
        name = RADICAL_NAMES.get(radical, radical + '部')
        result.append({
            'radical': radical,
            'radical_name': name,
            'members': edu_members,
            'count': len(edu_members),
            'source': 'MakeMeAHanzi',
            'verified': True
        })

print(f'Families: {len(result)}, Coverage: {sum(r["count"] for r in result)} chars')
for r in sorted(result, key=lambda x: -x['count'])[:15]:
    print(f'  {r["radical"]}({r["radical_name"]}): {",".join(r["members"][:6])} ({r["count"]})')

with open('src/shared/db/radical_families.json', 'w') as f:
    json.dump(result, f, ensure_ascii=False, indent=2)
print(f'Saved {len(result)} families')
