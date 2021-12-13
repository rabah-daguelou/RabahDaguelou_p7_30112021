<template>
<div class="all">
  <p v-if="authentified || Token==null" class="authentified"> {{ authentified }}</p>
  <!---  <Profil> </Profil>  --->
  <div v-else class="all">
    <h2> Le profil de {{ oneUser.name}}</h2>

    <!-- Profil image / name / Email / is_admin-->
    <div class="user-infos">
      <div>
          
        <img v-if="oneUser.profil_picture"
          :src="require(`./../../../backend/images/${oneUser.profil_picture}`)"
          width="200"
          alt=""
        />  
        <img v-else src="../assets/icon.png" alt="" />
    
    <p class="username" > {{ oneUser.name }} 
      <span v-if="oneUser.isAdmin == 1" my_title="Administrateur"> <i class="fas fa-user-cog"> </i> </span>
    </p>
  
    </div>
      <div class="infos-user">
        <p> Mail: <span>{{ oneUser.email }}</span>  </p>
        <p> Matricule: <span>{{ oneUser.userId }}</span> </p>
        <p v-if="oneUser.isAdmin == 1"> Administrateur </p>
        
      </div>
    </div>
   <!--   -->
  <div>
        <!-- Modifier ou supprimer mon profil -->
    <div v-if="oneUser.userId==Token.userId" class="modify">
    <button v-if="!okDeleteProfil" @click="btnModifyProfil()" class="btn modifyProfil">
       Modifier mon profil &#160;  <i class="fas fa-pen-square"> </i></button>
    <button v-if="!okModifyProfil" class="btn deleteProfil" @click="btnDeleteProfil()">
      <i class="fas fa-user-minus"></i> Supprimer mon profil
    </button>
    
    <!-- Supprimer mon profil -->
    <p v-if="okDeleteProfil && !okModifyProfil" class="attention">
      Attention, la suppression de votre profil est irréversible !!!

      <router-link to="../">
        <button class="btn " @click="deleteOneUser">Supprimer</button>
      </router-link>

      <button class="btn dontDelete" @click="btnDeleteProfil()">Annuler</button>
    </p>

    <!-- Modifier mon Email -->
    
    <div v-if="okModifyProfil && !okDeleteProfil" class="modifyMail">
      <label>Modifier mon Email</label>
      <br>
      <input
        v-model="email2"
        name="email2"
        type="email"
        placeholder="Votre nouvel Email"
      />
      <br>
      <button v-if="email2" @click="updateEmail" class="btn">Valider</button>
        <p v-if="errorEmail2" class="errorEmail2"> {{ errorEmail2 }}</p>

    </div>
    <br />

    <!-- Modifier mon mot de passe -->
    <div v-if="okModifyProfil && !okDeleteProfil" class="modifyPassword">
      <label>Modifier mon mot de passe</label>
      <br />
      <input
        v-model="password1"
        type="password"
        name="password1"
        placeholder=" Ancien mot de passe"
      />
      <input
        v-model="password2"
        type="password"
        placeholder=" Nouveau mot de passe"
        name="password2"
      />
      <input v-if="password2"
        v-model="password3"
        type="password"
        placeholder=" Confirmez votre nouveau mot de passe"
        name="password3"
      />
      <br />
      <button v-if="password3" class="btn" @click="updatePassword">Valider</button>
      
      <p v-if="errorPassword2" class="errorPassword2"> {{ errorPassword2 }}</p>
    </div>
    <br />

    <!-- Modifier mon pseudo -->
    <div v-if="okModifyProfil && !okDeleteProfil" class="modifyPseud">
      <label> Modifier mon pseudo </label>
      <br>
      <input
        v-model="name2"
        type="text"
        placeholder="Nouveau pseudo"
        name="name2"
      />
      <br>
      <button v-if="name2" class="btn" @click="updateName">Valider</button>
      <p v-if="errorName2" class="errorName2"> {{ errorName2 }}</p>
    </div>
    <br />

    <!-- Modifier ma photo de profil -->
    <div v-if="okModifyProfil && !okDeleteProfil" class="modifyPhoto">
      <form @submit.prevent="onSubmit" enctype="multipart/form-data">
        <label> Modifier ma photo de profil</label>
        <div class="modifyPicture">
        <input   type="file" ref="file" @change="onSelect" />
        </div>
        <button class="btn" @click="updateProfilPicture">Valider</button>
      </form>
    </div>
    </div>
    
  </div>

<!-- Mes publications -->
  <h2> Les publications de {{ oneUser.name }} </h2>
  <button v-if="!okShowMyPublications" class="btn" @click="btnShowMyPublications"> Afficher toutes les publications </button>
  <button v-else class="btn" @click="btnShowMyPublications"> Masquer les publications </button>
  
  <div v-if="okShowMyPublications">
    <MyPublications :userConnected="oneUser"> </MyPublications>
  </div>
<!-- Fin mes publications  -->
  </div>


</div> 
</template>

<script>
import axios from "axios";
import MyPublications from '../components/MyPublications'

export default {
 
  name: "Profil",

  components:{
    MyPublications
  },

  data() {
    return {
      name: "",
      email: "",
      users: [],
      oneUser: {},
      userId:"",
      okDeleteProfil: false,
      okModifyProfil: false,
      email2: "",
      password1:null,
      password2: null,
      password3:null,
      name2: null,
      file2: null,
      user: null,
      error:null,
      myPublications:[],
      id: "",
      errorEmail2:"",
      errorPassword2:"",
      errorName2: null,
      profil_picture:'',
      okShowMyPublications:false,
      text: "",
      Token:null,
      authentified:""
      
    };
  },
  
  created() {
    this.userId=this.$route.params.id
    this.getOneUserById(this.userId);
    this.deleteOneUser();
    this.id=this.$route.params.id
  },
 
  methods: {
    btnDeleteProfil: function () {
      this.okDeleteProfil = !this.okDeleteProfil;
      if (this.okDeleteProfil) {
        this.okModifyProfil = false;
      }
    },
    btnModifyProfil: function () {
      this.okModifyProfil = !this.okModifyProfil;
      if (this.okModifyProfil) {
        this.okDeleteProfil = false;
      }
    },
  btnShowMyPublications(){
    this.okShowMyPublications=!this.okShowMyPublications
  },
  
// Get one user
    async getOneUserById(userId) {
      this.Token = JSON.parse(localStorage.getItem("Token"));
      if (this.Token) {  
        try {
        const response = await axios.get(
          "http://localhost:3000/api/users" + userId,
          {
          headers:
          {
            authorization: `bearer ${this.Token.token}`,
          }
        }
        );
        // Si requête non authentifiée
       if (response.data.message){
         this.authentified=response.data.message;
        // Si requête authentifiée
       } else {
         this.oneUser = response.data[0];
       }
        
      } catch (err) {
        console.log(err);
      }
      } else {
        this.authentified=" Merci de vous connecter d'abord !"
      }
    },
    ///////////////////
// Delete One User

    deleteOneUser: function (event) {
        
        this.id=this.$route.params.id
        console.log ('userId:', this.id)
      if (event) {
        axios
          .delete("http://localhost:3000/api/users" + this.id,
          {
          headers:
          {
            authorization: `bearer ${this.Token.token}`,
          }
        }
          
          )
          .then((res) => {

            console.log(" Le user, ses publications et ses commentairesont été supprimés avec succès!", res);
            localStorage.removeItem("Token");
            this.$store.commit("DECONNEXION")
          })
          .catch((err) => {
            console.log("Le user n'a pas été supprimé!", err);
          });
      }
    },

////////////////////////
// Update Photo

    onSelect() {
      
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      const file = this.$refs.file.files[0];
      this.file = file;
      if (!allowedTypes.includes(file.type)) {
        this.message = "Filetype is wrong!!";
      }
      if (file.size > 500000) {
        this.message = "Too large, max size allowed is 500kb";
      }
    },
    async onSubmit() {
      const formData = new FormData();
      formData.append("file", this.file);
      console.log ('new profil_picture:', this.file.name)
      this.profil_picture=this.file.name
      
      try {
        this.id=this.$route.params.id
        let self=this
        await axios
          .patch("http://localhost:3000/api/users/photo/" + this.id, 
         formData,
         {
          headers:
          {
            authorization: `bearer ${this.Token.token}`,
          }
        }
         
         )
          .then(function (res) {
            console.log('profil_picture à modifier:', res.data[0].profil_picture);
            console.log('nouvelle profil_picture:', self.profil_picture);  
            
          })
          .catch(function (err) {
            console.log(err);
          });
        } catch (err) {
        console.log(err);
        }
      this.getOneUserById(this.userId)
    },

  /////////////////
  // update Email
    updateEmail: function (event) {
     if (event) {
       
        axios.patch("http://localhost:3000/api/users/email/" + this.id,
          {
            email: this.email2,
            
          },
          {
          headers:
          {
            authorization: `bearer ${this.Token.token}`,
          }
        }
          )
          .then ( (res)=>{
              this.errorEmail2="";
              if (res.data.type == "error") {
                this.errorEmail2="Votre nouvel email n'est pas valide!";

              } else {
                this.errorEmail2="";
                this.errorEmail2="Votre email a été modifié avec succès!"
                console.log("Email modifié ! ");
              }
          })
          .catch( (err)=> {
           console.log("Erreur serveur !", err)
          })
       }
    },

/////////////////////////////////////
// update Password
    updatePassword: function (event) {
     
      if (event) {
         if ( this.password2==this.password3){
         
        axios.put("http://localhost:3000/api/users/password/" + this.id,
          {
            password: this.password2,
            password1: this.password1
        
          },
          {
          headers:
          {
            authorization: `bearer ${this.Token.token}`,
          }
        }
          )
          .then ( (res)=>{
              this.errorPassword2="";
              if (res.data.type == "error") {
                this.errorPassword2=res.data.message;

              } else {
                this.errorPassword2="";
                this.errorPassword2="Votre mot de passe a été modifié avec succès!"
                console.log("Mot de passe modifié ! ");
                }

          })
          .catch( (err)=> {
           console.log("Erreur serveur !", err)
            
          })
         }else {
            this.errorPassword2="Vos nouveaux mots de passe ne correspondent pas !"
            }
        } 
    },

/////////////////////////////////////
// Update Name
updateName: function (event) {
      let id = this.oneUser.userId;
      if (event) {
        if (!this.name2){
          this.errorName2="Merci de saisir votre nouveau pseudo avant de valider!"
        } else {
        axios.patch("http://localhost:3000/api/users/name" + id,
          {
            name: this.name2,
            
          },
          {
          headers:
          {
            authorization: `bearer ${this.Token.token}`,
          }
        }
          )
          .then ( (res)=>{
            console.log(res.data.message)
            this.errorName2=res.data.message
          })
          .catch( (err)=> {
            console.log (err.data.message)
            this.errorName2=err.data.message
          })
        }
      this.getOneUserById(this.userId)
      }
    },
    
  ////////////
  },
};
</script>


<!--   Style --->

<style scoped >
.all {
  text-align: center;
  margin: auto;
  background:#ffd7d7 ;
  height: 100%;
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
    bottom:0px;
    left:35px;
    visibility: hidden;
    font-family: cursive;
    font-weight: 600;
    font-size: 1.7em;
}
[my_title]:after:active{
  visibility: hidden;
}
/* ----  */
/*-- userInfos -- */
.user-infos {
  display: flex;
  justify-content: space-around;
}
.infos-user {
  text-align: left;
  font-family: 'Courier New', Courier, monospace;
  font-weight: 600;
}
.infos-user span {
  font-size: 1em;
  font-weight: 200;
  font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif
}
/* ----- */

.authentified {
  color:red;
  font-weight: bold;
}
.username {
  color:#000;
  text-shadow: 1px 1px 2px #222;
  margin-top: 10px;
}
.username i{
  color:rgb(10, 10, 248)
}
.username .admin{
  opacity: 0;
  color: rgb(61, 247, 15);
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
  width: 100px;

  height: 120px;
  margin: 20px;
  box-sizing: border-box;

  padding-top: 15px;
}
img {
  width: 70px;
  height: 70px;
  /*border: 1px solid black;*/
  border-radius: 35px;
  box-shadow: 3px 1px 3px rgb(219, 148, 148);
}

p {
  color: black;
  text-decoration: none;
}
.modifyProfil, .deleteProfil{
  height:40px;
}
.modifyProfil i {
  color:rgb(81, 136, 240)
}
.deleteProfil i {
  color:rgb(240, 81, 89)
}
.errorModifyPassword,.errorEmail2,.errorPassword2, .errorName2 {
  color: red;
}
.modify {
  margin: 0px 15px;
  background: rgb(255, 255, 255);
  border-radius: 10px;
  box-shadow: 2px 2px 5px ;
  padding-bottom: 0px;
}
.modifyPhoto {
  margin: auto;
  text-align: center;
}

/******** */

.bar-nav {
  width: 100%;
  height: 50px;
  background: #fff;
  display: flex;
  justify-content: center;
}
.bienvenue {
  margin-right: 20px;
}
.profilPhoto {
  margin: auto;
  width: 60px;
  border: 1px solid black;
  border-radius: 30px;
}
.profilPhoto img {
  border-radius: 30px;
}
.attention {
  color:red;
}
.dontDelete {
  background: rgb(40, 128, 6);
  color: white;
}
.modifyPicture {
 display: flex;
 justify-content: center;
}
input {
  background: #d1cfcf;
  border: 1px dashed green;
  border-radius: 2px;
}
label {
  font-style: italic;
  color:#1e304f;
}

/* /////////////  */

.publicationCard {
  width: 80%;
 
  margin: 20px auto;
  padding: 10px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 2px 2px 5px grey;
}

textarea {
  width: 85%;
  height: 50px;
  margin-top: 20px;
  border: 0.1px solid rgb(226, 219, 219);
  border-radius: 5px;
  box-shadow: 1px 2px 5px grey;
}

.send-it {
  margin: 15px 5px;
  display: flex;
  justify-content: space-between;
  color: red;
}

.send-it button {
  background: #1e304f;
  width: 80px;
  color: #fff;
}

/* Les publications */
h2 {
  background: #1e304f;
  color: white;
  text-shadow: 2px 2px 2px #ffd7d7;
  letter-spacing: .3rem;
  font-family: 'Courier New', Courier, monospace;
  border-bottom: 3px solid white;;
}

.userAndImage {
  width: 60px;
  height: 60px;
  background: #ffd7d7;
  border-radius: 50%;
}
.userAndImage img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.userAndImage p {
  font-weight: 900;
  font-size: 0.6rem;
  margin-top: -2px;
}
.publicationDate {
  display: flex;
  align-items: center;
  border-bottom: 2px solid black;
  margin: 5px;
}

.publicationDate p {
  margin-left: 5px;
  font-size: 1rem;
}
.publicationPhoto {
  width: 60%;
  height: 100%;
  margin: auto;
  box-shadow: 2px 2px 5px black;
  border-radius: 10px;
}
.publicationPhoto img {
  border-radius: 10px;
  width: 100%;
  height: 100%;
}
.publicationText {
  margin: 10px;
  background: #f2f2f2;
}

/* Likes */
.likes {
  display: flex;
  justify-content: space-between;
  margin-left: 10px;
  align-items: center;
  width: 100%;
  height: 40px;
  color: #1e304f;
}
div i {
  font-size: 20px;
  margin-right: 10px;
}
span {
  font-size: 0.5em;
  margin-right: 10px;
  color: #000;
}
/* The communts */
.communt {
  width: 100%;
}
.addCommunt {
  margin-top: 20px;
  border-top: 2px solid black;
}

.yourCommunt {
  margin-left: 50px;
}

/** MEDIAS QUERIES  */

@media screen and (max-width: 768px) {
  
  #formPub {
    width: 80%;
  }
  .publicationCard {
    width: 95%;
  }
  .send-it {
    flex-direction: column;
  }
}
@media screen and (min-width: 991px) {
.all {
  width: 70%;
  margin: auto;
  }
}
</style>