const store = require('../../utils/store')
const i18n = require('../../utils/i18n')

Component({
  properties: {
    product: { type: Object, value: {} },
    layout: { type: String, value: 'grid' }
  },
  methods: {
    open() {
      wx.navigateTo({ url: `/pages/product/index?id=${this.data.product.id}` })
    },
    add() {
      store.addToCart(this.data.product.id, 1)
      wx.showToast({ title: i18n.t().common.added, icon: 'success' })
    }
  }
})
