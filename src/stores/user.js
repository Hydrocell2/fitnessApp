import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// The first argument is a unique id of the store across your application.
export const useUserStore = defineStore('user', () => {
  const user = ref({
    id: null
  })

  function setUser(userData) {
    user.value.id = userData.id
  }

  function unsetUser() {
    user.value.id = null
    localStorage.clear()
  }

  return { user, setUser, unsetUser }
})