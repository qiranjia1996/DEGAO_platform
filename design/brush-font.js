// 生成书法标题字体：把马善政毛笔楷书（Ma Shan Zheng，SIL OFL 开源字体）裁剪成只含标题用到的字，
// 输出 miniprogram/styles/brush-font.wxss（base64 内嵌的 @font-face）。
// 改了标题文案后重新运行：node design/brush-font.js（需要 python3 + fonttools）
const fs = require('fs')
const path = require('path')
const { execFileSync } = require('child_process')

const ROOT = path.join(__dirname, '..')
const MP = path.join(ROOT, 'miniprogram')
const FONT_URL = 'https://github.com/google/fonts/raw/main/ofl/mashanzheng/MaShanZheng-Regular.ttf'
const FONT = path.join(__dirname, 'fonts', 'MaShanZheng-Regular.ttf')
const OUT = path.join(MP, 'styles', 'brush-font.wxss')

global.wx = { getStorageSync: () => 'zh' }
const d = require(path.join(MP, 'utils/i18n.js')).t('zh')
const company = require(path.join(MP, 'data/company.js'))
const catalog = require(path.join(MP, 'data/catalog.js'))

// 用书法字体显示的文字（和 WXML 里用 var(--brush) 的位置对应）
const texts = [
  d.home.heroTitle, d.home.solutions, d.home.featured, d.home.categories, d.home.trust, d.home.contactTitle,
  d.product.intro, d.product.benefits, d.product.specs, d.product.grades,
  d.advisor.title, d.advisor.recommended, d.advisor.resultTitle, d.advisor.refsTitle, d.product.refs,
  d.cart.empty, d.checkout.items, d.checkout.success, d.mine.hello, d.contact.form,
  d.about.story, d.about.milestones, d.about.certs, d.about.portfolio,
  company.slogan.zh, company.name.zh,
  ...catalog.getSpecies('zh').map(s => s.name),
  ...Object.values(catalog.SERIES).map(s => s.name.zh)
]
const chars = [...new Set(texts.join('').replace(/[\s\x00-\x7f]/g, ''))].join('')

if (!fs.existsSync(FONT)) {
  fs.mkdirSync(path.dirname(FONT), { recursive: true })
  execFileSync('curl', ['-sL', '-o', FONT, FONT_URL])
}
const tmp = path.join(__dirname, 'fonts', 'subset.woff')
execFileSync('python3', ['-m', 'fontTools.subset', FONT, `--text=${chars}`, '--flavor=woff', `--output-file=${tmp}`, '--layout-features=*', '--no-hinting'])
const b64 = fs.readFileSync(tmp).toString('base64')
fs.mkdirSync(path.dirname(OUT), { recursive: true })
fs.writeFileSync(OUT, `/* 自动生成：node design/brush-font.js
   字体：Ma Shan Zheng（马善政毛笔楷书），SIL Open Font License 1.1
   只包含这些字：${chars} */
@font-face {
  font-family: "DG Brush";
  src: url("data:font/woff;base64,${b64}") format("woff");
  font-weight: normal;
  font-style: normal;
}
`)
console.log(`${chars.length} 个字，${(b64.length / 1024).toFixed(0)} KB → ${path.relative(ROOT, OUT)}`)
