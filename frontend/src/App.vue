<template >
  <div class="all">
    
   <navigation class="navigation"> </navigation>
   
   <router-view />
    
  </div>

</template>

<script>
import Navigation from './components/Navigation.vue';

//import {eventBus} from './main';


export default {
  name: 'App',
  
  components: { 
    Navigation,
    
  },
  
  data (){
    return {
      isConnected:false
    }
  },

  created(){
    this.$store.commit("CONNEXION")
    console.log ("isConnected:", this.isConnected)
  },

}
</script>

<style scoped>

body {
  height: 100vh;
}
.all{
  
  background:#ffd7d7;
}
.navigation {
  text-align: right;
}

</style>
