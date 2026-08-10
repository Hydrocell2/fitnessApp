import { createRouter, createWebHistory } from 'vue-router'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Workouts from '../pages/Workouts.vue'
import AddWorkout from '../pages/AddWorkout.vue'
import EditWorkout from '../pages/EditWorkout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/workouts',
      name: 'workouts',
      component: Workouts
    },
    {
      path: '/add-workout',
      name: 'addWorkout',
      component: AddWorkout
    },
    {
      path: '/edit-workout/:id',
      name: 'editWorkout',
      component: EditWorkout
    }
  ]
})

export default router