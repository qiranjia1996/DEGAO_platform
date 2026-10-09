// AI 选品：有 apiKey 时调用大模型，否则（或调用失败时）使用本地规则匹配。

const catalog = require('../data/catalog')
const config = require('../config')

const SPECIES_KW = {
  pig: ['猪', '仔猪', '母猪', '育肥', '保育', '乳猪', 'pig', 'piglet', 'sow', 'swine', 'hog', 'finisher'],
  poultry: ['鸡', '鸭', '鹅', '禽', '蛋', '肉鸡', '蛋鸡', 'broiler', 'layer', 'poultry', 'chicken', 'duck', 'hen'],
  ruminant: ['牛', '羊', '犊', '奶牛', '奶山羊', '反刍', 'cattle', 'cow', 'dairy', 'calf', 'calves', 'sheep', 'goat', 'ruminant', 'beef'],
  aqua: ['鱼', '虾', '蟹', '水产', '对虾', '鳗', 'fish', 'shrimp', 'prawn', 'aqua', 'crab', 'tilapia']
}

const THEMES = [
  { id: 'gut', zh: '肠道健康 / 腹泻', en: 'gut health / diarrhea', kw: ['腹泻', '拉稀', '稀便', '肠', '断奶', 'scour', 'diarrh', 'gut', 'intestin', 'wean', 'loose'], series: ['butyrate', 'tannic', 'tributyrin', 'kdf'] },
  { id: 'agp', zh: '替抗减抗', en: 'antibiotic reduction', kw: ['替抗', '减抗', '无抗', '禁抗', '抗生素', 'antibiotic', 'agp'], series: ['butyrate', 'oregano', 'gox', 'allicin'] },
  { id: 'stress', zh: '热应激 / 应激', en: 'heat / stress', kw: ['热应激', '应激', '高温', '夏', '天热', '运输', 'heat', 'stress', 'summer', 'hot', 'transport'], series: ['gaba', 'betaine'] },
  { id: 'mold', zh: '霉菌毒素', en: 'mycotoxins', kw: ['霉', '毒素', '黄曲', '呕吐毒素', '赤霉', '假发情', 'mold', 'mould', 'mycotox', 'aflatox', 'zearal', ' don', 'false-estrus'], series: ['moldx', 'ycw'] },
  { id: 'growth', zh: '生长性能', en: 'growth performance', kw: ['增重', '瘦肉', '生长', '育肥', '出栏', '料肉比', '饲料转化', '胸肉', '长得慢', 'growth', 'gain', 'lean', 'finish', 'fcr', 'breast'], series: ['cysteamine', 'gaa', 'kdf', 'betaine'] },
  { id: 'immune', zh: '免疫力', en: 'immunity', kw: ['免疫', '抵抗力', '疫苗', '体弱', '成活', '死淘', 'immun', 'vaccin', 'resist', 'surviv', 'mortal'], series: ['ycw', 'allicin'] },
  { id: 'fat', zh: '脂肪消化 / 肝脏', en: 'fat digestion / liver', kw: ['脂肪', '肝', '油脂', '能量', 'fat', 'liver', 'lipid', 'energy'], series: ['bile', 'betaine'] },
  { id: 'palat', zh: '采食与诱食', en: 'intake & palatability', kw: ['诱食', '适口', '采食', '不爱吃', 'palat', 'appetite', 'intake', 'attract'], series: ['betaine', 'allicin', 'tributyrin'] },
  { id: 'laying', zh: '产蛋性能', en: 'laying performance', kw: ['产蛋', '蛋鸡', '蛋壳', 'laying', 'layer', 'egg'], series: ['gaba', 'butyrate'] }
]

function pickSku(series) {
  const skus = catalog.SKUS.filter(s => s.series === series)
  return (skus.find(s => s.featured) || skus[0]).id
}

function localRecommend(query, lang) {
  // “false heat”（假发情）不是热应激
  const q = (' ' + query.toLowerCase() + ' ').replace(/false heat/g, 'false-estrus')
  const species = Object.keys(SPECIES_KW).filter(k => SPECIES_KW[k].some(w => q.includes(w)))
  const themes = THEMES.filter(t => t.kw.some(w => q.includes(w)))
  const scores = {}
  themes.forEach(t => t.series.forEach((s, i) => { scores[s] = (scores[s] || 0) + (4 - i) }))
  Object.keys(catalog.SERIES).forEach(s => {
    const hits = catalog.SERIES[s].keywords.filter(w => q.includes(w.toLowerCase())).length
    if (hits) scores[s] = (scores[s] || 0) + hits
  })
  let ranked = Object.keys(scores)
    .filter(s => !species.length || species.some(sp => catalog.SERIES[s].species.includes(sp)))
    .sort((a, b) => scores[b] - scores[a])
    .slice(0, 3)

  const spNames = catalog.getSpecies(lang).filter(s => species.includes(s.id)).map(s => s.name)
  const themeNames = themes.map(t => t[lang] || t.zh)

  if (!ranked.length) {
    const featured = catalog.getProducts(lang).filter(p => p.featured)
    return {
      mode: 'offline',
      matched: false,
      summary: '',
      items: featured.map(p => ({ product: p, reason: p.benefits[0], dosage: p.dose }))
    }
  }

  const items = ranked.map(s => {
    const p = catalog.getProduct(pickSku(s), lang)
    return { product: p, reason: p.benefits.slice(0, 2).join(lang === 'en' ? '; ' : '；'), dosage: p.dose }
  })

  let summary
  if (lang === 'en') {
    summary = `Identified needs: ${themeNames.join(', ') || 'general performance'}${spNames.length ? ` · Species: ${spNames.join(', ')}` : ''}. Suggested combination: ${items.map(i => i.product.title).join(' + ')}.`
  } else {
    summary = `识别到的需求：${themeNames.join('、') || '综合性能提升'}${spNames.length ? ` · 适用动物：${spNames.join('、')}` : ''}。建议组合：${items.map(i => i.product.title).join(' + ')}。`
  }
  return { mode: 'offline', matched: true, summary, items }
}

function catalogText(lang) {
  return catalog.getProducts(lang).map(p =>
    `${p.id} | ${p.title} | ${p.catName} | ${p.speciesIds.join('/')} | ${p.benefits.join('; ')} | ${p.dose}`
  ).join('\n')
}

function systemPrompt(lang) {
  const zh = lang !== 'en'
  return [
    zh
      ? '你是济南德高农牧科技有限公司（德高农牧，饲料添加剂生产企业）的选品顾问。根据客户描述的养殖场景和问题，从下面的产品目录中推荐 1–4 个最合适的产品，组成一个方案。'
      : 'You are the product advisor for Jinan Degao Agriculture & Animal Husbandry Technology Co., Ltd., a feed additive manufacturer. Based on the customer’s farm situation, recommend 1–4 of the most suitable products from the catalog below as a program.',
    zh ? '产品目录（编号 | 名称 | 类别 | 适用动物 | 功效 | 参考添加量）：' : 'Catalog (id | name | category | species | benefits | inclusion):',
    catalogText(lang),
    zh
      ? '规则：只能使用目录中的编号；不要编造产品；不要给出疾病诊断或药物治疗建议，涉及疫病时提醒咨询兽医；用中文回答；语言专业、简洁。'
      : 'Rules: only use ids from the catalog; never invent products; no disease diagnosis or drug advice — suggest consulting a vet when disease is involved; answer in English; be professional and concise.',
    zh
      ? '只输出 JSON：{"summary":"一到两句话概括客户需求和方案思路","items":[{"id":"产品编号","reason":"为什么推荐，一句话","dosage":"针对该场景的参考用量"}],"notes":"一句使用建议或注意事项"}'
      : 'Output JSON only: {"summary":"1–2 sentences on the need and approach","items":[{"id":"product id","reason":"one-sentence rationale","dosage":"suggested inclusion for this case"}],"notes":"one practical tip or caution"}'
  ].join('\n\n')
}

function parseJson(text) {
  const m = text.match(/\{[\s\S]*\}/)
  return JSON.parse(m ? m[0] : text)
}

function llmRecommend(query, lang) {
  const { endpoint, model, apiKey } = config.llm
  return new Promise((resolve, reject) => {
    wx.request({
      url: endpoint,
      method: 'POST',
      timeout: 60000,
      header: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      data: {
        model,
        temperature: 0.3,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt(lang) },
          { role: 'user', content: query }
        ]
      },
      success(res) {
        try {
          if (res.statusCode !== 200) throw new Error('HTTP ' + res.statusCode)
          const out = parseJson(res.data.choices[0].message.content)
          const items = (out.items || [])
            .map(i => ({ product: catalog.getProduct(i.id, lang), reason: i.reason, dosage: i.dosage }))
            .filter(i => i.product)
          if (!items.length) throw new Error('no items')
          resolve({ mode: 'online', matched: true, summary: out.summary, notes: out.notes, items })
        } catch (e) {
          reject(e)
        }
      },
      fail: reject
    })
  })
}

function recommend(query, lang) {
  if (!config.llm.apiKey) {
    // 短暂延迟，让界面有“思考”的过程
    return new Promise(r => setTimeout(() => r(localRecommend(query, lang)), 700))
  }
  return llmRecommend(query, lang).catch(() =>
    Object.assign(localRecommend(query, lang), { fallback: true })
  )
}

module.exports = { recommend, localRecommend }
