import Vue from 'vue'
import VueRouter from 'vue-router'
import FileUpload from "../views/FileUpload";
import VideoVerify from '../views/videoPersonVerify.vue'
import Tracking from '../views/tracking.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'FileUpload',
    component: FileUpload
  },
  {
    path: '/VideoVerify',
    name: 'VideoVerify',
    component: VideoVerify
  },
  {
    path: 'tracking',
    name: 'Tracking',
    component: Tracking
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
