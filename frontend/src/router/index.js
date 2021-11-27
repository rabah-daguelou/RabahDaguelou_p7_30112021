import { createRouter, createWebHashHistory} from 'vue-router';
import Login from '@/views/Login.vue';
import Users from '@/views/Users.vue';
import Posts from '@/views/Posts.vue';
import Profil from '@/views/Profil.vue';


const routes= [
    {
        name:'Login',
        path:'/',
        component:Login
    },
    
    {
        name:'Users',
        path:'/Users',
        component:Users,
    },
    {
        name:'Posts',
        path:'/Posts',
        component:Posts
    },
    {
        name:'Profil',
        path:'/Profil/:id',
        component:Profil
    },
    
];

const router= createRouter({
    history:createWebHashHistory(),
    routes,
})

export default router;