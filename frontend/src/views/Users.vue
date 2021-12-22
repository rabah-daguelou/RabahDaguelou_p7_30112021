<template>
  <div class="all">
    <div v-if="authentified || Token==null" class="authentified"> {{ authentified }}</div>
    <div v-else>
    <h1>Liste des salariés</h1>

    <!-- Bouton de recherche -->
    <input v-model="searchUser" type="text" placeholder="Chercher un utilisateur">
    <p> {{ searchUser }}</p>
    <!-- -->

    <div class="usersList">
      <div v-for="user in users" :key="user.userId">
        
      <router-link :to="{ name: 'Profil', params: { id: user.userId } }">
          <div class="userCard">
        <img v-if="user.profil_picture"
          :src="require(`./../../../backend/images/${user.profil_picture}`)"
          width="200"
          alt=""
        />  
        <img v-else src="../assets/icon.png" alt="" />
            
            <p>{{ user.name }}</p>
            <p v-if="user.isAdmin==1" class="identifiant"> Administrateur </p>
          </div>
      </router-link> 

      </div>
    </div>
  </div> 
</div>
 
</template>

<script>
import axios from "axios";

export default {
  name: "Users",
   
  data() {
    return {
      users: [],
      authentified:"",
      Token:null,
      searchUser:""
    };
  },

  created() {
    this.getAllUsers();
 },
  computed(){
    this.users=[this.searchUser]
  },
  methods: {
    // Get all users
    getAllUsers() {
     this.Token = JSON.parse(localStorage.getItem("Token"));
      if (this.Token){
      axios
        .get("http://localhost:3000/api/users",
       {
          headers:
          {
            authorization: `bearer ${this.Token.token}`,
          }
        })
        .then((res) => {
          console.log('Liste des salariés:' , res.data);
          
           if (res.data.message){
           // console.log ("Requête non authentifié:", this.publications.message);
            this.authentified=res.data.message
          // Si requête authentifiée
          } else {
            this.users = res.data;
            console.log("Requête authentifiée: Liste des salariés:", this.users);
          }
        })
        .catch((err) => {
          console.log(err);
        });
      } else {
        this.authentified=" Merci de vous connecter d'abord !"
      }
    },

    //
  },
};
</script>


<!--   Style --->

<style scoped>
.btn {
  background: #000;
  color: #fff;
  margin: 20px;
}
.usersList {
  display: flex;
  justify-content: space-evenly;
  flex-direction: row;
  flex-wrap: wrap;
}
.userCard {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 140px;
  margin: 20px;
  box-sizing: border-box;
  padding-top: 15px;
  border-radius: 15px;
  background: rgb(255, 255, 255);
  box-shadow: 2px 2px 5px black;
  padding: 5px;
  transition: transform .4s;
}
.userCard:hover {
  transform: scale(1.3);
  background: rgb(212, 209, 212);
}

img {
  margin-bottom: 5px;
  width: 70px;
  height: 70px;
  border-radius: 35px;
  box-shadow: 2px 1px 2px black;
}
.identifiant {
  font-size: .7em;
}
p, h1 {
  color: black;
  text-decoration: none;
  text-shadow: 1px 1px 1px rgb(100, 98, 98);
  font-family: cursive;
}
.authentified {
  color:red;
  font-weight: bold;
}
</style>