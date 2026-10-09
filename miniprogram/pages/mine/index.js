const i18n = require('../../utils/i18n')
const store = require('../../utils/store')

Page({
  data: {},

  onShow() {
    i18n.applyChrome('mine')
    store.syncBadge()
    this.render()
  },

  render() {
    const lang = i18n.getLang()
    const t = i18n.t(lang)
    this.setData({
      lang,
      t,
      orderCount: store.getOrders(lang).length,
      cartCount: store.cartDetail(lang).count
    })
  },

  setLang(e) {
    const lang = e.currentTarget.dataset.lang
    if (lang === this.data.lang) return
    i18n.setLang(lang)
    i18n.applyChrome('mine')
    this.render()
  },

  go(e) {
    const url = e.currentTarget.dataset.url
    if (['/pages/cart/index', '/pages/advisor/index'].includes(url)) wx.switchTab({ url })
    else wx.navigateTo({ url })
  }
})
