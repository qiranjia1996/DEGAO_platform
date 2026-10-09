const store = require('./utils/store')

App({
  // productFilter：首页跳转产品页时带的筛选条件；advisorQuery：跳转 AI 选品时预填的问题
  globalData: { productFilter: null, advisorQuery: '' },

  onLaunch() {
    store.syncBadge()
  }
})
