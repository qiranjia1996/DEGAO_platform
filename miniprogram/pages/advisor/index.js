const i18n = require('../../utils/i18n')
const advisor = require('../../utils/advisor')
const store = require('../../utils/store')
const config = require('../../config')

Page({
  data: { messages: [], input: '', loading: false },

  onShow() {
    i18n.applyChrome('advisor')
    store.syncBadge()
    const lang = i18n.getLang()
    if (lang !== this.data.lang) this.setData({ messages: [] })
    this.setData({ lang, t: i18n.t(lang), online: !!config.llm.apiKey })
    const q = getApp().globalData.advisorQuery
    if (q) {
      getApp().globalData.advisorQuery = ''
      this.ask(q)
    }
  },

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
