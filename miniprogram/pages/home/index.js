const i18n = require('../../utils/i18n')
const catalog = require('../../data/catalog')
const company = require('../../data/company')
const store = require('../../utils/store')

const SOLUTIONS = [
  { id: 'pig', en: 'SWINE', focus: { zh: '断奶腹泻 · 生长性能 · 替抗', en: 'Weaning scours · Growth · AGP-free' }, skus: ['SB30C', 'KDF95', 'CS30C'] },
  { id: 'poultry', en: 'POULTRY', focus: { zh: '热应激 · 肠道健康 · 胸肉率', en: 'Heat stress · Gut health · Breast yield' }, skus: ['GABA98', 'GAA', 'ORP'] },
  { id: 'ruminant', en: 'RUMINANT', focus: { zh: '犊牛肠道 · 免疫 · 生产性能', en: 'Calf gut · Immunity · Performance' }, skus: ['SB98P', 'YCW', 'CS30C'] },
  { id: 'aqua', en: 'AQUA', focus: { zh: '诱食 · 脂肪利用 · 肝胆健康', en: 'Attraction · Fat use · Liver health' }, skus: ['BA30', 'BT70C', 'ALC'] }
]

Page({
  data: {},

  onLoad() {
    const sys = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync()
    let navTop = sys.statusBarHeight + 6
    let navHeight = 32
    try {
      const m = wx.getMenuButtonBoundingClientRect()
      navTop = m.top
      navHeight = m.height
    } catch (e) {}
    this.setData({ navTop, navHeight })
  },

  onShow() {
    i18n.applyChrome()
    store.syncBadge()
    this.render()
  },

  render() {
    const lang = i18n.getLang()
    const t = i18n.t(lang)
    const products = catalog.getProducts(lang)
    const species = catalog.getSpecies(lang)
    const categories = catalog.getCategories(lang).map(c => {
      const list = products.filter(p => p.cat === c.id)
      return Object.assign(c, { count: list.length, names: [...new Set(list.map(p => p.name))].join(lang === 'en' ? ' · ' : '、') })
    })
    this.setData({
      lang,
      t,
      heroTitle: t.home.heroTitle.split('\n'),
      featured: products.filter(p => p.featured),
      categories,
      solutions: SOLUTIONS.map(s => ({
        id: s.id,
        en: s.en,
        name: species.find(x => x.id === s.id).name,
        focus: i18n.pick(s.focus, lang),
        items: s.skus.map(id => catalog.getProduct(id, lang).name)
      })),
      company: {
        name: i18n.pick(company.name, lang),
        slogan: i18n.pick(company.slogan, lang),
        about: i18n.pick(company.about, lang)[0],
        stats: company.stats.map(s => ({ value: s.value, label: i18n.pick(s.label, lang) })),
        certs: company.certs.map(c => ({ code: c.code, title: i18n.pick(c.title, lang), desc: i18n.pick(c.desc, lang) })),
        phone: company.contact.phone
      }
    })
  },

  toggleLang() {
    i18n.setLang(this.data.lang === 'zh' ? 'en' : 'zh')
    i18n.applyChrome()
    this.render()
  },

  goAdvisor() {
    wx.switchTab({ url: '/pages/advisor/index' })
  },

  goProducts() {
    wx.switchTab({ url: '/pages/products/index' })
  },

  goSpecies(e) {
    getApp().globalData.productFilter = { species: e.currentTarget.dataset.id }
    wx.switchTab({ url: '/pages/products/index' })
  },

  goCategory(e) {
    getApp().globalData.productFilter = { cat: e.currentTarget.dataset.id }
    wx.switchTab({ url: '/pages/products/index' })
  },

  goAbout() {
    wx.navigateTo({ url: '/pages/about/index' })
  },

  goContact() {
    wx.navigateTo({ url: '/pages/contact/index' })
  },

  call() {
    wx.makePhoneCall({ phoneNumber: this.data.company.phone, fail() {} })
  },

  onShareAppMessage() {
    return { title: this.data.company.name, path: '/pages/home/index' }
  }
})
