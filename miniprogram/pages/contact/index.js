const i18n = require('../../utils/i18n')
const company = require('../../data/company')

Page({
  data: { form: { name: '', tel: '', msg: '' } },

  onShow() {
    const lang = i18n.getLang()
    const t = i18n.t(lang)
    wx.setNavigationBarTitle({ title: t.nav.contact })
    const c = company.contact
    this.setData({
      t,
      name: i18n.pick(company.name, lang),
      c: { phone: c.phone, fax: c.fax, email: c.email, address: i18n.pick(c.address, lang) }
    })
  },

  call() {
    wx.makePhoneCall({ phoneNumber: this.data.c.phone, fail() {} })
  },

  copy(e) {
    wx.setClipboardData({ data: e.currentTarget.dataset.v })
  },

  onField(e) {
    this.setData({ [`form.${e.currentTarget.dataset.k}`]: e.detail.value })
  },

  submit() {
    const { form, t } = this.data
    if (!form.name.trim() || !form.tel.trim() || !form.msg.trim()) {
      return wx.showToast({ title: t.contact.required, icon: 'none' })
    }
    // Alpha：留言仅保存在本机，正式版需接入后端或企业微信通知
    const list = wx.getStorageSync('dg_messages') || []
    list.unshift(Object.assign({ time: Date.now() }, form))
    wx.setStorageSync('dg_messages', list)
    this.setData({ form: { name: '', tel: '', msg: '' } })
    wx.showToast({ title: t.contact.sent, icon: 'none', duration: 2500 })
  }
})
