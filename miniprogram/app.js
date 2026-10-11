const store = require('./utils/store')

App({
  // productFilter：首页跳转产品页时带的筛选条件；advisorQuery：跳转 AI 选品时预填的问题；
  // advisorTree：跳转到问答选品（可带 species 直接选好动物）
  globalData: { productFilter: null, lastSpecies: '', advisorQuery: '', advisorTree: null },

  onLaunch() {
    store.syncBadge()
  }
})
