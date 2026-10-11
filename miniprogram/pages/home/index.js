const i18n = require('../../utils/i18n')
const catalog = require('../../data/catalog')
const company = require('../../data/company')
const store = require('../../utils/store')

const SOLUTIONS = [
  { id: 'pig', en: 'SWINE', focus: { zh: '断奶腹泻 · 母猪哺乳 · 瘦肉率', en: 'Weaning scours · Sows · Lean yield' }, skus: ['SB50F', 'TA40C', 'GAA98'] },
  { id: 'poultry', en: 'POULTRY', focus: { zh: '热应激 · 肠道健康 · 胸肉率', en: 'Heat stress · Gut health · Breast yield' }, skus: ['GABA98', 'TB65', 'GAA98'] },
  { id: 'ruminant', en: 'RUMINANT', focus: { zh: '围产期 · 乳蛋白 · 育肥增重', en: 'Transition · Milk protein · Finishing gain' }, skus: ['RPM50', 'RPC25', 'GAA50M'] },
  { id: 'aqua', en: 'AQUA', focus: { zh: '肠道保护 · 豆粕替代 · 肝胆健康', en: 'Gut protection · Soy diets · Liver health' }, skus: ['SB40M', 'TB65', 'BA10'] }
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
    // 主推产品按六大方向的顺序排列
    const order = catalog.getCategories(lang).map(c => c.id)
    const featured = products.filter(p => p.featured).sort((a, b) => order.indexOf(a.cat) - order.indexOf(b.cat))
    this.setData({
      lang,
      t,
      heroTitle: t.home.heroTitle.split('\n'),
      featured,
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

  goTree() {
    getApp().globalData.advisorTree = {}
    wx.switchTab({ url: '/pages/advisor/index' })
  },

  goProducts() {
    wx.switchTab({ url: '/pages/products/index' })
  },

  goSpecies(e) {
    getApp().globalData.productFilter = { species: e.currentTarget.dataset.id }
    getApp().globalData.lastSpecies = e.currentTarget.dataset.id
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
