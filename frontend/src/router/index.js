import { createRouter, createWebHashHistory} from 'vue-router';
import Login from '@/views/Login.vue';
import Users from '@/views/Users.vue';
import Posts from '@/views/Posts.vue';
import Profil from '@/views/Profil.vue';

//---- Les routes --- //
const routes= [

    //--- Vue Login Accueil
    {
        name:'Login',
        path:'/',
        component:Login
    },

    //--- Vue Utilisateurs
    {
        name:'Users',
        path:'/Users',
        component:Users,
    },

    // --- Vue forum ( Les publications )
    {
        name:'Posts',
        path:'/Posts',
        component:Posts
    },

    // ---- Vue Le profil d'un utilisateur 
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