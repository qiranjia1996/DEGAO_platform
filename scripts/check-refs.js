// 在线核对文献：node scripts/check-refs.js
// 逐条请求 Crossref，确认 DOI 存在、年份一致、标题一致（忽略大小写和标点）
const { REFS } = require('../miniprogram/data/references')

const norm = s =>
  s.toLowerCase().replace(/<[^>]+>/g, '').replace(/β/g, 'beta').replace(/γ/g, 'gamma').replace(/[^a-z0-9]+/g, '')
// Crossref 的标题末尾有时带脚注编号（如 "…Piglets1–3"），只要以我们记录的标题开头、多出来的只是数字就算一致
const sameTitle = (a, b) => {
  const x = norm(a)
  const y = norm(b)
  return x === y || (x.startsWith(y) && /^[0-9]*$/.test(x.slice(y.length)))
}
const sleep = ms => new Promise(r => setTimeout(r, ms))

async function get(doi) {
  for (let i = 0; i < 4; i++) {
    const res = await fetch('https://api.crossref.org/works/' + encodeURIComponent(doi), {
      headers: { 'User-Agent': 'degao-refcheck/1.0' }
    })
    if (res.status !== 429) return res
    await sleep(3000 * (i + 1))
  }
  return { ok: false, status: 429 }
}

async function main() {
  let bad = 0
  for (const r of REFS) {
    await sleep(500)
    const res = await get(r.doi)
    if (!res.ok) {
      bad++
      console.log(`✗ ${r.id} ${r.doi} → HTTP ${res.status}`)
      continue
    }
    const m = (await res.json()).message
    const year = ((m.issued || {})['date-parts'] || [[]])[0][0]
    const title = (m.title || [''])[0]
    const problems = []
    if (year !== r.year) problems.push(`年份 ${year} ≠ ${r.year}`)
    if (!sameTitle(title, r.title)) problems.push(`标题不一致：${title}`)
    if (problems.length) bad++
    console.log(`${problems.length ? '✗' : '✓'} ${r.id} ${r.doi}${problems.length ? ' → ' + problems.join('；') : ''}`)
  }
  console.log(bad ? `${bad} 条有问题` : `全部 ${REFS.length} 条通过`)
  process.exit(bad ? 1 : 0)
}

main()
