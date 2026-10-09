// 问答选品数据自检：node scripts/test-tree.js [--print]
// 检查每条路径都能走到结果、产品适用动物、中英文齐全、文献引用完整；--print 列出全部路径
global.wx = { getStorageSync: () => 'zh' }
const tree = require('../miniprogram/utils/tree')
const { NODES } = require('../miniprogram/data/decision-tree')

const errors = tree.validate()
if (process.argv.includes('--print')) {
  const walk = (id, trail) =>
    NODES[id].options.forEach(o => {
      const t = trail.concat(o.label.zh)
      if (o.next) return walk(o.next, t)
      const r = tree.getResult(o.result, 'zh')
      console.log(`${t.join(' › ')}  →  ${r.items.map(i => i.product.id).join(' + ')}  [${r.refs.length} 篇文献]`)
    })
  walk('root', [])
}
if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
console.log(`通过：${tree.RESULT_COUNT} 个推荐结果`)
