import axios from "axios";

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
    baseURL: API_URL
});

// interceptor
api.interceptors.request.use((config) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (userId) {
        config.headers['X-User-ID'] = userId;
    }

    return config;
});

// APIs
export const getActivities = () => api.get('/activities');

export const addActivity = (activity) => api.post('/activities', activity);

export const getActivityDetail = (id) => api.get(`/recommendations/activity/${id}`);

// ✅ NEW: get logged-in user from backend
export const getCurrentUser = () => api.get('/users/me');

export default api;