<template >
  <div class="all">
    
   <navigation class="navigation"> </navigation>
  <router-view/>
    
  </div>

</template>

<script>
import Navigation from './components/Navigation.vue'
// import Login from "./views/Login.vue";

export default {
  components: { Navigation },
  name: 'App',
 /*
  components: {
    Login
  }*/
  
}
</script>

<style scoped>
.all{
  
  background:#ffd7d7;
}
.navigation {
  text-align: right;
}

</style>
