// 小程序网页运行时：在浏览器里模拟 App / Page / Component / wx API，
// 直接运行 miniprogram/ 下的原始页面代码和 WXML 模板。
// __BUNDLE__ 由 build.js 注入：{ app, modules, templates, configs, icons }
;(function () {
  const B = window.__BUNDLE__
  const app = B.app

  // ---------- CommonJS ----------
  const cache = {}
  function norm(p) {
    const out = []
    p.split('/').forEach(s => {
      if (s === '..') out.pop()
      else if (s && s !== '.') out.push(s)
    })
    return out.join('/')
  }
  function resolve(from, req) {
    const base = req.startsWith('/') ? req : from.split('/').slice(0, -1).join('/') + '/' + req
    let p = norm(base)
    if (!B.modules[p] && B.modules[p + '.js']) p += '.js'
    return p
  }
  function load(path) {
    if (cache[path]) return cache[path].exports
    const fn = B.modules[path]
    if (!fn) throw new Error('module not found: ' + path)
    const module = { exports: {} }
    cache[path] = module
    fn(req => load(resolve(path, req)), module, module.exports)
    return module.exports
  }

  // ---------- 存储 ----------
  const mem = {}
  const PREFIX = 'dgweb:'
  const storage = {
    get(k) {
      try {
        const v = localStorage.getItem(PREFIX + k)
        return v == null ? '' : JSON.parse(v)
      } catch (e) {
        return k in mem ? mem[k] : ''
      }
    },
    set(k, v) {
      mem[k] = v
      try { localStorage.setItem(PREFIX + k, JSON.stringify(v)) } catch (e) {}
    }
  }

  // ---------- WXML 解析 ----------
  function parseWxml(src) {
    src = src.replace(/<!--[\s\S]*?-->/g, '')
    const root = { tag: '#root', attrs: {}, kids: [] }
    const stack = [root]
    const re = /<\/([\w-]+)\s*>|<([\w-]+)((?:\s+[^\s=>\/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'))?)*)\s*(\/?)>|([^<]+)/g
    let m
    while ((m = re.exec(src))) {
      const top = stack[stack.length - 1]
      if (m[1]) stack.pop()
      else if (m[2]) {
        const attrs = {}
        const ar = /([^\s=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'))?/g
        let a
        while ((a = ar.exec(m[3]))) attrs[a[1]] = a[2] != null ? a[2] : a[3] != null ? a[3] : true
        const node = { tag: m[2], attrs, kids: [] }
        top.kids.push(node)
        if (!m[4] && !['input', 'image', 'icon'].includes(m[2])) stack.push(node)
      } else if (m[5]) {
        if (/^\s*$/.test(m[5]) && m[5].includes('\n')) continue
        top.kids.push({ text: m[5] })
      }
    }
    return root
  }

  const exprCache = {}
  function evalExpr(code, scope) {
    let fn = exprCache[code]
    try {
      if (!fn) fn = exprCache[code] = new Function('__s', 'with(__s){return (' + code + ')}')
    } catch (e) {
      console.error('WXML 表达式错误：{{' + code + '}}', e.message)
      fn = exprCache[code] = () => undefined
    }
    try {
      return fn(scope)
    } catch (e) {
      return undefined
    }
  }
  // "a {{b}} c" → 字符串；"{{b}}" → 原始值
  function interp(str, scope) {
    if (typeof str !== 'string') return str
    const single = str.match(/^\s*\{\{([\s\S]*?)\}\}\s*$/)
    if (single && !single[1].includes('}}')) return evalExpr(single[1], scope)
    if (!str.includes('{{')) return str
    return str.replace(/\{\{([\s\S]*?)\}\}/g, (_, c) => {
      const v = evalExpr(c, scope)
      return v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v)
    })
  }

  const tplCache = {}
  function tpl(path) {
    return tplCache[path] || (tplCache[path] = parseWxml(B.templates[path] || ''))
  }

  // ---------- 渲染为虚拟节点 ----------
  function child(scope, vars) {
    const s = Object.create(scope)
    Object.assign(s, vars)
    return s
  }

  function renderKids(kids, scope, ctx, path) {
    const out = []
    let prevCond = null // null：前面不是条件链；true：已有分支命中；false：尚未命中
    kids.forEach((n, i) => {
      if (n.text != null) {
        prevCond = null
        const v = interp(n.text, scope)
        out.push({ text: v == null ? '' : String(v) })
        return
      }
      const a = n.attrs
      let show = true
      if ('wx:if' in a) {
        show = !!interp(a['wx:if'], scope)
        prevCond = show
      } else if ('wx:elif' in a) {
        if (prevCond === null || prevCond) show = false
        else show = prevCond = !!interp(a['wx:elif'], scope)
      } else if ('wx:else' in a) {
        show = prevCond === false
        prevCond = null
      } else prevCond = null
      if (!show) return

      const p = path + '.' + i
      if ('wx:for' in a) {
        let list = interp(a['wx:for'], scope)
        if (typeof list === 'number') list = Array.from({ length: list }, (_, k) => k)
        if (!list) list = []
        const itemName = a['wx:for-item'] || 'item'
        const indexName = a['wx:for-index'] || 'index'
        const iter = Array.isArray(list) ? list.map((v, k) => [k, v]) : Object.keys(list).map(k => [k, list[k]])
        iter.forEach(([k, v]) => {
          renderNode(n, child(scope, { [itemName]: v, [indexName]: k }), ctx, p + '[' + k + ']', out)
        })
      } else renderNode(n, scope, ctx, p, out)
    })
    return out
  }

  function camel(s) {
    return s.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
  }

  function renderNode(n, scope, ctx, path, out) {
    if (n.tag === 'block') {
      out.push(...renderKids(n.kids, scope, ctx, path))
      return
    }
    const v = { tag: n.tag, cls: '', style: '', id: '', ev: {}, ds: {}, props: {}, owner: ctx.owner, kids: [] }
    Object.keys(n.attrs).forEach(k => {
      if (k.startsWith('wx:')) return
      const raw = n.attrs[k]
      const val = interp(raw, scope)
      const ev = k.match(/^(bind|catch):?(\w+)$/)
      if (ev) v.ev[ev[2]] = { h: val, c: ev[1] === 'catch' }
      else if (k.startsWith('data-')) v.ds[camel(k.slice(5))] = val
      else if (k === 'class') v.cls = val == null ? '' : String(val)
      else if (k === 'style') v.style = val == null ? '' : String(val)
      else if (k === 'id') v.id = val
      else if (k === 'hover-class') v.hover = val === 'none' ? '' : val
      else v.props[k] = val
    })
    const comp = ctx.comps[n.tag]
    if (comp) {
      const inst = ctx.instance(path, comp, v.props)
      v.comp = comp
      v.kids = renderKids(tpl(comp).kids, inst.data, { owner: inst, comps: compMap(comp), instance: ctx.instance }, path + '>')
    } else v.kids = renderKids(n.kids, scope, ctx, path)
    out.push(v)
  }

  // ---------- 组件 ----------
  const compDefs = {}
  function compMap(owner) {
    const cfg = (B.configs[owner] || {}).usingComponents || {}
    const map = {}
    const all = Object.assign({}, app.usingComponents || {}, cfg)
    Object.keys(all).forEach(k => (map[k] = norm(all[k])))
    return map
  }
  function coerce(type, v) {
    if (type === Number) return Number(v)
    if (type === Boolean) return v === true || v === 'true' || (v !== false && v !== 'false' && !!v)
    if (type === String) return v == null ? '' : String(v)
    return v
  }
  function makeComponent(path, page) {
    const def = compDefs[path]
    const props = def.properties || {}
    const data = {}
    Object.keys(props).forEach(k => {
      const p = props[k]
      data[k] = p && typeof p === 'object' && 'value' in p ? p.value : undefined
    })
    Object.assign(data, JSON.parse(JSON.stringify(def.data || {})))
    const inst = { data, is: path }
    Object.keys(def.methods || {}).forEach(m => (inst[m] = def.methods[m].bind(inst)))
    inst.setData = (obj, cb) => {
      applyData(inst.data, obj)
      page.__render()
      cb && cb()
    }
    inst.__setProps = vals => {
      Object.keys(vals).forEach(k => {
        const key = camel(k)
        if (!(key in props)) return
        const t = props[key] && props[key].type !== undefined ? props[key].type : props[key]
        inst.data[key] = coerce(t, vals[k])
      })
    }
    const attached = (def.lifetimes && def.lifetimes.attached) || def.attached
    inst.__attach = () => attached && attached.call(inst)
    return inst
  }

  function applyData(target, obj) {
    Object.keys(obj).forEach(key => {
      const parts = key.replace(/\[(\d+)\]/g, '.$1').split('.')
      let o = target
      for (let i = 0; i < parts.length - 1; i++) {
        if (o[parts[i]] == null || typeof o[parts[i]] !== 'object') o[parts[i]] = /^\d+$/.test(parts[i + 1]) ? [] : {}
        o = o[parts[i]]
      }
      o[parts[parts.length - 1]] = obj[key]
    })
  }

  // ---------- DOM 更新 ----------
  const TAGS = { view: 'wx-view', text: 'wx-text', 'scroll-view': 'wx-scroll-view', button: 'wx-button', image: 'img' }
  function domTag(v) {
    return v.text != null ? '#text' : TAGS[v.tag] || v.tag
  }
  function create(v) {
    if (v.text != null) return document.createTextNode(v.text)
    const el = document.createElement(domTag(v))
    update(el, v)
    return el
  }
  function update(el, v) {
    if (v.text != null) {
      if (el.data !== v.text) el.data = v.text
      return
    }
    el.__v = v
    let cls = v.cls
    if (v.tag === 'scroll-view') {
      cls += (v.props['scroll-x'] ? ' wx-sx' : '') + (v.props['scroll-y'] ? ' wx-sy' : '')
      if (v.props['show-scrollbar'] === false) cls += ' wx-nobar'
    }
    if (el.getAttribute('class') !== cls) el.setAttribute('class', cls)
    if ((el.getAttribute('style') || '') !== v.style) el.setAttribute('style', v.style)
    if (v.id) el.id = v.id
    else if (el.id) el.removeAttribute('id')
    if (v.tag === 'image') {
      // 小程序里的绝对路径 /images/x.png 在网页里改成相对路径，适配 GitHub Pages 子目录
      const src = String(v.props.src || '').replace(/^\//, '')
      if (el.getAttribute('src') !== src) el.setAttribute('src', src)
      const fit = { aspectFit: 'contain', aspectFill: 'cover', scaleToFill: 'fill' }[v.props.mode || 'scaleToFill']
      if (fit) el.style.objectFit = fit
      if (v.props.mode === 'widthFix') el.style.height = 'auto'
      el.alt = ''
      return
    }
    if (v.tag === 'input' || v.tag === 'textarea') {
      const val = v.props.value == null ? '' : String(v.props.value)
      if (el.value !== val) el.value = val
      const ph = v.props.placeholder || ''
      if (el.placeholder !== ph) el.placeholder = ph
      if (v.tag === 'input') {
        const t = v.props.type
        el.type = v.props.password ? 'password' : 'text'
        if (t === 'number' || t === 'digit') el.inputMode = t === 'number' ? 'numeric' : 'decimal'
        if (v.props['confirm-type']) el.enterKeyHint = v.props['confirm-type'] === 'search' ? 'search' : v.props['confirm-type'] === 'send' ? 'send' : 'done'
      }
      return
    }
    patch(el, v.kids)
  }
  function patch(parent, kids) {
    const nodes = parent.childNodes
    kids.forEach((v, i) => {
      const d = nodes[i]
      if (!d) parent.appendChild(create(v))
      else if (sameNode(d, v)) update(d, v)
      else parent.replaceChild(create(v), d)
    })
    while (nodes.length > kids.length) parent.removeChild(parent.lastChild)
  }
  function sameNode(d, v) {
    if (v.text != null) return d.nodeType === 3
    return d.nodeType === 1 && d.tagName.toLowerCase() === domTag(v)
  }

  // ---------- 页面 ----------
  const pageDefs = {}
  let registering = null

  window.App = function (def) {
    Object.assign(appInstance, def)
  }
  const appInstance = { globalData: {} }
  window.getApp = () => appInstance
  window.Page = function (def) {
    pageDefs[registering] = def
  }
  window.Component = function (def) {
    compDefs[registering] = def
  }
  window.getCurrentPages = () => stack.slice()

  function register(path) {
    registering = path
    load(path + '.js')
    registering = null
  }

  function createPage(route, query) {
    if (!pageDefs[route]) register(route)
    const def = pageDefs[route]
    const page = { route, options: query, data: JSON.parse(JSON.stringify(def.data || {})) }
    Object.keys(def).forEach(k => {
      if (k === 'data') return
      page[k] = typeof def[k] === 'function' ? def[k].bind(page) : def[k]
    })
    const cfg = Object.assign({}, app.window, B.configs[route] || {})
    page.__title = cfg.navigationBarTitleText || ''
    page.__custom = cfg.navigationStyle === 'custom'
    page.__navBg = cfg.navigationBarBackgroundColor || '#000000'
    page.__navFg = cfg.navigationBarTextStyle === 'black' ? '#000000' : '#ffffff'
    page.__bg = cfg.backgroundColor || '#ffffff'
    const comps = compMap(route)
    Object.values(comps).forEach(c => {
      if (!compDefs[c]) register(c)
      Object.values(compMap(c)).forEach(cc => compDefs[cc] || register(cc))
    })
    const insts = {}
    const ctx = {
      owner: page,
      comps,
      instance(path, comp, props) {
        let inst = insts[path]
        const fresh = !inst || inst.is !== comp
        if (fresh) inst = insts[path] = makeComponent(comp, page)
        inst.__setProps(props)
        if (fresh) inst.__attach()
        return inst
      }
    }
    // DOM
    const wrap = document.createElement('div')
    wrap.className = 'pg'
    const scroller = document.createElement('div')
    scroller.className = 'wx-page P-' + route.replace(/\//g, '-')
    wrap.appendChild(scroller)
    $pages.appendChild(wrap)
    page.__el = wrap
    page.__scroller = scroller
    page.__render = () => patch(scroller, renderKids(tpl(route).kids, page.data, ctx, ''))
    page.setData = (obj, cb) => {
      applyData(page.data, obj)
      page.__render()
      cb && cb()
    }
    page.__render()
    page.onLoad && page.onLoad(query)
    return page
  }

  // ---------- 导航与外壳 ----------
  const $app = document.getElementById('app')
  const $pages = document.getElementById('pages')
  const $title = document.getElementById('nav-title')
  const $back = document.getElementById('nav-back')
  const $tabbar = document.getElementById('tabbar')
  const tabs = (app.tabBar && app.tabBar.list) || []
  const tabRoutes = tabs.map(t => t.pagePath)
  const tabPages = {}
  let stack = []
  let current = null

  function parseUrl(url) {
    const [p, q = ''] = url.split('?')
    const query = {}
    q.split('&').filter(Boolean).forEach(kv => {
      const [k, v = ''] = kv.split('=')
      query[decodeURIComponent(k)] = decodeURIComponent(v)
    })
    return { route: norm(p), query }
  }

  function show(page) {
    if (current && current !== page) {
      current.onHide && current.onHide()
      current.__el.style.display = 'none'
    }
    current = page
    page.__el.style.display = ''
    const isTab = tabRoutes.includes(page.route)
    $app.classList.toggle('no-nav', page.__custom)
    $app.style.setProperty('--nav-bg', page.__navBg)
    $app.style.setProperty('--nav-fg', page.__navFg)
    $app.style.setProperty('--page-bg', page.__bg)
    $app.classList.toggle('no-tab', !isTab)
    $back.classList.toggle('show', stack.length > 1 || !isTab)
    $back.classList.toggle('home', stack.length <= 1 && !isTab)
    setTitle(page.__title)
    $tabbar.querySelectorAll('.tab').forEach((el, i) => {
      const on = tabs[i].pagePath === page.route
      el.classList.toggle('on', on)
      el.querySelector('img').src = B.icons[on ? tabs[i].selectedIconPath : tabs[i].iconPath]
    })
    page.onShow && page.onShow()
  }

  function setTitle(t) {
    $title.textContent = t
    document.title = t || (app.window && app.window.navigationBarTitleText) || ''
  }

  function hashFor(route, query) {
    const q = Object.keys(query || {}).map(k => k + '=' + encodeURIComponent(query[k])).join('&')
    return '#/' + route + (q ? '?' + q : '')
  }

  function unload(page) {
    page.onUnload && page.onUnload()
    page.__el.remove()
  }

  function navigateTo(url, mode) {
    const { route, query } = parseUrl(url)
    if (tabRoutes.includes(route)) return switchTab(route)
    if (mode === 'redirect' && stack.length) {
      const top = stack.pop()
      current = null
      unload(top)
    }
    const page = createPage(route, query)
    stack.push(page)
    if (mode === 'push') history.pushState({ depth: stack.length }, '', hashFor(route, query))
    else history.replaceState({ depth: stack.length }, '', hashFor(route, query))
    show(page)
  }

  function switchTab(route) {
    route = norm(route)
    if (current && !tabRoutes.includes(current.route)) {
      current.onHide && current.onHide()
      current = null
    }
    stack.filter(p => !tabRoutes.includes(p.route)).forEach(unload)
    let page = tabPages[route]
    if (!page) page = tabPages[route] = createPage(route, {})
    stack = [page]
    history.replaceState({ depth: 1 }, '', hashFor(route, {}))
    show(page)
  }

  function navigateBack(delta) {
    delta = delta || 1
    if (stack.length <= 1) {
      if (current && !tabRoutes.includes(current.route)) {
        const top = stack.pop()
        current = null
        unload(top)
        return switchTab(tabRoutes[0])
      }
      return
    }
    for (let i = 0; i < delta && stack.length > 1; i++) {
      const top = stack.pop()
      if (top === current) current = null
      unload(top)
    }
    show(stack[stack.length - 1])
  }

  window.addEventListener('popstate', () => {
    if (stack.length > 1) navigateBack(1)
    else route(location.hash)
  })

  $back.addEventListener('click', () => {
    if (stack.length > 1) history.back()
    else navigateBack(1)
  })

  tabs.forEach((t, i) => {
    const el = document.createElement('div')
    el.className = 'tab'
    el.innerHTML = '<div class="tab-ico"><img alt=""><span class="badge"></span></div><div class="tab-t"></div>'
    el.querySelector('.tab-t').textContent = t.text
    el.addEventListener('click', () => switchTab(t.pagePath))
    $tabbar.appendChild(el)
  })
  document.documentElement.style.setProperty('--tab-color', app.tabBar.color)
  document.documentElement.style.setProperty('--tab-on', app.tabBar.selectedColor)
  document.documentElement.style.setProperty('--tab-bg', app.tabBar.backgroundColor || '#ffffff')
  document.documentElement.style.setProperty('--tab-border', app.tabBar.borderStyle === 'white' ? 'transparent' : 'rgba(0,0,0,0.08)')

  // ---------- 事件 ----------
  function evObj(type, el, target, detail) {
    return {
      type,
      detail: detail || {},
      currentTarget: { id: el.id, dataset: el.__v.ds },
      target: { id: target.id, dataset: (target.__v && target.__v.ds) || {} },
      timeStamp: Date.now()
    }
  }
  function fire(el, name, target, detail) {
    const h = el.__v.ev[name]
    if (!h) return false
    const owner = el.__v.owner
    const fn = typeof h.h === 'function' ? h.h : owner[h.h]
    if (typeof fn === 'function') fn.call(owner, evObj(name, el, target, detail))
    else console.warn('handler not found:', h.h)
    return h.c
  }
  $pages.addEventListener('click', e => {
    let el = e.target.nodeType === 1 ? e.target : e.target.parentNode
    const target = el
    while (el && el !== $pages) {
      if (el.__v && el.__v.ev.tap && fire(el, 'tap', target, { x: e.clientX, y: e.clientY })) break
      el = el.parentNode
    }
  })
  $pages.addEventListener('input', e => {
    const el = e.target
    if (el.__v) fire(el, 'input', el, { value: el.value })
  })
  $pages.addEventListener('keydown', e => {
    const el = e.target
    if (e.key === 'Enter' && !e.isComposing && el.tagName === 'INPUT' && el.__v) {
      fire(el, 'confirm', el, { value: el.value })
      el.blur()
    }
  })
  $pages.addEventListener('focusout', e => {
    const el = e.target
    if (el.__v) fire(el, 'blur', el, { value: el.value })
  })
  // hover-class
  let hoverEl = null
  let hoverCls = []
  function clearHover() {
    if (hoverEl) hoverCls.forEach(c => hoverEl.classList.remove(c))
    hoverEl = null
  }
  $pages.addEventListener('pointerdown', e => {
    clearHover()
    let el = e.target.nodeType === 1 ? e.target : e.target.parentNode
    while (el && el !== $pages && !(el.__v && el.__v.hover)) el = el.parentNode
    if (el && el !== $pages) {
      hoverEl = el
      hoverCls = el.__v.hover.split(/\s+/).filter(Boolean)
      hoverCls.forEach(c => el.classList.add(c))
    }
  })
  ;['pointerup', 'pointercancel', 'pointerleave'].forEach(t =>
    document.addEventListener(t, () => setTimeout(clearHover, 80), true)
  )
  $pages.addEventListener('scroll', clearHover, true)

  // ---------- toast ----------
  const $toast = document.getElementById('toast')
  let toastTimer
  function toast(title, icon, duration) {
    clearTimeout(toastTimer)
    $toast.className = 'toast show' + (icon === 'success' ? ' icon' : '')
    $toast.querySelector('.toast-t').textContent = title
    toastTimer = setTimeout(() => ($toast.className = 'toast'), duration || 1500)
  }

  // ---------- wx ----------
  function done(o, res) {
    o = o || {}
    o.success && o.success(res || {})
    o.complete && o.complete(res || {})
  }
  const winInfo = () => ({
    statusBarHeight: 0,
    windowWidth: $app.clientWidth,
    windowHeight: $app.clientHeight,
    screenWidth: $app.clientWidth,
    screenHeight: $app.clientHeight,
    pixelRatio: window.devicePixelRatio || 2,
    platform: 'web'
  })
  const wx = {
    getStorageSync: k => storage.get(k),
    setStorageSync: (k, v) => storage.set(k, v),
    removeStorageSync: k => {
      delete mem[k]
      try { localStorage.removeItem(PREFIX + k) } catch (e) {}
    },
    getWindowInfo: winInfo,
    getSystemInfoSync: winInfo,
    getMenuButtonBoundingClientRect: () => ({ top: 10, height: 32, left: 0, right: 0, width: 0, bottom: 42 }),
    navigateTo: o => { navigateTo(o.url, 'push'); done(o) },
    redirectTo: o => { navigateTo(o.url, 'redirect'); done(o) },
    reLaunch: o => {
      stack.filter(p => !tabRoutes.includes(p.route)).forEach(unload)
      stack = []
      current = null
      navigateTo(o.url, 'replace')
      done(o)
    },
    switchTab: o => { switchTab(parseUrl(o.url).route); done(o) },
    navigateBack: o => { navigateBack((o && o.delta) || 1); done(o) },
    setNavigationBarTitle: o => {
      const page = stack[stack.length - 1]
      if (page) page.__title = o.title
      if (page === current || !current) setTitle(o.title)
      done(o)
    },
    setTabBarItem: o => {
      const el = $tabbar.children[o.index]
      if (el && o.text) el.querySelector('.tab-t').textContent = o.text
      done(o)
    },
    setTabBarBadge: o => {
      const b = $tabbar.children[o.index] && $tabbar.children[o.index].querySelector('.badge')
      if (b) { b.textContent = o.text; b.classList.add('show') }
      done(o)
    },
    removeTabBarBadge: o => {
      const b = $tabbar.children[o.index] && $tabbar.children[o.index].querySelector('.badge')
      if (b) b.classList.remove('show')
      done(o)
    },
    showToast: o => { toast(o.title, o.icon || 'success', o.duration); done(o) },
    hideToast: () => ($toast.className = 'toast'),
    showLoading: o => { toast(o.title, 'none', 60000); done(o) },
    hideLoading: () => ($toast.className = 'toast'),
    showModal: o => {
      const ok = o.showCancel === false ? (alert(o.content || o.title), true) : confirm(o.content || o.title)
      done(o, { confirm: ok, cancel: !ok })
    },
    makePhoneCall: o => {
      location.href = 'tel:' + o.phoneNumber
      done(o)
    },
    setClipboardData: o => {
      const ok = () => { toast('内容已复制', 'success'); done(o) }
      const fallback = () => {
        const ta = document.createElement('textarea')
        ta.value = o.data
        ta.style.cssText = 'position:fixed;opacity:0'
        document.body.appendChild(ta)
        ta.select()
        try { document.execCommand('copy') } catch (e) {}
        ta.remove()
        ok()
      }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(o.data).then(ok, fallback)
      else fallback()
    },
    pageScrollTo: o => {
      const page = current
      if (!page) return
      const sc = page.__scroller
      let top = o.scrollTop || 0
      if (o.selector) {
        const el = sc.querySelector(o.selector)
        if (!el) return o.fail && o.fail({})
        top = el.offsetTop + el.offsetHeight - sc.clientHeight
      }
      sc.scrollTo({ top, behavior: o.duration ? 'smooth' : 'auto' })
      done(o)
    },
    request: o => {
      const ctrl = new AbortController()
      const timer = o.timeout ? setTimeout(() => ctrl.abort(), o.timeout) : null
      fetch(o.url, {
        method: o.method || 'GET',
        headers: o.header,
        body: o.data && (o.method || 'GET') !== 'GET' ? JSON.stringify(o.data) : undefined,
        signal: ctrl.signal
      })
        .then(r => r.text().then(t => {
          let data = t
          try { data = JSON.parse(t) } catch (e) {}
          done(o, { statusCode: r.status, data })
        }))
        .catch(err => { o.fail && o.fail({ errMsg: String(err) }); o.complete && o.complete({}) })
        .finally(() => clearTimeout(timer))
    }
  }
  window.wx = new Proxy(wx, {
    get(t, k) {
      if (k in t) return t[k]
      return o => {
        console.warn('wx.' + String(k) + ' 网页版未实现')
        o && o.fail && o.fail({ errMsg: String(k) + ':fail not supported' })
      }
    }
  })

  // ---------- 启动 ----------
  function route(hash) {
    const url = (hash || '').replace(/^#\/?/, '')
    const target = url ? parseUrl(url) : { route: tabRoutes[0] || app.pages[0], query: {} }
    if (!app.pages.includes(target.route)) target.route = tabRoutes[0] || app.pages[0]
    if (tabRoutes.includes(target.route)) switchTab(target.route)
    else {
      stack.filter(p => !tabRoutes.includes(p.route)).forEach(unload)
      stack = []
      current = null
      navigateTo(url, 'replace')
    }
  }

  load('app.js')
  appInstance.onLaunch && appInstance.onLaunch({})
  route(location.hash)
  appInstance.onShow && appInstance.onShow({})
})()
