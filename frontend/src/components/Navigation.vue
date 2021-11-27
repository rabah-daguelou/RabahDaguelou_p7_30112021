
<template>
  <div>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <div class="img">
          <router-link to="/"> <img class="navbar-brand" src="../assets/iconlogomonochrome1.png" /></router-link>
          
        </div>
        <button
          type="button"
          class="navbar-toggle collapsed"
          data-toggle="collapse"
          data-target="#bs-example-navbar-collapse-1"
          aria-expanded="false"
        >
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
      </div>
      <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
        <ul class="nav navbar-nav navbar-right">

          <li aria-label=" Se connecter" class="infobulle">
            <router-link to="/"><i class="fas fa-plug"></i></router-link>
          </li>
          
          <li  aria-label=" Forum" class="infobulle">
            <router-link to="/Posts"><img src="../assets/icon.png" width="24" alt=""></router-link>
            
          </li>

          <li aria-label=" Utilisateurs" class="infobulle">
            <router-link  @click="isConnected" v-if="isDeconnected==flase" to="/Users"> <i class="fas fa-users"></i></router-link>
            <router-link v-else to="/"> <i class="fas fa-users"></i></router-link>
          </li>

          <li aria-label=" Mon profil" class="infobulle">
            <router-link  @click="isConnected" v-if="isDeconnected==false" to="/Profil/:id">
              <i class="fas fa-user-tie"></i>
            </router-link>
            <router-link v-else to="/">
              <i class="fas fa-user-tie"></i>
            </router-link>
          </li>


          <li  aria-label=" Se déconnecter" class="infobulle">
            <router-link @click="deconnected" to="/"
              ><i class="fas fa-sign-out-alt"></i
            ></router-link>
          </li>
        </ul>
      </div>
    </div>
  </nav>
  <!--
  <p v-if="isDeconnected" class="isDeconnected"> Vous êtes déconnecté! Merci de vous connecter d'abord.</p>
  -->
</div>
</template>

<script>
export default {
  name: "Navigation",
  components: {},
 /*
 data (){
    return{
      isDeconnected:false,
    }
  },

  methods:{

    deconnected(){
      localStorage.clear();
      this.isDeconnected==true;
    },

    isConnected(){
      const Token = JSON.parse(localStorage.getItem("Token"));
      const self=this
      console.log ( "Token: ", Token)
      if (Token){
        self.isDeconnected=false;
        console.log( " isDeconnected: ", self.isDeconnected)
      } else {
        self.isDeconnected=true;
        console.log( " isDeconnected: ", self.isDeconnected)

      }
    }
  },*/
  
};
</script>

<style scoped>
body {
  background:#ffd7d7;
  text-align: right;
}

li {
  margin-right: 15px;
}
.isDeconnected {
  color:red;
}
</style>
