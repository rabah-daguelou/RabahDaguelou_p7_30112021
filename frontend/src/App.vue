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
  //  
  if (JSON.parse(localStorage.getItem("Token"))) {
    this.Token=JSON.parse(localStorage.getItem("Token"))
    this.$store.commit("CONNEXION")
    this.$store.commit("USER_CONNECTED") 
    }
    console.log ("isConnected:", this.isConnected)
  },
  computed(){
    //this.$store.commit("USER_CONNECTED")
    this.isConnected==this.$store.state.userConnected
    //this.$store.commit("CONNEXION")
  }

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
