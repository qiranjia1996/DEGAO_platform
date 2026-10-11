const i18n = require('../../utils/i18n')
const catalog = require('../../data/catalog')
const company = require('../../data/company')
const references = require('../../data/references')
const store = require('../../utils/store')

Page({
  data: { qty: 1, faqOpen: -1 },

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
    const refs = references.getSeriesRefs(p.series, lang)
    const d = catalog.getDetail(p.series, refs.map(r => r.id), lang)
    // 应用场景默认显示客户最近关注的动物（在产品中心或问答选品里选过的），否则显示第一个
    const last = getApp().globalData.lastSpecies
    const useSp = d.uses.some(g => g.id === last) ? last : d.uses.length ? d.uses[0].id : ''
    const grades = catalog.getSiblings(this.id, lang)
    this.setData({
      lang,
      t,
      p,
      d,
      useSp,
      faqOpen: -1,
      grades,
      gradeGuide: grades.length > 1 && grades.some(g => g.fit),
      related: catalog.getProducts(lang).filter(x => x.cat === p.cat && x.series !== p.series).slice(0, 4),
      refs
    })
  },

  pickGrade(e) {
    this.id = e.currentTarget.dataset.id
    this.setData({ qty: 1 })
    this.render()
  },

  pickUseSp(e) {
    const id = e.currentTarget.dataset.id
    getApp().globalData.lastSpecies = id
    this.setData({ useSp: id })
  },

  toggleFaq(e) {
    const i = e.currentTarget.dataset.i
    this.setData({ faqOpen: this.data.faqOpen === i ? -1 : i })
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

  // 小程序里复制文献链接，网页版直接打开
  openRef(e) {
    const url = e.currentTarget.dataset.url
    if (typeof window !== 'undefined' && window.open) {
      window.open(url, '_blank')
      return
    }
    const title = this.data.t.advisor.linkCopied
    wx.setClipboardData({ data: url, success: () => wx.showToast({ title, icon: 'none' }) })
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
