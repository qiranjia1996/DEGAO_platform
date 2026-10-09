// 把 design/ 下的 SVG 渲染成小程序用的 PNG（需要本机安装 Chrome）
// 用法：node design/render.js
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')
const os = require('os')

const ROOT = path.join(__dirname, '..')
const CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Google Chrome 2.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome'
].find(p => fs.existsSync(p))

// [源 SVG, 输出 PNG, 宽, 高, 颜色替换]
const OFF = '#8C918E'
const ON = '#0A5A3A'
const JOBS = [
  ['brand/logo-mark.svg', 'miniprogram/images/brand/logo-mark.png', 144, 144],
  ['brand/logo-full.svg', 'miniprogram/images/brand/logo-full.png', 396, 120],
  ...['pig', 'poultry', 'ruminant', 'aqua'].map(n => [`icons/animal-${n}.svg`, `miniprogram/images/species/${n}.png`, 120, 120, ON]),
  ...['home', 'grid', 'spark', 'cart', 'user'].flatMap(n => [
    [`icons/${n}.svg`, `miniprogram/images/tab/${n}.png`, 81, 81, OFF],
    [`icons/${n}.svg`, `miniprogram/images/tab/${n}-on.png`, 81, 81, ON]
  ])
]

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function main() {
  if (!CHROME) throw new Error('找不到 Chrome')
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'render-'))
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=9334', '--no-first-run', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' })
  try {
    let targets = []
    for (let i = 0; i < 50 && !targets.length; i++) {
      try { targets = (await (await fetch('http://127.0.0.1:9334/json')).json()).filter(t => t.type === 'page') } catch (e) {}
      await sleep(200)
    }
    const ws = new WebSocket(targets[0].webSocketDebuggerUrl)
    await new Promise(r => (ws.onopen = r))
    let id = 0
    const pending = {}
    ws.onmessage = m => {
      const d = JSON.parse(m.data)
      if (d.id && pending[d.id]) pending[d.id](d.result)
    }
    const send = (method, params = {}) => new Promise(r => { const i = ++id; pending[i] = r; ws.send(JSON.stringify({ id: i, method, params })) })
    await send('Emulation.setDefaultBackgroundColorOverride', { color: { r: 0, g: 0, b: 0, a: 0 } })

    for (const [src, out, w, h, color] of JOBS) {
      let svg = fs.readFileSync(path.join(__dirname, src), 'utf8')
      if (color) svg = svg.replace(/currentColor/g, color)
      const html = `<html><body style="margin:0;background:transparent"><div style="width:${w}px;height:${h}px">${svg.replace('<svg ', `<svg width="${w}" height="${h}" `)}</div></body></html>`
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false })
      await send('Page.navigate', { url: 'data:text/html;base64,' + Buffer.from(html).toString('base64') })
      await sleep(250)
      const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: w, height: h, scale: 1 } })
      fs.mkdirSync(path.dirname(path.join(ROOT, out)), { recursive: true })
      fs.writeFileSync(path.join(ROOT, out), Buffer.from(shot.data, 'base64'))
      console.log(out)
    }
    ws.close()
  } finally {
    chrome.kill()
  }
}

main().catch(e => { console.error(e); process.exit(1) })
