// 德高农牧产品目录
// 产品系列与规格来自德高官网（degaonongmu.com，2024-12 / 2025-02 存档）。
// 功能说明与参考添加量为行业通用参考，正式上线前需由德高技术部审核。
// price 为 Alpha 演示价格（元/kg），不是真实报价。

const CATEGORIES = [
  { id: 'acid', zh: '有机酸与丁酸', en: 'Organic Acids & Butyrates' },
  { id: 'nutri', zh: '功能性营养', en: 'Functional Nutrition' },
  { id: 'plant', zh: '植物提取物', en: 'Phytogenics' },
  { id: 'bio', zh: '酶与免疫多糖', en: 'Enzymes & Immunity' },
  { id: 'detox', zh: '霉菌毒素管理', en: 'Mycotoxin Control' }
]

const SPECIES = [
  { id: 'pig', zh: '猪', en: 'Swine' },
  { id: 'poultry', zh: '家禽', en: 'Poultry' },
  { id: 'ruminant', zh: '反刍', en: 'Ruminant' },
  { id: 'aqua', zh: '水产', en: 'Aqua' }
]

const SERIES = {
  butyrate: {
    cat: 'acid',
    formula: 'C₄H₇NaO₂',
    name: { zh: '丁酸钠', en: 'Sodium Butyrate' },
    species: ['pig', 'poultry', 'ruminant', 'aqua'],
    intro: {
      zh: '丁酸是肠上皮细胞最主要的能量来源。丁酸钠可促进肠绒毛发育、修复肠黏膜屏障、调节肠道菌群，是“饲料禁抗”后替抗、减抗方案的核心原料。包被型产品可在肠道后段缓慢释放，作用更持久。',
      en: 'Butyrate is the primary energy source for intestinal epithelial cells. Sodium butyrate supports villus development, repairs the mucosal barrier and balances gut microbiota — a cornerstone of antibiotic-free feeding programs. Coated grades release gradually along the lower gut.'
    },
    benefits: {
      zh: ['修复肠黏膜，降低腹泻率', '提高采食量与日增重', '调节菌群，抑制有害菌', '替抗、减抗方案核心原料'],
      en: ['Repairs gut lining, reduces diarrhea', 'Improves feed intake and daily gain', 'Balances microbiota, suppresses pathogens', 'Core of antibiotic-free programs']
    },
    keywords: ['腹泻', '拉稀', '肠道', '肠炎', '肠健康', '断奶', '仔猪', '替抗', '减抗', '无抗', '禁抗', '采食', '增重', '犊牛', '黏膜', 'diarrhea', 'scour', 'gut', 'intestin', 'wean', 'antibiotic', 'calf', 'butyr']
  },
  tributyrin: {
    cat: 'acid',
    formula: 'C₁₅H₂₆O₆',
    name: { zh: '三丁酸甘油酯', en: 'Tributyrin' },
    species: ['pig', 'poultry', 'ruminant', 'aqua'],
    intro: {
      zh: '三丁酸甘油酯是丁酸的甘油酯形式，几乎无异味、适口性好。在小肠经脂肪酶水解后释放丁酸，能到达肠道中后段发挥作用，是新一代高效丁酸源。',
      en: 'A glyceride form of butyrate with almost no odor and excellent palatability. It is hydrolyzed by lipase in the small intestine, delivering butyrate further along the gut — a next-generation butyrate source.'
    },
    benefits: {
      zh: ['无异味，不影响适口性', '肠道中后段精准释放', '促进肠道发育与修复', '可与丁酸钠搭配使用'],
      en: ['Odorless, keeps feed palatable', 'Targeted release in mid/lower gut', 'Supports gut development and repair', 'Pairs well with sodium butyrate']
    },
    keywords: ['腹泻', '肠道', '断奶', '适口性', '异味', '替抗', '减抗', '肠健康', '乳猪', '教槽', 'palatab', 'odor', 'gut', 'wean', 'tributyrin']
  },
  kdf: {
    cat: 'acid',
    formula: 'KH(HCOO)₂',
    name: { zh: '二甲酸钾', en: 'Potassium Diformate' },
    species: ['pig', 'poultry', 'aqua'],
    intro: {
      zh: '二甲酸钾是欧盟首个批准的非抗生素类促生长饲料添加剂。它可降低胃肠道 pH，抑制大肠杆菌、沙门氏菌等有害菌，提高蛋白质消化率，促进生长。',
      en: 'The first non-antibiotic growth promoter approved in the EU. It lowers gastrointestinal pH, suppresses E. coli and Salmonella, and improves protein digestibility and growth.'
    },
    benefits: {
      zh: ['降低胃肠 pH，提高消化率', '抑制大肠杆菌、沙门氏菌', '提高日增重与饲料转化率', '水产养殖改善水体与肠道'],
      en: ['Lowers gut pH, boosts digestibility', 'Inhibits E. coli and Salmonella', 'Improves daily gain and FCR', 'Supports gut and water quality in aqua']
    },
    keywords: ['大肠杆菌', '沙门', '酸化', '酸化剂', 'ph', '消化', '促生长', '料肉比', '饲料转化', '虾', '水产', 'e. coli', 'salmonella', 'acidif', 'digest', 'growth', 'fcr', 'shrimp']
  },
  cysteamine: {
    cat: 'nutri',
    formula: 'C₂H₇NS·HCl',
    name: { zh: '半胱胺盐酸盐', en: 'Cysteamine HCl' },
    species: ['pig', 'poultry', 'ruminant', 'aqua'],
    intro: {
      zh: '半胱胺可调节体内生长抑素水平，促进生长激素等的分泌，从而提高日增重、瘦肉率和饲料转化效率。包被工艺可保护有效成分、减少刺激、提高稳定性。',
      en: 'Cysteamine modulates somatostatin levels and promotes growth hormone secretion, improving daily gain, lean meat yield and feed efficiency. Coating protects the active ingredient and improves stability.'
    },
    benefits: {
      zh: ['提高日增重与瘦肉率', '改善饲料转化效率', '包被工艺，稳定性高', '育肥阶段效果明显'],
      en: ['Higher daily gain and lean yield', 'Better feed conversion', 'Coated for stability', 'Strong results in finishing stage']
    },
    keywords: ['增重', '瘦肉', '生长', '育肥', '出栏', '料肉比', '饲料转化', '生长激素', '产奶', '奶牛', 'growth', 'lean', 'finish', 'fcr', 'weight gain', 'milk']
  },
  gaba: {
    cat: 'nutri',
    formula: 'C₄H₉NO₂',
    name: { zh: 'γ-氨基丁酸', en: 'GABA' },
    species: ['pig', 'poultry', 'ruminant'],
    intro: {
      zh: 'γ-氨基丁酸（GABA）是动物体内重要的抑制性神经递质，可缓解热应激、运输应激和转群应激，改善采食与休息，稳定生产性能。',
      en: 'GABA is a key inhibitory neurotransmitter. It relieves heat, transport and regrouping stress, improves feed intake and rest, and stabilizes performance.'
    },
    benefits: {
      zh: ['缓解热应激与运输应激', '提高高温季节采食量', '稳定产蛋率与生长性能', '改善睡眠，减少躁动'],
      en: ['Relieves heat and transport stress', 'Maintains intake in hot seasons', 'Stabilizes laying rate and growth', 'Calms animals, reduces agitation']
    },
    keywords: ['热应激', '应激', '高温', '夏季', '夏天', '天热', '运输', '转群', '躁动', '采食下降', '产蛋', '蛋鸡', 'heat', 'stress', 'summer', 'transport', 'calm', 'laying', 'layer']
  },
  allicin: {
    cat: 'plant',
    formula: 'C₆H₁₀OS₂',
    name: { zh: '大蒜素', en: 'Allicin' },
    species: ['pig', 'poultry', 'aqua'],
    intro: {
      zh: '大蒜素是天然植物来源的含硫活性成分，具有广谱抑菌、诱食、增强免疫的作用，还能改善肉蛋风味，是绿色养殖常用的植物提取物。',
      en: 'A natural sulfur-containing compound from garlic with broad-spectrum antibacterial, appetite-stimulating and immune-supporting effects. It also improves meat and egg flavor.'
    },
    benefits: {
      zh: ['天然广谱抑菌', '独特气味，诱食效果好', '增强机体免疫力', '改善肉蛋品质与风味'],
      en: ['Natural broad-spectrum antibacterial', 'Distinct aroma stimulates appetite', 'Supports immunity', 'Improves meat and egg flavor']
    },
    keywords: ['抗菌', '抑菌', '诱食', '免疫', '球虫', '风味', '肉质', '天然', '鱼', '水产', 'antibacter', 'appetite', 'immun', 'flavor', 'natural', 'garlic', 'fish']
  },
  oregano: {
    cat: 'plant',
    formula: 'C₁₀H₁₄O',
    name: { zh: '牛至双酚', en: 'Oregano Phenols' },
    species: ['pig', 'poultry', 'ruminant', 'aqua'],
    intro: {
      zh: '牛至双酚的主要活性成分为香芹酚和百里香酚，可破坏病原菌细胞膜，兼具抗菌、抗氧化和促消化作用，是替抗方案中应用广泛的植物精油类产品。',
      en: 'Rich in carvacrol and thymol, oregano phenols disrupt pathogen cell membranes and offer antibacterial, antioxidant and digestive benefits — widely used in antibiotic-free programs.'
    },
    benefits: {
      zh: ['破坏病原菌细胞膜', '抗氧化，保护肠道', '促进消化酶分泌', '替抗方案常用植物精油'],
      en: ['Disrupts pathogen membranes', 'Antioxidant gut protection', 'Stimulates digestive enzymes', 'Popular essential-oil option for AGP-free diets']
    },
    keywords: ['替抗', '无抗', '减抗', '抗菌', '抗氧化', '精油', '坏死性肠炎', '肠炎', '植物', 'antibiotic', 'antioxid', 'essential oil', 'oregano', 'necrotic', 'phyto']
  },
  ycw: {
    cat: 'bio',
    formula: 'β-Glucan · MOS',
    name: { zh: '酵母细胞壁多糖', en: 'Yeast Cell Wall Polysaccharides' },
    species: ['pig', 'poultry', 'ruminant', 'aqua'],
    intro: {
      zh: '酵母细胞壁富含β-葡聚糖和甘露寡糖（MOS），能激活先天免疫、提高疫苗应答，并可结合病原菌和部分霉菌毒素，帮助动物增强抵抗力。',
      en: 'Rich in β-glucans and mannan-oligosaccharides (MOS), yeast cell wall activates innate immunity, improves vaccine response, and binds pathogens and some mycotoxins.'
    },
    benefits: {
      zh: ['激活免疫，提高抵抗力', '提高疫苗免疫效果', '结合病原菌，减少定植', '辅助吸附部分霉菌毒素'],
      en: ['Activates immunity and resilience', 'Improves vaccine response', 'Binds pathogens, limits colonization', 'Helps bind some mycotoxins']
    },
    keywords: ['免疫', '抵抗力', '疫苗', '病原', '母猪', '体弱', '成活率', '死淘', 'immun', 'vaccin', 'resist', 'sow', 'surviv', 'mortality', 'yeast']
  },
  moldx: {
    cat: 'detox',
    formula: 'Mycotoxin Binder',
    name: { zh: '霉毒克（脱霉剂）', en: 'Meiduke Mycotoxin Binder' },
    species: ['pig', 'poultry', 'ruminant', 'aqua'],
    intro: {
      zh: '霉毒克是德高的多组分复合脱霉剂，可高效吸附黄曲霉毒素，并减轻玉米赤霉烯酮、呕吐毒素等对动物的危害，保护肝脏和繁殖性能。',
      en: 'Degao’s multi-component mycotoxin solution. It efficiently binds aflatoxins and mitigates the effects of zearalenone and DON, protecting liver function and reproduction.'
    },
    benefits: {
      zh: ['高效吸附黄曲霉毒素', '减轻玉米赤霉烯酮、呕吐毒素危害', '保护肝脏与免疫系统', '改善母畜繁殖性能'],
      en: ['Strong aflatoxin binding', 'Mitigates ZEN and DON effects', 'Protects liver and immunity', 'Supports breeding performance']
    },
    keywords: ['霉变', '发霉', '霉菌', '毒素', '黄曲霉', '呕吐毒素', '玉米赤霉烯酮', '假发情', '流产', '玉米', '原料差', '脱霉', 'mold', 'mould', 'mycotoxin', 'aflatoxin', 'don', 'zearalenone', 'corn']
  },
  bile: {
    cat: 'nutri',
    formula: 'Bile Acids',
    name: { zh: '胆汁酸', en: 'Bile Acids' },
    species: ['pig', 'poultry', 'aqua'],
    intro: {
      zh: '胆汁酸是天然的脂肪乳化剂，可提高脂肪和脂溶性维生素的消化吸收，保护肝胆功能，减轻脂肪肝。在水产和高能日粮中应用广泛。',
      en: 'Natural fat emulsifiers that improve digestion of fat and fat-soluble vitamins, protect liver and gallbladder function, and reduce fatty liver. Widely used in aqua and high-energy diets.'
    },
    benefits: {
      zh: ['提高脂肪消化利用率', '保护肝胆，减轻脂肪肝', '促进脂溶性维生素吸收', '水产饲料效果突出'],
      en: ['Improves fat utilization', 'Protects liver, reduces fatty liver', 'Enhances fat-soluble vitamin uptake', 'Excellent in aqua feeds']
    },
    keywords: ['脂肪', '脂肪肝', '肝', '肝胆', '油脂', '能量', '消化', '鱼', '虾', '水产', '肉鸡', 'fat', 'liver', 'lipid', 'energy', 'fish', 'shrimp', 'aqua', 'bile']
  },
  gox: {
    cat: 'bio',
    formula: 'EC 1.1.3.4',
    name: { zh: '葡萄糖氧化酶', en: 'Glucose Oxidase' },
    species: ['pig', 'poultry', 'aqua'],
    intro: {
      zh: '葡萄糖氧化酶可消耗肠道中的氧气并生成葡萄糖酸，营造有利于益生菌生长的厌氧环境，抑制好氧致病菌，同时具有抗氧化作用。',
      en: 'Glucose oxidase consumes intestinal oxygen and produces gluconic acid, creating an anaerobic environment that favors beneficial bacteria and suppresses aerobic pathogens, with antioxidant effects.'
    },
    benefits: {
      zh: ['营造厌氧环境，利于益生菌', '抑制好氧致病菌', '生成葡萄糖酸，降低肠道 pH', '抗氧化，保护肠道'],
      en: ['Creates anaerobic, probiotic-friendly gut', 'Suppresses aerobic pathogens', 'Produces gluconic acid, lowers pH', 'Antioxidant gut protection']
    },
    keywords: ['益生菌', '菌群', '抗氧化', '替抗', '酶', '肠道', 'probiotic', 'microbio', 'enzyme', 'antioxid', 'flora']
  },
  tannic: {
    cat: 'plant',
    formula: 'C₇₆H₅₂O₄₆',
    name: { zh: '单宁酸', en: 'Tannic Acid' },
    species: ['pig', 'poultry', 'ruminant'],
    intro: {
      zh: '单宁酸是天然多酚类物质，具有收敛止泻、保护肠黏膜、抑菌和抗氧化作用。包被颗粒可减少对适口性的影响，并在肠道中缓慢释放。',
      en: 'A natural polyphenol with astringent anti-diarrheal, mucosa-protective, antibacterial and antioxidant effects. Coated granules protect palatability and release gradually in the gut.'
    },
    benefits: {
      zh: ['收敛止泻，见效快', '保护肠黏膜', '天然抑菌、抗氧化', '包被型适口性好'],
      en: ['Fast-acting astringent against diarrhea', 'Protects intestinal mucosa', 'Natural antibacterial and antioxidant', 'Coated grade keeps palatability']
    },
    keywords: ['腹泻', '拉稀', '止泻', '收敛', '黏膜', '粪便', '稀便', 'diarrhea', 'scour', 'astring', 'tannin', 'feces', 'loose']
  },
  betaine: {
    cat: 'nutri',
    formula: 'C₅H₁₁NO₂·HCl',
    name: { zh: '甜菜碱盐酸盐', en: 'Betaine HCl' },
    species: ['pig', 'poultry', 'ruminant', 'aqua'],
    intro: {
      zh: '甜菜碱是高效的甲基供体，可部分替代蛋氨酸和氯化胆碱；它还能调节细胞渗透压、缓解热应激，并促进脂肪代谢、提高瘦肉率。对水产动物有明显的诱食作用。',
      en: 'An efficient methyl donor that partially replaces methionine and choline. It regulates cellular osmotic balance to ease heat stress, promotes fat metabolism and lean yield, and is a strong feed attractant for aqua species.'
    },
    benefits: {
      zh: ['高效甲基供体，节约蛋氨酸和胆碱', '调节渗透压，缓解热应激', '促进脂肪代谢，提高瘦肉率', '水产诱食效果显著'],
      en: ['Methyl donor, spares methionine and choline', 'Osmotic balance, eases heat stress', 'Boosts fat metabolism and lean yield', 'Strong attractant for aqua']
    },
    keywords: ['甲基', '蛋氨酸', '胆碱', '热应激', '高温', '瘦肉', '诱食', '脂肪肝', '水产', '虾', '鱼', 'methyl', 'methionine', 'choline', 'heat', 'lean', 'attract', 'shrimp', 'fish']
  },
  gaa: {
    cat: 'nutri',
    formula: 'C₃H₇N₃O₂',
    name: { zh: '胍基乙酸', en: 'Guanidinoacetic Acid' },
    species: ['pig', 'poultry', 'ruminant'],
    intro: {
      zh: '胍基乙酸是体内合成肌酸的直接前体，可提高能量代谢效率、促进肌肉沉积，改善胴体品质与饲料转化率，在肉鸡和育肥猪中应用广泛。',
      en: 'The direct precursor of creatine. It improves energy metabolism and muscle deposition, carcass quality and FCR — widely used in broilers and finishing pigs.'
    },
    benefits: {
      zh: ['肌酸前体，提升能量代谢', '促进肌肉沉积，提高胸肉率', '改善饲料转化率', '可部分节约能量原料'],
      en: ['Creatine precursor, boosts energy metabolism', 'More muscle and breast yield', 'Better FCR', 'Can spare dietary energy']
    },
    keywords: ['肌肉', '瘦肉', '胸肉', '能量', '肉鸡', '料肉比', '增重', '胴体', 'muscle', 'breast', 'broiler', 'energy', 'carcass', 'creatine', 'fcr']
  }
}

// 规格 SKU。spec 为官网标注规格；std 表示官网未列具体含量。
const SKUS = [
  { id: 'SB30C', zh: '30%包被丁酸钠颗粒', series: 'butyrate', pct: '30%', form: 'coated', price: 22, featured: true, dose: { zh: '0.5–1.5 kg/t 全价料', en: '0.5–1.5 kg/t complete feed' } },
  { id: 'SB90G', series: 'butyrate', pct: '90%', form: 'granule', price: 38, dose: { zh: '0.3–1.0 kg/t 全价料', en: '0.3–1.0 kg/t complete feed' } },
  { id: 'SB98G', series: 'butyrate', pct: '98%', form: 'granule', price: 42, dose: { zh: '0.3–0.8 kg/t 全价料', en: '0.3–0.8 kg/t complete feed' } },
  { id: 'SB98P', zh: '98%丁酸钠粉末', series: 'butyrate', pct: '98%', form: 'powder', price: 40, dose: { zh: '0.3–0.8 kg/t 全价料；犊牛可按每日 4–9 g 加入代乳粉', en: '0.3–0.8 kg/t complete feed; calves 4–9 g/day in milk replacer' } },
  { id: 'TB50', series: 'tributyrin', pct: '50%', form: 'powder', price: 36, dose: { zh: '0.5–2.0 kg/t 全价料', en: '0.5–2.0 kg/t complete feed' } },
  { id: 'TB60', series: 'tributyrin', pct: '60%', form: 'powder', price: 45, featured: true, dose: { zh: '0.5–1.5 kg/t 全价料', en: '0.5–1.5 kg/t complete feed' } },
  { id: 'KDF95', zh: '95%二甲酸钾', series: 'kdf', pct: '95%', form: 'powder', price: 18, featured: true, dose: { zh: '仔猪 6–12 kg/t；生长育肥猪 4–6 kg/t；水产 4–8 kg/t', en: 'Piglets 6–12 kg/t; growers 4–6 kg/t; aqua 4–8 kg/t' } },
  { id: 'CS30C', series: 'cysteamine', pct: '30%', form: 'coated', price: 55, featured: true, dose: { zh: '0.5–1.0 kg/t 全价料', en: '0.5–1.0 kg/t complete feed' } },
  { id: 'CS40C', series: 'cysteamine', pct: '40%', form: 'coated', price: 68, dose: { zh: '0.4–0.8 kg/t 全价料', en: '0.4–0.8 kg/t complete feed' } },
  { id: 'CS50C', series: 'cysteamine', pct: '50%', form: 'coated', price: 82, dose: { zh: '0.3–0.6 kg/t 全价料', en: '0.3–0.6 kg/t complete feed' } },
  { id: 'GABA50', zh: '50%γ-氨基丁酸', series: 'gaba', pct: '50%', form: 'powder', price: 60, dose: { zh: '0.2–0.6 kg/t 全价料', en: '0.2–0.6 kg/t complete feed' } },
  { id: 'GABA95', zh: '95%γ-氨基丁酸', series: 'gaba', pct: '95%', form: 'powder', price: 110, dose: { zh: '0.1–0.3 kg/t 全价料', en: '0.1–0.3 kg/t complete feed' } },
  { id: 'GABA98', zh: '98%γ-氨基丁酸', series: 'gaba', pct: '98%', form: 'powder', price: 120, dose: { zh: '0.1–0.3 kg/t 全价料', en: '0.1–0.3 kg/t complete feed' } },
  { id: 'ALC', series: 'allicin', pct: 'std', form: 'powder', price: 45, dose: { zh: '0.1–0.4 kg/t 全价料', en: '0.1–0.4 kg/t complete feed' } },
  { id: 'ORP', series: 'oregano', pct: 'std', form: 'powder', price: 85, dose: { zh: '0.1–0.3 kg/t 全价料', en: '0.1–0.3 kg/t complete feed' } },
  { id: 'YCW', series: 'ycw', pct: 'std', form: 'powder', price: 28, dose: { zh: '0.5–2.0 kg/t 全价料', en: '0.5–2.0 kg/t complete feed' } },
  { id: 'MDK', series: 'moldx', pct: 'std', form: 'powder', price: 15, dose: { zh: '0.5–2.0 kg/t，视原料霉变程度调整', en: '0.5–2.0 kg/t depending on contamination level' } },
  { id: 'BA30', zh: '30%胆汁酸', series: 'bile', pct: '30%', form: 'powder', price: 280, dose: { zh: '0.2–0.5 kg/t 全价料', en: '0.2–0.5 kg/t complete feed' } },
  { id: 'GOX', series: 'gox', pct: 'std', form: 'powder', price: 120, dose: { zh: '0.1–0.3 kg/t，视酶活规格调整', en: '0.1–0.3 kg/t depending on activity grade' } },
  { id: 'TA40C', zh: '40%包被单宁酸颗粒', series: 'tannic', pct: '40%', form: 'coated', price: 32, dose: { zh: '0.5–1.5 kg/t 全价料', en: '0.5–1.5 kg/t complete feed' } },
  { id: 'TA50P', series: 'tannic', pct: '50%', form: 'powder', price: 35, dose: { zh: '0.4–1.2 kg/t 全价料', en: '0.4–1.2 kg/t complete feed' } },
  { id: 'TA70P', zh: '70%单宁酸粉末', series: 'tannic', pct: '70%', form: 'powder', price: 48, dose: { zh: '0.3–0.8 kg/t 全价料', en: '0.3–0.8 kg/t complete feed' } },
  { id: 'BT70C', series: 'betaine', pct: '70%', form: 'coated', price: 16, dose: { zh: '1.0–2.0 kg/t 全价料', en: '1.0–2.0 kg/t complete feed' } },
  { id: 'GAA', series: 'gaa', pct: 'std', form: 'powder', price: 35, dose: { zh: '0.3–0.6 kg/t 全价料', en: '0.3–0.6 kg/t complete feed' } }
]

const FORMS = {
  coated: { zh: '包被颗粒', en: 'Coated granule' },
  granule: { zh: '颗粒', en: 'Granule' },
  powder: { zh: '粉剂', en: 'Powder' }
}

// 产品视觉上的系列代号
const MARKS = {
  butyrate: 'SB', tributyrin: 'TB', kdf: 'KDF', cysteamine: 'CS', gaba: 'GABA', allicin: 'ALC', oregano: 'ORP',
  ycw: 'YCW', moldx: 'MDK', bile: 'BA', gox: 'GOX', tannic: 'TA', betaine: 'BT', gaa: 'GAA'
}

const PACK = { zh: '25 kg / 袋', en: '25 kg / bag' }
const PACK_KG = 25

function pick(obj, lang) {
  return obj ? obj[lang] || obj.zh : ''
}

function build(sku, lang) {
  const s = SERIES[sku.series]
  const name = pick(s.name, lang)
  const form = pick(FORMS[sku.form], lang)
  const std = sku.pct === 'std'
  // 中文名优先用官网原名（sku.zh）
  const EN_FORM = { coated: ' (Coated)', granule: ' Granule', powder: ' Powder' }
  let title
  if (std) title = name
  else if (lang === 'en') title = `${sku.pct} ${name}${EN_FORM[sku.form]}`
  else title = sku.zh || `${sku.pct}${sku.form === 'coated' ? '包被' : ''}${name}${sku.form === 'coated' ? '' : form}`
  return {
    id: sku.id,
    series: sku.series,
    cat: s.cat,
    catName: pick(CATEGORIES.find(c => c.id === s.cat), lang),
    formula: s.formula,
    mark: MARKS[sku.series],
    name,
    title,
    pct: std ? '' : sku.pct,
    spec: std ? (lang === 'en' ? 'Grade on request' : '规格请咨询') : sku.pct,
    form,
    pack: pick(PACK, lang),
    price: sku.price,
    bagPrice: sku.price * PACK_KG,
    featured: !!sku.featured,
    dose: pick(sku.dose, lang),
    intro: pick(s.intro, lang),
    benefits: s.benefits[lang] || s.benefits.zh,
    species: s.species.map(id => ({ id, name: pick(SPECIES.find(x => x.id === id), lang) })),
    speciesIds: s.species
  }
}

function getProducts(lang) {
  return SKUS.map(s => build(s, lang))
}

function getProduct(id, lang) {
  const sku = SKUS.find(s => s.id === id)
  return sku ? build(sku, lang) : null
}

function getSiblings(id, lang) {
  const sku = SKUS.find(s => s.id === id)
  if (!sku) return []
  return SKUS.filter(s => s.series === sku.series).map(s => build(s, lang))
}

function getCategories(lang) {
  return CATEGORIES.map(c => ({ id: c.id, name: pick(c, lang) }))
}

function getSpecies(lang) {
  return SPECIES.map(c => ({ id: c.id, name: pick(c, lang) }))
}

module.exports = { SERIES, SKUS, PACK_KG, getProducts, getProduct, getSiblings, getCategories, getSpecies }
