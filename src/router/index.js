import Vue from 'vue'
import VueRouter from 'vue-router'
import ListSession from '../views/ListSession.vue'
import AddSession from '../views/AddSession.vue'
import SessionDetail from '../views/SessionDetail.vue'
import OrderList from '../views/OrderList.vue'
import Order from '../views/Order.vue'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/admin',
    name: 'ListSession',
    component: ListSession
  },
  {
    path: '/admin/AddSession',
    name: 'AddSession',
    component: AddSession
  },
  {
    path: '/admin/session_detail/:s_id',
    name: 'SessionDetail',
    component: SessionDetail
  },
  {
    path: '/OrderList',
    name: 'OrderList',
    component: OrderList
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
