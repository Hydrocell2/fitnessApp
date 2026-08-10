<script setup>
  import { onMounted, computed } from "vue";
  import { RouterView, useRouter, useRoute } from "vue-router";
  import { useUserStore } from "@/stores/user";
  import axios from "axios";

  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();

  const isAuthenticated = computed(() => {
    return userStore.user.id || localStorage.getItem('token');
  });

  const isAuthPage = computed(() => {
    return route.path === '/login' || route.path === '/register';
  });

  function logout() {
    userStore.unsetUser();
    router.push('/login');
  }

  onMounted(() => {
    const token = localStorage.getItem('token');
    if (token && !userStore.user.id) {
      axios.get('/users/details', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(response => {
        userStore.setUser({
          id: response.data._id
        });
      })
      .catch(error => {
        console.error(error);
        localStorage.removeItem('token');
      });
    }
  });
</script>

<template>
  <div class="app-container">
    <nav v-if="isAuthenticated && !isAuthPage" class="navbar navbar-expand-lg navbar-dark">
      <div class="container">
        <router-link to="/workouts" class="navbar-brand">
          <i class="bi bi-heart-pulse-fill me-2"></i>Fitness Tracker
        </router-link>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto">
            <li class="nav-item">
              <router-link to="/workouts" class="nav-link">
                <i class="bi bi-list-check me-1"></i>My Workouts
              </router-link>
            </li>
            <li class="nav-item">
              <router-link to="/add-workout" class="nav-link">
                <i class="bi bi-plus-circle me-1"></i>Add Workout
              </router-link>
            </li>
            <li class="nav-item ms-2">
              <button @click="logout" class="btn btn-logout">
                <i class="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="main-content">
      <div class="container">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: linear-gradient(135deg, #0a0e27 0%, #162447 50%, #1f4068 100%);
  background-attachment: fixed;
  min-height: 100vh;
  color: #e8eaf6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 15px;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem 0;
}

.navbar {
  background: rgba(10, 14, 39, 0.95) !important;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(79, 195, 247, 0.1);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
  padding: 0.75rem 0;
}

.navbar-brand {
  font-size: 1.3rem;
  font-weight: 700;
  color: #4fc3f7 !important;
  letter-spacing: -0.5px;
  transition: all 0.3s ease;
}

.navbar-brand:hover {
  color: #81d4fa !important;
}

.navbar-brand i {
  font-size: 1.4rem;
}

.nav-link {
  color: #b0bec5 !important;
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  padding: 0.5rem 1rem !important;
  border-radius: 8px;
  margin: 0 0.25rem;
}

.nav-link:hover {
  color: #4fc3f7 !important;
  background: rgba(79, 195, 247, 0.1);
}

.nav-link.router-link-active {
  color: #4fc3f7 !important;
  background: rgba(79, 195, 247, 0.15);
}

.btn-logout {
  background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
  color: white;
  border: none;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(30, 136, 229, 0.3);
}

.btn-logout:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(30, 136, 229, 0.4);
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
}

.container {
  max-width: 1140px;
}
</style>
