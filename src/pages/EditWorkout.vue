<template>
    <div class="form-wrapper">
        <div class="form-container">
            <div class="form-header">
                <i class="bi bi-pencil-square form-icon"></i>
                <h1>Edit Workout</h1>
                <p class="form-subtitle">Update your workout details</p>
            </div>
            
            <form @submit.prevent="updateWorkout">
                <div class="mb-3">
                    <label for="name" class="form-label">
                        <i class="bi bi-dumbbell me-2"></i>Workout Name
                    </label>
                    <input 
                        type="text" 
                        class="form-control" 
                        id="name"
                        placeholder="e.g., Morning Run, Chest Day" 
                        required
                        v-model="name"
                    />
                </div>

                <div class="mb-4">
                    <label for="duration" class="form-label">
                        <i class="bi bi-stopwatch me-2"></i>Duration
                    </label>
                    <input 
                        type="text" 
                        class="form-control" 
                        id="duration"
                        placeholder="e.g., 30 mins, 1 hour" 
                        required
                        v-model="duration"
                    />
                </div>

                <div class="form-actions">
                    <button :disabled="!isActive" type="submit" class="btn btn-primary" :class="{'btn-disabled': !isActive}">
                        <i class="bi bi-check-circle me-2"></i>Update Workout
                    </button>
                    <router-link to="/workouts" class="btn btn-secondary">
                        <i class="bi bi-x-circle me-2"></i>Cancel
                    </router-link>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { Notyf } from 'notyf';
import axios from 'axios';

import { useUserStore } from '@/stores/user';

const notyf = new Notyf();
const router = useRouter();
const route = useRoute();
const userStore = useUserStore();

const name = ref('');
const duration = ref('');
const workoutId = ref('');

const isActive = computed(() => {
    return name.value !== '' && duration.value !== '';
});

function fetchWorkout() {
    const token = localStorage.getItem('token');
    if (!token) {
        notyf.error('Please login first');
        router.push('/login');
        return;
    }

    axios.get('/workouts/getMyWorkouts', {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        const workouts = response.data.workouts || response.data;
        const workout = workouts.find(w => w._id === route.params.id);
        if (workout) {
            name.value = workout.name;
            duration.value = workout.duration;
            workoutId.value = workout._id;
        } else {
            notyf.error('Workout not found');
            router.push('/workouts');
        }
    })
    .catch(error => {
        console.error(error);
        notyf.error('Failed to fetch workout');
        router.push('/workouts');
    });
}

function updateWorkout() {
    const token = localStorage.getItem('token');
    if (!token) {
        notyf.error('Please login first');
        router.push('/login');
        return;
    }

    axios.patch(`/workouts/updateWorkout/${workoutId.value}`, {
        name: name.value,
        duration: duration.value
    }, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        notyf.success('Workout updated successfully');
        router.push('/workouts');
    })
    .catch(error => {
        console.error(error);
        const message = error.response?.data?.message || 'Failed to update workout';
        notyf.error(message);
    });
}

onMounted(() => {
    if (!userStore.user.id && !localStorage.getItem('token')) {
        router.push('/login');
    } else {
        fetchWorkout();
    }
});
</script>

<style scoped>
.form-wrapper {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 60vh;
    padding: 1rem;
}

.form-container {
    width: 100%;
    max-width: 550px;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(10px);
    padding: 2.5rem;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(79, 195, 247, 0.15);
}

.form-header {
    text-align: center;
    margin-bottom: 2rem;
}

.form-icon {
    font-size: 2.5rem;
    color: #4fc3f7;
    margin-bottom: 1rem;
}

.form-container h1 {
    color: #e8eaf6;
    font-weight: 700;
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
}

.form-subtitle {
    color: #b0bec5;
    font-size: 0.95rem;
    margin: 0;
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

.form-actions {
    display: flex;
    gap: 0.75rem;
    margin-top: 1.5rem;
}

.btn {
    flex: 1;
    padding: 0.7rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    border: none;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
}

.btn-primary {
    background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(30, 136, 229, 0.3);
}

.btn-primary:hover:not(.btn-disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(30, 136, 229, 0.4);
    background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
}

.btn-disabled {
    background: rgba(66, 66, 66, 0.5) !important;
    color: rgba(255, 255, 255, 0.4) !important;
    cursor: not-allowed !important;
    transform: none !important;
}

.btn-secondary {
    background: rgba(176, 190, 197, 0.15);
    color: #b0bec5;
    border: 1px solid rgba(176, 190, 197, 0.2);
}

.btn-secondary:hover {
    background: rgba(176, 190, 197, 0.25);
    color: #e8eaf6;
    transform: translateY(-1px);
}
</style>
