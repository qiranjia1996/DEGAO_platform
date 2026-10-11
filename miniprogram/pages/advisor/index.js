const i18n = require('../../utils/i18n')
const advisor = require('../../utils/advisor')
const tree = require('../../utils/tree')
const store = require('../../utils/store')
const config = require('../../config')

const pad = n => (n < 10 ? '0' : '') + n

Page({
  // mode：tree 问答选品 / chat 对话咨询；path：问答选品里已选的选项序号
  data: { mode: 'tree', path: [], crumbs: [], messages: [], input: '', loading: false },

  onShow() {
    i18n.applyChrome('advisor')
    store.syncBadge()
    const lang = i18n.getLang()
    if (lang !== this.data.lang) this.setData({ messages: [], path: [] })
    this.setData({ lang, t: i18n.t(lang), online: !!config.llm.apiKey })

    const app = getApp()
    const start = app.globalData.advisorTree
    if (start) {
      app.globalData.advisorTree = null
      this.setData({ mode: 'tree', path: start.species ? tree.pathForSpecies(start.species) : [] })
    }
    this.renderTree()

    const q = app.globalData.advisorQuery
    if (q) {
      app.globalData.advisorQuery = ''
      this.setData({ mode: 'chat' })
      this.ask(q)
    }
  },

  switchMode(e) {
    const mode = e.currentTarget.dataset.mode
    if (mode !== this.data.mode) this.setData({ mode })
  },

  // ---------- 问答选品 ----------
  renderTree() {
    const { path, lang } = this.data
    const w = tree.walk(path, lang)
    const data = { crumbs: w.crumbs, node: w.node || null, result: w.result || null }
    if (w.node) {
      data.stepNo = pad(path.length + 1)
      data.stepTotal = pad(path.length + tree.depthFrom(w.node.id))
    }
    this.setData(data)
  },

  setPath(path) {
    this.setData({ path }, () => {
      this.renderTree()
      wx.pageScrollTo({ scrollTop: 0, duration: 0, fail() {} })
    })
  },

  pickOption(e) {
    const i = Number(e.currentTarget.dataset.index)
    // 第一步选的是动物，记下来，产品详情页的应用场景默认显示这种动物
    if (!this.data.path.length) getApp().globalData.lastSpecies = ['pig', 'poultry', 'ruminant', 'aqua'][i] || ''
    this.setPath(this.data.path.concat(i))
  },

  treeBack() {
    this.setPath(this.data.path.slice(0, -1))
  },

  treeRestart() {
    this.setPath([])
  },

  treeAddAll() {
    this.data.result.items.forEach(i => store.addToCart(i.product.id, 1))
    wx.showToast({ title: this.data.t.common.added, icon: 'success' })
  },

  // 带着已选的路径切到对话咨询
  treeAskChat() {
    const q = i18n.fmt(this.data.t.advisor.askChatQ, { path: this.data.crumbs.join(' · ') })
    this.setData({ mode: 'chat' })
    this.ask(q)
  },

  // 小程序里不能直接打开外部网页，复制文献链接；网页版直接在新标签页打开
  openRef(e) {
    const url = e.currentTarget.dataset.url
    if (typeof window !== 'undefined' && window.open) {
      window.open(url, '_blank')
      return
    }
    const title = this.data.t.advisor.linkCopied
    wx.setClipboardData({ data: url, success: () => wx.showToast({ title, icon: 'none' }) })
  },

  // ---------- 对话咨询 ----------
  onInput(e) {
    this.setData({ input: e.detail.value })
  },

  send() {
    const q = this.data.input.trim()
    if (q) this.ask(q)
  },

  useExample(e) {
    this.ask(e.currentTarget.dataset.q)
  },

  ask(q) {
    if (this.data.loading) return
    const lang = this.data.lang
    const messages = this.data.messages.concat({ role: 'user', text: q })
    this.setData({ messages, input: '', loading: true }, () => this.scrollEnd())
    advisor.recommend(q, lang).then(res => {
      this.setData({ messages: this.data.messages.concat({ role: 'ai', res }), loading: false }, () => this.scrollEnd())
    })
  },

  scrollEnd() {
    wx.pageScrollTo({ selector: '#end', duration: 300, fail() {} })
  },

  openProduct(e) {
    wx.navigateTo({ url: `/pages/product/index?id=${e.currentTarget.dataset.id}` })
  },

  addOne(e) {
    store.addToCart(e.currentTarget.dataset.id, 1)
    wx.showToast({ title: this.data.t.common.added, icon: 'success' })
  },

  addAll(e) {
    const msg = this.data.messages[e.currentTarget.dataset.index]
    msg.res.items.forEach(i => store.addToCart(i.product.id, 1))
    wx.showToast({ title: this.data.t.common.added, icon: 'success' })
  },

  clear() {
    this.setData({ messages: [] })
  }
})
