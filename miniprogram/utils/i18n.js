const KEY = 'dg_lang'

const dict = {
  zh: {
    tabs: ['首页', '产品', 'AI 选品', '采购单', '我的'],
    nav: {
      products: '产品中心', advisor: 'AI 选品顾问', cart: '采购单', mine: '我的',
      product: '产品详情', about: '关于德高', contact: '联系我们', checkout: '确认订单', orders: '我的订单'
    },
    common: {
      langSwitch: 'EN', addCart: '加入采购单', buyNow: '立即下单', added: '已加入采购单',
      perKg: '/kg', perBag: '/袋', viewAll: '查看全部', more: '了解更多', call: '拨打电话',
      copy: '复制', copied: '已复制', demo: 'Alpha 演示版 · 价格与订单仅用于演示', yuan: '¥', inquiry: '询价',
      submit: '提交', cancel: '取消', empty: '暂无内容'
    },
    home: {
      heroKicker: 'DEGAO · 德高农牧',
      heroTitle: '肠道 · 肌肉 · 抗应激\n德高饲料添加剂',
      heroSub: '19 个系列 35 个规格 · 包被缓释工艺 · 国家高新技术企业',
      ctaAdvisor: 'AI 智能选品', ctaProducts: '浏览产品',
      searchHint: '描述您的养殖问题，例如：断奶仔猪腹泻',
      solutions: '按养殖品种选择', solutionsSub: '为不同动物匹配合适的方案',
      featured: '主推产品', featuredSub: '每个方向的代表产品',
      categories: '六大产品方向', categoriesSub: '按要解决的问题找产品',
      trust: '资质与认证', trustSub: '质量体系与权威认证',
      aboutTitle: '关于德高', aboutCta: '公司介绍',
      contactTitle: '合作洽谈', contactSub: '欢迎来厂参观、指导、合作、洽购',
      treeCta: '3 步找到适合您的产品'
    },
    products: { all: '全部', search: '搜索产品名称或功能', count: '共 {n} 个产品', species: '适用动物' },
    product: {
      intro: '产品介绍', benefits: '核心功效', specs: '规格参数', species: '适用动物', dosage: '参考添加量',
      spec: '有效含量', form: '剂型', pack: '包装', formula: '分子式 / 类别', code: '产品编号',
      grades: '可选规格', qty: '采购数量', bags: '袋', note: '添加量来自德高产品目录（每吨饲料用量），具体方案请咨询德高技术服务团队。',
      askAI: '问问 AI 这个产品适合我吗', inquiry: '电话询价',
      refs: '研究依据',
      mechanism: '作用原理', uses: '对您的养殖场有什么用', gradeGuide: '如何选择规格', howto: '使用要点', faq: '常见问题',
      current: '当前', speciesAsk: '适用动物请咨询',
      usesNote: '方括号中的编号对应下方「研究依据」中的文献。',
      pending: '本产品为德高复配产品，成分与功效待德高技术部确认，以下为通用介绍。详情请电话咨询。'
    },
    advisor: {
      title: 'AI 选品顾问',
      sub: '用一句话描述您的养殖场景或问题，AI 会从德高的全线产品中为您推荐方案。',
      placeholder: '例如：夏季蛋鸡热应激，产蛋率下降',
      send: '发送', thinking: '正在分析您的需求…',
      examples: ['断奶仔猪腹泻严重，想减少抗生素', '夏季蛋鸡热应激，产蛋率下降', '玉米原料有霉变，母猪假发情', '育肥猪想提高日增重和瘦肉率', '对虾饲料想提高诱食和脂肪利用', '犊牛腹泻，想改善肠道健康'],
      tryAsk: '试试这样问',
      recommended: '推荐方案', dosage: '参考用量', reason: '推荐理由',
      offline: '本地智能匹配', online: 'AI 大模型',
      disclaimer: 'AI 建议仅供参考，具体配方请咨询德高技术服务或执业兽医。',
      noMatch: '暂时没能准确理解您的需求。请补充动物种类、生长阶段和遇到的问题，下面先为您列出德高的主推产品：',
      error: 'AI 服务暂时不可用，已切换为本地智能匹配。',
      clear: '清空对话', addAll: '全部加入采购单',
      modeTree: '问答选品', modeChat: '对话咨询',
      treeSub: '回答几个问题，我们根据研究文献为您推荐产品组合。',
      step: '第 {n} 步', back: '上一步', restart: '重新选择', resultTitle: '为您推荐', role: '作用',
      askChat: '继续对话咨询', askChatQ: '{path}，还有什么需要注意的？',
      refsTitle: '研究依据', refsNote: '以下为该类成分的公开研究文献，结论来自研究条件，不代表对德高产品的单独测试。',
      linkCopied: '文献链接已复制'
    },
    cart: {
      empty: '采购单还是空的', emptySub: '去产品中心或让 AI 帮您选品', go: '去选品',
      total: '合计', checkout: '去结算', bags: '袋', remove: '删除', items: '{n} 种产品'
    },
    checkout: {
      title: '确认订单', company: '公司 / 养殖场名称', contact: '联系人', phone: '联系电话', address: '收货地址',
      remark: '备注（可选）', remarkHint: '如：需要开票、指定发货时间', items: '产品清单', submit: '提交订单',
      required: '请填写完整的联系信息', phoneInvalid: '请填写正确的手机号', success: '订单已提交',
      successSub: '德高销售人员将尽快与您联系确认价格与发货', invoice: '付款方式', pay: '线下对公转账 / 货到确认'
    },
    orders: { empty: '还没有订单', no: '订单号', status: '待确认', time: '下单时间', total: '订单金额' },
    mine: {
      hello: '您好，欢迎来到德高', sub: '绿色饲料添加剂一站式采购',
      orders: '我的订单', cart: '采购单', advisor: 'AI 选品顾问', about: '关于德高', contact: '联系我们',
      language: '语言 / Language', langName: '中文', version: '版本'
    },
    about: { story: '公司简介', milestones: '发展历程', certs: '资质荣誉', portfolio: '六大产品方向', portfolioSub: '点击方向查看全部产品，点击产品查看详情' },
    contact: {
      title: '联系我们', phone: '咨询热线', fax: '传真', email: '邮箱', address: '地址',
      form: '在线留言', name: '您的姓名', tel: '联系电话', msg: '留言内容（想了解的产品、需求等）',
      sent: '留言已提交，我们会尽快联系您', required: '请填写姓名、电话和留言内容'
    }
  },
  en: {
    tabs: ['Home', 'Products', 'AI Advisor', 'Cart', 'Me'],
    nav: {
      products: 'Products', advisor: 'AI Product Advisor', cart: 'Purchase List', mine: 'Me',
      product: 'Product Details', about: 'About Degao', contact: 'Contact Us', checkout: 'Confirm Order', orders: 'My Orders'
    },
    common: {
      langSwitch: '中文', addCart: 'Add to List', buyNow: 'Order Now', added: 'Added to list',
      perKg: '/kg', perBag: '/bag', viewAll: 'View all', more: 'Learn more', call: 'Call',
      copy: 'Copy', copied: 'Copied', demo: 'Alpha demo · prices & orders are for demonstration only', yuan: '¥', inquiry: 'Inquire',
      submit: 'Submit', cancel: 'Cancel', empty: 'Nothing here yet'
    },
    home: {
      heroKicker: 'DEGAO · Since 2019',
      heroTitle: 'Gut · Muscle · Stress,\nDegao Feed Additives',
      heroSub: '19 product lines, 35 grades · Coated slow-release technology · National High-Tech Enterprise',
      ctaAdvisor: 'AI Product Finder', ctaProducts: 'Browse Products',
      searchHint: 'Describe your challenge, e.g. piglet diarrhea after weaning',
      solutions: 'Solutions by Species', solutionsSub: 'Programs matched to each animal',
      featured: 'Featured Products', featuredSub: 'One flagship from each area',
      categories: 'Six Product Areas', categoriesSub: 'Find products by the problem you need to solve',
      trust: 'Certifications', trustSub: 'Quality systems & recognitions',
      aboutTitle: 'About Degao', aboutCta: 'Our story',
      contactTitle: 'Partner With Us', contactSub: 'Factory visits, technical exchange and orders welcome',
      treeCta: 'Find the right products in 3 steps'
    },
    products: { all: 'All', search: 'Search by name or function', count: '{n} products', species: 'Species' },
    product: {
      intro: 'Overview', benefits: 'Key Benefits', specs: 'Specifications', species: 'Target Species', dosage: 'Suggested Inclusion',
      spec: 'Active content', form: 'Form', pack: 'Packaging', formula: 'Formula / Class', code: 'Product code',
      grades: 'Available grades', qty: 'Quantity', bags: 'bags', note: 'Inclusion rates are from the Degao product catalog (per tonne of feed). Please consult Degao technical service for your formulation.',
      askAI: 'Ask AI if this product fits my farm', inquiry: 'Call for quote',
      refs: 'Research evidence',
      mechanism: 'How It Works', uses: 'What It Does for Your Farm', gradeGuide: 'Choosing a Grade', howto: 'How to Use', faq: 'FAQ',
      current: 'Current', speciesAsk: 'Species: please inquire',
      usesNote: 'Numbers in brackets refer to the studies listed under Research evidence.',
      pending: 'This is a Degao proprietary blend. Its composition and effects are awaiting confirmation by Degao’s technical team, so the description below is general. Please call for details.'
    },
    advisor: {
      title: 'AI Product Advisor',
      sub: 'Describe your farm or the problem you face in one sentence. The AI will recommend a program from Degao’s full portfolio.',
      placeholder: 'e.g. Layers under heat stress, egg production dropping',
      send: 'Send', thinking: 'Analyzing your needs…',
      examples: ['Severe post-weaning diarrhea in piglets, want to cut antibiotics', 'Layers under summer heat stress, egg output dropping', 'Moldy corn, sows showing false heat', 'Improve daily gain and lean yield in finishers', 'Better palatability and fat use in shrimp feed', 'Calf diarrhea, want better gut health'],
      tryAsk: 'Try asking',
      recommended: 'Recommended Program', dosage: 'Inclusion', reason: 'Why',
      offline: 'Smart Match (offline)', online: 'AI Model',
      disclaimer: 'AI suggestions are for reference only. Consult Degao technical service or a licensed veterinarian for formulations.',
      noMatch: 'I couldn’t pin down your needs yet. Please add species, production stage and the issue. Meanwhile, here are our flagship products:',
      error: 'AI service is unavailable — switched to offline smart match.',
      clear: 'Clear chat', addAll: 'Add all to list',
      modeTree: 'Guided', modeChat: 'Chat',
      treeSub: 'Answer a few questions and we will recommend a research-backed combination.',
      step: 'Step {n}', back: 'Back', restart: 'Start over', resultTitle: 'Recommended for you', role: 'Role',
      askChat: 'Ask a follow-up', askChatQ: '{path} — anything else I should know?',
      refsTitle: 'Research evidence', refsNote: 'Published studies on these ingredients. Results reflect study conditions and are not tests of Degao products.',
      linkCopied: 'Reference link copied'
    },
    cart: {
      empty: 'Your purchase list is empty', emptySub: 'Browse products or let AI pick for you', go: 'Find products',
      total: 'Total', checkout: 'Checkout', bags: 'bags', remove: 'Remove', items: '{n} items'
    },
    checkout: {
      title: 'Confirm Order', company: 'Company / Farm name', contact: 'Contact person', phone: 'Phone', address: 'Delivery address',
      remark: 'Notes (optional)', remarkHint: 'e.g. invoice needed, preferred delivery date', items: 'Items', submit: 'Place Order',
      required: 'Please complete your contact details', phoneInvalid: 'Please enter a valid phone number', success: 'Order submitted',
      successSub: 'A Degao sales representative will contact you to confirm pricing and shipping', invoice: 'Payment', pay: 'Bank transfer / confirm on delivery'
    },
    orders: { empty: 'No orders yet', no: 'Order No.', status: 'Pending', time: 'Placed', total: 'Amount' },
    mine: {
      hello: 'Welcome to Degao', sub: 'One-stop sourcing for green feed additives',
      orders: 'My Orders', cart: 'Purchase List', advisor: 'AI Product Advisor', about: 'About Degao', contact: 'Contact Us',
      language: 'Language / 语言', langName: 'English', version: 'Version'
    },
    about: { story: 'Company Profile', milestones: 'Milestones', certs: 'Certifications', portfolio: 'Six Product Areas', portfolioSub: 'Tap an area for all its products, or a product for details' },
    contact: {
      title: 'Contact Us', phone: 'Hotline', fax: 'Fax', email: 'Email', address: 'Address',
      form: 'Leave a Message', name: 'Your name', tel: 'Phone', msg: 'Message (products of interest, needs, etc.)',
      sent: 'Message sent. We will contact you shortly.', required: 'Please enter name, phone and message'
    }
  }
}

function getLang() {
  try {
    return wx.getStorageSync(KEY) || 'zh'
  } catch (e) {
    return 'zh'
  }
}

function setLang(lang) {
  wx.setStorageSync(KEY, lang)
}

function t(lang) {
  return dict[lang || getLang()]
}

function fmt(str, vars) {
  return str.replace(/\{(\w+)\}/g, (_, k) => vars[k])
}

function pick(obj, lang) {
  return obj ? obj[lang || getLang()] || obj.zh : ''
}

// 在 tab 页 onShow 中调用，同步 tabBar 文案和导航标题
function applyChrome(navKey) {
  const lang = getLang()
  const d = dict[lang]
  d.tabs.forEach((text, index) => wx.setTabBarItem({ index, text, fail() {} }))
  if (navKey) wx.setNavigationBarTitle({ title: d.nav[navKey] })
}

module.exports = { getLang, setLang, t, fmt, pick, applyChrome }
