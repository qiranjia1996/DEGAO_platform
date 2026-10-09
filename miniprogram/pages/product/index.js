const i18n = require('../../utils/i18n')
const catalog = require('../../data/catalog')
const company = require('../../data/company')
const store = require('../../utils/store')

Page({
  data: { qty: 1 },

  onLoad(q) {
    this.id = q.id
  },

  onShow() {
    this.render()
  },

  render() {
    const lang = i18n.getLang()
    const t = i18n.t(lang)
    const p = catalog.getProduct(this.id, lang)
    if (!p) return
    wx.setNavigationBarTitle({ title: p.title })
    this.setData({
      lang,
      t,
      p,
      grades: catalog.getSiblings(this.id, lang),
      related: catalog.getProducts(lang).filter(x => x.cat === p.cat && x.series !== p.series).slice(0, 4)
    })
  },

  pickGrade(e) {
    this.id = e.currentTarget.dataset.id
    this.setData({ qty: 1 })
    this.render()
  },

  minus() {
    if (this.data.qty > 1) this.setData({ qty: this.data.qty - 1 })
  },

  plus() {
    this.setData({ qty: this.data.qty + 1 })
  },

  addCart() {
    store.addToCart(this.id, this.data.qty)
    wx.showToast({ title: this.data.t.common.added, icon: 'success' })
  },

  buyNow() {
    store.addToCart(this.id, this.data.qty)
    wx.navigateTo({ url: '/pages/checkout/index' })
  },

  call() {
    wx.makePhoneCall({ phoneNumber: company.contact.phone, fail() {} })
  },

  askAI() {
    const p = this.data.p
    getApp().globalData.advisorQuery = this.data.lang === 'en'
      ? `Is ${p.title} right for my farm? How should I use it?`
      : `${p.title}适合我的养殖场吗？应该怎么用？`
    wx.switchTab({ url: '/pages/advisor/index' })
  },

  onShareAppMessage() {
    return { title: this.data.p.title, path: `/pages/product/index?id=${this.id}` }
  }
})
