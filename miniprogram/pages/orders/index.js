const i18n = require('../../utils/i18n')

const store = require('../../utils/store')

Page({
  data: {},

  onLoad(q) {
    this.newNo = q.new || ''
  },

  onShow() {
    const lang = i18n.getLang()
    const t = i18n.t(lang)
    wx.setNavigationBarTitle({ title: t.nav.orders })
    this.setData({ t, orders: store.getOrders(lang), newNo: this.newNo })
  },

  home() {
    wx.switchTab({ url: '/pages/home/index' })
  }
})
