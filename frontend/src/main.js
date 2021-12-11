
import { createApp } from 'vue'


//import Vue from 'vue'
import App from './App.vue'
import router from './router';


// Vue.config.productionTip=false;
/*
// Nouvelle instance Vue eventBus
/*
export const eventBus= new Vue({
    data () {
        return {
        isConnected:false
        }
    }
})/**/



createApp(App).use(router).use(router).mount('#app')

