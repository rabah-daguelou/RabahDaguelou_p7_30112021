
<template>
  <div>
  <nav class="navbar navbar-default">
    <div class="container-fluid">
      <div class="navbar-header">
        <div class="img">
          <router-link to="/"> <img class="navbar-brand" src="../assets/logo1.png" /></router-link>
          
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

          <li v-if="!$store.state.isConnected" my_title=" Se connecter" class="infobulle">
            <router-link to="/"><i class="fas fa-plug"></i></router-link>
          </li>
         

         
          <li my_title=" Forum" class="infobulle">
            <router-link to="/Posts"> <img src="../assets/icon.png" alt="" width="23"> </router-link>
          </li>

          <li my_title=" Utilisateurs" class="infobulle">
            <router-link to="/Users"> <i class="fas fa-users"></i></router-link>
            
          </li>

          <li my_title=" Mon profil" class="infobulle">
             <router-link :to="{ name: 'Profil', params: { id: userId } }">
            <!--
            <router-link to="/Profil/:id">
            -->
              <i class="fas fa-user-tie"></i>
            </router-link>
            
          </li>

          <li v-if="$store.state.isConnected" @click="deconnected" my_title=" Se déconnecter" class="infobulle">
            <router-link to="/"
              ><i class="fas fa-sign-out-alt"></i
            ></router-link>
          </li>
         
         </ul>
      </div>
    </div>
  </nav>
  <p> isConnected: {{ $store.state.isConnected}}</p>
</div>

</template>

<script>
//import Login from '../views/Login.vue';
export default {
  name: "Navigation",
  //components: { Login },
  data (){
    return{
      userId:"null",
      Token:""
    }
  },
  
  created(){
    this.$store.commit("CONNEXION")
    if (JSON.parse(localStorage.getItem("Token"))) {
      this.userId=JSON.parse(localStorage.getItem("Token")).userId
      
      console.log(" isConnected: ", this.$store.state.isConnected )
      console.log("Utilisateur connecté:", this.userId)
    }
    
  },

  methods:{
    deconnected(){
      localStorage.removeItem("Token");
      //location.reload()
      this.$store.commit("DECONNEXION")
    },
  
  }
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
li i {
  color:#ffd7d7;
  text-shadow: 1px 1px 10px black;
}
.isDeconnected {
  color:red;
}
.infobulle img {
  border-radius: 50%;
  box-shadow: 1px 1px 10px black;
  margin-right: 8px;
}
/* --------- Les infos-bulles ------------ */
[my_title] {
    position: relative;
}
[my_title]:hover:after {
    opacity: 1;
    transition: all 0.1s ease 0.5s;
    visibility: visible;
}
[my_title]:after {
    content: attr(my_title);
    position: absolute;
    bottom: 10px;
    right:60px;
    visibility: hidden;
    font-family: cursive;
    font-weight: 600;
}
[my_title]:after:active{
  visibility: hidden;
}

@media screen and (min-width: 768px) {
  li {
    width:105px;
    font-size: .9em;
    
  }
  [my_title]:after {
    right:0px;
    bottom: -4px;
    
 }
}
</style>
