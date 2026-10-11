// 问答选品：读取决策树、生成推荐结果（含文献编号）
const { NODES, RESULTS } = require('../data/decision-tree')
const catalog = require('../data/catalog')
const references = require('../data/references')

const REF_RE = /\[ref:([\w]+)\]/g

function pick(obj, lang) {
  return obj ? obj[lang] || obj.zh : ''
}

function getNode(id, lang) {
  const n = NODES[id]
  if (!n) return null
  return {
    id,
    q: pick(n.q, lang),
    options: n.options.map((o, i) => ({
      index: i,
      label: pick(o.label, lang),
      sub: pick(o.sub, lang),
      icon: o.icon ? `/images/species/${o.icon}.png` : '',
      next: o.next || '',
      result: o.result || ''
    }))
  }
}

// 把推荐语里的 [ref:id] 换成 [1] [2]，编号按首次出现的顺序；同时返回文献列表
function getResult(id, lang) {
  const r = RESULTS[id]
  if (!r) return null
  const order = []
  const text = pick(r.reason, lang).replace(REF_RE, (_, ref) => {
    if (!order.includes(ref)) order.push(ref)
    return `[${order.indexOf(ref) + 1}]`
  })
  return {
    id,
    title: pick(r.title, lang),
    reason: text,
    items: r.items.map(it => ({ product: catalog.getProduct(it.sku, lang), role: pick(it.role, lang) })),
    refs: order.map((ref, i) => Object.assign({ no: i + 1 }, references.getRef(ref, lang)))
  }
}

// 根据已选的选项序号，走出当前节点、面包屑和结果
function walk(path, lang) {
  let nodeId = 'root'
  const crumbs = []
  for (const idx of path) {
    const opt = NODES[nodeId] && NODES[nodeId].options[idx]
    if (!opt) break
    crumbs.push(pick(opt.label, lang))
    if (opt.result) return { crumbs, result: getResult(opt.result, lang) }
    nodeId = opt.next
  }
  return { crumbs, node: getNode(nodeId, lang) }
}

// 从首页按动物进入时，算出对应的路径
function pathForSpecies(species) {
  const idx = NODES.root.options.findIndex(o => o.icon === species)
  return idx >= 0 ? [idx] : []
}

// 一共有几步（用于显示 01 / 03）：当前深度 + 剩余最长深度
function depthFrom(nodeId) {
  const n = NODES[nodeId]
  if (!n) return 0
  return 1 + Math.max(...n.options.map(o => (o.result ? 0 : depthFrom(o.next))))
}

// 数据自检：测试脚本调用，返回问题列表（空数组表示通过）
function validate() {
  const errors = []
  const refIds = new Set(references.REFS.map(r => r.id))
  const reached = new Set()
  const seenNodes = new Set()
  const visit = (id, trail) => {
    if (trail.includes(id)) return errors.push(`循环：${trail.concat(id).join(' → ')}`)
    const n = NODES[id]
    if (!n) return errors.push(`找不到节点 ${id}（来自 ${trail.join(' → ')}）`)
    seenNodes.add(id)
    if (!n.q.zh || !n.q.en) errors.push(`${id} 问题缺少中文或英文`)
    n.options.forEach((o, i) => {
      if (!o.label.zh || !o.label.en || !o.sub.zh || !o.sub.en) errors.push(`${id} 第 ${i + 1} 个选项缺少中英文`)
      if (!!o.next === !!o.result) errors.push(`${id} 第 ${i + 1} 个选项必须且只能有 next 或 result`)
      if (o.result) {
        if (!RESULTS[o.result]) errors.push(`${id} 指向不存在的结果 ${o.result}`)
        reached.add(o.result)
      } else visit(o.next, trail.concat(id))
    })
  }
  visit('root', [])
  Object.keys(NODES).forEach(id => seenNodes.has(id) || errors.push(`节点 ${id} 走不到`))

  Object.keys(RESULTS).forEach(id => {
    const r = RESULTS[id]
    if (!reached.has(id)) errors.push(`结果 ${id} 走不到`)
    if (!r.title.zh || !r.title.en || !r.reason.zh || !r.reason.en) errors.push(`${id} 标题或推荐语缺少中英文`)
    const cited = {}
    ;['zh', 'en'].forEach(lang => {
      cited[lang] = new Set([...r.reason[lang].matchAll(REF_RE)].map(m => m[1]))
      cited[lang].forEach(ref => refIds.has(ref) || errors.push(`${id} 引用了不存在的文献 ${ref}`))
    })
    if ([...cited.zh].sort().join() !== [...cited.en].sort().join()) errors.push(`${id} 中英文引用的文献不一致`)
    const zhLen = r.reason.zh.replace(REF_RE, '').length
    if (zhLen < 60 || zhLen > 200) errors.push(`${id} 中文推荐语 ${zhLen} 字，应在 60–200 字之间`)
    r.items.forEach(it => {
      const sku = catalog.SKUS.find(s => s.id === it.sku)
      if (!sku) return errors.push(`${id} 引用了不存在的产品 ${it.sku}`)
      if (catalog.SERIES[sku.series].pending) errors.push(`${id}：${it.sku} 成分待确认，不能进入推荐`)
      if (!(sku.species || catalog.SERIES[sku.series].species).includes(r.species)) errors.push(`${id}：${it.sku} 不适用于 ${r.species}`)
      if (!it.role.zh || !it.role.en) errors.push(`${id}：${it.sku} 缺少作用说明`)
      const seriesRefs = references.REFS.filter(x => references.covers(x, sku.series)).map(x => x.id)
      if (!seriesRefs.some(ref => cited.zh.has(ref))) errors.push(`${id}：${it.sku} 没有引用任何文献`)
    })
  })
  return errors
}

module.exports = { getNode, getResult, walk, pathForSpecies, depthFrom, validate, RESULT_COUNT: Object.keys(RESULTS).length }
