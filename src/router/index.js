import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login.vue';
import Home from '../components/Accueil.vue';
import SignUp from '../components/SignUp.vue';
import Parkings from '../components/Parkings.vue';
import ParkingDetail from '../components/ParkingDetail.vue';
import AddCar from '../components/AddCar.vue';
import ParkingSession from '../components/ParkingSession.vue';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/signUp',
        name: 'SignUp',
        component: SignUp
    },
    {
        path: '/parkings',
        name: 'Parkings',
        component: Parkings,
        meta: { requiresAuth: true }
    },
    {
        path: '/parking/:id',
        name: 'ParkingDetail',
        component: ParkingDetail,
        props: true,
        meta: { requiresAuth: true }
    },
    {
        path: '/addCar',
        name: 'AddCar',
        component: AddCar,
        meta: { requiresAuth: true }
    },
    {
        path: '/parkingSession',
        name: 'ParkingSession',
        component: ParkingSession,
        meta: { requiresAuth: true }
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

// Garde de navigation globale
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        const token = localStorage.getItem('token');
        if (!token) {
            next({ name: 'Login' }); // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
        } else {
            next(); // Continuer vers la route demandée
        }
    } else {
        next(); // Continuer vers la route demandée
    }
});

export default router;