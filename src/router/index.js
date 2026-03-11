import { createRouter, createWebHashHistory } from 'vue-router'
import Start from '@/views/Start.vue'
import CharacterCreate from '@/views/CharacterCreate.vue'
import Game from '@/views/Game.vue'
import Ending from '@/views/Ending.vue'

const routes = [
  {
    path: '/',
    name: 'Start',
    component: Start
  },
  {
    path: '/create',
    name: 'CharacterCreate',
    component: CharacterCreate
  },
  {
    path: '/game',
    name: 'Game',
    component: Game
  },
  {
    path: '/ending',
    name: 'Ending',
    component: Ending
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
