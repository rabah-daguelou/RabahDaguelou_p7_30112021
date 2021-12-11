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
  components: { Navigation },
  name: 'App',
  data (){
    return {
      isConnected:false
    }
  },

  created(){
   // this.isConnected=eventBus.isConnected;
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
