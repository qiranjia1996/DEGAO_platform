const i18n = require('../../utils/i18n')
const store = require('../../utils/store')

Page({
  data: {},

  onShow() {
    i18n.applyChrome('cart')
    this.render()
  },

  render() {
    const lang = i18n.getLang()
    const t = i18n.t(lang)
    const d = store.cartDetail(lang)
    store.syncBadge()
    this.setData({ t, lines: d.lines, total: d.total, itemsText: i18n.fmt(t.cart.items, { n: d.lines.length }), count: d.count })
  },

  minus(e) {
    const id = e.currentTarget.dataset.id
    const line = this.data.lines.find(l => l.id === id)
    store.setQty(id, line.qty - 1)
    this.render()
  },

  plus(e) {
    const id = e.currentTarget.dataset.id
    const line = this.data.lines.find(l => l.id === id)
    store.setQty(id, line.qty + 1)
    this.render()
  },

  remove(e) {
    store.removeFromCart(e.currentTarget.dataset.id)
    this.render()
  },

  open(e) {
    wx.navigateTo({ url: `/pages/product/index?id=${e.currentTarget.dataset.id}` })
  },

  goShop() {
    wx.switchTab({ url: '/pages/advisor/index' })
  },

  checkout() {
    wx.navigateTo({ url: '/pages/checkout/index' })
  }
})
