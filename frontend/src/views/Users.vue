<template>
  <div class="all">
    <div v-if="authentified || Token == null" class="authentified">
      {{ authentified }}
    </div>
    <div v-else>
      <h1>Liste des salariés</h1>

      <!-- Bouton de recherche -->
      <div class="search">
        <div class="searchInput">
          <input
            v-model="searchKey"
            type="search"
            placeholder="Chercher un utilisateur"
          />
        </div>
        <div class="searchIcone">
          <i class="fas fa-search"></i>
        </div>
      </div>

      <h4 v-if="search.length && !searchKey">
        {{ search.length }} salariés inscrits
      </h4>
      <h4 v-else>{{ search.length }} salariés avec {{ searchKey }}</h4>
      <!-- Fin bouton de recherche -->

      <div class="usersList">
        <div v-for="user in search" :key="user.userId">
          <router-link :to="{ name: 'Profil', params: { id: user.userId } }">
            <div class="userCard">
              <img
                v-if="user.profil_picture"
                :src="
                  require(`./../../../backend/images/${user.profil_picture}`)
                "
                width="200"
                alt=""
              />
              <img v-else src="../assets/icon.png" alt="" />

              <p>{{ user.name }}</p>
              <p v-if="user.isAdmin == 1" class="identifiant">
                Administrateur <i class="admin fas fa-users-cog"></i>
              </p>
              <p v-if="user.isDeleted == 1">
                Compte supprimé
                <span class="deleted">
                  <i class="fas fa-minus-circle"></i
                ></span>
              </p>
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
      authentified: "",
      Token: null,
      searchKey: "",
    };
  },

  created() {
    this.getAllUsers();
  },

  computed: {
    search() {
      return this.users.filter((user) => {
        return user.name.toLowerCase().startsWith(this.searchKey.toLowerCase());
      });
    },
  },

  methods: {
    //---1/ Afficher la liste de tous les utilisateurs //
    getAllUsers() {
      this.Token = JSON.parse(localStorage.getItem("Token"));
      if (this.Token) {
        axios
          .get("http://localhost:3000/api/users", {
            headers: {
              authorization: `bearer ${this.Token.token}`,
            },
          })
          .then((res) => {
            // Si requête non authentifiée
            if (res.data.disconnected) {
              this.authentified = res.data.message;
              localStorage.removeItem("Token");
              this.$store.commit("DECONNEXION");
              // Si requête authentifiée
            } else {
              this.users = res.data;
            }
          })
          .catch((err) => {
            console.log(err);
          });

        // si déconnecté --- pas de token
      } else {
        this.authentified = " Merci de vous connecter d'abord !";
      }
    },
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
  transition: transform 0.4s;
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
  font-size: 0.7em;
}
h1 {
  margin-bottom: 20px;
}
p,
h1 {
  color: black;
  text-decoration: none;
  text-shadow: 1px 1px 1px rgb(100, 98, 98);
  font-family: cursive;
}
.authentified {
  color: red;
  font-weight: bold;
}
.search {
  display: flex;
  justify-content: center;
}
input {
  border: none;
  line-height: 36px;
  text-align: center;
  border-radius: 5px 0px 0px 5px;
}
.searchInput {
  width: 180px;
  height: 40px;
  background: rgb(247, 250, 247);
  border-radius: 5px 0px 0px 5px;
  border: 1px solid #000;
}
i {
  color: #fff;
  padding-left: 10px;
  line-height: 40px;
}
.searchIcone {
  width: 40px;
  height: 40px;
  background: #000;
  border-radius: 0px 5px 5px 0px;
}
.deleted i {
  color: red;
}
.admin {
  color: blue;
}
</style>