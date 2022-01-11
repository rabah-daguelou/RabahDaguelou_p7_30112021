<template>
  <div class="all">

    <!-- Carte du formulaire -->
    <div class="form-card">
      <div class="form-card1">
        <img src="../assets/immeuble.png" alt="" />
      </div>
      <h1 class="title-card" v-if="mode == 'login'">C O N N E X I O N</h1>
      <h1 class="title-card" v-else>I N S C R I P T I O N</h1>

      <div id="input-card">
        <input
          v-model="email"
          class="email"
          type="email"
          placeholder=" Votre E-mail"
          required="required"
        />
      </div>

      <div id="input-card">
        <input
          v-model="password"
          class="password"
          type="password"
          placeholder="Votre mot de passe"
          required="required"
        />
      </div>

      <div id="input-card" v-if="mode == 'signup'">
        <input
          v-model="name"
          class="name"
          type="text"
          placeholder="Votre nom"
          required="required"
        />
      </div>

      <div v-if="errors.length > 0" class="errors">
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>
      <p v-if="passwordForgot"> Mot de passe oublié ?</p>
      <!-- Valider l'inscription et se diriger vers publications -->
      <div id="input-card">
        <div v-if="mode == 'signup'">
          <button @click="createAccount()" class="button">
            Je valide mon compte
          </button>
        </div>

        <div v-else>
          <button
            @keyup.enter="login()"
            @click="login()"
            class="button"
            type="submit"
          >
            Je me connecte
          </button>
        </div>
      </div>

      <div class="have-count">
        <p v-if="mode == 'login'">
          Vous n'avez pas encore de compte?
          <span class="haveNotCount" @click="signupOne()">m'inscrire</span>
        </p>
        <p v-else>
          Vous avez déjà un compte?
          <span class="haveNotCount" @click="loginOne()">me connecter</span>
        </p>
        
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Login",
  data: function () {
    return {
      mode: "login",
      email: null,
      password: null,
      name: null,
      errors: [],
      error: "",
      passwordForgot:false
    };
  },
  
  created: function () {},

  methods: {
    signupOne: function () {
      this.mode = "signup";
      this.errors = [];
    },
   
    loginOne: function () {
      this.mode = "login";
      this.errors = [];
    },

  // 1/----- S'inscrire -----
    async createAccount() {
      if (this.email && this.password && this.name) {
        try {
          const self = this;
          await axios
            .post("http://localhost:3000/api/auth/signup", {
              email: this.email,
              password: this.password,
              name: this.name,
            })
            .then(function (res) {
              
              if (res.data.type == "error") {
                self.errors = [];
                self.errors.push(res.data.message);
              } else {
                self.login();
              }
            })
            .catch(function () {
              console.log("Erreur ! ");
            });
        } catch (err) {
          this.errors.push(err);
        }
      } else {
        this.errors = [];
        if (!this.email) {
          this.errors.push("Le champs Email est requis");
        }
        if (!this.password) {
          this.errors.push("Le champs Mot de passe est requis");
        }
        if (!this.name) {
          this.errors.push("Le champs Nom est requis");
        }
      }
    },

    // --2/----- Se connecter -----
    //
    async login() {
      this.errors=[]
      if (this.email.toLowerCase().startsWith("groupomania")) {
        this.errors.push("Cette adresse email est interdite !");
      } else {
        if (this.email && this.password) {
          try {
            const self = this;
            await axios
              .post("http://localhost:3000/api/auth/login", {
                email: this.email,
                password: this.password,
              })
              .then(function (res) {
                if (res.data.type == "error") {
                  self.errors = [];
                  self.errors.push(res.data.message);
                  if(res.data.passwordForgot){
                    self.passwordForgot=true
                   // self.errors.push("Mot de passe oublié?")
                  }
                } else {
                  localStorage.setItem("Token", JSON.stringify(res.data));
                  self.$store.commit("CONNEXION");
                  self.$store.commit("USER_CONNECTED");
                  self.$router.push("/Posts");
                }
              })
              .catch(function (err) {
                console.log(err);
              });
          } catch (err) {
            console.log(err);
          }
        } else {
          this.errors = [];
          if (!this.email) {
            this.errors.push("Le champs Email est requis");
          }
          if (!this.password) {
            this.errors.push("Le champs Mot de passe est requis");
          }
        }
      }
    },

    //
  },
};
</script>

<style scoped>
.all {
  height: 100vh;
}
li {
  color: red;
  list-style: none;
  
}
.form-card {
  width: 50%;
  padding: 20px;
  background: #031533;
  text-align: center;
  border-radius: 10px 10px;
  color: #fff;
  margin: auto;
}
.form-card img {
  width: 100%;
  border-radius: 5px;
  box-shadow: 2px 2px 5px;
}
#input-card > input,
#input-card > button,
button {
  width: 80%;
  height: 50px;
  margin-bottom: 20px;
  text-align: center;
  border-radius: 8px;
  transition: transform 0.2s;
  color: rgb(12, 11, 11);
}
#input-card > input:hover,
button:hover {
  transform: scale(1.1);
}
.haveNotCount {
  font-weight: 900;
  color: rgb(255, 0, 140);
  cursor: pointer;
  font-size: 1em;
}
button {
  background: #ffd7d7;
  color: #000;
  font-weight: 900;
}
input:focus {
  color: black;
  font-size: 1.2em;
  font-weight: bold;
  outline: none;
  border: 2px dashed green;
}
/* medias queries */
@media screen and (max-width: 769px) {
  .form-card {
    width: 80%;
  }
  h1 {
    font-size: 1.5em;
    text-shadow: 1px 2px 5px #ffd7d7;
  }
}
</style>