// 问答选品决策树：动物 → 类型/目的 → 具体情况 → 推荐组合
// 节点的选项用 next 指向下一个问题，或用 result 指向推荐结果。
// 推荐语里的 [ref:xxx] 对应 data/references.js 里的文献，页面上显示为 [1] [2] 编号。
// 组合与文案为行业参考，上线前需德高技术部审核。成分待确认（pending）的产品不进入推荐。

const NODES = {
  root: {
    q: { zh: '您养殖的是什么动物？', en: 'Which animal do you raise?' },
    options: [
      { icon: 'pig', label: { zh: '猪', en: 'Swine' }, sub: { zh: '仔猪 · 育肥猪 · 母猪', en: 'Piglets · finishers · sows' }, next: 'pig' },
      { icon: 'poultry', label: { zh: '家禽', en: 'Poultry' }, sub: { zh: '肉鸡 · 蛋鸡 · 鸭鹅', en: 'Broilers · layers · waterfowl' }, next: 'poultry' },
      { icon: 'ruminant', label: { zh: '反刍动物', en: 'Ruminants' }, sub: { zh: '犊牛 · 奶牛 · 育肥牛羊', en: 'Calves · dairy cows · beef & lambs' }, next: 'ruminant' },
      { icon: 'aqua', label: { zh: '水产', en: 'Aquaculture' }, sub: { zh: '鱼 · 虾蟹', en: 'Fish · shrimp & crab' }, next: 'aqua' }
    ]
  },

  // ---------- 猪 ----------
  pig: {
    q: { zh: '您最想改善哪方面？', en: 'What do you most want to improve?' },
    options: [
      { label: { zh: '肠道健康 / 腹泻', en: 'Gut health / diarrhea' }, sub: { zh: '断奶腹泻、消化不良', en: 'Weaning scours, poor digestion' }, next: 'pig_gut' },
      { label: { zh: '替抗减抗', en: 'Antibiotic reduction' }, sub: { zh: '禁抗后保持健康和生长', en: 'Stay healthy and productive without AGPs' }, next: 'pig_agp' },
      { label: { zh: '生长与瘦肉率', en: 'Growth & lean yield' }, sub: { zh: '日增重、料肉比、胴体', en: 'Daily gain, FCR, carcass' }, next: 'pig_growth' },
      { label: { zh: '夏季热应激', en: 'Summer heat stress' }, sub: { zh: '高温采食下降、生长变慢', en: 'Lower intake and growth in hot weather' }, result: 'p_heat' },
      { label: { zh: '母猪与哺乳仔猪', en: 'Sows & suckling piglets' }, sub: { zh: '哺乳仔猪腹泻、断奶后发情慢', en: 'Suckling scours, slow return to estrus' }, result: 'p_sow' },
      { label: { zh: '霉菌毒素', en: 'Mycotoxins' }, sub: { zh: '原料霉变', en: 'Moldy grain' }, result: 'p_mold' },
      { label: { zh: '免疫与抵抗力', en: 'Immunity' }, sub: { zh: '体弱、易发病', en: 'Weak, prone to illness' }, result: 'p_immune' }
    ]
  },
  pig_gut: {
    q: { zh: '具体是哪种情况？', en: 'Which situation fits best?' },
    options: [
      { label: { zh: '断奶仔猪腹泻', en: 'Post-weaning diarrhea' }, sub: { zh: '断奶后 1–2 周拉稀、掉膘', en: 'Scours and weight loss 1–2 weeks after weaning' }, result: 'p_wean' },
      { label: { zh: '哺乳 / 教槽仔猪采食少', en: 'Low creep-feed intake' }, sub: { zh: '教槽料吃得少、易拉稀', en: 'Suckling piglets eat little creep feed' }, result: 'p_creep' },
      { label: { zh: '生长育肥猪消化不良', en: 'Poor digestion in growers' }, sub: { zh: '粪便不成形、饲料浪费', en: 'Loose feces, wasted feed' }, result: 'p_grower' }
    ]
  },
  pig_agp: {
    q: { zh: '哪个阶段需要替抗？', en: 'Which stage needs an antibiotic-free plan?' },
    options: [
      { label: { zh: '保育阶段', en: 'Nursery' }, sub: { zh: '断奶后到 25 kg 左右', en: 'From weaning to about 25 kg' }, result: 'p_agp_nursery' },
      { label: { zh: '生长育肥阶段', en: 'Grow-finish' }, sub: { zh: '25 kg 到出栏', en: '25 kg to market' }, result: 'p_agp_finisher' }
    ]
  },
  pig_growth: {
    q: { zh: '更关注哪个指标？', en: 'Which target matters most?' },
    options: [
      { label: { zh: '育肥后期瘦肉率', en: 'Lean yield at finishing' }, sub: { zh: '背膘厚、胴体等级', en: 'Backfat and carcass grade' }, result: 'p_lean' },
      { label: { zh: '日增重与料肉比', en: 'Daily gain & FCR' }, sub: { zh: '长得慢、出栏晚', en: 'Slow growth, late to market' }, result: 'p_adg' }
    ]
  },

  // ---------- 家禽 ----------
  poultry: {
    q: { zh: '养的是哪类家禽？', en: 'What type of poultry?' },
    options: [
      { label: { zh: '肉鸡', en: 'Broilers' }, sub: { zh: '白羽、黄羽肉鸡', en: 'White and colored broilers' }, next: 'broiler' },
      { label: { zh: '蛋鸡', en: 'Laying hens' }, sub: { zh: '产蛋期蛋鸡', en: 'Hens in lay' }, next: 'layer' },
      { label: { zh: '鸭 / 鹅', en: 'Ducks / geese' }, sub: { zh: '肉鸭、蛋鸭、鹅', en: 'Meat and laying ducks, geese' }, result: 'w_gut' }
    ]
  },
  broiler: {
    q: { zh: '您最想改善哪方面？', en: 'What do you most want to improve?' },
    options: [
      { label: { zh: '肠道健康 / 过料', en: 'Gut health / undigested feed' }, sub: { zh: '粪便有料、肠炎', en: 'Feed in droppings, enteritis' }, result: 'b_gut' },
      { label: { zh: '替抗减抗', en: 'Antibiotic reduction' }, sub: { zh: '无抗饲养', en: 'Antibiotic-free rearing' }, result: 'b_agp' },
      { label: { zh: '胸肉率与料肉比', en: 'Breast yield & FCR' }, sub: { zh: '出栏体重、屠宰率', en: 'Market weight, carcass yield' }, result: 'b_growth' },
      { label: { zh: '热应激', en: 'Heat stress' }, sub: { zh: '夏季采食下降、死淘增加', en: 'Lower intake and higher losses in summer' }, result: 'b_heat' },
      { label: { zh: '霉菌毒素', en: 'Mycotoxins' }, sub: { zh: '原料霉变', en: 'Moldy grain' }, result: 'b_mold' }
    ]
  },
  layer: {
    q: { zh: '您最想改善哪方面？', en: 'What do you most want to improve?' },
    options: [
      { label: { zh: '夏季产蛋率下降', en: 'Summer drop in lay rate' }, sub: { zh: '高温导致产蛋下降', en: 'Heat lowers egg production' }, result: 'l_heat' },
      { label: { zh: '产蛋后期 / 脂肪肝', en: 'Late lay / fatty liver' }, sub: { zh: '产蛋率下滑、肝脏负担大', en: 'Declining lay, liver burden' }, result: 'l_late' },
      { label: { zh: '原料霉变', en: 'Moldy grain' }, sub: { zh: '霉菌毒素风险', en: 'Mycotoxin risk' }, result: 'l_mold' }
    ]
  },

  // ---------- 反刍 ----------
  ruminant: {
    q: { zh: '养的是哪类反刍动物？', en: 'Which ruminants?' },
    options: [
      { label: { zh: '犊牛', en: 'Calves' }, sub: { zh: '哺乳期、断奶前后', en: 'Milk-fed and around weaning' }, result: 'r_calf' },
      { label: { zh: '奶牛', en: 'Dairy cows' }, sub: { zh: '围产期、泌乳牛', en: 'Transition and lactating cows' }, next: 'dairy' },
      { label: { zh: '育肥牛 / 育肥羊', en: 'Beef cattle / lambs' }, sub: { zh: '育肥期增重', en: 'Finishing gain' }, result: 'r_fattening' }
    ]
  },
  dairy: {
    q: { zh: '您最想解决什么问题？', en: 'What do you most want to solve?' },
    options: [
      { label: { zh: '围产期 / 产后护肝', en: 'Transition / post-calving liver' }, sub: { zh: '产后采食慢、脂肪肝、产奶上不去', en: 'Slow intake after calving, fatty liver, low peak' }, result: 'd_transition' },
      { label: { zh: '乳蛋白偏低 / 降豆粕', en: 'Low milk protein / less soybean meal' }, sub: { zh: '乳蛋白率低、想降低日粮蛋白', en: 'Low milk protein, want lower dietary protein' }, result: 'd_protein' },
      { label: { zh: '夏季热应激、产奶下降', en: 'Heat stress, lower milk' }, sub: { zh: '高温采食少、乳成分下降', en: 'Lower intake and milk components in heat' }, result: 'd_heat' },
      { label: { zh: '霉菌毒素 / 牛奶黄曲霉毒素', en: 'Mycotoxins / aflatoxin M1 in milk' }, sub: { zh: '原料霉变、奶检风险', en: 'Moldy feed, milk testing risk' }, result: 'd_mold' }
    ]
  },

  // ---------- 水产 ----------
  aqua: {
    q: { zh: '您最想改善哪方面？', en: 'What do you most want to improve?' },
    options: [
      { label: { zh: '诱食与采食', en: 'Attraction & intake' }, sub: { zh: '饲料不爱吃、植物蛋白多', en: 'Poor acceptance, plant-protein feeds' }, result: 'a_attract' },
      { label: { zh: '肠道健康', en: 'Gut health' }, sub: { zh: '肠炎、肠道受损', en: 'Enteritis, damaged gut' }, result: 'a_gut' },
      { label: { zh: '生长与饲料系数', en: 'Growth & FCR' }, sub: { zh: '长得慢、饲料系数高', en: 'Slow growth, high FCR' }, result: 'a_growth' },
      { label: { zh: '肝胆健康 / 脂肪利用', en: 'Liver health / fat use' }, sub: { zh: '高脂高淀粉饲料、肝脏发白', en: 'High-fat or high-starch feed, pale liver' }, result: 'a_liver' },
      { label: { zh: '免疫与抗病', en: 'Immunity & disease resistance' }, sub: { zh: '换季、应激时易发病', en: 'Outbreaks at season changes and stress' }, result: 'a_immune' }
    ]
  }
}

// 推荐结果。species 用于核对产品适用动物；items 的 role 是这个产品在方案里的分工
// 推荐结果。species 用于核对产品适用动物；items 的 role 是这个产品在方案里的分工
const RESULTS = {
  // ---------- 猪 ----------
  p_wean: {
    species: 'pig',
    title: { zh: '断奶仔猪腹泻方案', en: 'Post-weaning diarrhea program' },
    items: [
      { sku: 'SB50F', role: { zh: '核心：修复肠黏膜', en: 'Core: repairs gut lining' } },
      { sku: 'TA40C', role: { zh: '收敛止泻', en: 'Astringent, eases scours' } },
      { sku: 'TB65', role: { zh: '后段供能、不影响适口性', en: 'Lower-gut energy, palatable' } }
    ],
    reason: {
      zh: '断奶应激让仔猪肠绒毛萎缩、屏障受损，是腹泻高发的根源。方案以包被丁酸钠为核心：试验中它配合减半抗生素，仍让断奶仔猪增重更快、腹泻更少[ref:sb_piglet]；单宁酸在不影响生长的前提下降低断奶腹泻率[ref:ta_piglet]，包被型在 500–1000 mg/kg 时对生长无不良影响[ref:ta_micro]；三丁酸甘油酯提高断奶仔猪日增重和饲料效率[ref:tb_piglet]。建议从断奶前一周开始添加。',
      en: 'Weaning stress shrinks villi and weakens the gut barrier — the root of post-weaning scours. Coated sodium butyrate is the core: with antibiotics halved, piglets still grew faster with less diarrhea[ref:sb_piglet]. Tannic acid lowers post-weaning diarrhea without hurting growth[ref:ta_piglet], and the coated form was safe for growth at 500–1000 mg/kg[ref:ta_micro]. Tributyrin improves daily gain and feed efficiency[ref:tb_piglet]. Start a week before weaning.'
    }
  },
  p_creep: {
    species: 'pig',
    title: { zh: '教槽期开食方案', en: 'Creep-feeding program' },
    items: [
      { sku: 'TB65', role: { zh: '无异味丁酸源，促进肠道发育', en: 'Odorless butyrate for gut development' } },
      { sku: 'ALC25', role: { zh: '抑菌，减少腹泻', en: 'Antibacterial, fewer scours' } }
    ],
    reason: {
      zh: '教槽料吃得好，断奶才过得顺。三丁酸甘油酯几乎无异味，不会影响教槽料适口性，研究显示它能减轻仔猪肠道损伤[ref:tb_injury]、提高断奶仔猪增重和饲料效率[ref:tb_piglet]；大蒜素在断奶仔猪试验中提高日增重，并随添加量增加降低腹泻发生率[ref:alc_piglet]。两者搭配，帮助仔猪早开食、少拉稀，为断奶打好肠道基础。',
      en: 'Good creep-feed intake means a smoother weaning. Tributyrin is nearly odorless, so it keeps creep feed palatable; it alleviated intestinal injury in piglets[ref:tb_injury] and improved gain and feed efficiency after weaning[ref:tb_piglet]. Allicin raised daily gain in weaned piglets and reduced diarrhea in a dose-dependent way[ref:alc_piglet]. Together they help piglets start eating early and arrive at weaning with a healthier gut.'
    }
  },
  p_grower: {
    species: 'pig',
    title: { zh: '生长育肥猪肠道方案', en: 'Grower gut program' },
    items: [
      { sku: 'SB70F', role: { zh: '核心：修复肠黏膜', en: 'Core: repairs gut lining' } },
      { sku: 'TB60', role: { zh: '肠道中后段供能', en: 'Energy for the mid and lower gut' } }
    ],
    reason: {
      zh: '生长育肥猪粪便不成形、饲料浪费，多与肠黏膜受损、消化吸收不充分有关。丁酸钠为肠上皮细胞供能，在仔猪试验中改善增重、减少腹泻[ref:sb_piglet]；三丁酸甘油酯在小肠中后段释放丁酸，减轻肠道损伤、促进紧密连接形成[ref:tb_injury]。这阶段用量大，选 70% 脂肪包被丁酸钠兼顾含量和成本。以上研究多在仔猪上进行，建议先在一栋猪舍试用 4 周，对比粪便评分和料肉比。',
      en: 'Loose feces and wasted feed in growers usually point to a damaged gut lining and incomplete digestion. Sodium butyrate fuels gut cells and improved gain and reduced diarrhea in piglet trials[ref:sb_piglet]; tributyrin releases butyrate further down the small intestine, easing gut injury and promoting tight junctions[ref:tb_injury]. At grower volumes, the 70% fat-coated butyrate balances potency and cost. Most studies were in piglets, so trial it in one barn for 4 weeks and compare fecal scores and FCR.'
    }
  },
  p_agp_nursery: {
    species: 'pig',
    title: { zh: '保育猪替抗方案', en: 'Nursery antibiotic-free program' },
    items: [
      { sku: 'SB50F', role: { zh: '核心：肠道屏障', en: 'Core: gut barrier' } },
      { sku: 'TA40C', role: { zh: '收敛、保护黏膜', en: 'Astringent, protects mucosa' } },
      { sku: 'ALC25', role: { zh: '植物源抑菌', en: 'Plant-based antibacterial' } }
    ],
    reason: {
      zh: '禁抗后，保育阶段要同时守住肠道屏障、控制有害菌。包被丁酸钠在抗生素减半时仍提高了断奶仔猪增重、降低腹泻[ref:sb_piglet]；单宁酸降低断奶腹泻率、改善肠道屏障[ref:ta_piglet]，综述也认为它可作为预防仔猪大肠杆菌性腹泻的抗生素替代方案[ref:ta_review]；大蒜素提高断奶仔猪日增重、降低腹泻[ref:alc_piglet]。三条作用路线叠加，是保育期替抗的常用思路。',
      en: 'Without antibiotics, the nursery must protect the gut barrier and control pathogens at once. Coated sodium butyrate improved gain and cut diarrhea even with antibiotics halved[ref:sb_piglet]; tannic acid lowered post-weaning diarrhea and improved the gut barrier[ref:ta_piglet], and a review supports tannins as an antibiotic alternative against E. coli scours[ref:ta_review]; allicin raised daily gain and reduced diarrhea in weaned piglets[ref:alc_piglet]. Three complementary routes for an antibiotic-free nursery.'
    }
  },
  p_agp_finisher: {
    species: 'pig',
    title: { zh: '生长育肥猪替抗方案', en: 'Grow-finish antibiotic-free program' },
    items: [
      { sku: 'SB70F', role: { zh: '肠道屏障', en: 'Gut barrier' } },
      { sku: 'ALC25', role: { zh: '植物源抑菌', en: 'Plant-based antibacterial' } }
    ],
    reason: {
      zh: '生长育肥阶段用量大、周期长，替抗方案要兼顾效果和成本。丁酸钠帮助维持肠道屏障，在减少抗生素的条件下仍改善了猪的增重和腹泻[ref:sb_piglet]；大蒜类提取物在大肠杆菌攻毒试验中降低了猪的腹泻和炎症反应[ref:alc_garlic]。两者添加量小、成本可控，适合长期使用。注意：以上研究多在断奶仔猪上进行，育肥阶段建议先小批量验证。',
      en: 'In grow-finish, volumes are large and periods long, so an antibiotic-free plan must balance results and cost. Sodium butyrate helps maintain the gut barrier and improved gain and diarrhea with reduced antibiotics[ref:sb_piglet]; garlic extracts reduced diarrhea and inflammation in E. coli-challenged pigs[ref:alc_garlic]. Both are low-inclusion and cost-controlled. Most studies were in weaned pigs, so validate on a small batch first.'
    }
  },
  p_lean: {
    species: 'pig',
    title: { zh: '育肥后期瘦肉率方案', en: 'Finishing lean-yield program' },
    items: [
      { sku: 'GAA98', role: { zh: '核心：促进肌肉沉积', en: 'Core: more muscle deposition' } },
      { sku: 'BT70C', role: { zh: '降背膘、提高屠宰率', en: 'Less backfat, higher dressing %' } }
    ],
    reason: {
      zh: '育肥后期多长的是脂肪，提高瘦肉率要从肌肉和脂肪两头入手。育肥猪添加 600 mg/kg 胍基乙酸，背膘更薄，瘦肉率和眼肌面积提高[ref:gaa_pig2]；汇总多项研究，甜菜碱降低育肥猪背膘、提高屠宰率[ref:bt_meta]，0.25% 甜菜碱可改善胴体性状[ref:bt_pig]。两者配合，帮助育肥猪多长肉、少长膘，提高胴体等级和售价。',
      en: 'Late finishing puts on mostly fat, so lean yield must be tackled on both the muscle and fat side. Finishers fed 600 mg/kg guanidinoacetic acid had thinner backfat and higher lean percentage and loin-eye area[ref:gaa_pig2]; across studies, betaine reduced backfat and raised dressing percentage[ref:bt_meta], and 0.25% betaine improved carcass traits[ref:bt_pig]. Together they help pigs put on lean instead of fat for a better carcass grade and price.'
    }
  },
  p_adg: {
    species: 'pig',
    title: { zh: '日增重与料肉比方案', en: 'Daily-gain & FCR program' },
    items: [
      { sku: 'GAA98', role: { zh: '肌酸前体，提升能量代谢', en: 'Creatine precursor, energy metabolism' } },
      { sku: 'CS30M', role: { zh: '促生长', en: 'Growth support' } }
    ],
    reason: {
      zh: '长得慢、出栏晚，往往是肌肉能量供应跟不上。胍基乙酸是肌酸前体，300 mg/kg 时生长育肥猪日增重和终末体重达到最佳[ref:gaa_pig]；半胱胺 70 mg/kg 可提高育肥猪日增重，剂量加倍反而无效[ref:cs_pig]，务必按推荐量添加。两者从能量代谢和生长激素两条路线提速，缩短出栏时间、摊薄饲养成本。',
      en: 'Slow growth often means muscles run short of energy. Guanidinoacetic acid, the creatine precursor, maximised daily gain and final weight of growing-finishing pigs at 300 mg/kg[ref:gaa_pig]; cysteamine at 70 mg/kg raised daily gain while double the dose did not[ref:cs_pig] — follow the recommended rate. Two routes, energy metabolism and growth hormone, to shorten days to market and spread costs.'
    }
  },
  p_heat: {
    species: 'pig',
    title: { zh: '猪夏季抗应激方案', en: 'Swine summer stress program' },
    items: [
      { sku: 'BT70C', role: { zh: '核心：调节渗透压', en: 'Core: osmoregulation' } },
      { sku: 'GABA98', role: { zh: '稳定情绪与采食', en: 'Calms animals, steadies intake' } }
    ],
    reason: {
      zh: '高温下猪采食下降、生长变慢，夏季每多一天都是成本。甜菜碱帮助细胞维持渗透平衡，热应激条件下添加 0.1% 甜菜碱的生长育肥猪日增重高于对照[ref:bt_pig_hs]；γ-氨基丁酸在生长育肥猪上全程添加 30 mg/kg，提高了日增重，并减轻运输应激对肉质的影响[ref:gaba_pig_tr]。GABA 的热应激研究主要来自家禽和奶牛，猪上建议先小批量验证。入夏前两周开始添加。',
      en: 'In heat, pigs eat less and grow slower — every extra summer day costs money. Betaine helps cells keep osmotic balance; heat-stressed growing-finishing pigs fed 0.1% betaine gained faster than controls[ref:bt_pig_hs]. GABA at 30 mg/kg raised daily gain of growing-finishing pigs and eased the effect of transport stress on meat quality[ref:gaba_pig_tr]. GABA heat-stress evidence comes mainly from poultry and dairy cows, so validate it on a small batch of pigs. Start two weeks before summer.'
    }
  },
  p_sow: {
    species: 'pig',
    title: { zh: '母猪与哺乳仔猪方案', en: 'Sow & suckling-piglet program' },
    items: [
      { sku: 'SB98G', role: { zh: '核心：通过母猪惠及仔猪', en: 'Core: benefits piglets through the sow' } },
      { sku: 'YCW', role: { zh: '免疫支持', en: 'Immune support' } }
    ],
    reason: {
      zh: '哺乳仔猪的肠道和免疫力，很大程度取决于母猪的初乳。母猪妊娠后期和哺乳期添加 1 g/kg 丁酸钠，初乳免疫球蛋白增加，哺乳仔猪腹泻率和断奶前死亡率下降，母猪断奶后发情更快[ref:sb_sow]；酵母 β-葡聚糖能调节猪的免疫反应[ref:ycw_pig]，可作为免疫支持。建议从妊娠 85 天左右开始，持续到断奶。',
      en: 'A suckling piglet’s gut and immunity depend heavily on the sow’s colostrum. Adding 1 g/kg sodium butyrate to sow feed in late gestation and lactation raised colostrum immunoglobulins, lowered piglet diarrhea and preweaning mortality, and shortened the wean-to-estrus interval[ref:sb_sow]. Yeast β-glucan modulates the pig immune response[ref:ycw_pig] as extra immune support. Start around day 85 of gestation and continue to weaning.'
    }
  },
  p_mold: {
    species: 'pig',
    title: { zh: '猪饲料霉菌毒素方案', en: 'Swine mycotoxin program' },
    items: [{ sku: 'YCW', role: { zh: '吸附霉菌毒素、免疫支持', en: 'Binds mycotoxins, immune support' } }],
    reason: {
      zh: '玉米质量不稳定时，与其事后补救，不如全程加一道防线。汇总 23 篇文献的分析显示，饲料霉菌毒素在常见水平（不超过法规限量）时，添加酵母细胞壁提取物改善了生长猪的生产性能[ref:ycw_myco_pig]。原料霉变明显时可取用量上限。德高霉毒克-100 的成分待技术部确认，确认后可与之配合使用。',
      en: 'When grain quality varies, a standing line of defense beats firefighting. A meta-analysis of 23 papers found that yeast cell wall extract improved growing-pig performance when feed mycotoxins were at common levels (at or below regulatory limits)[ref:ycw_myco_pig]. Use the upper dose when mold is obvious. Degao Meiduke-100 can be added once its composition is confirmed by our technical team.'
    }
  },
  p_immune: {
    species: 'pig',
    title: { zh: '猪群免疫力方案', en: 'Swine immunity program' },
    items: [
      { sku: 'YCW', role: { zh: '激活免疫', en: 'Immune activation' } },
      { sku: 'ALC25', role: { zh: '天然抑菌', en: 'Natural antibacterial' } }
    ],
    reason: {
      zh: '猪群体弱、易发病时，营养手段可以帮助提高底子。酵母 β-葡聚糖在 LPS 攻毒试验中调节了断奶仔猪的免疫反应[ref:ycw_pig]；大蒜素提高断奶仔猪日增重并降低腹泻发生率[ref:alc_piglet]。两者搭配，一个调免疫、一个控病菌。涉及疫病时请先咨询执业兽医，营养方案作为辅助。',
      en: 'When pigs are weak and fall ill easily, nutrition can help strengthen the baseline. Yeast beta-glucan modulated the immune response of LPS-challenged weaned pigs[ref:ycw_pig], and allicin improved gain and reduced diarrhea in weaned piglets[ref:alc_piglet] — one supports immunity, the other controls bacteria. For disease, consult a veterinarian first; use nutrition as support.'
    }
  },

  // ---------- 家禽 ----------
  b_gut: {
    species: 'poultry',
    title: { zh: '肉鸡肠道健康方案', en: 'Broiler gut-health program' },
    items: [
      { sku: 'SB50F', role: { zh: '核心：肠道发育', en: 'Core: gut development' } },
      { sku: 'TB65', role: { zh: '改善料肉比', en: 'Better feed conversion' } }
    ],
    reason: {
      zh: '肉鸡过料、肠炎，说明肠道消化吸收和屏障出了问题。包被丁酸钠改善肉鸡肠道发育、黏膜形态和抗氧化能力，并调节肠道菌群[ref:sb_broiler]；黄羽肉鸡添加 250 mg/kg 三丁酸甘油酯，22–42 日龄料重比降低，盲肠菌群改善[ref:tb_broiler]。两种丁酸源分别在肠道前段和中后段起作用，让饲料消化得更充分。',
      en: 'Undigested feed and enteritis mean digestion and the gut barrier are struggling. Coated sodium butyrate improves broiler gut development, mucosal structure and antioxidant capacity and modulates the microbiota[ref:sb_broiler]; 250 mg/kg tributyrin lowered feed:gain from day 22 to 42 in yellow-feathered broilers and improved the cecal microbiota[ref:tb_broiler]. The two butyrate sources act in the upper and lower gut respectively for more complete digestion.'
    }
  },
  b_agp: {
    species: 'poultry',
    title: { zh: '肉鸡替抗方案', en: 'Broiler antibiotic-free program' },
    items: [
      { sku: 'YCW', role: { zh: '核心：应对坏死性肠炎', en: 'Core: necrotic enteritis support' } },
      { sku: 'SB50F', role: { zh: '肠道屏障', en: 'Gut barrier' } }
    ],
    reason: {
      zh: '无抗肉鸡最大的风险是坏死性肠炎。在坏死性肠炎攻毒试验中，酵母细胞壁提取物改善了肉鸡增重和成活率，效果与杆菌肽锌、盐霉素相当[ref:ycw_ne]；甘露寡糖还能减轻大肠杆菌引起的肠道炎症[ref:ycw_broiler]。包被丁酸钠改善肠道发育和黏膜形态[ref:sb_broiler]，帮助守住肠道屏障。',
      en: 'Necrotic enteritis is the biggest risk in antibiotic-free broilers. In a necrotic enteritis challenge, yeast cell wall extract improved broiler gain and livability as well as zinc bacitracin and salinomycin did[ref:ycw_ne], and MOS eased E. coli-induced gut inflammation[ref:ycw_broiler]. Coated sodium butyrate improves gut development and mucosal structure[ref:sb_broiler] to hold the gut barrier.'
    }
  },
  b_growth: {
    species: 'poultry',
    title: { zh: '肉鸡胸肉率方案', en: 'Broiler breast-yield program' },
    items: [
      { sku: 'GAA98', role: { zh: '核心：肌肉能量、胸肉率', en: 'Core: muscle energy, breast yield' } },
      { sku: 'BA10', role: { zh: '提高脂肪利用', en: 'Better fat utilization' } }
    ],
    reason: {
      zh: '胸肉率直接决定屠宰收益。欧盟 EFSA 评估认为，胍基乙酸在 600 mg/kg 起可提高肉鸡生长性能[ref:gaa_efsa]，在全植物性日粮中还提高了胸肉率[ref:gaa_broiler]；胆汁酸提高肉鸡日增重、降低料重比，并提升肠道脂肪酶活性[ref:ba_broiler]，让日粮中的油脂物尽其用。一个长肌肉、一个省能量，提升每只鸡的出肉量。',
      en: 'Breast yield drives slaughter revenue. EFSA concluded that guanidinoacetic acid improves broiler performance from 600 mg/kg[ref:gaa_efsa], and in all-vegetable diets it raised breast meat yield[ref:gaa_broiler]. Bile acids improved daily gain and feed:gain and boosted intestinal lipase[ref:ba_broiler], so dietary fat is fully used. One builds muscle, one saves energy — more meat per bird.'
    }
  },
  b_heat: {
    species: 'poultry',
    title: { zh: '肉鸡抗热应激方案', en: 'Broiler heat-stress program' },
    items: [
      { sku: 'GABA50', role: { zh: '稳定采食、降体温', en: 'Supports intake, lowers body temperature' } },
      { sku: 'BT70C', role: { zh: '调节渗透压', en: 'Osmoregulation' } }
    ],
    reason: {
      zh: '热应激时肉鸡采食骤降、死淘上升。γ-氨基丁酸（100 mg/kg）在热应激下提高肉鸡采食量和增重，并降低体温[ref:gaba_fi]，同时改善抗氧化和免疫指标[ref:gaba_hs]；甜菜碱减轻长期热应激对肉鸡生长、消化和胴体的不利影响[ref:bt_broiler_hs]。两者一个稳采食、一个保细胞，帮助鸡群平稳度夏。',
      en: 'Heat stress cuts broiler intake and raises losses. GABA at 100 mg/kg increased intake and gain and lowered body temperature under heat[ref:gaba_fi], while improving antioxidant and immune status[ref:gaba_hs]; betaine reduced the harm of long-term heat stress on growth, digestion and carcass[ref:bt_broiler_hs]. One keeps birds eating, the other protects cells — a steadier summer.'
    }
  },
  b_mold: {
    species: 'poultry',
    title: { zh: '肉鸡霉菌毒素方案', en: 'Broiler mycotoxin program' },
    items: [{ sku: 'YCW', role: { zh: '核心：保护肠道、降低死亡', en: 'Core: protects gut, lowers mortality' } }],
    reason: {
      zh: '雏鸡对黄曲霉毒素尤其敏感，霉菌毒素还会加重肠道疾病。在黄曲霉毒素与坏死性肠炎双重攻毒下，酵母细胞壁降低了肉鸡死亡率，部分保护了生长和肠道健康[ref:ycw_af]。原料不理想时建议全程添加。德高霉毒克-100 的成分待技术部确认，确认后可与之配合使用。',
      en: 'Chicks are especially sensitive to aflatoxin, and mycotoxins worsen gut disease. Under combined aflatoxin and necrotic enteritis challenge, yeast cell wall lowered broiler mortality and partly protected growth and gut health[ref:ycw_af]. Use it throughout when grain quality is poor. Degao Meiduke-100 can be added once its composition is confirmed by our technical team.'
    }
  },
  l_heat: {
    species: 'poultry',
    title: { zh: '蛋鸡夏季稳产方案', en: 'Layer summer production program' },
    items: [
      { sku: 'GABA98', role: { zh: '核心：稳产蛋、护蛋壳', en: 'Core: steadies lay and shell quality' } },
      { sku: 'BT70C', role: { zh: '缓解热应激', en: 'Heat-stress relief' } }
    ],
    reason: {
      zh: '夏季产蛋率下滑，根源是高温导致采食下降和代谢紊乱。热应激蛋鸡添加 50 mg/kg γ-氨基丁酸，产蛋率、蛋重和蛋壳强度提高，料蛋比降低[ref:gaba_hen]，与德高 98% 规格 25–50 g/t 的用量一致；慢性热应激蛋鸡添加 1000 mg/kg 甜菜碱，产蛋性能也有提高[ref:bt_hen]。建议入夏前开始添加，配合通风降温效果更好。',
      en: 'Summer drops in lay come from heat-driven loss of appetite and metabolic stress. Heat-stressed hens fed 50 mg/kg GABA laid more and heavier eggs with stronger shells and better feed:egg[ref:gaba_hen] — matching Degao’s 25–50 g/t of the 98% grade; hens under chronic heat stress fed 1000 mg/kg betaine also laid better[ref:bt_hen]. Start before summer and combine with ventilation.'
    }
  },
  l_late: {
    species: 'poultry',
    title: { zh: '产蛋后期护肝方案', en: 'Late-lay liver program' },
    items: [
      { sku: 'BA10', role: { zh: '改善脂代谢、护肝', en: 'Lipid metabolism, liver support' } },
      { sku: 'SB50F', role: { zh: '改善肠道、延长产蛋', en: 'Gut support, longer lay' } }
    ],
    reason: {
      zh: '产蛋后期蛋鸡肝脏脂肪蓄积多，肠道功能也在下降，产蛋率随之下滑。60 mg/kg 胆汁酸提高了产蛋后期蛋鸡的产蛋率和饲料转化，并改善血脂代谢[ref:ba_hen]；51 周龄蛋鸡添加 800 mg/kg 包被丁酸钠，产蛋性能提高、肠绒毛变长、蛋黄颜色改善[ref:sb_layer]。适合在产蛋 50 周后加入，延长产蛋高峰。',
      en: 'In late lay, fat builds up in the liver and gut function declines, so egg production slips. 60 mg/kg bile acids increased egg production and feed conversion of late-lay hens and improved blood lipids[ref:ba_hen]; 51-week-old hens fed 800 mg/kg coated sodium butyrate laid better, with longer villi and better yolk color[ref:sb_layer]. Add after about week 50 to extend peak production.'
    }
  },
  l_mold: {
    species: 'poultry',
    title: { zh: '蛋鸡霉菌毒素方案', en: 'Layer mycotoxin program' },
    items: [{ sku: 'YCW', role: { zh: '保护肠道、降低损失', en: 'Protects the gut, reduces losses' } }],
    reason: {
      zh: '蛋鸡饲养周期长，霉菌毒素会持续累积，损伤肝脏、拖累产蛋。酵母细胞壁在黄曲霉毒素与坏死性肠炎双重攻毒下降低了鸡的死亡率，部分保护生长和肠道[ref:ycw_af]。该研究来自肉鸡，蛋鸡可参照，建议全程低量添加作为日常防线。德高霉毒克-100 的成分确认后可与之配合。',
      en: 'Layers live long, so mycotoxins accumulate, damaging the liver and dragging down production. Under combined aflatoxin and necrotic enteritis challenge, yeast cell wall lowered mortality and partly protected growth and the gut[ref:ycw_af]. The study is in broilers; for layers, a continuous low dose is a sensible standing defense. Degao Meiduke-100 can be added once its composition is confirmed.'
    }
  },
  w_gut: {
    species: 'poultry',
    title: { zh: '鸭鹅肠道健康方案', en: 'Waterfowl gut-health program' },
    items: [
      { sku: 'SB50F', role: { zh: '核心：促进肠道发育', en: 'Core: gut development' } },
      { sku: 'YCW', role: { zh: '结合病原菌、减轻肠炎', en: 'Binds pathogens, eases enteritis' } }
    ],
    reason: {
      zh: '鸭鹅大肠杆菌病高发，肠道屏障是第一道防线。包被丁酸钠促进家禽肠道发育、改善黏膜形态[ref:sb_broiler]；甘露寡糖减轻大肠杆菌引起的肠道炎症和屏障损伤[ref:ycw_broiler]。两者配合，适合无抗或减抗的水禽养殖。注意：以上研究来自肉鸡，水禽上建议先小群试用。',
      en: 'Colibacillosis is common in ducks and geese, and the gut barrier is the first line of defense. Coated sodium butyrate supports gut development and mucosal structure in poultry[ref:sb_broiler]; MOS eased E. coli-induced gut inflammation and barrier damage[ref:ycw_broiler]. A good fit for antibiotic-reduced waterfowl. The studies are in broilers, so trial on a small flock first.'
    }
  },

  // ---------- 反刍 ----------
  r_calf: {
    species: 'ruminant',
    title: { zh: '犊牛腹泻与生长方案', en: 'Calf scours & growth program' },
    items: [
      { sku: 'SB98P', role: { zh: '核心：加入代乳粉，促生长', en: 'Core: in milk replacer, supports growth' } },
      { sku: 'YCW', role: { zh: '改善粪便、减少腹泻', en: 'Better feces, fewer scours' } }
    ],
    reason: {
      zh: '犊牛腹泻是牧场死淘的首要原因，也拖慢后期生长。代乳粉中添加丁酸钠，哺乳犊牛的生长速度和饲料转化率优于抗生素促生长剂组[ref:sb_calf]；甘露寡糖改善犊牛粪便评分，效果与抗生素相当，且断奶后开食料采食更多[ref:ycw_calf]。98% 丁酸钠粉末溶解快，可直接加入代乳粉，操作简单。',
      en: 'Calf scours are the top cause of losses on dairy farms and slow later growth. Sodium butyrate in milk replacer improved growth and feed conversion over an antibiotic growth promoter[ref:sb_calf]; MOS improved fecal scores as well as antibiotics did and raised starter intake after weaning[ref:ycw_calf]. The 98% sodium butyrate powder dissolves quickly and goes straight into milk replacer.'
    }
  },
  r_fattening: {
    species: 'ruminant',
    title: { zh: '育肥牛羊增重方案', en: 'Beef & lamb finishing program' },
    items: [
      { sku: 'GAA50M', role: { zh: '核心：过瘤胃肌酸前体', en: 'Core: rumen-protected creatine precursor' } },
      { sku: 'CS30M', role: { zh: '提高增重与饲料效率', en: 'Gain and feed efficiency' } }
    ],
    reason: {
      zh: '育肥期的目标是用更少的饲料长更多的肉。安格斯公牛添加胍基乙酸后采食量和日增重提高[ref:gaa_bull]；过瘤胃（包被）胍基乙酸提高湖羊日增重、降低料重比[ref:gaa_rp_sheep]，所以牛羊要选脂肪包被微囊。半胱胺提高育肥羔羊日增重、采食量和饲料效率[ref:cs_lamb]。两者一个长肉、一个提速，帮助缩短育肥期、提高屠宰收益。',
      en: 'Finishing is about more meat from less feed. Angus bulls fed guanidinoacetic acid ate more and gained faster[ref:gaa_bull], and rumen-protected GAA raised daily gain and lowered feed:gain in Hu sheep[ref:gaa_rp_sheep] — which is why cattle and sheep need the fat-coated microcapsule. Cysteamine increased daily gain, intake and feed efficiency of feedlot lambs[ref:cs_lamb]. One builds muscle, one speeds growth — a shorter finishing period and better returns.'
    }
  },
  d_transition: {
    species: 'ruminant',
    title: { zh: '奶牛围产期方案', en: 'Dairy transition program' },
    items: [
      { sku: 'RPM50', role: { zh: '核心：提高采食和产奶', en: 'Core: more intake and milk' } },
      { sku: 'RPL60', role: { zh: '补足赖氨酸、提高乳成分', en: 'Supplies lysine, more milk solids' } },
      { sku: 'RPC25', role: { zh: '帮助肝脏输出脂肪', en: 'Helps the liver export fat' } }
    ],
    reason: {
      zh: '围产期决定整个泌乳期的产量。产前 4 周到产后饲喂过瘤胃蛋氨酸，产后 30 天内每天多产奶 4.1 kg，肝功能改善[ref:met_ec]；产前开始饲喂过瘤胃赖氨酸，产后能量校正乳和乳成分产量提高[ref:lys_pre]；汇总 21 项试验，围产期补充过瘤胃胆碱使产奶量每天多 1.6 kg[ref:chol_meta]。三者都要用包被型，普通产品在瘤胃里会被分解。',
      en: 'The transition period sets yield for the whole lactation. Rumen-protected methionine from 4 weeks before calving added 4.1 kg/d milk in the first 30 days and improved liver function[ref:met_ec]; rumen-protected lysine started before calving raised energy-corrected milk and component yields[ref:lys_pre]; across 21 experiments, rumen-protected choline in transition added 1.6 kg/d milk[ref:chol_meta]. All three must be coated — plain forms are destroyed in the rumen.'
    }
  },
  d_protein: {
    species: 'ruminant',
    title: { zh: '乳蛋白与降豆粕方案', en: 'Milk protein & lower-protein program' },
    items: [
      { sku: 'RPM50', role: { zh: '核心：第一限制性氨基酸', en: 'Core: first limiting amino acid' } },
      { sku: 'RPL60', role: { zh: '第二限制性氨基酸', en: 'Second limiting amino acid' } }
    ],
    reason: {
      zh: '乳蛋白率低，常常是蛋氨酸和赖氨酸供应不足。汇总 35 项研究，过瘤胃蛋氨酸使乳蛋白率平均提高 0.07 个百分点、乳蛋白每天多 27 g[ref:met_meta]；日粮蛋白不足时，补充过瘤胃赖氨酸和蛋氨酸，产奶量和乳蛋白产量接近正常蛋白日粮[ref:lys_mp]。按约 3:1 平衡赖氨酸和蛋氨酸，有机会在不减产的前提下降低豆粕用量。',
      en: 'Low milk protein often means methionine and lysine are running short. Across 35 studies, rumen-protected methionine raised milk protein by 0.07 percentage points and 27 g/d[ref:met_meta]; on a protein-short diet, rumen-protected lysine and methionine brought milk and milk protein close to a normal-protein diet[ref:lys_mp]. Balancing lysine and methionine at about 3:1 opens the way to less soybean meal without losing milk.'
    }
  },
  d_heat: {
    species: 'ruminant',
    title: { zh: '奶牛夏季稳产方案', en: 'Dairy summer production program' },
    items: [
      { sku: 'BT70C', role: { zh: '核心：缓解热应激、提高乳成分', en: 'Core: heat relief, milk components' } },
      { sku: 'GABA40M', role: { zh: '降体温、抗氧化', en: 'Lowers body temperature, antioxidant' } }
    ],
    reason: {
      zh: '夏季高温让奶牛采食减少、乳蛋白和乳脂下降。热应激奶牛每天补充 15 g 甜菜碱，干物质采食量、乳蛋白和乳脂均有提高[ref:bt_dairy]；饲喂过瘤胃 γ-氨基丁酸的热应激奶牛，直肠温度随剂量下降，免疫和抗氧化指标改善[ref:gaba_cow]。奶牛要选 40% 包被微囊，才能通过瘤胃。',
      en: 'Summer heat lowers intake, milk protein and milk fat. Heat-stressed cows given 15 g/d betaine had higher dry matter intake, milk protein and milk fat[ref:bt_dairy]; cows fed rumen-protected GABA showed dose-related drops in rectal temperature and better immune and antioxidant status[ref:gaba_cow]. Use the 40% coated microcapsule so GABA survives the rumen.'
    }
  },
  d_mold: {
    species: 'ruminant',
    title: { zh: '奶牛霉菌毒素方案', en: 'Dairy mycotoxin program' },
    items: [{ sku: 'YCW', role: { zh: '核心：减少毒素进入牛奶', en: 'Core: less toxin carry-over to milk' } }],
    reason: {
      zh: '饲料中的黄曲霉毒素会转化为牛奶中的 M1，直接影响奶检。研究显示，含黏土矿物和灭活酵母的吸附剂，使奶牛饲料中黄曲霉毒素向牛奶的转移降低 52–63%[ref:ycw_dairy]。酵母细胞壁是这类组合中的酵母成分；德高霉毒克-100 的成分确认后，可组成「黏土 + 酵母」的完整方案。',
      en: 'Dietary aflatoxin turns into M1 in milk and directly affects milk testing. Sequestrants combining clay minerals and inactivated yeast cut aflatoxin transfer into milk by 52–63%[ref:ycw_dairy]. Yeast cell wall supplies the yeast part of that combination; once Degao Meiduke-100’s composition is confirmed, the two can form a full clay-plus-yeast program.'
    }
  },

  // ---------- 水产 ----------
  a_attract: {
    species: 'aqua',
    title: { zh: '水产诱食方案', en: 'Aquafeed attraction program' },
    items: [
      { sku: 'BT70C', role: { zh: '核心：诱食', en: 'Core: feeding attractant' } },
      { sku: 'ALC25', role: { zh: '天然抑菌、抗病', en: 'Natural antibacterial' } }
    ],
    reason: {
      zh: '植物蛋白用得越多，饲料越不受欢迎。甘氨酸甜菜碱作为诱食剂，使罗氏沼虾采食量和增重明显提高，增重比对照高 61.5%[ref:bt_prawn]；大蒜素则从健康角度加分，虹鳟饲料中添加后，感染嗜水气单胞菌的死亡率由 80% 降到 0–8%[ref:alc_trout]。一个让鱼虾爱吃，一个让鱼虾少病。',
      en: 'The more plant protein in the feed, the less fish and shrimp like it. Glycine betaine as an attractant raised feed intake and growth of giant freshwater prawn — 61.5% more gain than the control[ref:bt_prawn]. Allicin adds health: in rainbow trout it cut mortality from Aeromonas hydrophila from 80% to 0–8%[ref:alc_trout]. One makes them eat, the other keeps them healthy.'
    }
  },
  a_gut: {
    species: 'aqua',
    title: { zh: '水产肠道健康方案', en: 'Aquaculture gut-health program' },
    items: [
      { sku: 'SB40M', role: { zh: '核心：保护肠黏膜', en: 'Core: protects gut mucosa' } },
      { sku: 'TB65', role: { zh: '高豆粕饲料护肠', en: 'Gut support in high-soy feeds' } }
    ],
    reason: {
      zh: '饲料油脂氧化、豆粕用量高，都会损伤鱼虾肠道。微囊丁酸钠提高鲤鱼增重、降低饲料系数，并保护肠黏膜免受氧化油脂损伤[ref:sb_carp]；高豆粕对虾饲料中添加三丁酸甘油酯，对虾生长恢复到高鱼粉对照水平，肠黏膜厚度和免疫酶活性提高[ref:tb_shrimp]。水产料建议选微囊规格，在水中更稳定。',
      en: 'Oxidized feed oil and high soybean meal both damage the fish and shrimp gut. Microencapsulated sodium butyrate increased carp weight gain, lowered FCR and protected the mucosa from oxidized oil[ref:sb_carp]; tributyrin in high-soybean-meal shrimp feed brought growth back to the high-fishmeal control and raised mucosal thickness and immune enzymes[ref:tb_shrimp]. Choose microencapsulated grades for aquafeeds.'
    }
  },
  a_growth: {
    species: 'aqua',
    title: { zh: '水产促生长方案', en: 'Aquaculture growth program' },
    items: [
      { sku: 'TB65', role: { zh: '帮助利用植物蛋白', en: 'Helps use plant protein' } },
      { sku: 'BA10', role: { zh: '提高脂肪利用', en: 'Better fat utilization' } }
    ],
    reason: {
      zh: '饲料系数每降 0.1，都是实打实的利润。用豆粕替代鱼粉会拖累生长，高豆粕对虾饲料中添加三丁酸甘油酯后，生长恢复到高鱼粉对照水平，消化酶活性提高[ref:tb_shrimp]；胆汁酸促进大口黑鲈生长，并改善糖脂代谢[ref:ba_bass]。两者从消化和代谢两头发力，让饲料更多转化为鱼虾肉。',
      en: 'Every 0.1 drop in FCR is real profit. Replacing fishmeal with soybean meal slows growth; tributyrin in high-soybean-meal shrimp feed restored growth to the high-fishmeal control and raised digestive enzymes[ref:tb_shrimp]. Bile acids enhanced growth of largemouth bass and improved glucose and lipid metabolism[ref:ba_bass]. Working on both digestion and metabolism turns more feed into fish and shrimp.'
    }
  },
  a_liver: {
    species: 'aqua',
    title: { zh: '水产护肝方案', en: 'Aquaculture liver program' },
    items: [{ sku: 'BA10', role: { zh: '护肝、改善脂代谢', en: 'Liver support, lipid metabolism' } }],
    reason: {
      zh: '高淀粉、高脂饲料让肝脏负担加重，肝脏发白、发黄是常见信号。研究显示，胆汁酸促进大口黑鲈生长，并减轻高淀粉饲料引起的肝脏纤维化和脂质沉积[ref:ba_bass]。胆汁酸用量小，特别适合肉食性鱼类和高能量饲料。',
      en: 'High-starch and high-fat feeds burden the liver; a pale or yellow liver is a common sign. Bile acids enhanced growth of largemouth bass and alleviated liver fibrosis and lipid accumulation from a high-starch diet[ref:ba_bass]. Low inclusion, especially suited to carnivorous species and high-energy feeds.'
    }
  },
  a_immune: {
    species: 'aqua',
    title: { zh: '水产免疫抗病方案', en: 'Aquaculture immunity program' },
    items: [
      { sku: 'YCW', role: { zh: '核心：增强抗应激能力', en: 'Core: stress resistance' } },
      { sku: 'ALC25', role: { zh: '天然抑菌', en: 'Natural antibacterial' } }
    ],
    reason: {
      zh: '换季和水质波动时，鱼虾最容易发病。2–4 g/kg 甘露寡糖提高凡纳滨对虾生长和抗氨氮应激能力[ref:ycw_shrimp]；大蒜素使虹鳟感染嗜水气单胞菌的死亡率由 80% 降至 0–8%[ref:alc_trout]。建议在换季前 2 周开始添加。发病时请先咨询水产兽医，营养方案作为辅助。',
      en: 'Fish and shrimp fall ill most at season changes and when water quality swings. 2–4 g/kg MOS improved growth and ammonia-stress resistance of Pacific white shrimp[ref:ycw_shrimp]; allicin cut rainbow trout mortality from Aeromonas hydrophila from 80% to 0–8%[ref:alc_trout]. Start two weeks before the season changes; for outbreaks, consult an aquatic veterinarian first.'
    }
  }
}

module.exports = { NODES, RESULTS }
