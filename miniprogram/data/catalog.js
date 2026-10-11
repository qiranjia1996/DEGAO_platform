// 德高农牧产品目录
// 产品、规格、包装和添加量来自《济南德高农牧科技有限公司产品目录表》（2026 年 10 月版）。
// 作用原理、应用场景和常见问题根据 data/references.js 中的公开文献撰写，正式推广前需由德高技术部审核。
// pending: true 的产品是复配产品或成分未公开，介绍为通用说明，待德高技术部确认。
// price 为 Alpha 演示价格（元/kg），不是真实报价。

const CATEGORIES = [
  { id: 'gut', zh: '肠道健康与消化', en: 'Gut Health & Digestion', rep: ['SB50F', 'TB65', 'BA10'],
    desc: { zh: '断奶腹泻、过料、肠炎、油脂消化差：为肠道细胞供能、修复黏膜、帮助消化。', en: 'Weaning scours, undigested feed, enteritis, poor fat digestion: fuel gut cells, repair the lining, aid digestion.' } },
  { id: 'muscle', zh: '肌肉与生长', en: 'Muscle & Growth', rep: ['GAA98', 'GAA50M', 'CS30M'],
    desc: { zh: '长得慢、瘦肉率低、胸肉率低：补充肌肉能量、促进生长激素作用。', en: 'Slow growth, low lean or breast yield: more muscle energy, stronger growth-hormone action.' } },
  { id: 'stress', zh: '抗应激', en: 'Stress Relief', rep: ['GABA98', 'GABA40M', 'BT70C'],
    desc: { zh: '夏季热应激、运输转群应激：稳定采食和体温，保护细胞。', en: 'Summer heat, transport and regrouping stress: steady intake and body temperature, protect cells.' } },
  { id: 'rumen', zh: '过瘤胃包被营养', en: 'Rumen-Protected Nutrition', rep: ['RPM50', 'RPL60', 'RPC25'],
    desc: { zh: '奶牛围产期、乳蛋白偏低、脂肪肝：包被保护营养通过瘤胃，在小肠吸收。', en: 'Transition cows, low milk protein, fatty liver: coated nutrients survive the rumen and are absorbed in the small intestine.' } },
  { id: 'agp', zh: '植物源与替抗', en: 'Phytogenics & AGP-Free', rep: ['ALC25', 'TA40C'],
    desc: { zh: '禁抗后的腹泻和有害菌：植物源抑菌、收敛，支持无抗、减抗饲养。', en: 'Scours and pathogens after the antibiotic ban: plant-based antibacterial and astringent support for antibiotic-free feeding.' } },
  { id: 'health', zh: '霉菌毒素与免疫', en: 'Mycotoxins & Immunity', rep: ['YCW', 'MDK100'],
    desc: { zh: '原料霉变、体弱易病：结合病原菌和霉菌毒素，激活先天免疫。', en: 'Moldy grain, weak animals: bind pathogens and mycotoxins, prime innate immunity.' } }
]

const SPECIES = [
  { id: 'pig', zh: '猪', en: 'Swine' },
  { id: 'poultry', zh: '家禽', en: 'Poultry' },
  { id: 'ruminant', zh: '反刍', en: 'Ruminant' },
  { id: 'aqua', zh: '水产', en: 'Aqua' }
]

const FORMS = {
  powder: { zh: '粉末', en: 'Powder' },
  granule: { zh: '颗粒', en: 'Granule' },
  dextrin: { zh: '糊精包被颗粒', en: 'Dextrin-coated granule' },
  fat: { zh: '脂肪包被颗粒', en: 'Fat-coated granule' },
  fatmicro: { zh: '脂肪包被微囊', en: 'Fat-coated microcapsule' },
  micro: { zh: '包被微囊', en: 'Coated microcapsule' },
  coated: { zh: '包被颗粒', en: 'Coated granule' },
  chelate: { zh: '螯合物粉末', en: 'Chelate powder' },
  blend: { zh: '复配', en: 'Blend' }
}

// 待确认产品的统一说明
const PENDING_FAQ = {
  q: { zh: '这个产品的具体成分是什么？', en: 'What exactly is in this product?' },
  a: {
    zh: '本产品为德高复配产品，具体成分、含量和作用方式请致电德高技术服务索取产品说明书。网站上的介绍待技术部确认后更新。',
    en: 'This is a Degao proprietary blend. Please call Degao technical service for the product sheet with composition and mode of action. The description here will be updated once confirmed.'
  }
}

const SERIES = {
  // ---------------- 肠道健康与消化 ----------------
  butyrate: {
    cat: 'gut',
    formula: 'C₄H₇NaO₂',
    name: { zh: '丁酸钠', en: 'Sodium Butyrate' },
    species: ['pig', 'poultry', 'ruminant', 'aqua'],
    intro: {
      zh: '丁酸是肠道上皮细胞最主要的能量来源。丁酸钠给肠道细胞「直接喂饭」，帮助肠绒毛生长、修复肠黏膜屏障、调节菌群，是无抗饲养中最常用的肠道健康原料。德高丁酸钠有 7 个规格，从 98% 原粉到 30% 脂肪包被微囊，可按动物、饲料类型和希望起效的肠段来选择。',
      en: 'Butyrate is the main fuel for gut lining cells. Sodium butyrate feeds those cells directly, supporting villus growth, repairing the mucosal barrier and balancing the microbiota — the most widely used gut-health ingredient in antibiotic-free feeding. Degao offers 7 grades, from 98% powder to 30% fat-coated microcapsules, chosen by species, feed type and where in the gut you want it to work.'
    },
    benefits: {
      zh: ['为肠道细胞供能，促进肠绒毛发育', '帮助修复肠黏膜，降低断奶腹泻', '调节肠道菌群', '母猪料中使用可惠及哺乳仔猪'],
      en: ['Fuels gut cells, supports villus growth', 'Helps repair the gut lining, fewer weaning scours', 'Balances the gut microbiota', 'In sow feed, benefits suckling piglets too']
    },
    mechanism: {
      zh: [
        '肠道细胞更新很快，2–3 天就换一批，需要大量能量。丁酸被肠上皮细胞吸收后直接氧化供能，是它们首选的「燃料」。能量充足，肠绒毛就长得高，吸收面积大，细胞之间的紧密连接也更牢固，有害物质和细菌不容易穿过肠壁。',
        '断奶、换料、热应激时，动物采食下降，肠道内丁酸产生减少，肠绒毛萎缩、腹泻随之而来。这时在饲料里补充丁酸钠，可以帮助肠道渡过难关。丁酸还能调节肠道菌群，营造有利于有益菌的环境。',
        '未包被的丁酸钠在胃和小肠前段就被大量吸收，到达后段的较少；包被（脂肪、糊精）和微囊工艺让丁酸分段、缓慢释放，更多丁酸能到达小肠后段和大肠，同时大幅减少丁酸钠特有的气味。'
      ],
      en: [
        'Gut lining cells are replaced every 2–3 days and need a lot of energy. Butyrate absorbed by these cells is burned directly as fuel — their preferred energy source. Well-fed cells build taller villi with more absorptive surface and tighter junctions, so toxins and bacteria cross the gut wall less easily.',
        'At weaning, feed changes or heat stress, intake drops, less butyrate is produced in the gut, villi shrink and diarrhea follows. Supplementing sodium butyrate helps the gut through these periods, and butyrate also shifts the microbiota in favor of beneficial bacteria.',
        'Uncoated sodium butyrate is largely absorbed in the stomach and upper small intestine. Fat or dextrin coating and microencapsulation release it gradually, so more reaches the lower small intestine and hindgut — and the typical butyrate odor is greatly reduced.'
      ]
    },
    uses: [
      { sp: 'pig', scene: { zh: '断奶仔猪腹泻', en: 'Post-weaning diarrhea' }, text: { zh: '断奶应激让肠绒毛萎缩、腹泻增加。包被丁酸钠即使在抗生素减半的条件下，仍提高了断奶仔猪增重和饲料效率，并降低腹泻。', en: 'Weaning stress shrinks villi and causes scours. Coated sodium butyrate improved gain and feed efficiency of weaned piglets and reduced diarrhea, even with antibiotics halved.' }, refs: ['sb_piglet'] },
      { sp: 'pig', scene: { zh: '母猪妊娠后期与哺乳期', en: 'Sows in late gestation and lactation' }, text: { zh: '母猪料中添加 1 g/kg 丁酸钠，初乳中免疫球蛋白增加，哺乳仔猪腹泻率和断奶前死亡率下降，母猪断奶后发情更快。', en: 'At 1 g/kg in sow feed, colostrum immunoglobulins rose, suckling piglets had less diarrhea and lower preweaning mortality, and sows returned to estrus sooner.' }, refs: ['sb_sow'] },
      { sp: 'poultry', scene: { zh: '肉鸡肠道发育', en: 'Broiler gut development' }, text: { zh: '包被丁酸钠改善肉鸡肠道发育、黏膜形态和抗氧化能力，并调节肠道菌群，帮助饲料消化得更充分。', en: 'Coated sodium butyrate improved broiler gut development, mucosal structure and antioxidant capacity and modulated the microbiota for better feed digestion.' }, refs: ['sb_broiler'] },
      { sp: 'poultry', scene: { zh: '产蛋后期蛋鸡', en: 'Layers in late lay' }, text: { zh: '51 周龄蛋鸡添加 800 mg/kg 包被丁酸钠，产蛋性能提高，肠绒毛变长，蛋黄颜色更好。', en: 'In 51-week-old hens, 800 mg/kg coated sodium butyrate improved laying performance, lengthened villi and improved yolk color.' }, refs: ['sb_layer'] },
      { sp: 'ruminant', scene: { zh: '哺乳犊牛', en: 'Milk-fed calves' }, text: { zh: '代乳粉中添加丁酸钠，犊牛生长速度和饲料转化率优于使用抗生素促生长剂的对照组。犊牛建议用 98% 粉末，直接溶入代乳粉。', en: 'Sodium butyrate in milk replacer gave better calf growth and feed conversion than an antibiotic growth promoter. Use the 98% powder, mixed straight into milk replacer.' }, refs: ['sb_calf'] },
      { sp: 'aqua', scene: { zh: '鱼类肠道保护', en: 'Fish gut protection' }, text: { zh: '饲料油脂氧化会损伤鱼的肠道。微囊丁酸钠提高鲤鱼增重、降低饲料系数，并保护肠黏膜免受氧化油脂损伤。', en: 'Oxidized feed oil damages the fish gut. Microencapsulated sodium butyrate raised carp weight gain, lowered FCR and protected the mucosa from oxidized oil.' }, refs: ['sb_carp'] }
    ],
    gradeNote: {
      zh: '7 个规格的添加量都是 250–1000 g/t，但含量从 98% 到 30% 不等。同样加 500 g，98% 原粉提供约 490 g 丁酸钠，30% 微囊只提供约 150 g。选用低含量包被产品时，一般取用量范围的中上限，具体请咨询技术部。',
      en: 'All 7 grades are dosed at 250–1000 g/t, but their content ranges from 98% to 30%. At 500 g/t, the 98% powder supplies about 490 g of sodium butyrate and the 30% microcapsule about 150 g. With low-content coated grades, dose toward the upper part of the range; ask our technical team for specifics.'
    },
    howto: {
      zh: [
        '先与少量载体（如麸皮、玉米粉）预混，再加入全价料或预混料，保证分布均匀。',
        '犊牛代乳粉、液体饲喂选 98% 粉末，溶解快。',
        '脂肪包被产品怕高温，高温调质制粒前请向技术部确认工艺参数。',
        '丁酸钠易吸潮，开袋后扎紧袋口，存放在阴凉干燥处，尽快用完。'
      ],
      en: [
        'Premix with a small amount of carrier (e.g. wheat bran, corn meal) first, then add to complete feed or premix for even distribution.',
        'For calf milk replacer or liquid feeding, use the 98% powder — it dissolves quickly.',
        'Fat-coated grades are heat-sensitive; check process settings with our technical team before high-temperature conditioning and pelleting.',
        'Sodium butyrate absorbs moisture. Reseal opened bags, store cool and dry, and use promptly.'
      ]
    },
    faq: [
      { q: { zh: '丁酸钠有异味，会影响采食吗？', en: 'Does the butyrate odor hurt feed intake?' }, a: { zh: '丁酸钠原粉有明显的特殊气味。包被颗粒和微囊产品把丁酸钠包在里面，气味小很多。教槽料、乳猪料等对适口性要求高的饲料，建议选包被或微囊规格，或者选用几乎无味的三丁酸甘油酯。', en: 'The raw powder has a strong, distinctive smell. Coated granules and microcapsules seal it in, so they smell far less. For creep and starter feeds where palatability matters, choose a coated or microencapsulated grade, or the nearly odorless tributyrin.' } },
      { q: { zh: '丁酸钠能和其他添加剂一起用吗？', en: 'Can it be combined with other additives?' }, a: { zh: '可以。丁酸钠常与有机酸、植物提取物、酵母产品等搭配使用，作用路线不同，可以互补。在已发表的仔猪试验中，它还与减半剂量的抗生素一起使用。', en: 'Yes. It is commonly paired with organic acids, plant extracts and yeast products, which work through different routes. In a published piglet trial it was also used alongside a halved antibiotic dose.' } },
      { q: { zh: '丁酸钠和三丁酸甘油酯怎么选？', en: 'Sodium butyrate or tributyrin?' }, a: { zh: '两者都提供丁酸。丁酸钠性价比高、规格多；三丁酸甘油酯几乎无味，要被肠道脂肪酶分解后才释放丁酸。对气味敏感的饲料可优先考虑三丁酸甘油酯，也可以两者搭配。', en: 'Both deliver butyrate. Sodium butyrate is cost-effective and comes in many grades; tributyrin is nearly odorless and releases butyrate only after intestinal lipase breaks it down. For odor-sensitive feeds, consider tributyrin, or combine the two.' } }
    ],
    keywords: ['腹泻', '拉稀', '肠道', '肠炎', '肠健康', '断奶', '仔猪', '母猪', '替抗', '减抗', '无抗', '禁抗', '采食', '增重', '犊牛', '黏膜', '蛋鸡', 'diarrhea', 'scour', 'gut', 'intestin', 'wean', 'antibiotic', 'calf', 'sow', 'butyr']
  },
  tributyrin: {
    cat: 'gut',
    formula: 'C₁₅H₂₆O₆',
    name: { zh: '三丁酸甘油酯', en: 'Tributyrin' },
    species: ['pig', 'poultry', 'aqua'],
    intro: {
      zh: '三丁酸甘油酯由一个甘油分子连着三个丁酸组成，几乎没有丁酸的异味。它在胃里基本不分解，进入小肠后被脂肪酶水解，释放出丁酸，作用部位更靠后。适合对适口性要求高的教槽料、乳猪料，也适合高豆粕的水产饲料。',
      en: 'Tributyrin is three butyrate molecules bound to glycerol, with almost none of butyrate’s odor. It passes the stomach largely intact and is split by lipase in the small intestine, releasing butyrate further down the gut. Ideal for palatability-sensitive creep and starter feeds and for high-soybean-meal aquafeeds.'
    },
    benefits: {
      zh: ['几乎无异味，不影响适口性', '在小肠中释放丁酸，作用部位靠后', '促进肠道发育、减轻肠道损伤', '可与丁酸钠搭配使用'],
      en: ['Nearly odorless, keeps feed palatable', 'Releases butyrate in the small intestine', 'Supports gut development and repair', 'Pairs well with sodium butyrate']
    },
    mechanism: {
      zh: [
        '丁酸钠在胃和小肠前段就开始溶解吸收。三丁酸甘油酯是酯类，不溶于水，要等到小肠里的脂肪酶把它切开，才释放出丁酸和甘油，因此能把丁酸送到小肠中后段。',
        '1 分子三丁酸甘油酯能释放 3 分子丁酸，丁酸的含量比丁酸钠高。释放出的丁酸同样为肠上皮细胞供能，帮助肠绒毛生长和紧密连接形成。'
      ],
      en: [
        'Sodium butyrate dissolves and is absorbed early, in the stomach and upper small intestine. Tributyrin is an ester and does not dissolve in water; only when intestinal lipase cleaves it are butyrate and glycerol released, delivering butyrate to the mid and lower small intestine.',
        'Each tributyrin molecule releases three butyrate molecules, a higher butyrate density than sodium butyrate. The released butyrate likewise fuels gut cells, supporting villus growth and tight-junction formation.'
      ]
    },
    uses: [
      { sp: 'pig', scene: { zh: '断奶仔猪生长', en: 'Weaned piglet growth' }, text: { zh: '三丁酸甘油酯提高断奶仔猪体重、日增重和饲料效率。', en: 'Tributyrin increased body weight, daily gain and feed efficiency of weaned piglets.' }, refs: ['tb_piglet'] },
      { sp: 'pig', scene: { zh: '仔猪肠道损伤修复', en: 'Gut injury in piglets' }, text: { zh: '0.1% 三丁酸甘油酯减轻仔猪结肠损伤，促进肠道紧密连接形成。', en: '0.1% tributyrin alleviated colonic injury in piglets and promoted tight-junction formation.' }, refs: ['tb_injury'] },
      { sp: 'poultry', scene: { zh: '黄羽肉鸡料肉比', en: 'Feed conversion in broilers' }, text: { zh: '黄羽肉鸡添加 250 mg/kg 三丁酸甘油酯，22–42 日龄料重比降低，盲肠菌群结构改善。', en: 'Yellow-feathered broilers fed 250 mg/kg tributyrin had better feed conversion from day 22 to 42 and a shifted cecal microbiota.' }, refs: ['tb_broiler'] },
      { sp: 'aqua', scene: { zh: '高豆粕对虾饲料', en: 'High-soybean-meal shrimp feed' }, text: { zh: '用豆粕替代鱼粉会拖累对虾生长。添加 10 g/kg 三丁酸甘油酯后，对虾生长恢复到高鱼粉对照水平，消化酶和免疫酶活性提高。注意：该研究用量远高于畜禽，水产使用请咨询技术部。', en: 'Replacing fishmeal with soybean meal slows shrimp growth. With 10 g/kg tributyrin, growth returned to the high-fishmeal control and digestive and immune enzymes rose. Note this dose is far above livestock levels — consult our technical team for aquafeeds.' }, refs: ['tb_shrimp'] }
    ],
    gradeNote: {
      zh: '65% 和 60% 两个规格都是粉剂，区别在于有效含量。添加量相同时，65% 规格提供的三丁酸甘油酯略多。',
      en: 'Both the 65% and 60% grades are powders; they differ only in active content. At the same inclusion, the 65% grade supplies slightly more tributyrin.'
    },
    howto: {
      zh: ['推荐添加量 500–1000 g/t 全价料，先与载体预混再加入。', '耐制粒，可直接用于颗粒饲料。', '密封存放于阴凉干燥处，避免高温暴晒。'],
      en: ['Use 500–1000 g/t of complete feed; premix with carrier first.', 'Pellet-stable; suitable for pelleted feeds.', 'Store sealed in a cool, dry place away from heat and sun.']
    },
    faq: [
      { q: { zh: '三丁酸甘油酯真的没有味道吗？', en: 'Is tributyrin really odorless?' }, a: { zh: '它本身气味很淡，不像丁酸钠那样有刺鼻的丁酸味，所以不影响采食。', en: 'Its own odor is very faint — nothing like the pungent smell of sodium butyrate — so it does not put animals off their feed.' } },
      { q: { zh: '和丁酸钠能一起用吗？', en: 'Can it be used with sodium butyrate?' }, a: { zh: '可以。丁酸钠在肠道前段释放，三丁酸甘油酯在中后段释放，两者搭配可让丁酸覆盖更长的肠段。', en: 'Yes. Sodium butyrate releases early and tributyrin further down, so combining them covers a longer stretch of the gut.' } }
    ],
    keywords: ['腹泻', '肠道', '断奶', '适口性', '异味', '替抗', '减抗', '肠健康', '乳猪', '教槽', '虾', '豆粕', 'palatab', 'odor', 'gut', 'wean', 'tributyrin', 'shrimp']
  },
  bile: {
    cat: 'gut',
    formula: 'Bile Acids',
    name: { zh: '胆汁酸', en: 'Bile Acids' },
    species: ['pig', 'poultry', 'aqua'],
    intro: {
      zh: '胆汁酸是动物体内天然的「乳化剂」，能把饲料中的油脂打散成小油滴，让脂肪酶更好地消化。补充胆汁酸可以提高油脂和脂溶性维生素的利用率，减轻肝脏负担，在高能日粮、产蛋后期蛋鸡和肉食性鱼类上应用广泛。',
      en: 'Bile acids are the body’s own emulsifiers: they break dietary fat into tiny droplets so lipase can digest it. Supplementing bile acids improves use of fat and fat-soluble vitamins and lightens the liver’s workload — widely used in high-energy diets, late-lay hens and carnivorous fish.'
    },
    benefits: {
      zh: ['乳化油脂，提高脂肪消化率', '提高脂溶性维生素吸收', '减轻肝脏脂肪沉积', '改善肠道功能和菌群'],
      en: ['Emulsifies fat, better fat digestibility', 'Better uptake of fat-soluble vitamins', 'Less fat build-up in the liver', 'Supports gut function and microbiota']
    },
    mechanism: {
      zh: [
        '油脂不溶于水，必须先被胆汁酸乳化成微小油滴，脂肪酶才能分解它。幼龄动物、高温季节和高脂日粮下，动物自身分泌的胆汁酸往往不够用，部分油脂就随粪便排出浪费了。',
        '补充的胆汁酸帮助乳化，提高能量利用；同时促进肝脏脂肪代谢，减轻脂肪肝。胆汁酸还是肠道的信号分子，能影响肠道上皮功能和菌群结构。'
      ],
      en: [
        'Fat does not dissolve in water; bile acids must first emulsify it into tiny droplets before lipase can break it down. Young animals, hot seasons and high-fat diets often outstrip the animal’s own bile supply, and some fat is lost in the feces.',
        'Supplemental bile acids aid emulsification and energy use, and support liver fat metabolism to reduce fatty liver. Bile acids also act as gut signaling molecules, influencing the intestinal lining and microbiota.'
      ]
    },
    uses: [
      { sp: 'poultry', scene: { zh: '肉鸡油脂利用', en: 'Fat use in broilers' }, text: { zh: '60–80 mg/kg 胆汁酸提高肉鸡日增重、降低料重比，并提高肠道脂肪酶活性。', en: '60–80 mg/kg bile acids improved broiler daily gain and feed:gain and raised intestinal lipase activity.' }, refs: ['ba_broiler'] },
      { sp: 'poultry', scene: { zh: '产蛋后期蛋鸡护肝', en: 'Liver support in late lay' }, text: { zh: '60 mg/kg 胆汁酸提高产蛋后期蛋鸡的产蛋率和饲料转化，改善血脂代谢。', en: '60 mg/kg bile acids increased egg production and feed conversion of late-lay hens and improved blood lipids.' }, refs: ['ba_hen'] },
      { sp: 'pig', scene: { zh: '断奶仔猪（含弱仔）', en: 'Weaned piglets, incl. runts' }, text: { zh: '断奶仔猪日粮添加胆汁酸，改善了宫内发育迟缓（弱仔）仔猪的结肠功能和菌群。', en: 'Dietary bile acids improved colonic function and microbiota of weaned piglets with intrauterine growth retardation (runts).' }, refs: ['ba_piglet'] },
      { sp: 'aqua', scene: { zh: '肉食性鱼类护肝', en: 'Liver health in carnivorous fish' }, text: { zh: '胆汁酸促进大口黑鲈生长，减轻高淀粉饲料引起的肝脏纤维化和脂质沉积。', en: 'Bile acids enhanced growth of largemouth bass and reduced liver fibrosis and lipid deposition caused by a high-starch diet.' }, refs: ['ba_bass'] }
    ],
    howto: {
      zh: ['目录添加量 100–300 g/t（10% 规格）。研究中的有效剂量按纯胆汁酸计为 60–80 mg/kg，具体用量请咨询技术部。', '高油脂日粮、夏季和产蛋后期可取上限。', '密封避光保存。'],
      en: ['Catalog inclusion is 100–300 g/t for the 10% grade. Studies used 60–80 mg/kg of pure bile acids; ask our technical team about your dose.', 'Use the upper end for high-fat diets, in summer and in late lay.', 'Store sealed and away from light.']
    },
    faq: [
      { q: { zh: '胆汁酸适合哪些饲料？', en: 'Which feeds benefit most?' }, a: { zh: '油脂添加量高的饲料（肉鸡料、乳猪料、水产料），以及肝脏负担大的阶段（产蛋后期、高淀粉水产饲料）效果最明显。', en: 'Feeds with a lot of added fat (broiler, piglet and aquafeeds) and stages with a heavy liver load (late lay, high-starch aquafeeds) see the clearest benefit.' } }
    ],
    keywords: ['脂肪', '脂肪肝', '肝', '肝胆', '油脂', '能量', '消化', '鱼', '虾', '水产', '肉鸡', '产蛋后期', 'fat', 'liver', 'lipid', 'energy', 'fish', 'shrimp', 'aqua', 'bile']
  },
  enzyme: {
    cat: 'gut',
    pending: true,
    formula: 'Enzyme Blend',
    name: { zh: '包被复合酶', en: 'Coated Enzyme Complex' },
    species: [],
    intro: {
      zh: '包被复合酶是德高的复配酶制剂，采用包被工艺保护酶活。复合酶一般由多种消化酶组成，用于帮助动物分解饲料中较难消化的成分。本产品的具体酶种、酶活和适用动物待德高技术部确认，请致电咨询。',
      en: 'A Degao enzyme blend with a protective coating to preserve activity. Enzyme complexes typically combine several digestive enzymes to help animals break down hard-to-digest feed components. The exact enzymes, activities and target species are awaiting confirmation by Degao’s technical team — please call for details.'
    },
    benefits: {
      zh: ['包被工艺，保护酶活', '帮助分解难消化的饲料成分', '具体配方待确认'],
      en: ['Coated to protect enzyme activity', 'Helps break down hard-to-digest feed components', 'Formula awaiting confirmation']
    },
    howto: {
      zh: ['目录添加量 500–1000 g/t。', '具体使用方法以产品说明书为准。'],
      en: ['Catalog inclusion is 500–1000 g/t.', 'Follow the product sheet for usage.']
    },
    faq: [PENDING_FAQ],
    keywords: ['酶', '复合酶', '消化', 'enzyme', 'digest']
  },

  // ---------------- 肌肉与生长 ----------------
  gaa: {
    cat: 'muscle',
    formula: 'C₃H₇N₃O₂',
    name: { zh: '胍基乙酸', en: 'Guanidinoacetic Acid' },
    species: ['pig', 'poultry', 'ruminant'],
    intro: {
      zh: '胍基乙酸是动物体内合成肌酸的直接原料。肌酸是肌肉的「充电宝」，在肌肉收缩需要能量时快速补充。补充胍基乙酸可以提高肌肉能量储备，促进肌肉生长，改善日增重、瘦肉率和胸肉率。98% 粉末用于猪禽，50% 脂肪包被微囊可避开瘤胃降解，用于牛羊。',
      en: 'Guanidinoacetic acid (GAA) is the direct building block of creatine — the muscle’s power bank that rapidly recharges energy during contraction. Supplementing GAA raises muscle energy reserves and promotes muscle growth, improving daily gain, lean yield and breast yield. The 98% powder is for pigs and poultry; the 50% fat-coated microcapsule bypasses rumen breakdown for cattle and sheep.'
    },
    benefits: {
      zh: ['肌酸前体，提升肌肉能量储备', '提高日增重和饲料转化率', '提高瘦肉率、胸肉率', '包被型适用于反刍动物'],
      en: ['Creatine precursor, boosts muscle energy', 'Better daily gain and FCR', 'Higher lean and breast yield', 'Coated grade for ruminants']
    },
    mechanism: {
      zh: [
        '肌肉收缩靠 ATP 供能，而 ATP 储量只够几秒钟。磷酸肌酸能把能量快速转给 ADP，重新生成 ATP。体内合成肌酸分两步：先由精氨酸和甘氨酸合成胍基乙酸，再在肝脏中经甲基化（GAMT 酶催化）变成肌酸。',
        '饲料中直接补充胍基乙酸，省去了第一步，也节约了精氨酸。肌酸供应充足，肌肉生长和能量利用更高效。肌酸合成需要甲基，所以使用胍基乙酸时要保证蛋氨酸、甜菜碱等甲基供体充足。',
        '反刍动物的瘤胃微生物会降解大部分胍基乙酸，所以牛羊要用包被型，让它安全通过瘤胃，到小肠再吸收。'
      ],
      en: [
        'Muscle contraction runs on ATP, but ATP stores last only seconds. Creatine phosphate quickly hands energy back to ADP to regenerate ATP. The body makes creatine in two steps: arginine and glycine form GAA, which the liver then methylates (via the GAMT enzyme) into creatine.',
        'Feeding GAA skips the first step and spares arginine. With ample creatine, muscle growth and energy use become more efficient. Creatine synthesis consumes methyl groups, so keep methyl donors such as methionine and betaine adequate when feeding GAA.',
        'Rumen microbes break down most free GAA, so cattle and sheep need the coated grade, which passes the rumen and is absorbed in the small intestine.'
      ]
    },
    uses: [
      { sp: 'pig', scene: { zh: '生长育肥猪日增重', en: 'Grow-finish daily gain' }, text: { zh: '300 mg/kg 胍基乙酸使生长育肥猪日增重和终末体重达到最佳。', en: '300 mg/kg GAA maximized daily gain and final weight of growing-finishing pigs.' }, refs: ['gaa_pig'] },
      { sp: 'pig', scene: { zh: '育肥猪瘦肉率', en: 'Lean yield in finishers' }, text: { zh: '育肥猪添加 600 mg/kg 胍基乙酸，背膘更薄，瘦肉率和眼肌面积提高，滴水损失降低。', en: 'Finishers fed 600 mg/kg GAA had thinner backfat, higher lean percentage and loin-eye area, and lower drip loss.' }, refs: ['gaa_pig2'] },
      { sp: 'poultry', scene: { zh: '肉鸡生长与胸肉率', en: 'Broiler growth and breast yield' }, text: { zh: '欧盟 EFSA 评估认为，胍基乙酸从 600 mg/kg 起可提高肉鸡生长性能；在全植物性日粮中还提高了胸肉率。', en: 'EFSA concluded GAA improves broiler performance from 600 mg/kg; in all-vegetable diets it also raised breast meat yield.' }, refs: ['gaa_efsa', 'gaa_broiler'] },
      { sp: 'ruminant', scene: { zh: '育肥牛', en: 'Beef cattle' }, text: { zh: '安格斯公牛日粮添加 0.6–0.9 g/kg（干物质）胍基乙酸，采食量和日增重提高，养分消化和瘤胃发酵改善。', en: 'Angus bulls fed 0.6–0.9 g/kg DM GAA ate more and gained faster, with better digestion and rumen fermentation.' }, refs: ['gaa_bull'] },
      { sp: 'ruminant', scene: { zh: '育肥羊', en: 'Finishing lambs' }, text: { zh: '胍基乙酸提高羔羊体重和肌肉量；过瘤胃（包被）胍基乙酸提高湖羊日增重、降低料重比。', en: 'GAA increased lamb weight and muscle mass; rumen-protected GAA raised Hu sheep daily gain and lowered feed:gain.' }, refs: ['gaa_lamb', 'gaa_rp_sheep'] }
    ],
    howto: {
      zh: ['猪禽用 98% 粉末，目录添加量 300–600 g/t；牛羊用 50% 脂肪包被微囊。', '与蛋氨酸、甜菜碱等甲基供体配合使用效果更好。', '密封存放于阴凉干燥处。'],
      en: ['Pigs and poultry: 98% powder at 300–600 g/t. Cattle and sheep: the 50% fat-coated microcapsule.', 'Works best with adequate methyl donors such as methionine and betaine.', 'Store sealed in a cool, dry place.']
    },
    faq: [
      { q: { zh: '胍基乙酸和肌酸有什么区别？', en: 'How is GAA different from creatine?' }, a: { zh: '胍基乙酸是肌酸的前体，在体内转化为肌酸。它比肌酸更稳定、成本更低，是饲料中补充肌酸的常用方式。', en: 'GAA is creatine’s precursor and is converted to creatine in the body. It is more stable and cheaper than creatine, making it the usual way to supply creatine through feed.' } },
      { q: { zh: '牛羊为什么要用包被型？', en: 'Why do ruminants need the coated grade?' }, a: { zh: '瘤胃微生物会分解大部分游离的胍基乙酸。脂肪包被微囊可以保护它通过瘤胃，到小肠后再释放吸收。', en: 'Rumen microbes break down most free GAA. The fat-coated microcapsule carries it through the rumen for release and absorption in the small intestine.' } }
    ],
    keywords: ['肌肉', '瘦肉', '胸肉', '能量', '肉鸡', '料肉比', '增重', '胴体', '育肥', '肉牛', '肉羊', 'muscle', 'breast', 'broiler', 'energy', 'carcass', 'creatine', 'fcr', 'beef', 'lamb']
  },
  cysteamine: {
    cat: 'muscle',
    formula: 'C₂H₇NS·HCl',
    name: { zh: '半胱胺', en: 'Cysteamine' },
    species: ['pig', 'poultry', 'ruminant'],
    intro: {
      zh: '半胱胺能降低体内生长抑素的水平，相当于「松开生长的刹车」，让生长激素和 IGF-I 发挥更大作用，从而提高日增重和饲料效率。德高提供两种包被盐酸盐微囊（30%、27%）和 30% 半胱胺螯合锌粉末。半胱胺有明确的最佳剂量，加多了反而无效甚至抑制生长，务必按推荐量使用。',
      en: 'Cysteamine lowers somatostatin — in effect releasing the brake on growth — so growth hormone and IGF-I work harder, improving daily gain and feed efficiency. Degao offers two coated hydrochloride microcapsules (30% and 27%) and a 30% cysteamine-zinc chelate powder. Cysteamine has a clear optimal dose; more is not better and can suppress growth, so always follow the recommended rate.'
    },
    benefits: {
      zh: ['降低生长抑素，促进生长激素作用', '提高日增重与饲料效率', '包被微囊，稳定、减少刺激', '有最佳剂量，按推荐量使用'],
      en: ['Lowers somatostatin, supports growth hormone', 'Better daily gain and feed efficiency', 'Coated microcapsules: stable, less irritating', 'Has an optimal dose — follow the rate']
    },
    mechanism: {
      zh: [
        '生长抑素是体内抑制生长激素分泌的激素。半胱胺能降低生长抑素的含量，使生长激素和胰岛素样生长因子（IGF-I）水平升高，动物长得更快，饲料利用更好。',
        '半胱胺盐酸盐容易氧化、吸潮，并有刺激性气味。微囊包被把它保护起来，提高在饲料中的稳定性，也减少对消化道的刺激。螯合锌产品把半胱胺和锌结合在一起，同时提供锌元素。'
      ],
      en: [
        'Somatostatin is the hormone that holds back growth hormone release. Cysteamine reduces somatostatin, raising growth hormone and IGF-I so animals grow faster and use feed better.',
        'Cysteamine hydrochloride oxidizes and absorbs moisture easily and has an irritating odor. Microencapsulation protects it, improving stability in feed and reducing gut irritation. The zinc chelate binds cysteamine to zinc, supplying zinc at the same time.'
      ]
    },
    uses: [
      { sp: 'pig', scene: { zh: '育肥猪增重', en: 'Finishing pig gain' }, text: { zh: '70 mg/kg 半胱胺提高育肥猪日增重和血清 IGF-I；剂量加倍反而没有效果。', en: '70 mg/kg cysteamine raised daily gain and serum IGF-I of finishing pigs; doubling the dose removed the effect.' }, refs: ['cs_pig'] },
      { sp: 'poultry', scene: { zh: '肉鸡生长', en: 'Broiler growth' }, text: { zh: '低剂量半胱胺提高肉鸡生长和消化酶活性，高剂量（150 mg/kg）反而抑制生长。', en: 'Low doses improved broiler growth and digestive enzymes; a high dose (150 mg/kg) suppressed growth.' }, refs: ['cs_broiler'] },
      { sp: 'poultry', scene: { zh: '种鸡产蛋（谨慎）', en: 'Breeder hens (with caution)' }, text: { zh: '67 周龄肉种鸡添加 400 mg/kg 半胱胺，产蛋率提高 2.24%、破蛋率下降，但后代母雏体重偏低。种鸡使用前请咨询技术部。', en: 'In 67-week-old broiler breeders, 400 mg/kg cysteamine raised lay rate by 2.24% and cut broken eggs, but female offspring were lighter. Consult our technical team before using in breeders.' }, refs: ['cs_hen'] },
      { sp: 'ruminant', scene: { zh: '育肥羊', en: 'Feedlot lambs' }, text: { zh: '半胱胺提高育肥羔羊日增重、采食量和饲料效率。', en: 'Cysteamine increased daily gain, intake and feed efficiency of feedlot lambs.' }, refs: ['cs_lamb'] }
    ],
    gradeNote: {
      zh: '三个规格的目录添加量都是 300 g/t。按 30% 包被微囊计算，相当于每公斤饲料约 90 mg 半胱胺盐酸盐，与研究中的有效剂量接近。螯合锌产品目前没有找到直接的公开研究。',
      en: 'All three grades are dosed at 300 g/t. For the 30% microcapsule that is about 90 mg cysteamine hydrochloride per kg of feed, close to the effective doses in studies. We found no published studies on the zinc chelate itself.'
    },
    howto: {
      zh: ['严格按 300 g/t 添加，不要自行加量：研究显示剂量过高反而无效甚至抑制生长。', '育肥阶段使用效果最明显。', '密封避光，存放于阴凉干燥处。'],
      en: ['Dose strictly at 300 g/t and do not increase it — studies show high doses lose effect or suppress growth.', 'Most effective in the finishing phase.', 'Store sealed, away from light, cool and dry.']
    },
    faq: [
      { q: { zh: '为什么不能多加？', en: 'Why not add more?' }, a: { zh: '半胱胺的作用有一个最佳剂量。猪的研究中剂量加倍后效果消失，肉鸡在高剂量下生长反而受抑制。多加不仅浪费，还可能适得其反。', en: 'Cysteamine works within an optimal window. In pigs, doubling the dose erased the effect; in broilers a high dose suppressed growth. Extra is wasted and can backfire.' } },
      { q: { zh: '30% 和 27% 微囊有什么区别？', en: '30% vs 27% microcapsule?' }, a: { zh: '两者都是包被盐酸盐微囊，主要区别是有效含量。同样添加 300 g/t，30% 规格提供的半胱胺略多。', en: 'Both are coated hydrochloride microcapsules; they differ mainly in active content. At 300 g/t the 30% grade supplies slightly more cysteamine.' } }
    ],
    keywords: ['增重', '瘦肉', '生长', '育肥', '出栏', '料肉比', '饲料转化', '生长激素', '长得慢', 'growth', 'lean', 'finish', 'fcr', 'weight gain']
  },
  musclex: {
    cat: 'muscle',
    pending: true,
    formula: 'Blend',
    name: { zh: '增肌王', en: 'Zengjiwang Muscle Builder' },
    species: [],
    intro: {
      zh: '增肌王是德高的复配产品，有标准版和加强版两个规格，定位于促进肌肉生长。具体成分、作用方式和适用动物待德高技术部确认，请致电咨询。',
      en: 'Zengjiwang is a Degao proprietary blend, available in standard and enhanced versions and positioned to support muscle growth. Composition, mode of action and target species are awaiting confirmation by Degao’s technical team — please call for details.'
    },
    benefits: {
      zh: ['定位：促进肌肉生长', '标准版、加强版两个规格', '具体配方待确认'],
      en: ['Positioned for muscle growth', 'Standard and enhanced versions', 'Formula awaiting confirmation']
    },
    howto: {
      zh: ['目录添加量：标准版 2000 g/t，加强版 2500 g/t。', '具体使用方法以产品说明书为准。'],
      en: ['Catalog inclusion: standard 2000 g/t, enhanced 2500 g/t.', 'Follow the product sheet for usage.']
    },
    faq: [PENDING_FAQ],
    keywords: ['增肌', '肌肉', '瘦肉', '生长', 'muscle']
  },
  gamt: {
    cat: 'muscle',
    pending: true,
    formula: 'GAMT',
    name: { zh: 'GAMT 酶', en: 'GAMT Enzyme' },
    species: [],
    intro: {
      zh: 'GAMT 是胍基乙酸甲基转移酶的英文缩写。在动物体内，它负责把胍基乙酸转化为肌酸，是肌酸合成的最后一步。德高 GAMT 酶有标准版、加强版和包被反刍用三个规格。产品的具体成分和作用方式待德高技术部确认，请致电咨询。',
      en: 'GAMT stands for guanidinoacetate N-methyltransferase — the enzyme that converts guanidinoacetic acid into creatine, the final step of creatine synthesis in animals. Degao’s GAMT Enzyme comes in standard, enhanced and coated-for-ruminants versions. Composition and mode of action are awaiting confirmation by Degao’s technical team — please call for details.'
    },
    benefits: {
      zh: ['围绕肌酸合成设计', '可与胍基乙酸搭配思路', '有反刍专用包被规格', '具体配方待确认'],
      en: ['Designed around creatine synthesis', 'Conceptually pairs with GAA', 'Coated version for ruminants', 'Formula awaiting confirmation']
    },
    howto: {
      zh: ['目录添加量 200–500 g/t。', '牛羊选用「包被反刍用」规格。', '具体使用方法以产品说明书为准。'],
      en: ['Catalog inclusion is 200–500 g/t.', 'For cattle and sheep, use the coated ruminant version.', 'Follow the product sheet for usage.']
    },
    faq: [PENDING_FAQ],
    keywords: ['肌酸', '胍基乙酸', '肌肉', 'gamt', 'creatine']
  },

  // ---------------- 抗应激 ----------------
  gaba: {
    cat: 'stress',
    formula: 'C₄H₉NO₂',
    name: { zh: 'γ-氨基丁酸', en: 'GABA' },
    species: ['pig', 'poultry', 'ruminant'],
    intro: {
      zh: 'γ-氨基丁酸（GABA）是动物体内主要的「镇静」神经递质。热应激、运输、转群时，动物紧张、采食下降，GABA 帮助它们安定下来、吃得下饭。用量很小：98% 规格每吨饲料只需 25–50 g，与猪和蛋鸡研究中的有效剂量一致。牛羊请选用 40% 包被微囊。',
      en: 'GABA is the body’s main calming neurotransmitter. Under heat, transport or regrouping stress, animals get agitated and eat less; GABA helps them settle and keep eating. The dose is tiny: just 25–50 g/t of the 98% grade, matching the effective doses in pig and layer studies. For cattle and sheep, use the 40% coated microcapsule.'
    },
    benefits: {
      zh: ['缓解热应激、运输应激', '稳定采食量', '改善抗氧化和免疫指标', '用量小，成本低'],
      en: ['Eases heat and transport stress', 'Keeps feed intake steady', 'Better antioxidant and immune status', 'Very low inclusion, low cost']
    },
    mechanism: {
      zh: [
        'GABA 与神经细胞上的受体结合，降低神经兴奋性，起到镇静作用。应激时，动物体内应激激素升高，采食中枢受到抑制。补充 GABA 可以缓和应激反应，帮助维持采食和体温调节。',
        '研究还发现 GABA 能提高机体抗氧化酶活性、调节免疫，并影响肠道功能。反刍动物瘤胃微生物会降解部分 GABA，所以牛羊要用包被型。'
      ],
      en: [
        'GABA binds receptors on nerve cells and dampens excitability, producing a calming effect. Under stress, stress hormones rise and the appetite center is suppressed; supplemental GABA softens the stress response and helps maintain intake and thermoregulation.',
        'Studies also show GABA raises antioxidant enzyme activity, modulates immunity and influences gut function. Rumen microbes degrade some GABA, so ruminants need the coated grade.'
      ]
    },
    uses: [
      { sp: 'pig', scene: { zh: '断奶仔猪', en: 'Weaned piglets' }, text: { zh: '断奶仔猪添加 20 mg/kg GABA，生长性能提高，肠道炎症因子表达下降。', en: 'Weaned piglets fed 20 mg/kg GABA grew better, with lower gut pro-inflammatory cytokine expression.' }, refs: ['gaba_piglet'] },
      { sp: 'pig', scene: { zh: '运输与出栏应激', en: 'Transport stress' }, text: { zh: '生长育肥猪全程添加 30 mg/kg GABA，日增重提高，并减轻运输应激对肉质的不利影响。', en: 'Growing-finishing pigs fed 30 mg/kg GABA gained faster, and GABA eased the impact of transport stress on meat quality.' }, refs: ['gaba_pig_tr'] },
      { sp: 'poultry', scene: { zh: '蛋鸡夏季稳产', en: 'Layers in summer heat' }, text: { zh: '热应激蛋鸡添加 50 mg/kg GABA，产蛋率、蛋重和蛋壳强度提高，料蛋比降低。', en: 'Heat-stressed hens fed 50 mg/kg GABA laid more and heavier eggs with stronger shells and better feed:egg.' }, refs: ['gaba_hen'] },
      { sp: 'poultry', scene: { zh: '肉鸡热应激', en: 'Broilers under heat stress' }, text: { zh: '100 mg/kg GABA 提高热应激肉鸡采食量和增重，降低体温，并改善抗氧化和免疫指标。', en: '100 mg/kg GABA raised intake and gain of heat-stressed broilers, lowered body temperature and improved antioxidant and immune status.' }, refs: ['gaba_fi', 'gaba_hs'] },
      { sp: 'ruminant', scene: { zh: '奶牛夏季热应激', en: 'Dairy cows in summer heat' }, text: { zh: '热应激泌乳奶牛饲喂过瘤胃 GABA（40–120 mg/kg 干物质），体温随剂量下降，免疫和抗氧化指标改善。', en: 'Heat-stressed cows fed rumen-protected GABA (40–120 mg/kg DM) showed dose-related drops in body temperature and better immune and antioxidant status.' }, refs: ['gaba_cow'] }
    ],
    gradeNote: {
      zh: '98% 规格含量最高，适合预混料厂；50% 规格已稀释，用量放大一倍，在全价料中更容易混匀；40% 包被微囊可通过瘤胃，用于奶牛、肉牛和羊。',
      en: 'The 98% grade has the highest content and suits premix plants; the 50% grade is pre-diluted, doubling the inclusion so it mixes evenly in complete feed; the 40% coated microcapsule passes the rumen for dairy, beef and sheep.'
    },
    howto: {
      zh: ['用量极小，必须先逐级预混（先与少量载体混匀，再扩大），保证均匀。', '建议在高温季节来临前 1–2 周开始添加，或在运输、转群前使用。', '密封存放于阴凉干燥处。'],
      en: ['Inclusion is tiny — premix in stages (blend with a little carrier first, then scale up) for uniformity.', 'Start 1–2 weeks before hot weather, or before transport and regrouping.', 'Store sealed in a cool, dry place.']
    },
    faq: [
      { q: { zh: 'GABA 用量这么小，真的有用吗？', en: 'Can such a small dose really work?' }, a: { zh: 'GABA 是信号分子，有效剂量本来就很低。猪的研究用 20–30 mg/kg，蛋鸡 50 mg/kg 效果最好，与德高推荐用量一致。', en: 'GABA is a signaling molecule, so effective doses are naturally low. Pig studies used 20–30 mg/kg and layers responded best at 50 mg/kg — in line with Degao’s recommended rates.' } },
      { q: { zh: '能和甜菜碱一起用吗？', en: 'Can it be combined with betaine?' }, a: { zh: '可以。GABA 从神经调节入手稳定采食，甜菜碱从细胞渗透压入手保护细胞，两者常搭配用于夏季抗热应激。', en: 'Yes. GABA steadies intake through the nervous system while betaine protects cells through osmotic balance — a common summer pairing.' } }
    ],
    keywords: ['热应激', '应激', '高温', '夏季', '夏天', '天热', '运输', '转群', '躁动', '采食下降', '产蛋', '蛋鸡', '奶牛', 'heat', 'stress', 'summer', 'transport', 'calm', 'laying', 'layer', 'gaba']
  },
  betaine: {
    cat: 'stress',
    formula: 'C₅H₁₁NO₂·HCl',
    name: { zh: '甜菜碱盐酸盐', en: 'Betaine HCl' },
    species: ['pig', 'poultry', 'ruminant', 'aqua'],
    intro: {
      zh: '甜菜碱有两大作用：一是帮细胞「保水」，在高温脱水时维持细胞正常形态和功能；二是作为甲基供体，可部分节约蛋氨酸和胆碱，并促进脂肪代谢、降低背膘。德高 70% 包被甜菜碱盐酸盐减少了吸潮和对其他成分的影响，猪、禽、牛和水产都适用。',
      en: 'Betaine does two jobs: it helps cells hold water, keeping them working when heat dehydrates the body, and it is a methyl donor that partly spares methionine and choline while promoting fat metabolism and reducing backfat. Degao’s 70% coated betaine HCl absorbs less moisture and interacts less with other ingredients — suitable for pigs, poultry, cattle and aqua.'
    },
    benefits: {
      zh: ['调节细胞渗透压，缓解热应激', '甲基供体，节约蛋氨酸和胆碱', '降低背膘，提高屠宰率', '对虾等水产动物有诱食作用'],
      en: ['Osmotic balance, eases heat stress', 'Methyl donor, spares methionine and choline', 'Less backfat, higher dressing percentage', 'Feeding attractant for shrimp and prawns']
    },
    mechanism: {
      zh: [
        '高温时动物失水，细胞缩水，代谢效率下降。甜菜碱是一种渗透调节物质，能在细胞内积累，帮助细胞保住水分、维持形态，肠道细胞尤其受益。',
        '甜菜碱带有三个甲基，可以把甲基转给同型半胱氨酸生成蛋氨酸，从而节约日粮中的蛋氨酸和胆碱。甲基还参与肉碱合成，帮助脂肪进入线粒体燃烧，这是甜菜碱降低背膘的原因之一。'
      ],
      en: [
        'In heat, animals lose water, cells shrink and metabolism slows. Betaine is an osmolyte that accumulates inside cells, helping them retain water and shape — gut cells benefit most.',
        'Betaine carries three methyl groups and can donate one to homocysteine to regenerate methionine, sparing dietary methionine and choline. Methyl groups also feed carnitine synthesis, which shuttles fat into mitochondria for burning — one reason betaine reduces backfat.'
      ]
    },
    uses: [
      { sp: 'pig', scene: { zh: '育肥猪降背膘', en: 'Less backfat in finishers' }, text: { zh: '汇总多项研究：甜菜碱降低育肥猪料重比和背膘厚、提高屠宰率（对日增重无影响）。0.25% 甜菜碱可改善胴体性状。', en: 'Across studies, betaine lowered feed per gain and backfat and raised dressing percentage in finishers (no change in daily gain); 0.25% betaine improved carcass traits.' }, refs: ['bt_meta', 'bt_pig'] },
      { sp: 'pig', scene: { zh: '猪夏季热应激', en: 'Pigs in summer heat' }, text: { zh: '热应激生长育肥猪添加 0.1% 甜菜碱，日增重高于热应激对照组。', en: 'Heat-stressed growing-finishing pigs fed 0.1% betaine gained faster than heat-stressed controls.' }, refs: ['bt_pig_hs'] },
      { sp: 'poultry', scene: { zh: '肉鸡、蛋鸡热应激', en: 'Broilers and layers in heat' }, text: { zh: '甜菜碱减轻长期热应激对黄羽肉鸡生长和胴体的不利影响；慢性热应激蛋鸡添加 1000 mg/kg 甜菜碱，产蛋性能提高。', en: 'Betaine reduced the harm of long-term heat stress on broiler growth and carcass; heat-stressed hens fed 1000 mg/kg betaine laid better.' }, refs: ['bt_broiler_hs', 'bt_hen'] },
      { sp: 'ruminant', scene: { zh: '奶牛夏季稳产', en: 'Dairy cows in summer' }, text: { zh: '热应激奶牛每天补充 15 g 甜菜碱，干物质采食量、乳蛋白和乳脂提高。', en: 'Heat-stressed cows given 15 g/d betaine ate more and produced more milk protein and fat.' }, refs: ['bt_dairy'] },
      { sp: 'aqua', scene: { zh: '虾类诱食', en: 'Prawn feed attraction' }, text: { zh: '5 g/kg 甘氨酸甜菜碱作为诱食剂，使罗氏沼虾采食量和增重提高，增重比对照高 61.5%。', en: '5 g/kg glycine betaine as an attractant raised feed intake and gain of giant freshwater prawn — 61.5% more gain than the control.' }, refs: ['bt_prawn'] }
    ],
    howto: {
      zh: ['目录添加量 500–1000 g/t；夏季热应激期可取上限。', '可部分替代日粮中的氯化胆碱和蛋氨酸，替代比例请咨询技术部。', '密封防潮保存。'],
      en: ['Catalog inclusion is 500–1000 g/t; use the upper end during heat stress.', 'Can partly replace choline chloride and methionine; ask our technical team about replacement ratios.', 'Store sealed and dry.']
    },
    faq: [
      { q: { zh: '为什么要用包被甜菜碱盐酸盐？', en: 'Why coated betaine HCl?' }, a: { zh: '甜菜碱盐酸盐酸性较强、容易吸潮。包被后不易结块，与维生素等成分接触更少，在预混料中更稳定。', en: 'Betaine HCl is fairly acidic and absorbs moisture. Coating prevents caking and limits contact with vitamins and other ingredients, making it more stable in premixes.' } }
    ],
    keywords: ['甲基', '蛋氨酸', '胆碱', '热应激', '高温', '瘦肉', '背膘', '诱食', '脂肪肝', '水产', '虾', '鱼', '奶牛', 'methyl', 'methionine', 'choline', 'heat', 'lean', 'backfat', 'attract', 'shrimp', 'fish']
  },

  // ---------------- 过瘤胃包被营养 ----------------
  met: {
    cat: 'rumen',
    formula: 'C₅H₁₁NO₂S',
    name: { zh: '包被蛋氨酸', en: 'Rumen-Protected Methionine' },
    species: ['ruminant'],
    intro: {
      zh: '蛋氨酸是奶牛产奶的第一限制性氨基酸。普通蛋氨酸进入瘤胃后大部分被微生物分解，到不了小肠。德高 50% 包被蛋氨酸能保护蛋氨酸通过瘤胃，在小肠释放吸收，直接用于合成乳蛋白。围产期和泌乳早期使用，效果最明显。',
      en: 'Methionine is the first limiting amino acid for milk production. Plain methionine is mostly broken down by rumen microbes and never reaches the small intestine. Degao’s 50% coated methionine carries it through the rumen for release and absorption in the small intestine, where it goes straight into milk protein. Best results in the transition period and early lactation.'
    },
    benefits: {
      zh: ['提高乳蛋白率和乳蛋白产量', '围产期提高采食量和产奶量', '改善肝功能', '可降低日粮粗蛋白、减少氮排放'],
      en: ['Higher milk protein content and yield', 'More intake and milk in the transition period', 'Better liver function', 'Allows lower dietary crude protein and less N excretion']
    },
    mechanism: {
      zh: [
        '奶牛小肠吸收的氨基酸主要来自瘤胃微生物蛋白和过瘤胃饲料蛋白。玉米型日粮中，蛋氨酸和赖氨酸最先不够用，限制了乳蛋白合成。',
        '包被层在瘤胃的中性环境中保持完整，保护蛋氨酸不被微生物降解；进入真胃和小肠后，包被在酸性和消化酶作用下打开，蛋氨酸被吸收。蛋氨酸还参与肝脏脂蛋白合成，帮助围产期奶牛把肝脏里的脂肪运出去。',
        '研究中常把可代谢蛋白中赖氨酸与蛋氨酸的比例调到约 3:1（2.8:1）。日粮赖氨酸也不足时，建议与包被赖氨酸一起使用。'
      ],
      en: [
        'The amino acids a cow absorbs come mainly from rumen microbial protein and rumen-undegradable feed protein. On corn-based diets, methionine and lysine run short first, limiting milk protein synthesis.',
        'The coating stays intact in the near-neutral rumen, shielding methionine from microbes; in the abomasum and small intestine, acid and enzymes open it and methionine is absorbed. Methionine also helps the liver build lipoproteins, exporting fat from the liver of transition cows.',
        'Studies typically target a lysine-to-methionine ratio of about 3:1 (2.8:1) in metabolizable protein. If lysine is also short, combine with coated lysine.'
      ]
    },
    uses: [
      { sp: 'ruminant', scene: { zh: '围产期奶牛', en: 'Transition dairy cows' }, text: { zh: '产前约 3–4 周至产后补充过瘤胃蛋氨酸，产后采食量和产奶量更高（每天多 3.8–4.1 kg 奶），乳蛋白率提高，肝功能改善。', en: 'Rumen-protected methionine from 3–4 weeks before calving raised post-calving intake and milk (3.8–4.1 kg/d more), milk protein and liver function.' }, refs: ['met_trans', 'met_ec'] },
      { sp: 'ruminant', scene: { zh: '泌乳奶牛乳蛋白', en: 'Milk protein in lactating cows' }, text: { zh: '汇总 35 项研究：过瘤胃蛋氨酸使乳蛋白率平均提高 0.07 个百分点，乳蛋白产量每天多 27 g。', en: 'Across 35 studies, rumen-protected methionine raised milk protein by 0.07 percentage points and 27 g/d on average.' }, refs: ['met_meta'] },
      { sp: 'ruminant', scene: { zh: '低蛋白日粮', en: 'Lower-protein diets' }, text: { zh: '日粮蛋白不足时，补充过瘤胃赖氨酸和蛋氨酸使产奶量和乳蛋白产量接近正常蛋白日粮，有助于降低豆粕用量。', en: 'On a protein-short diet, rumen-protected lysine and methionine brought milk and milk protein close to a normal-protein diet — a route to less soybean meal.' }, refs: ['lys_mp'] }
    ],
    howto: {
      zh: ['目录添加量 500–1000 g/t 饲料。牧场习惯按「每头每天多少克」添加，请技术部按您的日粮和采食量换算。', '围产期从产前 3–4 周开始，持续到产后 30–60 天。', '加入精料或 TMR 中搅拌均匀，避免长时间高强度粉碎破坏包被。'],
      en: ['Catalog inclusion is 500–1000 g/t of feed. Farms usually dose per head per day — our technical team will convert for your ration and intake.', 'For transition cows, start 3–4 weeks before calving and continue to 30–60 days in milk.', 'Mix into concentrate or TMR; avoid prolonged, harsh grinding that can damage the coating.']
    },
    faq: [
      { q: { zh: '为什么不能直接用普通蛋氨酸？', en: 'Why not plain methionine?' }, a: { zh: '普通蛋氨酸在瘤胃里大部分被微生物分解，奶牛几乎吸收不到。包被蛋氨酸才能把蛋氨酸送到小肠。', en: 'Rumen microbes break down most plain methionine, so the cow absorbs very little. Only the coated form delivers it to the small intestine.' } },
      { q: { zh: '什么时候用效果最好？', en: 'When does it pay off most?' }, a: { zh: '围产期和泌乳早期。研究显示这一阶段补充，采食量、产奶量和乳蛋白都有提高。', en: 'In the transition period and early lactation, when studies show gains in intake, milk and milk protein.' } }
    ],
    keywords: ['奶牛', '乳蛋白', '产奶', '围产', '过瘤胃', '蛋氨酸', '牛奶', '泌乳', 'dairy', 'milk protein', 'milk', 'transition', 'methionine', 'rumen']
  },
  lys: {
    cat: 'rumen',
    formula: 'C₆H₁₄N₂O₂',
    name: { zh: '包被赖氨酸', en: 'Rumen-Protected Lysine' },
    species: ['ruminant'],
    intro: {
      zh: '赖氨酸和蛋氨酸是玉米型日粮奶牛最缺的两种氨基酸。德高 60% 包被赖氨酸保护赖氨酸通过瘤胃，到小肠吸收，用于合成乳蛋白。产前开始饲喂，对产后产奶的帮助最大。与包被蛋氨酸搭配，可以同时补足两种限制性氨基酸。',
      en: 'Lysine and methionine are the two amino acids most lacking for cows on corn-based diets. Degao’s 60% coated lysine carries lysine through the rumen for absorption in the small intestine and use in milk protein. Starting before calving does the most for post-calving milk. Pair with coated methionine to cover both limiting amino acids.'
    },
    benefits: {
      zh: ['补足第二限制性氨基酸', '提高产奶量和乳成分产量', '产前饲喂效果更好', '可降低日粮粗蛋白'],
      en: ['Supplies the second limiting amino acid', 'More milk and milk components', 'Strongest when started before calving', 'Allows lower dietary crude protein']
    },
    mechanism: {
      zh: [
        '与蛋氨酸一样，游离赖氨酸在瘤胃中容易被降解。包被工艺让赖氨酸在瘤胃中保持稳定，在小肠中释放。',
        '赖氨酸和蛋氨酸需要按比例供应，一种不足，另一种也用不上。研究中常把可代谢蛋白中赖氨酸与蛋氨酸的比例调到约 3:1。'
      ],
      en: [
        'Like methionine, free lysine is readily degraded in the rumen. The coating keeps it stable there and releases it in the small intestine.',
        'Lysine and methionine must be supplied in balance — if one is short, the other cannot be fully used. Studies typically target about 3:1 lysine to methionine in metabolizable protein.'
      ]
    },
    uses: [
      { sp: 'ruminant', scene: { zh: '泌乳早期奶牛', en: 'Early-lactation cows' }, text: { zh: '汇总 13 项试验：泌乳早期开始或长期饲喂过瘤胃赖氨酸的奶牛，每天多产奶 1.51 kg。', en: 'Across 13 experiments, cows fed rumen-protected lysine from early lactation or for an extended period gave 1.51 kg/d more milk.' }, refs: ['lys_meta'] },
      { sp: 'ruminant', scene: { zh: '围产前期奶牛', en: 'Close-up dry cows' }, text: { zh: '产前 28 天开始饲喂过瘤胃赖氨酸，产后能量校正乳每天多约 4.6 kg，乳脂和乳蛋白产量提高；只在产后饲喂则没有效果。', en: 'Starting rumen-protected lysine 28 days before calving added about 4.6 kg/d energy-corrected milk with more fat and protein; feeding only after calving had no effect.' }, refs: ['lys_pre'] },
      { sp: 'ruminant', scene: { zh: '低蛋白日粮', en: 'Lower-protein diets' }, text: { zh: '日粮蛋白不足时，补充过瘤胃赖氨酸和蛋氨酸，产奶量和乳蛋白产量接近正常蛋白日粮。', en: 'On a protein-short diet, rumen-protected lysine plus methionine brought milk and milk protein close to a normal-protein diet.' }, refs: ['lys_mp'] }
    ],
    howto: {
      zh: ['目录添加量 500–1000 g/t 饲料，请技术部按每头每天用量换算。', '建议从产前 3–4 周开始饲喂。', '与包被蛋氨酸搭配使用，按约 3:1 的比例平衡。'],
      en: ['Catalog inclusion is 500–1000 g/t of feed; ask our technical team to convert to grams per head per day.', 'Start 3–4 weeks before calving.', 'Pair with coated methionine, balancing at about 3:1.']
    },
    faq: [
      { q: { zh: '产后才开始用可以吗？', en: 'Can I start after calving?' }, a: { zh: '可以用，但研究显示产前开始饲喂效果更好：产前就补足赖氨酸，产后产奶和乳成分提高更明显。', en: 'You can, but studies show starting before calving works better — topping up lysine pre-calving gave clearer gains in milk and components afterward.' } }
    ],
    keywords: ['奶牛', '乳蛋白', '产奶', '围产', '过瘤胃', '赖氨酸', '低蛋白', 'dairy', 'milk', 'lysine', 'rumen', 'transition']
  },
  choline: {
    cat: 'rumen',
    formula: 'C₅H₁₄ClNO',
    name: { zh: '包被氯化胆碱', en: 'Rumen-Protected Choline' },
    species: ['ruminant'],
    intro: {
      zh: '围产期奶牛大量动员体脂，肝脏容易堆积脂肪，形成脂肪肝。胆碱是肝脏把脂肪「打包运出去」所必需的原料，但普通氯化胆碱在瘤胃中几乎被完全分解。德高 25% 包被氯化胆碱保护胆碱通过瘤胃，帮助围产期奶牛护肝、稳产。',
      en: 'Transition cows mobilize lots of body fat, and fat can pile up in the liver. Choline is essential for the liver to package and export that fat, but plain choline chloride is almost entirely destroyed in the rumen. Degao’s 25% coated choline chloride carries choline through the rumen to protect the liver and support milk yield in transition cows.'
    },
    benefits: {
      zh: ['帮助肝脏输出脂肪', '提高产后产奶量', '有降低胎衣不下风险的趋势', '与包被蛋氨酸互补'],
      en: ['Helps the liver export fat', 'More milk after calving', 'Tends to lower retained-placenta risk', 'Complements coated methionine']
    },
    mechanism: {
      zh: [
        '肝脏把脂肪运出去，要先把它装进极低密度脂蛋白（VLDL），而合成 VLDL 需要磷脂酰胆碱。胆碱不足时，脂肪滞留在肝脏，影响肝功能和产奶。',
        '瘤胃微生物会分解绝大部分饲料中的胆碱，包被工艺让胆碱在小肠释放吸收。蛋氨酸也能在体内转化提供甲基合成胆碱，所以两者有一定替代关系：日粮蛋氨酸越充足，额外补充胆碱的效果越小。'
      ],
      en: [
        'To move fat out, the liver packs it into very-low-density lipoproteins (VLDL), which requires phosphatidylcholine. When choline is short, fat stays in the liver, hurting liver function and milk yield.',
        'Rumen microbes destroy nearly all dietary choline; the coating releases it in the small intestine instead. Methionine can also supply methyl groups for choline synthesis, so the two partly overlap — the better the methionine supply, the smaller the extra benefit from choline.'
      ]
    },
    uses: [
      { sp: 'ruminant', scene: { zh: '围产期奶牛产奶', en: 'Milk in transition cows' }, text: { zh: '汇总 21 项试验：围产期补充过瘤胃胆碱（中位数每天 12.9 g 胆碱）使产后产奶量每天多 1.6 kg，并有降低胎衣不下和乳房炎风险的趋势；日粮蛋氨酸越充足，胆碱的增产效果越小。', en: 'Across 21 experiments, rumen-protected choline in the transition period (median 12.9 g/d) added 1.6 kg/d milk and tended to lower retained placenta and mastitis; the response shrank as dietary methionine rose.' }, refs: ['chol_meta'] },
      { sp: 'ruminant', scene: { zh: '围产期肝脏代谢', en: 'Transition liver metabolism' }, text: { zh: '围产期奶牛饲喂过瘤胃胆碱，肝糖原增加，乳脂产量有提高趋势，提示胆碱帮助肝脏输出脂肪。注意：也有试验中胆碱对生产性能没有显著作用。', en: 'Rumen-protected choline raised liver glycogen and tended to raise milk fat, suggesting it helps the liver export fat. Note that some trials found no significant performance effect.' }, refs: ['chol_liver', 'met_trans'] }
    ],
    howto: {
      zh: ['目录添加量 500–1000 g/t 饲料。研究中按每头每天约 13 g 胆碱补充，请技术部按您的日粮换算。', '从产前 3 周开始，持续到产后至少 30 天。', '与包被蛋氨酸配合时，可适当调整两者用量。'],
      en: ['Catalog inclusion is 500–1000 g/t of feed. Studies supplied about 13 g choline per cow per day; our technical team can convert for your ration.', 'Start 3 weeks before calving and continue at least 30 days after.', 'When combined with coated methionine, the two doses can be balanced against each other.']
    },
    faq: [
      { q: { zh: '普通氯化胆碱给奶牛有用吗？', en: 'Does plain choline chloride work for cows?' }, a: { zh: '作用很小。普通氯化胆碱在瘤胃中几乎被完全分解，奶牛需要用包被型。', en: 'Very little. Plain choline chloride is almost entirely broken down in the rumen; cows need the coated form.' } }
    ],
    keywords: ['奶牛', '脂肪肝', '围产', '胎衣不下', '酮病', '过瘤胃', '胆碱', '肝', 'dairy', 'fatty liver', 'transition', 'choline', 'rumen', 'liver']
  },
  vitamin: {
    cat: 'rumen',
    pending: true,
    formula: 'Vitamin Blend',
    name: { zh: '包被复合维生素', en: 'Coated Multivitamin' },
    species: [],
    intro: {
      zh: '包被复合维生素是德高的复配维生素产品，采用包被工艺保护维生素活性。具体维生素种类、含量和适用动物待德高技术部确认，请致电咨询。',
      en: 'A Degao multivitamin blend with a protective coating to preserve vitamin activity. The specific vitamins, levels and target species are awaiting confirmation by Degao’s technical team — please call for details.'
    },
    benefits: {
      zh: ['包被工艺，保护维生素活性', '具体配方待确认'],
      en: ['Coated to protect vitamin activity', 'Formula awaiting confirmation']
    },
    howto: {
      zh: ['目录添加量 500–1000 g/t。', '具体使用方法以产品说明书为准。'],
      en: ['Catalog inclusion is 500–1000 g/t.', 'Follow the product sheet for usage.']
    },
    faq: [PENDING_FAQ],
    keywords: ['维生素', 'vitamin']
  },

  // ---------------- 植物源与替抗 ----------------
  allicin: {
    cat: 'agp',
    formula: 'C₆H₁₀OS₂',
    name: { zh: '大蒜素', en: 'Allicin' },
    species: ['pig', 'poultry', 'aqua'],
    intro: {
      zh: '大蒜素是大蒜中主要的含硫活性成分，具有广谱抑菌作用，独特的蒜香味还能刺激采食。在断奶仔猪上可降低腹泻、提高增重，在鱼类上能增强抗病力。德高 25% 大蒜素粉添加量 200–1000 g/t，是无抗、减抗方案中常用的植物源原料。',
      en: 'Allicin is garlic’s main sulfur-containing active compound, with broad-spectrum antibacterial activity, and its garlic aroma stimulates appetite. It reduces diarrhea and improves gain in weaned piglets and strengthens disease resistance in fish. Degao 25% allicin powder is dosed at 200–1000 g/t — a staple plant-based ingredient for antibiotic-free and reduced-antibiotic programs.'
    },
    benefits: {
      zh: ['天然广谱抑菌', '蒜香味，促进采食', '降低仔猪腹泻', '增强鱼类抗病力'],
      en: ['Natural broad-spectrum antibacterial', 'Garlic aroma stimulates appetite', 'Fewer scours in piglets', 'Better disease resistance in fish']
    },
    mechanism: {
      zh: [
        '大蒜素能与细菌体内含巯基的酶反应，干扰细菌代谢，从而抑制多种有害菌。它的刺激性气味还能提高饲料吸引力。',
        '大蒜素对热和光比较敏感，选购时要关注有效含量和稳定性。'
      ],
      en: [
        'Allicin reacts with thiol-containing enzymes in bacteria, disrupting their metabolism and inhibiting many harmful species. Its pungent aroma also makes feed more attractive.',
        'Allicin is sensitive to heat and light, so active content and stability matter when buying.'
      ]
    },
    uses: [
      { sp: 'pig', scene: { zh: '断奶仔猪腹泻', en: 'Weaned piglet scours' }, text: { zh: '大蒜素提高断奶仔猪日增重、降低料重比，并随剂量增加降低腹泻发生率。', en: 'Allicin improved daily gain and feed:gain of weaned piglets and reduced diarrhea in a dose-related way.' }, refs: ['alc_piglet'] },
      { sp: 'pig', scene: { zh: '大肠杆菌挑战', en: 'E. coli challenge' }, text: { zh: '大蒜等植物提取物降低大肠杆菌攻毒断奶仔猪的腹泻和炎症反应（对生长无影响）。', en: 'Plant extracts including garlic reduced diarrhea and inflammation in E. coli-challenged weaned pigs (no effect on growth).' }, refs: ['alc_garlic'] },
      { sp: 'aqua', scene: { zh: '鱼类抗病', en: 'Fish disease resistance' }, text: { zh: '饲料添加大蒜素后，虹鳟感染嗜水气单胞菌的死亡率由 80% 降至 0–8%。', en: 'Dietary allicin cut rainbow trout mortality from Aeromonas hydrophila infection from 80% to 0–8%.' }, refs: ['alc_trout'] }
    ],
    howto: {
      zh: ['目录添加量 200–1000 g/t。', '高温制粒会损失部分大蒜素，颗粒料可取用量中上限。', '密封、避光、低温保存。'],
      en: ['Catalog inclusion is 200–1000 g/t.', 'High-temperature pelleting loses some allicin; use the upper range in pelleted feed.', 'Store sealed, dark and cool.']
    },
    faq: [
      { q: { zh: '大蒜素会让肉蛋有蒜味吗？', en: 'Will meat or eggs taste of garlic?' }, a: { zh: '按推荐量使用一般不会。大量长期使用时，请先咨询技术部。', en: 'Not at recommended rates. For high, long-term use, check with our technical team first.' } }
    ],
    keywords: ['抗菌', '抑菌', '诱食', '免疫', '风味', '天然', '鱼', '水产', '腹泻', '替抗', 'antibacter', 'appetite', 'immun', 'natural', 'garlic', 'fish', 'allicin']
  },
  tannic: {
    cat: 'agp',
    formula: 'C₇₆H₅₂O₄₆',
    name: { zh: '单宁酸', en: 'Tannic Acid' },
    species: ['pig', 'poultry'],
    intro: {
      zh: '单宁酸是天然植物多酚，有收敛作用，能让肠黏膜表面的蛋白质轻微凝固，形成保护层，减少肠液渗出，从而减轻腹泻；同时有抑菌和抗氧化作用。德高有 70% 原粉和 40% 包被颗粒两个规格，包被型适口性更好，适合长期添加。',
      en: 'Tannic acid is a natural plant polyphenol with an astringent action: it lightly firms proteins on the gut surface into a protective layer and reduces fluid loss, easing diarrhea, while also being antibacterial and antioxidant. Degao offers a 70% raw powder and a 40% coated granule; the coated grade is more palatable and suited to long-term use.'
    },
    benefits: {
      zh: ['收敛止泻，保护肠黏膜', '改善肠道屏障', '天然抑菌、抗氧化', '包被型适口性好'],
      en: ['Astringent, eases diarrhea, protects the gut', 'Strengthens the gut barrier', 'Natural antibacterial and antioxidant', 'Coated grade keeps palatability']
    },
    mechanism: {
      zh: [
        '单宁酸能与蛋白质结合。在肠道中，它让黏膜表面形成一层薄薄的保护膜，减少肠液流失，并让病原菌不易附着。单宁酸还能抑制部分细菌和毒素，并有抗氧化作用。',
        '单宁酸用量过大会结合饲料蛋白和消化酶，影响适口性和消化。包被工艺让它在肠道中缓慢释放，减轻这些副作用。'
      ],
      en: [
        'Tannic acid binds proteins. In the gut it forms a thin protective film on the mucosa, reducing fluid loss and making it harder for pathogens to attach. It also inhibits some bacteria and toxins and acts as an antioxidant.',
        'Too much tannic acid binds dietary protein and digestive enzymes, hurting palatability and digestion. Coating releases it slowly in the gut, reducing these side effects.'
      ]
    },
    uses: [
      { sp: 'pig', scene: { zh: '断奶仔猪腹泻', en: 'Post-weaning diarrhea' }, text: { zh: '0.2% 或 1.0% 单宁酸降低断奶仔猪腹泻率、改善肠道屏障，生长性能不受影响。综述也认为单宁可作为预防仔猪大肠杆菌性腹泻的抗生素替代方案。', en: '0.2% or 1.0% tannic acid lowered post-weaning diarrhea and improved the gut barrier without affecting growth. A review also supports tannins as an antibiotic alternative against E. coli diarrhea in piglets.' }, refs: ['ta_piglet', 'ta_review'] },
      { sp: 'pig', scene: { zh: '包被型的安全剂量', en: 'Safe dose of the coated form' }, text: { zh: '断奶仔猪添加 500–1000 mg/kg 微囊单宁酸对生长无不良影响，1000 mg/kg 还改善了十二指肠形态。', en: 'Microencapsulated tannic acid at 500–1000 mg/kg did not harm weaned piglet growth, and 1000 mg/kg improved duodenal morphology.' }, refs: ['ta_micro'] },
      { sp: 'poultry', scene: { zh: '肉鸡（谨慎使用）', en: 'Broilers (use with care)' }, text: { zh: '肉鸡添加 0.25–2 g/kg 单宁酸，前中期肠道健康指标改善，但 42 日龄时整体生长和产肉量下降。肉鸡全程使用需谨慎，请先咨询技术部。', en: 'In broilers, 0.25–2 g/kg tannic acid improved early gut-health markers but reduced overall growth and meat yield by day 42. Use cautiously across the whole cycle; consult our technical team first.' }, refs: ['ta_broiler'] }
    ],
    gradeNote: {
      zh: '70% 原粉含量高、成本低，但有明显涩味，适合短期使用或预混料。40% 包被颗粒在肠道中缓慢释放，对适口性和消化酶的影响更小，适合乳仔猪料和长期添加。',
      en: 'The 70% raw powder is concentrated and economical but noticeably astringent — best for short-term use or premixes. The 40% coated granule releases slowly in the gut with less impact on palatability and enzymes — suited to piglet feeds and long-term use.'
    },
    howto: {
      zh: ['70% 原粉 300–500 g/t，40% 包被颗粒 400–600 g/t。', '腹泻高发期（断奶后 2 周内）使用效果最明显。', '不要超量添加，以免影响蛋白消化。'],
      en: ['70% powder at 300–500 g/t; 40% coated granule at 400–600 g/t.', 'Most effective during high-risk periods such as the first 2 weeks after weaning.', 'Do not overdose, to avoid impairing protein digestion.']
    },
    faq: [
      { q: { zh: '单宁酸会影响生长吗？', en: 'Does tannic acid hurt growth?' }, a: { zh: '仔猪研究中，推荐剂量下生长不受影响。剂量过大或在肉鸡上全程使用可能降低生长，所以请按推荐量添加。', en: 'In piglet studies, growth was unaffected at recommended doses. Overdosing, or whole-cycle use in broilers, can reduce growth, so stick to the recommended rate.' } }
    ],
    keywords: ['腹泻', '拉稀', '止泻', '收敛', '黏膜', '粪便', '稀便', '替抗', 'diarrhea', 'scour', 'astring', 'tannin', 'feces', 'loose']
  },
  heigold: {
    cat: 'agp',
    pending: true,
    formula: 'Blend',
    name: { zh: '黑黄金', en: 'Black Gold' },
    species: [],
    intro: {
      zh: '黑黄金是德高的复配产品，用于无抗、减抗饲养方案，目录添加量 5000 g/t。具体成分、作用方式和适用动物待德高技术部确认，请致电咨询。',
      en: 'Black Gold is a Degao proprietary blend for antibiotic-free and reduced-antibiotic feeding programs, dosed at 5000 g/t. Composition, mode of action and target species are awaiting confirmation by Degao’s technical team — please call for details.'
    },
    benefits: {
      zh: ['用于无抗、减抗饲养方案', '具体配方待确认'],
      en: ['For antibiotic-free and reduced-antibiotic programs', 'Formula awaiting confirmation']
    },
    howto: {
      zh: ['目录添加量 5000 g/t。', '具体使用方法以产品说明书为准。'],
      en: ['Catalog inclusion is 5000 g/t.', 'Follow the product sheet for usage.']
    },
    faq: [PENDING_FAQ],
    keywords: ['替抗', '减抗', '无抗', 'antibiotic', 'agp']
  },

  // ---------------- 霉菌毒素与免疫 ----------------
  ycw: {
    cat: 'health',
    formula: 'β-Glucan · MOS',
    name: { zh: '酵母细胞壁多糖', en: 'Yeast Cell Wall Polysaccharides' },
    species: ['pig', 'poultry', 'ruminant', 'aqua'],
    intro: {
      zh: '酵母细胞壁富含 β-葡聚糖和甘露寡糖（MOS）。β-葡聚糖能「唤醒」先天免疫细胞，甘露寡糖能结合大肠杆菌、沙门氏菌等病原菌，让它们随粪便排出，酵母细胞壁还能吸附部分霉菌毒素。一个产品同时兼顾免疫、肠道和霉菌毒素防护。',
      en: 'Yeast cell wall is rich in β-glucans and mannan-oligosaccharides (MOS). β-glucans prime innate immune cells; MOS binds pathogens such as E. coli and Salmonella so they pass out in the feces; and the cell wall also binds some mycotoxins. One product covering immunity, gut health and mycotoxin protection.'
    },
    benefits: {
      zh: ['激活先天免疫', '结合病原菌，减少肠道定植', '吸附部分霉菌毒素', '猪、禽、牛、水产都适用'],
      en: ['Activates innate immunity', 'Binds pathogens, less gut colonization', 'Binds some mycotoxins', 'For pigs, poultry, cattle and aqua']
    },
    mechanism: {
      zh: [
        'β-葡聚糖被肠道中的免疫细胞识别，能增强巨噬细胞等先天免疫细胞的活性，提高机体对感染的反应能力。',
        '大肠杆菌、沙门氏菌靠表面的「钩子」抓住肠壁上的甘露糖。甘露寡糖相当于诱饵，病原菌抓住它后就随粪便排出，难以在肠道定植。',
        '酵母细胞壁的多糖结构还能结合部分霉菌毒素，减少毒素吸收。'
      ],
      en: [
        'β-glucans are recognized by gut immune cells and boost the activity of macrophages and other innate immune cells, sharpening the response to infection.',
        'E. coli and Salmonella use surface "hooks" to grab mannose on the gut wall. MOS acts as a decoy: pathogens latch onto it and are carried out in the feces instead of colonizing the gut.',
        'The cell wall polysaccharides also bind some mycotoxins, reducing absorption.'
      ]
    },
    uses: [
      { sp: 'pig', scene: { zh: '猪群免疫', en: 'Swine immunity' }, text: { zh: '酵母 β-葡聚糖调节了 LPS 攻毒断奶仔猪的免疫反应。', en: 'Yeast β-glucan modulated the immune response of LPS-challenged weaned pigs.' }, refs: ['ycw_pig'] },
      { sp: 'pig', scene: { zh: '猪饲料霉菌毒素', en: 'Mycotoxins in pig feed' }, text: { zh: '汇总 23 篇文献：饲料霉菌毒素在常见水平时，添加酵母细胞壁提取物改善了生长猪的生产性能。', en: 'Across 23 papers, yeast cell wall extract improved growing-pig performance at common feed mycotoxin levels.' }, refs: ['ycw_myco_pig'] },
      { sp: 'poultry', scene: { zh: '肉鸡肠道与坏死性肠炎', en: 'Broiler gut and necrotic enteritis' }, text: { zh: '甘露寡糖减轻大肠杆菌引起的肉鸡肠道炎症；坏死性肠炎攻毒下，酵母细胞壁提取物改善增重和成活率，效果与常用抗生素相当。', en: 'MOS eased E. coli-induced gut inflammation in broilers; under necrotic enteritis challenge, yeast cell wall extract improved gain and livability as well as common antibiotics did.' }, refs: ['ycw_broiler', 'ycw_ne'] },
      { sp: 'poultry', scene: { zh: '肉鸡霉菌毒素', en: 'Broiler mycotoxins' }, text: { zh: '在黄曲霉毒素与坏死性肠炎双重攻毒下，酵母细胞壁降低了肉鸡死亡率，部分保护生长和肠道。', en: 'Under combined aflatoxin and necrotic enteritis challenge, yeast cell wall lowered broiler mortality and partly protected growth and gut health.' }, refs: ['ycw_af'] },
      { sp: 'ruminant', scene: { zh: '犊牛腹泻', en: 'Calf scours' }, text: { zh: '代乳粉中添加甘露寡糖改善犊牛粪便评分，效果与抗生素相当，断奶后开食料采食更多。', en: 'MOS in milk replacer improved calf fecal scores as well as antibiotics did and increased starter intake after weaning.' }, refs: ['ycw_calf'] },
      { sp: 'ruminant', scene: { zh: '奶牛黄曲霉毒素', en: 'Aflatoxin in dairy cows' }, text: { zh: '含黏土矿物和灭活酵母的吸附剂，使奶牛饲料中黄曲霉毒素向牛奶的转移降低 52–63%。', en: 'Sequestrants combining clay minerals and inactivated yeast cut aflatoxin transfer from feed into milk by 52–63%.' }, refs: ['ycw_dairy'] },
      { sp: 'aqua', scene: { zh: '对虾抗应激', en: 'Shrimp stress resistance' }, text: { zh: '2–4 g/kg 甘露寡糖提高凡纳滨对虾生长和抗氨氮应激能力。', en: '2–4 g/kg MOS improved growth and ammonia-stress resistance of Pacific white shrimp.' }, refs: ['ycw_shrimp'] }
    ],
    howto: {
      zh: ['目录添加量 1000–2000 g/t。', '换季、断奶、疫苗免疫前后，以及原料霉变风险高时可取上限。', '可与脱霉剂配合，增强霉菌毒素防护。'],
      en: ['Catalog inclusion is 1000–2000 g/t.', 'Use the upper end at season changes, weaning, around vaccination and when mycotoxin risk is high.', 'Combine with a mycotoxin binder for broader protection.']
    },
    faq: [
      { q: { zh: '酵母细胞壁和活酵母有什么区别？', en: 'How is it different from live yeast?' }, a: { zh: '酵母细胞壁是酵母的外壳，没有活性，耐高温制粒，主要靠 β-葡聚糖和甘露寡糖起作用；活酵母主要作用于瘤胃或肠道发酵。', en: 'Yeast cell wall is the inactive outer shell of yeast — pellet-stable and working through β-glucans and MOS. Live yeast mainly acts on rumen or gut fermentation.' } }
    ],
    keywords: ['免疫', '抵抗力', '疫苗', '病原', '母猪', '体弱', '成活率', '死淘', '霉菌', '毒素', '犊牛', 'immun', 'vaccin', 'resist', 'sow', 'surviv', 'mortality', 'yeast', 'mycotoxin']
  },
  moldx: {
    cat: 'health',
    pending: true,
    formula: 'Mycotoxin Binder',
    name: { zh: '霉毒克-100', en: 'Meiduke-100' },
    species: ['pig', 'poultry', 'ruminant', 'aqua'],
    intro: {
      zh: '霉毒克-100 是德高的霉菌毒素处理剂，用于原料霉变风险高时保护动物健康和生产性能，目录添加量 1000 g/t。具体成分和对各类霉菌毒素的作用待德高技术部确认，请致电咨询。',
      en: 'Meiduke-100 is Degao’s mycotoxin management product, used when grain mold risk is high to protect animal health and performance, dosed at 1000 g/t. Composition and its action on specific mycotoxins are awaiting confirmation by Degao’s technical team — please call for details.'
    },
    benefits: {
      zh: ['用于原料霉变风险高时', '保护生长与繁殖性能', '具体成分待确认'],
      en: ['For high mold-risk grain', 'Protects growth and reproduction', 'Composition awaiting confirmation']
    },
    howto: {
      zh: ['目录添加量 1000 g/t。', '可与酵母细胞壁多糖配合使用。', '具体使用方法以产品说明书为准。'],
      en: ['Catalog inclusion is 1000 g/t.', 'Can be combined with yeast cell wall polysaccharides.', 'Follow the product sheet for usage.']
    },
    faq: [PENDING_FAQ],
    keywords: ['霉变', '发霉', '霉菌', '毒素', '黄曲霉', '呕吐毒素', '玉米赤霉烯酮', '假发情', '玉米', '脱霉', 'mold', 'mould', 'mycotoxin', 'aflatoxin', 'zearalenone', 'corn']
  }
}

// 规格 SKU：名称、包装、添加量来自产品目录表。fit 说明这个规格适合什么情况。
const G = '/吨饲料'
const GE = ' per tonne of feed'
const dose = (range) => ({ zh: `${range} g${G}`, en: `${range} g${GE}` })

const SKUS = [
  // 丁酸钠
  { id: 'SB98P', series: 'butyrate', zh: '98%丁酸钠粉末', en: '98% Sodium Butyrate Powder', pct: '98%', form: 'powder', pack: 20, price: 40, dose: dose('250–1000'),
    fit: { zh: '含量最高、成本最低，溶解快。适合犊牛代乳粉、液体饲喂和预混料。有明显气味。', en: 'Highest content, lowest cost, dissolves fast. For calf milk replacer, liquid feeding and premixes. Strong odor.' } },
  { id: 'SB98G', series: 'butyrate', zh: '98%丁酸钠颗粒', en: '98% Sodium Butyrate Granule', pct: '98%', form: 'granule', price: 42, dose: dose('250–1000'),
    fit: { zh: '与粉末同含量，颗粒流动性好、粉尘少，便于饲料厂计量和混合。', en: 'Same content as the powder, but free-flowing and low-dust for easier dosing and mixing.' } },
  { id: 'SB90D', series: 'butyrate', zh: '90%糊精包被丁酸钠颗粒', en: '90% Dextrin-Coated Sodium Butyrate', pct: '90%', form: 'dextrin', price: 38, dose: dose('250–1000'),
    fit: { zh: '糊精包被，含量高，减少气味和吸潮。适合希望高含量、又要兼顾适口性的饲料。', en: 'Dextrin coating keeps content high while cutting odor and moisture pickup — high potency with better palatability.' } },
  { id: 'SB70F', series: 'butyrate', zh: '70%脂肪包被丁酸钠颗粒', en: '70% Fat-Coated Sodium Butyrate', pct: '70%', form: 'fat', price: 30, dose: dose('250–1000'),
    fit: { zh: '脂肪包被，让部分丁酸避开胃、在小肠逐步释放。含量与缓释兼顾，适用面广。', en: 'Fat coating lets part of the butyrate bypass the stomach and release gradually in the small intestine — a versatile balance of potency and slow release.' } },
  { id: 'SB50F', series: 'butyrate', zh: '50%脂肪包被丁酸钠颗粒', en: '50% Fat-Coated Sodium Butyrate', pct: '50%', form: 'fat', price: 24, featured: true, dose: dose('250–1000'),
    fit: { zh: '包被比例更高，释放更靠后、气味更小。保育料、肉鸡料常用。', en: 'More coating for later release and less odor. Common in nursery and broiler feeds.' } },
  { id: 'SB40M', series: 'butyrate', zh: '40%脂肪包被丁酸钠微囊', en: '40% Fat-Coated Sodium Butyrate Microcapsule', pct: '40%', form: 'fatmicro', price: 22, dose: dose('250–1000'),
    fit: { zh: '微囊颗粒细小、分布均匀，缓释到小肠后段。适合乳猪料、禽料和水产料。', en: 'Fine, evenly dispersed microcapsules releasing into the lower small intestine. For piglet, poultry and aqua feeds.' } },
  { id: 'SB30M', series: 'butyrate', zh: '30%脂肪包被丁酸钠微囊', en: '30% Fat-Coated Sodium Butyrate Microcapsule', pct: '30%', form: 'fatmicro', price: 18, dose: dose('250–1000'),
    fit: { zh: '包被最厚，缓释最持久，几乎无异味。适合对适口性最敏感的教槽料。', en: 'Thickest coating, longest release, nearly odorless. For the most palatability-sensitive creep feeds.' } },
  // 三丁酸甘油酯
  { id: 'TB65', series: 'tributyrin', zh: '65%三丁酸甘油酯粉', en: '65% Tributyrin Powder', pct: '65%', form: 'powder', price: 48, dose: dose('500–1000'),
    fit: { zh: '有效含量更高，同样用量提供更多丁酸。', en: 'Higher content — more butyrate at the same inclusion.' } },
  { id: 'TB60', series: 'tributyrin', zh: '60%三丁酸甘油酯粉', en: '60% Tributyrin Powder', pct: '60%', form: 'powder', price: 45, dose: dose('500–1000'),
    fit: { zh: '性价比之选，适合常规添加。', en: 'The value option for routine use.' } },
  // 胆汁酸、复合酶
  { id: 'BA10', series: 'bile', zh: '10%胆汁酸', en: '10% Bile Acids', pct: '10%', form: 'powder', price: 100, dose: dose('100–300') },
  { id: 'ENZC', series: 'enzyme', zh: '包被复合酶', en: 'Coated Enzyme Complex', pct: '', form: 'blend', price: 40, dose: dose('500–1000') },
  // 胍基乙酸
  { id: 'GAA98', series: 'gaa', zh: '98%胍基乙酸粉末', en: '98% Guanidinoacetic Acid Powder', pct: '98%', form: 'powder', price: 35, featured: true, dose: dose('300–600'),
    fit: { zh: '用于猪、禽。含量高，直接添加到全价料或预混料中。', en: 'For pigs and poultry. High content, added directly to complete feed or premix.' } },
  { id: 'GAA50M', series: 'gaa', zh: '50%脂肪包被胍基乙酸微囊', en: '50% Fat-Coated Guanidinoacetic Acid Microcapsule', pct: '50%', form: 'fatmicro', price: 26, dose: dose('300–600'),
    fit: { zh: '用于牛、羊。脂肪包被保护胍基乙酸通过瘤胃，在小肠释放。', en: 'For cattle and sheep. The fat coating protects GAA through the rumen for release in the small intestine.' } },
  // 半胱胺
  { id: 'CS30M', series: 'cysteamine', zh: '30%包被半胱胺盐酸盐微囊', en: '30% Coated Cysteamine HCl Microcapsule', pct: '30%', form: 'micro', price: 55, dose: dose('300'),
    fit: { zh: '主力规格，按 300 g/t 添加约提供 90 mg/kg 半胱胺盐酸盐。', en: 'The main grade; 300 g/t supplies about 90 mg/kg cysteamine HCl.' } },
  { id: 'CS27M', series: 'cysteamine', zh: '27%包被半胱胺盐酸盐微囊', en: '27% Coated Cysteamine HCl Microcapsule', pct: '27%', form: 'micro', price: 50, dose: dose('300'),
    fit: { zh: '含量略低，同样 300 g/t 用量下提供约 81 mg/kg 半胱胺盐酸盐。', en: 'Slightly lower content; 300 g/t supplies about 81 mg/kg cysteamine HCl.' } },
  { id: 'CSZN30', series: 'cysteamine', zh: '30%半胱胺螯合锌粉末', en: '30% Cysteamine Zinc Chelate Powder', pct: '30%', form: 'chelate', price: 60, dose: dose('300'),
    fit: { zh: '半胱胺与锌螯合，同时提供锌。目前没有找到该形式的直接公开研究，使用前请咨询技术部。', en: 'Cysteamine chelated with zinc, supplying zinc as well. No published studies on this form were found; consult our technical team before use.' } },
  // 增肌王、GAMT 酶
  { id: 'ZJWS', series: 'musclex', zh: '增肌王（标准版）', en: 'Zengjiwang (Standard)', grade: { zh: '标准版', en: 'Standard' }, pct: '', form: 'blend', price: 28, dose: dose('2000') },
  { id: 'ZJWP', series: 'musclex', zh: '增肌王（加强版）', en: 'Zengjiwang (Enhanced)', grade: { zh: '加强版', en: 'Enhanced' }, pct: '', form: 'blend', price: 34, dose: dose('2500') },
  { id: 'GAMTS', series: 'gamt', zh: 'GAMT酶（标准版）', en: 'GAMT Enzyme (Standard)', grade: { zh: '标准版', en: 'Standard' }, pct: '', form: 'blend', price: 60, dose: dose('200–500') },
  { id: 'GAMTP', series: 'gamt', zh: 'GAMT酶（加强版）', en: 'GAMT Enzyme (Enhanced)', grade: { zh: '加强版', en: 'Enhanced' }, pct: '', form: 'blend', price: 75, dose: dose('200–500') },
  { id: 'GAMTR', series: 'gamt', zh: 'GAMT酶（包被反刍用）', en: 'GAMT Enzyme (Coated, Ruminant)', grade: { zh: '包被反刍用', en: 'Coated, ruminant' }, species: ['ruminant'], pct: '', form: 'coated', price: 80, dose: dose('200–500') },
  // γ-氨基丁酸、甜菜碱
  { id: 'GABA98', series: 'gaba', zh: '98%γ-氨基丁酸粉末', en: '98% GABA Powder', pct: '98%', form: 'powder', price: 120, featured: true, dose: dose('25–50'),
    fit: { zh: '含量最高、用量最小，适合预混料厂逐级预混。', en: 'Highest content and lowest inclusion — for premix plants that blend in stages.' } },
  { id: 'GABA50', series: 'gaba', zh: '50%γ-氨基丁酸粉末', en: '50% GABA Powder', pct: '50%', form: 'powder', price: 62, dose: dose('50–100'),
    fit: { zh: '已稀释，用量放大一倍，在全价料中更容易混匀。', en: 'Pre-diluted at double the inclusion, so it mixes evenly in complete feed.' } },
  { id: 'GABA40M', series: 'gaba', zh: '40%包被γ-氨基丁酸微囊', en: '40% Coated GABA Microcapsule', pct: '40%', form: 'micro', price: 58, dose: dose('50–100'),
    fit: { zh: '包被可通过瘤胃，用于奶牛、肉牛和羊；也更耐储存。', en: 'Coated to pass the rumen — for dairy, beef and sheep — and more storage-stable.' } },
  { id: 'BT70C', series: 'betaine', zh: '70%包被甜菜碱盐酸盐', en: '70% Coated Betaine HCl', pct: '70%', form: 'coated', price: 16, dose: dose('500–1000') },
  // 过瘤胃包被营养
  { id: 'RPM50', series: 'met', zh: '50%包被蛋氨酸', en: '50% Rumen-Protected Methionine', pct: '50%', form: 'coated', price: 60, featured: true, dose: dose('500–1000') },
  { id: 'RPL60', series: 'lys', zh: '60%包被赖氨酸', en: '60% Rumen-Protected Lysine', pct: '60%', form: 'coated', price: 30, dose: dose('500–1000') },
  { id: 'RPC25', series: 'choline', zh: '25%包被氯化胆碱', en: '25% Rumen-Protected Choline Chloride', pct: '25%', form: 'coated', price: 18, dose: dose('500–1000') },
  { id: 'VITC', series: 'vitamin', zh: '包被复合维生素', en: 'Coated Multivitamin', pct: '', form: 'blend', price: 50, dose: dose('500–1000') },
  // 植物源与替抗
  { id: 'ALC25', series: 'allicin', zh: '25%大蒜素粉', en: '25% Allicin Powder', pct: '25%', form: 'powder', price: 45, dose: dose('200–1000') },
  { id: 'TA70P', series: 'tannic', zh: '70%单宁酸原粉', en: '70% Tannic Acid Powder', pct: '70%', form: 'powder', price: 48, dose: dose('300–500'),
    fit: { zh: '含量高、成本低，有涩味。适合短期使用或预混料。', en: 'Concentrated and economical, but astringent. For short-term use or premixes.' } },
  { id: 'TA40C', series: 'tannic', zh: '40%包被单宁酸颗粒', en: '40% Coated Tannic Acid Granule', pct: '40%', form: 'coated', price: 32, featured: true, dose: dose('400–600'),
    fit: { zh: '包被缓释，对适口性和消化影响小。适合乳仔猪料和长期添加。', en: 'Coated slow release with less impact on palatability and digestion. For piglet feeds and long-term use.' } },
  { id: 'HHJ', series: 'heigold', zh: '黑黄金', en: 'Black Gold', pct: '', form: 'blend', price: 22, dose: dose('5000') },
  // 霉菌毒素与免疫
  { id: 'YCW', series: 'ycw', zh: '酵母细胞壁多糖', en: 'Yeast Cell Wall Polysaccharides', pct: '', form: 'powder', price: 28, featured: true, dose: dose('1000–2000') },
  { id: 'MDK100', series: 'moldx', zh: '霉毒克-100', en: 'Meiduke-100', pct: '', form: 'blend', price: 15, dose: dose('1000') }
]

// 包装图上用的短名（英文全称太长，大图上会换行）
const SHORT_EN = {
  tributyrin: 'Tributyrin', gaa: 'GAA', cysteamine: 'Cysteamine', musclex: 'Zengjiwang', gamt: 'GAMT', enzyme: 'Enzymes',
  met: 'RP Methionine', lys: 'RP Lysine', choline: 'RP Choline', vitamin: 'Multivitamin', ycw: 'Yeast Wall',
  tannic: 'Tannic Acid', butyrate: 'Na Butyrate', moldx: 'Meiduke', heigold: 'Black Gold', betaine: 'Betaine'
}

// 产品视觉上的系列代号
const MARKS = {
  butyrate: 'SB', tributyrin: 'TB', bile: 'BA', enzyme: 'ENZ', gaa: 'GAA', cysteamine: 'CS', musclex: '增肌', gamt: 'GAMT',
  gaba: 'GABA', betaine: 'BT', met: 'MET', lys: 'LYS', choline: 'CHO', vitamin: 'VIT', allicin: 'ALC', tannic: 'TA',
  heigold: 'HHJ', ycw: 'YCW', moldx: 'MDK'
}

const PACK_DEFAULT = 25

function pick(obj, lang) {
  return obj ? obj[lang] || obj.zh : ''
}

function packText(kg, lang) {
  return lang === 'en' ? `${kg} kg / bag` : `${kg} kg / 袋`
}

function speciesOf(sku) {
  return sku.species || SERIES[sku.series].species
}

function build(sku, lang) {
  const s = SERIES[sku.series]
  const kg = sku.pack || PACK_DEFAULT
  const speciesIds = speciesOf(sku)
  const grade = sku.grade ? pick(sku.grade, lang) : ''
  return {
    id: sku.id,
    series: sku.series,
    cat: s.cat,
    catName: pick(CATEGORIES.find(c => c.id === s.cat), lang),
    formula: s.formula,
    mark: MARKS[sku.series],
    name: pick(s.name, lang),
    bagName: lang === 'en' && SHORT_EN[sku.series] ? SHORT_EN[sku.series] : pick(s.name, lang),
    title: pick(sku, lang),
    pct: sku.pct,
    grade,
    spec: sku.pct || grade || (lang === 'en' ? 'Standard' : '标准规格'),
    form: pick(FORMS[sku.form], lang),
    chip: grade || `${sku.pct} ${pick(FORMS[sku.form], lang)}`,
    fit: sku.fit ? pick(sku.fit, lang) : '',
    pack: packText(kg, lang),
    packKg: kg,
    price: sku.price,
    bagPrice: sku.price * kg,
    featured: !!sku.featured,
    pending: !!s.pending,
    dose: pick(sku.dose, lang),
    intro: pick(s.intro, lang),
    benefits: s.benefits[lang] || s.benefits.zh,
    species: speciesIds.map(id => ({ id, name: pick(SPECIES.find(x => x.id === id), lang) })),
    speciesIds
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

// 产品详情页的长内容：作用原理、应用场景（按动物分组，文献编号与 refIds 顺序对应）、选规格、使用要点、常见问题
function getDetail(series, refIds, lang) {
  const s = SERIES[series]
  const no = id => refIds.indexOf(id) + 1
  const groups = []
  ;(s.uses || []).forEach(u => {
    let g = groups.find(x => x.id === u.sp)
    if (!g) {
      g = { id: u.sp, name: pick(SPECIES.find(x => x.id === u.sp), lang), items: [] }
      groups.push(g)
    }
    const nums = (u.refs || []).map(no).filter(n => n > 0)
    g.items.push({ scene: pick(u.scene, lang), text: pick(u.text, lang), cite: nums.map(n => `[${n}]`).join('') })
  })
  return {
    mechanism: s.mechanism ? s.mechanism[lang] || s.mechanism.zh : [],
    uses: groups,
    gradeNote: s.gradeNote ? pick(s.gradeNote, lang) : '',
    howto: s.howto ? s.howto[lang] || s.howto.zh : [],
    faq: (s.faq || []).map(f => ({ q: pick(f.q, lang), a: pick(f.a, lang) }))
  }
}

function getCategories(lang) {
  return CATEGORIES.map(c => ({ id: c.id, name: pick(c, lang), desc: pick(c.desc, lang), rep: c.rep }))
}

function getSpecies(lang) {
  return SPECIES.map(c => ({ id: c.id, name: pick(c, lang) }))
}

module.exports = { SERIES, SKUS, CATEGORIES, getProducts, getProduct, getSiblings, getDetail, getCategories, getSpecies }
