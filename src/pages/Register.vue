<template>
    <div class="auth-wrapper">
        <form @submit.prevent="register" class="auth-form">
            <div class="text-center mb-4">
                <i class="bi bi-person-plus-fill auth-icon"></i>
                <h1 class="auth-title">Create Account</h1>
                <p class="auth-subtitle">Start your fitness journey today</p>
            </div>

            <div class="mb-3">
                <label for="email" class="form-label">
                    <i class="bi bi-envelope me-2"></i>Email address
                </label>
                <input 
                    type="email" 
                    class="form-control" 
                    id="email"
                    placeholder="Enter your email" 
                    required
                    v-model="email"
                />
            </div>

            <div class="mb-3">
                <label for="password" class="form-label">
                    <i class="bi bi-lock me-2"></i>Password
                </label>
                <input 
                    type="password" 
                    class="form-control" 
                    id="password"
                    placeholder="Enter your password" 
                    required
                    v-model="password"
                />
            </div>

            <div class="mb-4">
                <label for="confirmPassword" class="form-label">
                    <i class="bi bi-lock-fill me-2"></i>Confirm Password
                </label>
                <input 
                    type="password" 
                    class="form-control" 
                    id="confirmPassword"
                    placeholder="Confirm your password" 
                    required
                    v-model="confirmPassword"
                />
            </div>

            <button :disabled="!isActive" type="submit" class="btn w-100" :class="isActive ? 'btn-primary' : 'btn-disabled'">
                <i class="bi bi-check-circle me-2"></i>Register
            </button>
            
            <div class="text-center mt-3">
                <span class="text-muted">Already have an account?</span>
                <router-link to="/login" class="auth-link ms-2">Login here</router-link>
            </div>
        </form>
    </div>       
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import axios from 'axios';

import { useUserStore } from '@/stores/user';

const notyf = new Notyf();
const router = useRouter();
const userStore = useUserStore();

const email = ref('');
const password = ref('');
const confirmPassword = ref('');

const isActive = computed(() => {
    return email.value !== '' && password.value !== '' && confirmPassword.value !== '' && password.value === confirmPassword.value;
});

function register() {
    axios.post('/users/register', {
        email: email.value,
        password: password.value
    })
    .then(response => {
        notyf.success('Registration Successful');
        email.value = '';
        password.value = '';
        confirmPassword.value = '';
        router.push('/login');
    })
    .catch(error => {
        console.error(error);
        const message = error.response?.data?.message || 'Registration failed';
        notyf.error(message);
    });
}

onMounted(() => {
    if (userStore.user.id) {
        router.push('/workouts');
    }
});
</script>

<style scoped>
.auth-wrapper {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.auth-form {
    width: 100%;
    max-width: 420px;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(10px);
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(79, 195, 247, 0.15);
}

.auth-icon {
    font-size: 3rem;
    color: #4fc3f7;
    margin-bottom: 1rem;
}

.auth-title {
    color: #e8eaf6;
    font-weight: 700;
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
}

.auth-subtitle {
    color: #b0bec5;
    font-size: 0.95rem;
    margin-bottom: 0;
}

.form-label {
    color: #e8eaf6;
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
}

.form-control {
    background: rgba(255, 255, 255, 0.05);
    border: 1.5px solid rgba(79, 195, 247, 0.2);
    color: #e8eaf6;
    padding: 0.65rem 0.9rem;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
}

.form-control:focus {
    background: rgba(255, 255, 255, 0.08);
    border-color: #4fc3f7;
    color: #e8eaf6;
    box-shadow: 0 0 0 3px rgba(79, 195, 247, 0.1);
}

.form-control::placeholder {
    color: rgba(176, 190, 197, 0.5);
}

.btn {
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    border: none;
    transition: all 0.3s ease;
}

.btn-primary {
    background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
    box-shadow: 0 4px 12px rgba(30, 136, 229, 0.3);
}

.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(30, 136, 229, 0.4);
    background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
}

.btn-disabled {
    background: rgba(66, 66, 66, 0.5);
    color: rgba(255, 255, 255, 0.4);
    cursor: not-allowed;
}

.text-muted {
    color: #b0bec5 !important;
    font-size: 0.9rem;
}

.auth-link {
    color: #4fc3f7;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
}

.auth-link:hover {
    color: #81d4fa;
}
</style>
