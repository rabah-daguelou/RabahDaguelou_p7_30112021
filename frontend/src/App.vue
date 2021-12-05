<template >
  <div class="all">
    
   <navigation :isConnected="isConnected" class="navigation"> </navigation>
  <router-view/>
    
  </div>

</template>

<script>
import Navigation from './components/Navigation.vue'
// import Login from "./views/Login.vue";

export default {
  components: { Navigation },
  name: 'App',
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
