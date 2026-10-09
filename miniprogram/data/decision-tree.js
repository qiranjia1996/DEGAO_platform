// 问答选品决策树：动物 → 类型/目的 → 具体情况 → 推荐组合
// 节点的选项用 next 指向下一个问题，或用 result 指向推荐结果。
// 推荐语里的 [ref:xxx] 对应 data/references.js 里的文献，页面上显示为 [1] [2] 编号。
// 组合与文案为行业参考，上线前需德高技术部审核。

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
      { label: { zh: '霉菌毒素', en: 'Mycotoxins' }, sub: { zh: '原料霉变、母猪繁殖问题', en: 'Moldy grain, sow reproduction' }, next: 'pig_mold' },
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
  pig_mold: {
    q: { zh: '主要是哪种情况？', en: 'Which situation fits best?' },
    options: [
      { label: { zh: '母猪假发情、繁殖差', en: 'False heat, poor reproduction' }, sub: { zh: '小母猪阴户红肿、返情', en: 'Swollen vulva in gilts, repeat breeding' }, result: 'p_zen' },
      { label: { zh: '玉米霉变的日常预防', en: 'Routine protection for moldy corn' }, sub: { zh: '原料质量不稳定', en: 'Variable grain quality' }, result: 'p_aflatoxin' }
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
      { label: { zh: '奶牛', en: 'Dairy cows' }, sub: { zh: '泌乳牛', en: 'Lactating cows' }, next: 'dairy' },
      { label: { zh: '育肥牛 / 育肥羊', en: 'Beef cattle / lambs' }, sub: { zh: '育肥期增重', en: 'Finishing gain' }, result: 'r_fattening' }
    ]
  },
  dairy: {
    q: { zh: '您最想解决什么问题？', en: 'What do you most want to solve?' },
    options: [
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
const RESULTS = {
  // ---------- 猪 ----------
  p_wean: {
    species: 'pig',
    title: { zh: '断奶仔猪腹泻方案', en: 'Post-weaning diarrhea program' },
    items: [
      { sku: 'SB30C', role: { zh: '核心：修复肠黏膜', en: 'Core: repairs gut lining' } },
      { sku: 'TA40C', role: { zh: '收敛止泻', en: 'Fast anti-diarrheal' } },
      { sku: 'TB60', role: { zh: '后肠供能、不影响适口性', en: 'Hindgut energy, palatable' } }
    ],
    reason: {
      zh: '断奶应激让仔猪肠绒毛萎缩、屏障受损，是腹泻高发的根源。方案以包被丁酸钠为核心：试验中它配合减半抗生素，仍让断奶仔猪增重更快、腹泻更少[ref:sb_piglet]；单宁酸在不影响生长的前提下降低断奶腹泻率[ref:ta_piglet][ref:ta_review]；三丁酸甘油酯提高断奶仔猪日增重和饲料效率[ref:tb_piglet]。三者分工互补，适合禁抗后的保育前期。建议从断奶前一周开始添加，德高技术团队可协助确定用量。',
      en: 'Weaning stress shrinks villi and weakens the gut barrier — the root of post-weaning scours. Coated sodium butyrate is the core: with antibiotics halved, piglets still grew faster with less diarrhea[ref:sb_piglet]. Tannic acid lowers post-weaning diarrhea without hurting growth[ref:ta_piglet][ref:ta_review], and tributyrin improves daily gain and feed efficiency[ref:tb_piglet]. Start a week before weaning; Degao’s technical team can help set the dose.'
    }
  },
  p_creep: {
    species: 'pig',
    title: { zh: '教槽期开食方案', en: 'Creep-feeding program' },
    items: [
      { sku: 'TB60', role: { zh: '无异味丁酸源，促进肠道发育', en: 'Odorless butyrate for gut development' } },
      { sku: 'ALC', role: { zh: '抑菌，减少腹泻', en: 'Antibacterial, fewer scours' } }
    ],
    reason: {
      zh: '教槽料吃得好，断奶才过得顺。三丁酸甘油酯几乎无异味，不会影响教槽料适口性，研究显示它能减轻仔猪肠道损伤[ref:tb_injury]、提高断奶仔猪增重和饲料效率[ref:tb_piglet]；大蒜素在断奶仔猪试验中提高日增重，并随添加量增加线性降低腹泻发生率[ref:alc_piglet]。两者搭配，帮助仔猪早开食、少拉稀，为断奶打好肠道基础。',
      en: 'Good creep-feed intake means a smoother weaning. Tributyrin is nearly odorless, so it keeps creep feed palatable; it alleviated intestinal injury in piglets[ref:tb_injury] and improved gain and feed efficiency after weaning[ref:tb_piglet]. Allicin raised daily gain in weaned piglets and reduced diarrhea in a dose-dependent way[ref:alc_piglet]. Together they help piglets start eating early and arrive at weaning with a healthier gut.'
    }
  },
  p_grower: {
    species: 'pig',
    title: { zh: '生长育肥猪肠道方案', en: 'Grower gut-health program' },
    items: [
      { sku: 'KDF95', role: { zh: '酸化，抑制有害菌', en: 'Acidifier, curbs pathogens' } },
      { sku: 'SB90G', role: { zh: '修复肠黏膜', en: 'Repairs gut lining' } }
    ],
    reason: {
      zh: '生长育肥猪粪便不成形，多与肠道菌群失衡和黏膜受损有关。二甲酸钾经欧盟 EFSA 评估，对断奶仔猪和育肥猪安全，并作为酸度调节剂有效[ref:kdf_efsa]，试验中还减少了仔猪肠道大肠杆菌和沙门氏菌排出[ref:kdf_salm]；丁酸钠为肠上皮供能，在仔猪试验中显示出改善肠道、减少腹泻的作用[ref:sb_piglet]。建议先在一栋猪舍试用 4 周，对比粪便评分和料肉比。',
      en: 'Loose feces in growers usually come from disturbed gut flora and a damaged mucosa. EFSA assessed potassium diformate as safe for weaned piglets and fattening pigs and efficacious as an acidity regulator[ref:kdf_efsa]; it also lowered intestinal E. coli and Salmonella shedding in piglets[ref:kdf_salm]. Sodium butyrate fuels gut cells and reduced diarrhea in piglet trials[ref:sb_piglet]. Try it in one barn for 4 weeks and compare fecal scores and FCR.'
    }
  },
  p_agp_nursery: {
    species: 'pig',
    title: { zh: '保育猪替抗方案', en: 'Nursery antibiotic-free program' },
    items: [
      { sku: 'SB30C', role: { zh: '核心：肠道屏障', en: 'Core: gut barrier' } },
      { sku: 'ORP', role: { zh: '植物抑菌、抗氧化', en: 'Phytogenic antibacterial & antioxidant' } },
      { sku: 'KDF95', role: { zh: '酸化，抑制有害菌', en: 'Acidifier, curbs pathogens' } }
    ],
    reason: {
      zh: '禁抗后，保育阶段要同时守住肠道屏障、控制有害菌。包被丁酸钠在减半抗生素的条件下仍提高了断奶仔猪增重、降低腹泻[ref:sb_piglet]；牛至中的香芥酚和百里酚减轻断奶仔猪肠道氧化应激，增加乳酸菌、减少大肠杆菌[ref:orp_piglet]；二甲酸钾经 EFSA 评估在仔猪上安全有效[ref:kdf_efsa]，并能减少沙门氏菌排出[ref:kdf_salm]。三条作用路线叠加，是目前主流的保育期替抗思路。',
      en: 'Without antibiotics, the nursery must protect the gut barrier and control pathogens at the same time. Coated sodium butyrate improved gain and cut diarrhea even with antibiotics halved[ref:sb_piglet]; oregano phenols (carvacrol and thymol) reduced intestinal oxidative stress, raising Lactobacillus and lowering E. coli[ref:orp_piglet]; potassium diformate is EFSA-assessed for piglets[ref:kdf_efsa] and reduces Salmonella shedding[ref:kdf_salm]. Three complementary routes — the mainstream nursery AGP-free approach.'
    }
  },
  p_agp_finisher: {
    species: 'pig',
    title: { zh: '生长育肥猪替抗方案', en: 'Grow-finish antibiotic-free program' },
    items: [
      { sku: 'ORP', role: { zh: '植物抑菌、抗氧化', en: 'Phytogenic antibacterial & antioxidant' } },
      { sku: 'ALC', role: { zh: '天然抑菌', en: 'Natural antibacterial' } }
    ],
    reason: {
      zh: '生长育肥阶段用量大、周期长，替抗方案要兼顾效果和成本。牛至双酚的有效成分香芥酚和百里酚可减少肠道大肠杆菌、减轻氧化应激[ref:orp_piglet]；大蒜类提取物在大肠杆菌攻毒试验中降低了猪的腹泻和炎症反应[ref:alc_garlic]。两种植物源产品添加量小、成本可控，适合长期使用。注意：以上研究多在断奶仔猪上进行，育肥阶段建议先小批量验证。',
      en: 'In grow-finish, volumes are large and periods long, so an AGP-free plan must balance results and cost. Carvacrol and thymol — the actives in oregano — lower intestinal E. coli and oxidative stress[ref:orp_piglet], and garlic extracts reduced diarrhea and inflammation in E. coli-challenged pigs[ref:alc_garlic]. Both are low-inclusion and cost-controlled. Note: most studies were in weaned pigs, so validate on a small batch first.'
    }
  },
  p_lean: {
    species: 'pig',
    title: { zh: '育肥后期瘦肉率方案', en: 'Finishing lean-yield program' },
    items: [
      { sku: 'CS30C', role: { zh: '促生长激素分泌', en: 'Supports growth hormone' } },
      { sku: 'BT70C', role: { zh: '降背膘、节约蛋氨酸', en: 'Less backfat, spares methionine' } }
    ],
    reason: {
      zh: '育肥后期多长的是脂肪，提高瘦肉率要从激素和代谢两头入手。半胱胺在 70 mg/kg 时提高育肥猪日增重和 IGF-I，剂量过高反而无效[ref:cs_pig]，因此要严格按推荐量添加；甜菜碱在 0.25% 时降低育肥猪背膘、改善胴体性状[ref:bt_pig]。两者配合，帮助育肥猪多长肉、少长膘，提高胴体等级和售价。',
      en: 'Late finishing puts on mostly fat, so lean yield must be tackled through both hormones and metabolism. Cysteamine at 70 mg/kg raised daily gain and IGF-I in finishing pigs, while a higher dose did not[ref:cs_pig] — follow the recommended inclusion. Betaine at 0.25% reduced backfat and improved carcass traits[ref:bt_pig]. Together they help pigs put on lean instead of fat for a better carcass grade and price.'
    }
  },
  p_adg: {
    species: 'pig',
    title: { zh: '日增重与料肉比方案', en: 'Daily-gain & FCR program' },
    items: [
      { sku: 'GAA', role: { zh: '肌酸前体，提升能量代谢', en: 'Creatine precursor, energy metabolism' } },
      { sku: 'CS30C', role: { zh: '促生长', en: 'Growth support' } }
    ],
    reason: {
      zh: '长得慢、出栏晚，往往是肌肉能量供应跟不上。胍基乙酸是肌酸前体，300 mg/kg 时生长育肥猪日增重和终末体重达到最佳[ref:gaa_pig]；半胱胺适量添加可提高育肥猪日增重[ref:cs_pig]。两者从能量代谢和生长激素两条路线提速，缩短出栏时间、摊薄饲养成本。',
      en: 'Slow growth often means muscles run short of energy. Guanidinoacetic acid, the creatine precursor, maximised daily gain and final weight of growing-finishing pigs at 300 mg/kg[ref:gaa_pig], and cysteamine at the right dose raised daily gain[ref:cs_pig]. Two routes — energy metabolism and growth hormone — to shorten days to market and spread costs.'
    }
  },
  p_heat: {
    species: 'pig',
    title: { zh: '猪夏季抗热应激方案', en: 'Swine summer heat-stress program' },
    items: [
      { sku: 'BT70C', role: { zh: '核心：调节渗透压', en: 'Core: osmoregulation' } },
      { sku: 'GABA95', role: { zh: '稳定采食', en: 'Supports feed intake' } }
    ],
    reason: {
      zh: '高温下猪采食下降、生长变慢，夏季每多一天都是成本。甜菜碱帮助细胞维持渗透平衡，热应激条件下添加 0.1% 甜菜碱的生长育肥猪日增重高于对照[ref:bt_pig_hs]；γ-氨基丁酸在热应激肉鸡上提高了采食量和增重，并降低体温[ref:gaba_fi]，可作为稳定采食的辅助。建议在入夏前两周开始添加，GABA 在猪上的效果请先小批量验证。',
      en: 'In heat, pigs eat less and grow slower — every extra summer day costs money. Betaine helps cells keep osmotic balance; heat-stressed growing-finishing pigs fed 0.1% betaine gained faster than controls[ref:bt_pig_hs]. GABA raised intake and gain and lowered body temperature in heat-stressed broilers[ref:gaba_fi], so it can support appetite. Start two weeks before summer; validate GABA in pigs on a small batch first.'
    }
  },
  p_zen: {
    species: 'pig',
    title: { zh: '母猪玉米赤霉烯酮防控方案', en: 'Sow zearalenone control program' },
    items: [
      { sku: 'MDK', role: { zh: '核心：吸附霉菌毒素', en: 'Core: binds mycotoxins' } },
      { sku: 'YCW', role: { zh: '辅助吸附、免疫支持', en: 'Extra binding, immune support' } }
    ],
    reason: {
      zh: '小母猪阴户红肿、返情增多，常与玉米赤霉烯酮（ZEN）有关，它有类雌激素作用。研究显示，活化黏土类吸附剂能抵消 ZEN 引起的仔猪子宫、卵巢增大，并减少毒素残留[ref:mdk_zen]；黏土与灭活酵母组合的吸附剂可显著减少毒素吸收[ref:mdk_dairy]，酵母细胞壁在霉菌毒素攻毒时还能降低死亡率、保护肠道[ref:ycw_af]。霉毒克配合酵母细胞壁，适合母猪群长期使用。',
      en: 'Swollen vulvas and repeat breeding in gilts are often linked to zearalenone (ZEN), which acts like estrogen. Activated clay counteracted ZEN-induced enlargement of the uterus and ovaries and reduced residues[ref:mdk_zen]; clay plus inactivated yeast sharply reduced toxin absorption[ref:mdk_dairy], and yeast cell wall lowered mortality and protected the gut under mycotoxin challenge[ref:ycw_af]. A good long-term plan for the sow herd.'
    }
  },
  p_aflatoxin: {
    species: 'pig',
    title: { zh: '原料霉变日常防护', en: 'Routine mycotoxin protection' },
    items: [{ sku: 'MDK', role: { zh: '吸附黄曲霉毒素等', en: 'Binds aflatoxin and others' } }],
    reason: {
      zh: '玉米质量不稳定时，与其事后补救，不如全程加一道防线。经典试验中，膨润土类吸附剂改善了黄曲霉毒素污染日粮下断奶仔猪的日增重和采食量，并减轻肝功能指标异常[ref:mdk_pig_af]。霉毒克添加量随原料霉变程度调整，原料好时低量预防、霉变明显时加量，成本可控。',
      en: 'When grain quality varies, a standing line of defense beats firefighting. In classic trials, bentonite-type binders improved gain and intake of weanling pigs on aflatoxin-contaminated diets and eased liver enzyme changes[ref:mdk_pig_af]. Adjust the dose to contamination level — low for prevention, higher when mold is visible — to keep costs in check.'
    }
  },
  p_immune: {
    species: 'pig',
    title: { zh: '猪群免疫力方案', en: 'Swine immunity program' },
    items: [
      { sku: 'YCW', role: { zh: '激活免疫', en: 'Immune activation' } },
      { sku: 'ALC', role: { zh: '天然抑菌', en: 'Natural antibacterial' } }
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
      { sku: 'SB30C', role: { zh: '核心：肠道发育', en: 'Core: gut development' } },
      { sku: 'GOX', role: { zh: '降低肠道 pH、提高消化', en: 'Lowers gut pH, aids digestion' } },
      { sku: 'ORP', role: { zh: '保护肠道完整性', en: 'Protects gut integrity' } }
    ],
    reason: {
      zh: '肉鸡过料、肠炎，说明肠道消化吸收和屏障出了问题。包被丁酸钠改善肉鸡肠道发育、黏膜形态和菌群[ref:sb_broiler]；葡萄糖氧化酶提高肉鸡生长和养分消化率[ref:gox_broiler]，并降低回肠 pH、改善肠绒毛[ref:gox_ne]；含香芥酚和百里酚的精油改善了产气荚膜梭菌感染肉鸡的肠道完整性[ref:orp_ne]。三管齐下，让饲料消化得更充分。',
      en: 'Undigested feed and enteritis mean digestion and the gut barrier are struggling. Coated sodium butyrate improves gut development, mucosal structure and microbiota[ref:sb_broiler]; glucose oxidase improves growth and nutrient digestibility[ref:gox_broiler] while lowering ileal pH and improving villi[ref:gox_ne]; carvacrol-thymol essential oil protected gut integrity in C. perfringens-challenged broilers[ref:orp_ne]. Three routes to get more out of every bag of feed.'
    }
  },
  b_agp: {
    species: 'poultry',
    title: { zh: '肉鸡替抗方案', en: 'Broiler antibiotic-free program' },
    items: [
      { sku: 'ORP', role: { zh: '植物抑菌、促生长', en: 'Phytogenic, supports growth' } },
      { sku: 'KDF95', role: { zh: '控制产气荚膜梭菌', en: 'Controls C. perfringens' } }
    ],
    reason: {
      zh: '无抗肉鸡最大的风险是坏死性肠炎。百里酚与香芥酚提高肉鸡生长性能、抗氧化和消化酶活性，并增强免疫反应[ref:orp_broiler]，还能减轻产气荚膜梭菌造成的肠道损伤[ref:orp_ne]；二甲酸钾在坏死性肠炎攻毒后减少了空肠产气荚膜梭菌和肠杆菌数量[ref:kdf_broiler]。植物精油加有机酸盐，是无抗肉鸡的常用组合。',
      en: 'Necrotic enteritis is the biggest risk in antibiotic-free broilers. Thymol and carvacrol improved broiler performance, antioxidant and digestive enzymes and immunity[ref:orp_broiler] and reduced gut damage from C. perfringens[ref:orp_ne]; potassium diformate lowered jejunal C. perfringens and Enterobacteria after a necrotic enteritis challenge[ref:kdf_broiler]. Essential oil plus an organic acid salt is a proven AGP-free pairing.'
    }
  },
  b_growth: {
    species: 'poultry',
    title: { zh: '肉鸡胸肉率方案', en: 'Broiler breast-yield program' },
    items: [
      { sku: 'GAA', role: { zh: '核心：肌肉能量、胸肉率', en: 'Core: muscle energy, breast yield' } },
      { sku: 'BA30', role: { zh: '提高脂肪利用', en: 'Better fat utilization' } }
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
    items: [
      { sku: 'MDK', role: { zh: '核心：吸附黄曲霉毒素', en: 'Core: binds aflatoxin' } },
      { sku: 'YCW', role: { zh: '保护肠道、降低死亡', en: 'Protects gut, lowers mortality' } }
    ],
    reason: {
      zh: '雏鸡对黄曲霉毒素尤其敏感。经典试验中，1% 铝硅酸盐类吸附剂完全预防了 4 mg/kg 黄曲霉毒素对肉鸡生长和器官的毒害[ref:mdk_broiler]；酵母细胞壁在黄曲霉毒素与坏死性肠炎双重攻毒下降低了死亡率，部分保护生长和肠道[ref:ycw_af]。吸附加保护，原料不理想时也能守住生长。',
      en: 'Chicks are especially sensitive to aflatoxin. In a classic trial, 1% aluminosilicate binder fully prevented the toxic effects of 4 mg/kg aflatoxin on broiler growth and organs[ref:mdk_broiler]; yeast cell wall lowered mortality and partly protected growth and gut health under aflatoxin plus necrotic enteritis challenge[ref:ycw_af]. Binding plus protection keeps growth on track even with imperfect grain.'
    }
  },
  l_heat: {
    species: 'poultry',
    title: { zh: '蛋鸡夏季稳产方案', en: 'Layer summer production program' },
    items: [
      { sku: 'BT70C', role: { zh: '核心：缓解热应激', en: 'Core: heat-stress relief' } },
      { sku: 'GABA95', role: { zh: '稳定采食', en: 'Supports feed intake' } }
    ],
    reason: {
      zh: '夏季产蛋率下滑，根源是高温导致采食下降和代谢紊乱。慢性热应激蛋鸡添加 1000 mg/kg 甜菜碱后产蛋性能提高[ref:bt_hen]；γ-氨基丁酸在热应激家禽上提高采食量并降低体温[ref:gaba_fi]，可帮助稳住采食。建议入夏前开始添加，配合通风降温效果更好。GABA 的研究来自肉鸡，在蛋鸡上建议先小批量试用。',
      en: 'Summer drops in lay come from heat-driven loss of appetite and metabolic stress. Hens under chronic heat stress laid better with 1000 mg/kg betaine[ref:bt_hen]; GABA raised intake and lowered body temperature in heat-stressed poultry[ref:gaba_fi], helping keep birds eating. Start before summer and combine with ventilation. The GABA evidence is from broilers, so trial it on a small flock first.'
    }
  },
  l_late: {
    species: 'poultry',
    title: { zh: '产蛋后期护肝方案', en: 'Late-lay liver program' },
    items: [{ sku: 'BA30', role: { zh: '改善脂代谢、护肝', en: 'Lipid metabolism, liver support' } }],
    reason: {
      zh: '产蛋后期蛋鸡肝脏脂肪蓄积多，产蛋率随之下滑。研究显示，60 mg/kg 胆汁酸提高了产蛋后期蛋鸡的产蛋率和饲料转化，并改善血脂代谢、增加肠道有益菌[ref:ba_hen]。胆汁酸用量小、见效稳，适合在产蛋 50 周后加入，延长产蛋高峰、提高淘汰前的总产蛋量。',
      en: 'In late lay, fat builds up in the liver and egg production slips. 60 mg/kg bile acids increased egg production and feed conversion of late-phase hens, improved serum lipids and enriched beneficial gut bacteria[ref:ba_hen]. A low-inclusion, steady option to add after about week 50 to extend peak and raise total eggs per hen.'
    }
  },
  l_mold: {
    species: 'poultry',
    title: { zh: '蛋鸡霉菌毒素方案', en: 'Layer mycotoxin program' },
    items: [
      { sku: 'MDK', role: { zh: '吸附霉菌毒素', en: 'Binds mycotoxins' } },
      { sku: 'YCW', role: { zh: '保护肠道', en: 'Protects the gut' } }
    ],
    reason: {
      zh: '蛋鸡饲养周期长，霉菌毒素会持续累积，损伤肝脏、拖累产蛋。铝硅酸盐类吸附剂在试验中完全预防了黄曲霉毒素对家禽的毒害[ref:mdk_broiler]；酵母细胞壁在霉菌毒素攻毒下降低死亡率、保护肠道[ref:ycw_af]。以上研究来自肉鸡，蛋鸡可参照，建议全程低量添加作为日常防线。',
      en: 'Layers live long, so mycotoxins accumulate, damaging the liver and dragging down production. An aluminosilicate binder fully prevented aflatoxin toxicity in poultry[ref:mdk_broiler], and yeast cell wall lowered mortality and protected the gut under mycotoxin challenge[ref:ycw_af]. The studies are in broilers; for layers, a continuous low dose is a sensible standing defense.'
    }
  },
  w_gut: {
    species: 'poultry',
    title: { zh: '鸭鹅肠道健康方案', en: 'Waterfowl gut-health program' },
    items: [
      { sku: 'GOX', role: { zh: '核心：改善肠道屏障', en: 'Core: gut barrier' } },
      { sku: 'SB30C', role: { zh: '促进肠道发育', en: 'Gut development' } }
    ],
    reason: {
      zh: '鸭鹅大肠杆菌病高发，肠道屏障是第一道防线。葡萄糖氧化酶改善了大肠杆菌感染鸭的生长、免疫和肠道屏障，多数指标与抗生素组无显著差异[ref:gox_duck]；包被丁酸钠促进家禽肠道发育、改善黏膜形态[ref:sb_broiler]。两者配合，适合无抗或减抗的水禽养殖。',
      en: 'Colibacillosis is common in ducks and geese, and the gut barrier is the first line of defense. Glucose oxidase improved growth, immunity and gut barrier of E. coli-infected ducks, comparable to antibiotics on most measures[ref:gox_duck]; coated sodium butyrate supports gut development and mucosal structure in poultry[ref:sb_broiler]. A good fit for antibiotic-reduced waterfowl.'
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
      zh: '犊牛腹泻是牧场死淘的首要原因，也拖慢后期生长。代乳粉中添加丁酸钠，哺乳犊牛的生长速度和饲料转化率优于抗生素促生长剂组[ref:sb_calf]；甘露寡糖改善犊牛粪便评分，效果与抗生素相当，且断奶后开食料采食更多[ref:ycw_calf]。丁酸钠粉可按每头每天 4–9 g 直接加入代乳粉，操作简单。',
      en: 'Calf scours are the top cause of losses on dairy farms and slow later growth. Sodium butyrate in milk replacer improved growth and feed conversion over an antibiotic growth promoter[ref:sb_calf]; MOS improved fecal scores as well as antibiotics did and raised starter intake after weaning[ref:ycw_calf]. Sodium butyrate powder goes straight into milk replacer at 4–9 g per calf per day.'
    }
  },
  r_fattening: {
    species: 'ruminant',
    title: { zh: '育肥牛羊增重方案', en: 'Beef & lamb finishing program' },
    items: [
      { sku: 'CS30C', role: { zh: '提高增重与饲料效率', en: 'Gain and feed efficiency' } },
      { sku: 'GAA', role: { zh: '增加肌肉量', en: 'More muscle mass' } }
    ],
    reason: {
      zh: '育肥期的目标是用更少的饲料长更多的肉。半胱胺提高育肥羔羊日增重、采食量和饲料效率[ref:cs_lamb]；胍基乙酸提高羔羊体重和肌肉量，并改善肉品系水力[ref:gaa_lamb]。两者一个提速、一个长肉，帮助缩短育肥期、提高屠宰收益。以上研究来自羔羊，育肥牛可参照，建议先小群试用。',
      en: 'Finishing is about more meat from less feed. Cysteamine increased daily gain, intake and feed efficiency of feedlot lambs[ref:cs_lamb]; guanidinoacetic acid increased body weight and muscle mass of lambs and improved meat water-holding[ref:gaa_lamb]. One speeds growth, one builds muscle — a shorter finishing period and better returns. The studies are in lambs; trial it on a small group of cattle first.'
    }
  },
  d_heat: {
    species: 'ruminant',
    title: { zh: '奶牛夏季稳产方案', en: 'Dairy summer production program' },
    items: [{ sku: 'BT70C', role: { zh: '缓解热应激、提高乳成分', en: 'Heat relief, milk components' } }],
    reason: {
      zh: '夏季高温让奶牛采食减少、乳蛋白和乳脂下降。研究显示，热应激奶牛每天补充 15 g 甜菜碱，干物质采食量、乳蛋白和乳脂均有提高[ref:bt_dairy]。甜菜碱同时是高效甲基供体，用量小、成本低，是奶牛度夏最省心的营养手段之一。',
      en: 'Summer heat lowers intake, milk protein and milk fat. Heat-stressed cows given 15 g/d betaine had higher dry matter intake, milk protein and milk fat[ref:bt_dairy]. Betaine is also an efficient methyl donor — low dose, low cost, one of the simplest nutritional tools for summer.'
    }
  },
  d_mold: {
    species: 'ruminant',
    title: { zh: '奶牛霉菌毒素方案', en: 'Dairy mycotoxin program' },
    items: [
      { sku: 'MDK', role: { zh: '核心：吸附黄曲霉毒素', en: 'Core: binds aflatoxin' } },
      { sku: 'YCW', role: { zh: '协同吸附', en: 'Synergistic binding' } }
    ],
    reason: {
      zh: '饲料中的黄曲霉毒素会转化为牛奶中的 M1，直接影响奶检。研究显示，含黏土矿物和灭活酵母的吸附剂，使奶牛饲料中黄曲霉毒素向牛奶的转移降低 52–63%[ref:mdk_dairy]。霉毒克配合酵母细胞壁，正是这种「黏土 + 酵母」的组合思路，帮助牧场守住牛奶安全。',
      en: 'Dietary aflatoxin turns into M1 in milk and directly affects milk testing. Sequestrants combining clay minerals and inactivated yeast cut the transfer of aflatoxin into milk by 52–63%[ref:mdk_dairy]. Pairing the mycotoxin binder with yeast cell wall follows exactly this clay-plus-yeast approach to protect milk safety.'
    }
  },

  // ---------- 水产 ----------
  a_attract: {
    species: 'aqua',
    title: { zh: '水产诱食方案', en: 'Aquafeed attraction program' },
    items: [
      { sku: 'BT70C', role: { zh: '核心：诱食', en: 'Core: feeding attractant' } },
      { sku: 'ALC', role: { zh: '天然抑菌、抗病', en: 'Natural antibacterial' } }
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
      { sku: 'SB30C', role: { zh: '核心：修复肠黏膜', en: 'Core: repairs gut mucosa' } },
      { sku: 'KDF95', role: { zh: '改善消化、增强抗病', en: 'Digestion and disease resistance' } }
    ],
    reason: {
      zh: '饲料油脂氧化、换季应激都会损伤鱼虾肠道。微囊丁酸钠提高鲤鱼增重、降低饲料系数，并保护肠黏膜免受氧化油脂损伤[ref:sb_carp]；二甲酸钾提高罗非鱼采食、增重和蛋白消化率，并增强抗嗜水气单胞菌能力[ref:kdf_tilapia]。肠道好了，饲料系数和成活率才稳得住。',
      en: 'Oxidised feed oils and seasonal stress both damage the fish gut. Microencapsulated sodium butyrate increased weight gain and lowered FCR in carp while protecting the mucosa from oxidised oil[ref:sb_carp]; potassium diformate improved intake, growth and protein digestibility of tilapia and resistance to Aeromonas hydrophila[ref:kdf_tilapia]. A healthy gut keeps FCR and survival on track.'
    }
  },
  a_growth: {
    species: 'aqua',
    title: { zh: '水产促生长方案', en: 'Aquaculture growth program' },
    items: [
      { sku: 'KDF95', role: { zh: '提高采食与消化', en: 'Intake and digestibility' } },
      { sku: 'BA30', role: { zh: '提高脂肪利用', en: 'Better fat utilization' } }
    ],
    reason: {
      zh: '饲料系数每降 0.1，都是实打实的利润。0.2–0.3% 二甲酸钾提高罗非鱼采食量、增重和蛋白消化率[ref:kdf_tilapia]；胆汁酸促进大口黑鲈生长，并改善糖脂代谢[ref:ba_bass]。两者从消化和代谢两头发力，让饲料更多转化为鱼肉。',
      en: 'Every 0.1 drop in FCR is real profit. 0.2–0.3% potassium diformate improved feed intake, growth and protein digestibility of tilapia[ref:kdf_tilapia]; bile acids enhanced growth of largemouth bass and improved glucose and lipid metabolism[ref:ba_bass]. Working on both digestion and metabolism turns more feed into fish.'
    }
  },
  a_liver: {
    species: 'aqua',
    title: { zh: '水产护肝方案', en: 'Aquaculture liver program' },
    items: [{ sku: 'BA30', role: { zh: '护肝、改善脂代谢', en: 'Liver support, lipid metabolism' } }],
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
      { sku: 'ALC', role: { zh: '天然抑菌', en: 'Natural antibacterial' } }
    ],
    reason: {
      zh: '换季和水质波动时，鱼虾最容易发病。2–4 g/kg 甘露寡糖提高凡纳滨对虾生长和抗氨氮应激能力[ref:ycw_shrimp]；大蒜素使虹鳟感染嗜水气单胞菌的死亡率由 80% 降至 0–8%[ref:alc_trout]。建议在换季前 2 周开始添加。发病时请先咨询水产兽医，营养方案作为辅助。',
      en: 'Fish and shrimp fall ill most at season changes and when water quality swings. 2–4 g/kg MOS improved growth and ammonia-stress resistance of Pacific white shrimp[ref:ycw_shrimp]; allicin cut rainbow trout mortality from Aeromonas hydrophila from 80% to 0–8%[ref:alc_trout]. Start two weeks before the season changes; for outbreaks, consult an aquatic veterinarian first.'
    }
  }
}

module.exports = { NODES, RESULTS }
