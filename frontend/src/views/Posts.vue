<template>
  <div>
    <p v-if="authentified || Token==null" class="authentified"> {{ authentified }}</p>
    <div v-else class="all">

        <div class="bar-nav">
        <p class="bienvenue">Bienvenue chez</p>
        <img src="../assets/iconlogoleft.png" width="200" height="50" alt="" />
        </div>
      <!-- Publier un post -->
      

      <!-- Fin publier un post --> 
    
    <!--    <PublishPost v-if="userConnected" :userConnected="userConnected"> </PublishPost> -->
        <all-publications :userConnected="userConnected"> </all-publications>
    
    </div>
  </div>
</template>

<script>
import axios from 'axios';
//import PublishPost from "../components/PublishPost.vue"
import AllPublications from "../components/AllPublications.vue"

export default {
    name:"Posts",

    components: {
      //  PublishPost,
        AllPublications,
    },
    data() {
        return {
            userConnected: {},
            authentified:"",
            Token:null,
        }
    },
  
    mounted() {
    this.getUserConnected();
    
    //this.connexion();
  },

    methods: {
   
   //// Get the User connected
    async getUserConnected() {
      
      this.Token = JSON.parse(localStorage.getItem("Token"));
      if (this.Token) {
      console.log("Token:", this.Token);
      this.userId = this.Token.userId;
      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/userConnected/" + this.userId,{
        headers: {
           authorization: `bearer ${this.Token.token}`,
          },
          
          })
        
        // Si requête non authentifiée
       if (response.data.message){
         this.authentified=response.data.message;
        // Si requête authentifiée
       } else {
        this.userConnected=response.data[0];
        console.log ("User Connected: ", this.userConnected)
       
       }
                
      } catch (err) {
        console.log(err);
      }
      }else {
        this.authentified=" Merci de vous connecter d'abord !"
      }
    },

    /////////// fin getUserConnected //////

    ///// Fin methods ////////    
   }
//////// Fin Export///////////
}


</script>

<style scoped>
.authentified {
  color:red;
  font-weight: bold;
  
}
.all {
  margin: auto;
  text-align: center;
}
.bar-nav {
  width: 100%;
  height: 50px;
  background: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
.bienvenue {
  margin-right: 20px;
}
</style>