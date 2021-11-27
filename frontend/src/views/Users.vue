<template>
  <div class="all">
    <h1>Liste des salariés</h1>
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
            <p class="identifiant"> Identifiant: {{ user.userId }}</p>
          </div>
      </router-link> 
      </div>
    </div>
  </div>
 
</template>

<script>
import axios from "axios";

export default {
  name: "Users",
  components: {},
  
  data() {
    return {
      users: [],
    };
  },

  created() {
    this.getAllUsers();
  },

  methods: {
    // Get all users
    getAllUsers() {
      axios
        .get("http://localhost:3000/api/users")
        .then((res) => {
          console.log('Liste des salariés:' , res.data);
          this.users = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    //
  },
};
</script>


<!--   Style --->

<style scoped>
.all {
  text-align: center;
  margin: auto;
}
.btn {
  background: #000;
  color: #fff;
  margin: 20px;
}
.usersList {
  display: flex;
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
}
img {
    margin-bottom: 5px;
  width: 70px;
  height: 70px;
  
  border-radius: 35px;
}
.identifiant {
  font-size: .7em;
}
p, h1 {
  color: black;
  text-decoration: none;
  text-shadow: 1px 1px 1px rgb(100, 98, 98);
}
</style>