const catalog = require('../data/catalog')

const CART = 'dg_cart'
const ORDERS = 'dg_orders'

function read(key, fallback) {
  try {
    return wx.getStorageSync(key) || fallback
  } catch (e) {
    return fallback
  }
}

function getCart() {
  return read(CART, [])
}

function saveCart(cart) {
  wx.setStorageSync(CART, cart)
  syncBadge(cart)
}

function addToCart(id, qty = 1) {
  const cart = getCart()
  const line = cart.find(l => l.id === id)
  if (line) line.qty += qty
  else cart.push({ id, qty })
  saveCart(cart)
}

function setQty(id, qty) {
  const cart = getCart().map(l => (l.id === id ? { id, qty } : l)).filter(l => l.qty > 0)
  saveCart(cart)
}

function removeFromCart(id) {
  saveCart(getCart().filter(l => l.id !== id))
}

function cartDetail(lang) {
  const lines = getCart()
    .map(l => {
      const p = catalog.getProduct(l.id, lang)
      return p ? Object.assign({}, p, { qty: l.qty, subtotal: p.bagPrice * l.qty }) : null
    })
    .filter(Boolean)
  const total = lines.reduce((s, l) => s + l.subtotal, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  return { lines, total, count }
}

function syncBadge(cart) {
  const n = (cart || getCart()).reduce((s, l) => s + l.qty, 0)
  if (n > 0) wx.setTabBarBadge({ index: 3, text: String(n > 99 ? '99+' : n), fail() {} })
  else wx.removeTabBarBadge({ index: 3, fail() {} })
}

function placeOrder(info, lang) {
  const { lines, total } = cartDetail(lang)
  const now = new Date()
  const pad = n => String(n).padStart(2, '0')
  const no = `DG${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  const order = {
    no,
    time: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`,
    info,
    items: lines.map(l => ({ id: l.id, qty: l.qty, price: l.bagPrice })),
    total
  }
  const orders = read(ORDERS, [])
  orders.unshift(order)
  wx.setStorageSync(ORDERS, orders)
  saveCart([])
  return order
}

function getOrders(lang) {
  return read(ORDERS, []).map(o =>
    Object.assign({}, o, {
      items: o.items.map(i => Object.assign({}, catalog.getProduct(i.id, lang), { qty: i.qty }))
    })
  )
}

module.exports = { getCart, addToCart, setQty, removeFromCart, cartDetail, syncBadge, placeOrder, getOrders }
