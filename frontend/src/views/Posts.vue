<template>
    <div class="all">

        <div class="bar-nav">
        <p class="bienvenue">Bienvenue chez</p>
        <img src="../assets/iconlogoleft.png" width="200" height="50" alt="" />
        </div>
      <!-- Publier un post -->
      

      <!-- Fin publier un post --> 
    
    <!--    <PublishPost v-if="userConnected" :userConnected="userConnected"> </PublishPost> -->
        <all-publications :userConnected="userConnected"> </all-publications>
    
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
        }
    },
    
    mounted() {
    this.getUserConnected();
    
  },

    methods: {
        
        //// Get the User connected
    async getUserConnected() {
      let Token = JSON.parse(localStorage.getItem("Token"));
      console.log("Token:", Token);
      this.userId = Token.userId;
      try {
        const response = await axios.get(
          "http://localhost:3000/api/users/userConnected/" + this.userId,{
        headers: {
           authorization: `bearer ${Token.token}`,
          },
          
          })
        this.userConnected=response.data[0];
        console.log ("User Connected: ", this.userConnected)
        
      } catch (err) {
        console.log(err);
      }
    },

    /////////// fin getUserConnected //////

    ///// Fin methods ////////    
   }
//////// Fin Export///////////
}


</script>

<style scoped>
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