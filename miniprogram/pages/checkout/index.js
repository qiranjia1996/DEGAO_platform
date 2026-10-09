const i18n = require('../../utils/i18n')
const store = require('../../utils/store')

const INFO = 'dg_buyer'

Page({
  data: { form: { company: '', contact: '', phone: '', address: '', remark: '' } },

  onLoad() {
    const saved = wx.getStorageSync(INFO)
    if (saved) this.setData({ form: Object.assign({}, saved, { remark: '' }) })
  },

  onShow() {
    const lang = i18n.getLang()
    const t = i18n.t(lang)
    wx.setNavigationBarTitle({ title: t.nav.checkout })
    const d = store.cartDetail(lang)
    this.setData({ t, lines: d.lines, total: d.total, count: d.count })
  },

  onField(e) {
    this.setData({ [`form.${e.currentTarget.dataset.k}`]: e.detail.value })
  },

  submit() {
    const { t, form, lines } = this.data
    if (!lines.length) return
    if (!form.company.trim() || !form.contact.trim() || !form.phone.trim() || !form.address.trim()) {
      return wx.showToast({ title: t.checkout.required, icon: 'none' })
    }
    if (!/^1\d{10}$/.test(form.phone.trim()) && !/^[\d\-+ ]{7,}$/.test(form.phone.trim())) {
      return wx.showToast({ title: t.checkout.phoneInvalid, icon: 'none' })
    }
    wx.setStorageSync(INFO, { company: form.company, contact: form.contact, phone: form.phone, address: form.address })
    const order = store.placeOrder(form, i18n.getLang())
    wx.redirectTo({ url: `/pages/orders/index?new=${order.no}` })
  }
})
