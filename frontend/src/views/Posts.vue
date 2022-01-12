<template>
  <div>
    <p v-if="authentified || Token == null" class="authentified">
      {{ authentified }}
    </p>
    <div v-else class="all">
      <div class="bar-nav">
        <p class="bienvenue">Bienvenue chez</p>
        <img src="../assets/iconlogoleft.png" width="200" height="50" alt="" />
      </div>

      <all-publications :userConnected="userConnected"> </all-publications>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import AllPublications from "../components/AllPublications.vue";

export default {
  name: "Posts",

  components: {
    AllPublications,
  },

  data() {
    return {
      userConnected: {},
      authentified: "",
      Token: null,
    };
  },

  created() {
    this.getUserConnected();
  },

  methods: {
    //--1/----  Afficher l'utilisateur connecté
    async getUserConnected() {
      this.Token = JSON.parse(localStorage.getItem("Token"));
      if (this.Token) {
        this.userId = this.Token.userId;
        try {
          const response = await axios.get(
            "http://localhost:3000/api/users/userConnected/" + this.userId,
            {
              headers: {
                authorization: `bearer ${this.Token.token}`,
              },
            }
          );

          // Si requête non authentifiée
          if (response.data.disconnected) {
            this.authentified = response.data.disconnected;
            // Si requête authentifiée
          } else {
            this.userConnected = response.data[0];
            this.$store.commit("USER_CONNECTED");
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        this.authentified = " Merci de vous connecter d'abord !";
      }
    },

    /////////// fin getUserConnected //////

    ///// Fin methods ////////
  },
  //////// Fin Export///////////
};
</script>

<style scoped>
.authentified {
  color: red;
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