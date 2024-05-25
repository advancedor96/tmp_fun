import { createRouter, createWebHistory } from 'vue-router'
import OrderList from '../views/OrderList.vue'
import Order from '../views/Order.vue'
import TheaterOrder from '../views/TheaterOrder.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
    },
    {
      path: '/listTheater/:t_id',
      name: 'TheaterOrder',
      component: TheaterOrder
    }
  ]
})

export default router
