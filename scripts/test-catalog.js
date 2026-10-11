// 产品目录自检：node scripts/test-catalog.js
// 检查规格与德高产品目录表（2026 年 10 月版）一一对应，各系列的介绍、应用场景、使用要点中英文齐全，引用的文献存在且属于该系列
global.wx = { getStorageSync: () => 'zh' }
const catalog = require('../miniprogram/data/catalog')
const references = require('../miniprogram/data/references')

// 产品目录表：名称、包装（kg/袋）、添加量（g/吨饲料）
const SHEET = [
  ['98%丁酸钠粉末', 20, '250–1000'], ['98%丁酸钠颗粒', 25, '250–1000'], ['90%糊精包被丁酸钠颗粒', 25, '250–1000'],
  ['70%脂肪包被丁酸钠颗粒', 25, '250–1000'], ['50%脂肪包被丁酸钠颗粒', 25, '250–1000'], ['40%脂肪包被丁酸钠微囊', 25, '250–1000'],
  ['30%脂肪包被丁酸钠微囊', 25, '250–1000'], ['65%三丁酸甘油酯粉', 25, '500–1000'], ['60%三丁酸甘油酯粉', 25, '500–1000'],
  ['98%胍基乙酸粉末', 25, '300–600'], ['50%脂肪包被胍基乙酸微囊', 25, '300–600'], ['98%γ-氨基丁酸粉末', 25, '25–50'],
  ['50%γ-氨基丁酸粉末', 25, '50–100'], ['40%包被γ-氨基丁酸微囊', 25, '50–100'], ['30%包被半胱胺盐酸盐微囊', 25, '300'],
  ['27%包被半胱胺盐酸盐微囊', 25, '300'], ['30%半胱胺螯合锌粉末', 25, '300'], ['增肌王（标准版）', 25, '2000'],
  ['增肌王（加强版）', 25, '2500'], ['GAMT酶（标准版）', 25, '200–500'], ['GAMT酶（加强版）', 25, '200–500'],
  ['GAMT酶（包被反刍用）', 25, '200–500'], ['25%大蒜素粉', 25, '200–1000'], ['酵母细胞壁多糖', 25, '1000–2000'],
  ['霉毒克-100', 25, '1000'], ['10%胆汁酸', 25, '100–300'], ['70%单宁酸原粉', 25, '300–500'], ['40%包被单宁酸颗粒', 25, '400–600'],
  ['50%包被蛋氨酸', 25, '500–1000'], ['60%包被赖氨酸', 25, '500–1000'], ['25%包被氯化胆碱', 25, '500–1000'],
  ['70%包被甜菜碱盐酸盐', 25, '500–1000'], ['包被复合酶', 25, '500–1000'], ['包被复合维生素', 25, '500–1000'], ['黑黄金', 25, '5000']
]

const errors = []
const err = m => errors.push(m)
const products = catalog.getProducts('zh')

if (products.length !== SHEET.length) err(`规格数 ${products.length}，目录表是 ${SHEET.length}`)
SHEET.forEach(([name, kg, dose]) => {
  const p = products.find(x => x.title === name)
  if (!p) return err(`目录表里的「${name}」没有上架`)
  if (p.packKg !== kg) err(`${name} 包装 ${p.packKg} kg，目录表是 ${kg} kg`)
  if (!p.dose.startsWith(dose + ' g')) err(`${name} 添加量「${p.dose}」，目录表是 ${dose} g/t`)
})
products.forEach(p => SHEET.some(([name]) => name === p.title) || err(`「${p.title}」不在目录表里`))

const both = (o, label) => (o && o.zh && o.en ? null : err(`${label} 缺少中文或英文`))
const sameLen = (o, label) => o && o.zh.length !== o.en.length && err(`${label} 中英文条数不一致`)
Object.keys(catalog.SERIES).forEach(id => {
  const s = catalog.SERIES[id]
  ;['name', 'intro', 'benefits', 'howto'].forEach(f => both(s[f], `${id}.${f}`))
  ;['benefits', 'howto', 'mechanism'].forEach(f => sameLen(s[f], `${id}.${f}`))
  ;(s.faq || []).forEach((f, i) => { both(f.q, `${id}.faq[${i}].q`); both(f.a, `${id}.faq[${i}].a`) })
  if (s.gradeNote) both(s.gradeNote, `${id}.gradeNote`)
  const refs = references.REFS.filter(r => references.covers(r, id))
  if (s.pending) {
    if (refs.length) err(`${id} 成分待确认，不应引用文献`)
    return
  }
  if (!s.mechanism) err(`${id} 缺少作用原理`)
  if (!refs.length) err(`${id} 没有文献`)
  if (!(s.uses || []).length) err(`${id} 缺少应用场景`)
  ;(s.uses || []).forEach((u, i) => {
    both(u.scene, `${id}.uses[${i}].scene`)
    both(u.text, `${id}.uses[${i}].text`)
    if (!s.species.includes(u.sp)) err(`${id}.uses[${i}] 的动物 ${u.sp} 不在适用动物里`)
    u.refs.forEach(r => refs.some(x => x.id === r) || err(`${id}.uses[${i}] 引用了不属于该系列的文献 ${r}`))
  })
  const skus = catalog.SKUS.filter(x => x.series === id)
  if (skus.length > 1) skus.forEach(x => x.fit || err(`${x.id} 缺少「适合什么情况」说明`))
})

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(`通过：${products.length} 个规格，${Object.keys(catalog.SERIES).length} 个系列`)
