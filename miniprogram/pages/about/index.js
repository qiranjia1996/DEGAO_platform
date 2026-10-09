const i18n = require('../../utils/i18n')
const catalog = require('../../data/catalog')
const company = require('../../data/company')

Page({
  data: {},

  onShow() {
    const lang = i18n.getLang()
    const t = i18n.t(lang)
    wx.setNavigationBarTitle({ title: t.nav.about })
    const products = catalog.getProducts(lang)
    this.setData({
      t,
      name: i18n.pick(company.name, lang),
      slogan: i18n.pick(company.slogan, lang),
      tagline: i18n.pick(company.tagline, lang),
      about: i18n.pick(company.about, lang),
      stats: company.stats.map(s => ({ value: s.value, label: i18n.pick(s.label, lang) })),
      milestones: company.milestones.map(m => ({ year: m.year, text: i18n.pick(m.text, lang) })),
      certs: company.certs.map(c => ({ code: c.code, title: i18n.pick(c.title, lang), desc: i18n.pick(c.desc, lang) })),
      portfolio: catalog.getCategories(lang).map(c => ({
        id: c.id,
        name: c.name,
        items: [...new Set(products.filter(p => p.cat === c.id).map(p => p.name))]
      }))
    })
  },

  goCat(e) {
    getApp().globalData.productFilter = { cat: e.currentTarget.dataset.id }
    wx.switchTab({ url: '/pages/products/index' })
  },

  contact() {
    wx.navigateTo({ url: '/pages/contact/index' })
  }
})
