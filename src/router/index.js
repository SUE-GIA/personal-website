import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('../layouts/DefaultLayout.vue'),
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('../pages/HomePage.vue'),
            },
        ],
    },
]

export default createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})