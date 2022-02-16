import Vue from 'vue'
import VueRouter from 'vue-router'
import OrderList from '../views/OrderList.vue'
import Order from '../views/Order.vue'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/OrderList',
    name: 'OrderList',
    component: OrderList,
    alias: '/'
  },
  {
    path: '/list/:s_id',
    name: 'Order',
    component: Order
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
