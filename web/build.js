// 把 miniprogram/ 打包成一个可直接部署的网页：web/dist/index.html
// 用法：node web/build.js
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..', 'miniprogram')
const OUT = path.join(__dirname, 'dist')

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]
  )
}
const rel = f => path.relative(ROOT, f).split(path.sep).join('/')
const read = f => fs.readFileSync(f, 'utf8')
// 内联到 <script> 时防止提前闭合
const safe = s => s.replace(/<\/(script)/gi, '<\\/$1').replace(/<!--/g, '<\\!--')

const files = walk(ROOT)
const app = JSON.parse(read(path.join(ROOT, 'app.json')))

// ---------- JS 模块 ----------
const modules = files
  .filter(f => f.endsWith('.js'))
  .map(f => `${JSON.stringify(rel(f))}: function (require, module, exports) {\n${read(f)}\n}`)
  .join(',\n')

// ---------- 模板与页面配置 ----------
const templates = {}
const configs = {}
files.forEach(f => {
  const r = rel(f)
  if (r.endsWith('.wxml')) templates[r.slice(0, -5)] = read(f)
  if (r.endsWith('.json') && r !== 'app.json' && r !== 'sitemap.json') configs[r.slice(0, -5)] = JSON.parse(read(f))
})

// ---------- 样式 ----------
function rpx(css) {
  return css.replace(/(-?\d*\.?\d+)rpx/g, (_, n) => `calc(var(--rpx) * ${n})`)
}
const TAG = { view: 'wx-view', text: 'wx-text', 'scroll-view': 'wx-scroll-view', button: 'wx-button', image: 'img', page: '.wx-page' }
function mapSelector(sel, scope) {
  sel = sel.trim().replace(/(^|[\s,>+~(])(scroll-view|view|text|button|image|page)(?=$|[\s,.:#\[>+~)])/g, (_, a, t) => a + TAG[t])
  if (!scope || sel.startsWith('.wx-page')) return sel
  return `${scope} ${sel}`
}
// 简单的 CSS 解析：给每条规则的选择器加作用域前缀，@media 递归处理，@keyframes 原样保留
function scopeCss(css, scope) {
  css = css.replace(/\/\*[\s\S]*?\*\//g, '')
  let out = ''
  let i = 0
  while (i < css.length) {
    const open = css.indexOf('{', i)
    if (open < 0) break
    const head = css.slice(i, open).trim()
    let depth = 1
    let j = open + 1
    while (j < css.length && depth) {
      if (css[j] === '{') depth++
      else if (css[j] === '}') depth--
      j++
    }
    const body = css.slice(open + 1, j - 1)
    if (/^@(-webkit-)?keyframes|^@font-face/.test(head)) out += `${head}{${body}}\n`
    else if (head.startsWith('@')) out += `${head}{${scopeCss(body, scope)}}\n`
    else out += head.split(',').map(s => mapSelector(s, scope)).join(', ') + `{${body}}\n`
    i = j
  }
  return out
}

let css = scopeCss(read(path.join(ROOT, 'app.wxss')), '')
const wxss = files.filter(f => f.endsWith('.wxss') && rel(f) !== 'app.wxss')
// 页面样式在前、组件样式在后，组件内部同名类名以组件为准
wxss
  .filter(f => rel(f).startsWith('pages/'))
  .forEach(f => (css += scopeCss(read(f), '.P-' + rel(f).slice(0, -5).replace(/\//g, '-'))))
const compTags = {}
Object.entries(app.usingComponents || {}).forEach(([tag, p]) => (compTags[p.replace(/^\//, '')] = tag))
Object.values(configs).forEach(c =>
  Object.entries(c.usingComponents || {}).forEach(([tag, p]) => (compTags[p.replace(/^\//, '')] = tag))
)
wxss
  .filter(f => !rel(f).startsWith('pages/'))
  .forEach(f => {
    const tag = compTags[rel(f).slice(0, -5)]
    if (tag) css += scopeCss(read(f), tag)
  })
css = rpx(css)

// ---------- 图标 ----------
const icons = {}
;(app.tabBar ? app.tabBar.list : []).forEach(t =>
  [t.iconPath, t.selectedIconPath].forEach(p => {
    icons[p] = 'data:image/png;base64,' + fs.readFileSync(path.join(ROOT, p)).toString('base64')
  })
)

// ---------- 输出 ----------
const shell = read(path.join(__dirname, 'shell.html'))
const bundle = `window.__BUNDLE__ = {
app: ${JSON.stringify(app)},
templates: ${JSON.stringify(templates)},
configs: ${JSON.stringify(configs)},
icons: ${JSON.stringify(icons)},
modules: {
${modules}
}
}`
const html = shell
  .replace('/*__APP_CSS__*/', () => css)
  .replace('/*__BUNDLE__*/', () => safe(bundle))
  .replace('/*__RUNTIME__*/', () => safe(read(path.join(__dirname, 'runtime.js'))))
  .replace('__TITLE__', app.window.navigationBarTitleText || '')

fs.mkdirSync(OUT, { recursive: true })
fs.writeFileSync(path.join(OUT, 'index.html'), html)
console.log(`web/dist/index.html  ${(html.length / 1024).toFixed(0)} KB`)
