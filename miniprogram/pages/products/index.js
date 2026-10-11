const i18n = require('../../utils/i18n')
const catalog = require('../../data/catalog')
const store = require('../../utils/store')

Page({
  data: { cat: 'all', species: 'all', keyword: '' },

  onShow() {
    i18n.applyChrome('products')
    store.syncBadge()
    const f = getApp().globalData.productFilter
    if (f) {
      getApp().globalData.productFilter = null
      if (f.species) getApp().globalData.lastSpecies = f.species
      this.setData({ cat: f.cat || 'all', species: f.species || 'all', keyword: '' })
    }
    this.render()
  },

  render() {
    const lang = i18n.getLang()
    const t = i18n.t(lang)
    const { cat, species } = this.data
    const kw = this.data.keyword.trim().toLowerCase()
    const all = catalog.getProducts(lang)
    const list = all.filter(p =>
      (cat === 'all' || p.cat === cat) &&
      (species === 'all' || p.speciesIds.includes(species)) &&
      (!kw || [p.title, p.name, p.formula, p.id, p.catName].concat(p.benefits).join(' ').toLowerCase().includes(kw))
    )
    this.setData({
      lang,
      t,
      cats: [{ id: 'all', name: t.products.all }].concat(catalog.getCategories(lang)),
      speciesList: [{ id: 'all', name: t.products.all }].concat(catalog.getSpecies(lang)),
      list,
      countText: i18n.fmt(t.products.count, { n: list.length })
    })
  },

  onSearch(e) {
    this.setData({ keyword: e.detail.value })
    this.render()
  },

  clearSearch() {
    this.setData({ keyword: '' })
    this.render()
  },

  pickCat(e) {
    this.setData({ cat: e.currentTarget.dataset.id })
    this.render()
  },

  pickSpecies(e) {
    const id = e.currentTarget.dataset.id
    if (id !== 'all') getApp().globalData.lastSpecies = id
    this.setData({ species: id })
    this.render()
  }
})
