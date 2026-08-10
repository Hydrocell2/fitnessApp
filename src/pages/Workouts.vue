<template>
    <div class="workouts-container">
        <div class="page-header">
            <h1><i class="bi bi-list-check me-2"></i>My Workouts</h1>
            <router-link to="/add-workout" class="btn btn-primary">
                <i class="bi bi-plus-circle me-2"></i>Add Workout
            </router-link>
        </div>
        
        <div v-if="workouts.length === 0" class="empty-state">
            <i class="bi bi-clipboard-x empty-icon"></i>
            <h3>No workouts yet</h3>
            <p>Start your fitness journey by adding your first workout!</p>
            <router-link to="/add-workout" class="btn btn-primary mt-2">
                <i class="bi bi-plus-circle me-2"></i>Create Your First Workout
            </router-link>
        </div>

        <div v-else class="workouts-grid">
            <div v-for="workout in workouts" :key="workout._id" class="workout-card">
                <div class="workout-header">
                    <h5 class="workout-name">
                        <i class="bi bi-dumbbell me-2"></i>{{ workout.name }}
                    </h5>
                    <span class="workout-status" :class="workout.status === 'completed' ? 'status-completed' : 'status-pending'">
                        <i :class="workout.status === 'completed' ? 'bi bi-check-circle-fill' : 'bi bi-clock-fill'"></i>
                        {{ workout.status }}
                    </span>
                </div>
                <div class="workout-body">
                    <div class="workout-info">
                        <i class="bi bi-stopwatch me-2"></i>
                        <span>{{ workout.duration }}</span>
                    </div>
                </div>
                <div class="workout-actions">
                    <button v-if="workout.status !== 'completed'" @click="completeWorkout(workout._id)" class="btn btn-success btn-sm">
                        <i class="bi bi-check-lg me-1"></i>Complete
                    </button>
                    <router-link :to="`/edit-workout/${workout._id}`" class="btn btn-warning btn-sm">
                        <i class="bi bi-pencil me-1"></i>Edit
                    </router-link>
                    <button @click="deleteWorkout(workout._id)" class="btn btn-danger btn-sm">
                        <i class="bi bi-trash me-1"></i>Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Notyf } from 'notyf';
import axios from 'axios';

import { useUserStore } from '@/stores/user';

const notyf = new Notyf();
const router = useRouter();
const userStore = useUserStore();

const workouts = ref([]);

function fetchWorkouts() {
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
        workouts.value = response.data.workouts || response.data;
    })
    .catch(error => {
        console.error(error);
        notyf.error('Failed to fetch workouts');
    });
}

function completeWorkout(id) {
    const token = localStorage.getItem('token');
    
    axios.patch(`/workouts/completeWorkoutStatus/${id}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        notyf.success('Workout marked as complete');
        fetchWorkouts();
    })
    .catch(error => {
        console.error(error);
        notyf.error('Failed to update workout');
    });
}

function deleteWorkout(id) {
    const token = localStorage.getItem('token');
    
    axios.delete(`/workouts/deleteWorkout/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        notyf.success('Workout deleted');
        fetchWorkouts();
    })
    .catch(error => {
        console.error(error);
        notyf.error('Failed to delete workout');
    });
}

onMounted(() => {
    if (!userStore.user.id && !localStorage.getItem('token')) {
        router.push('/login');
    } else {
        fetchWorkouts();
    }
});
</script>

<style scoped>
.workouts-container {
    max-width: 1000px;
    margin: 0 auto;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
}

.page-header h1 {
    color: #e8eaf6;
    font-weight: 700;
    font-size: 1.75rem;
    margin: 0;
}

.btn-primary {
    background: linear-gradient(135deg, #1e88e5 0%, #1565c0 100%);
    border: none;
    padding: 0.65rem 1.25rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.9rem;
    box-shadow: 0 2px 8px rgba(30, 136, 229, 0.3);
    transition: all 0.3s ease;
    color: white;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
}

.btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(30, 136, 229, 0.4);
    background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
    color: white;
}

.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: rgba(15, 23, 42, 0.4);
    border-radius: 16px;
    border: 1px solid rgba(79, 195, 247, 0.1);
}

.empty-icon {
    font-size: 4rem;
    color: #4fc3f7;
    opacity: 0.6;
    margin-bottom: 1rem;
}

.empty-state h3 {
    color: #e8eaf6;
    font-weight: 600;
    margin-bottom: 0.5rem;
}

.empty-state p {
    color: #b0bec5;
    margin-bottom: 1.5rem;
}

.workouts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.25rem;
}

.workout-card {
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(79, 195, 247, 0.15);
    border-radius: 12px;
    padding: 1.25rem;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.workout-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(79, 195, 247, 0.15);
    border-color: rgba(79, 195, 247, 0.3);
}

.workout-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
    gap: 0.75rem;
}

.workout-name {
    color: #e8eaf6;
    font-weight: 700;
    font-size: 1.1rem;
    margin: 0;
    flex: 1;
}

.workout-status {
    padding: 0.35rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: capitalize;
    white-space: nowrap;
}

.status-completed {
    background: rgba(76, 175, 80, 0.2);
    color: #66bb6a;
    border: 1px solid rgba(76, 175, 80, 0.3);
}

.status-pending {
    background: rgba(255, 167, 38, 0.2);
    color: #ffa726;
    border: 1px solid rgba(255, 167, 38, 0.3);
}

.workout-body {
    margin-bottom: 1rem;
}

.workout-info {
    color: #b0bec5;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
}

.workout-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.btn-sm {
    padding: 0.5rem 0.9rem;
    border-radius: 6px;
    font-weight: 600;
    font-size: 0.85rem;
    border: none;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
}

.btn-success {
    background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
    color: white;
    box-shadow: 0 2px 6px rgba(67, 160, 71, 0.3);
}

.btn-success:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(67, 160, 71, 0.4);
    background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
}

.btn-warning {
    background: linear-gradient(135deg, #fb8c00 0%, #e65100 100%);
    color: white;
    box-shadow: 0 2px 6px rgba(251, 140, 0, 0.3);
    text-decoration: none;
}

.btn-warning:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(251, 140, 0, 0.4);
    background: linear-gradient(135deg, #ff9800 0%, #ef6c00 100%);
    color: white;
}

.btn-danger {
    background: linear-gradient(135deg, #e53935 0%, #b71c1c 100%);
    color: white;
    box-shadow: 0 2px 6px rgba(229, 57, 53, 0.3);
}

.btn-danger:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(229, 57, 53, 0.4);
    background: linear-gradient(135deg, #f44336 0%, #c62828 100%);
}
</style>
