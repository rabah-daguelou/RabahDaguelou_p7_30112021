<template>
  <div>
    <div class="all">
      <div add-post>
        <h1>Publiez ...</h1>
        <!-- User connected -->
        <router-link :to="`/Profil/${userConnected.userId}`">
          <div class="profiluser">
            <div class="profilPhoto">
              <img
                v-if="userConnected.profil_picture"
                :src="
                  require(`./../../../backend/images/${userConnected.profil_picture}`)
                "
                width="60"
                height="60"
                alt=""
              />
              <img
                v-else
                src="./../../../backend/images/icon.png"
                width="60"
                height="60"
                alt=""
              />
            </div>
            <p class="username">
              {{ userConnected.name }}
              <span v-if="userConnected.isAdmin == 1" title="Administrateur">
                <i class="fas fa-user-cog"> </i>
              </span>
            </p>
          </div>
        </router-link>

        <!------  Fin user connected      ----->

        <!-- Publier un post -->

        <!-- Formulaire -->
        <div class="publicationCard">
          <form @submit.prevent="onSubmit" enctype="multipart/form-data">
            <div>
              <textarea
                v-model="text"
                name="text"
                id=""
                cols="30"
                rows="10"
                placeholder="Tapez votre texte ici"
              ></textarea>
            </div>

            <div class="send-it">
              <input type="file" ref="file" @change="onSelect" />

              <button @click="sendText" type="submit" class="btn btn-publier">
                Publier
              </button>
            </div>
            <p class="errorMessage" v-if="error">
              {{ error }}
            </p>
          </form>
        </div>
      </div>
    </div>
    <!-- Fin publier un post -->

    <!-- Afficher les publications -->

    <h2>P U B L I C A T I O N S</h2>
    <!-- Les publications  -->
    <div v-if="publications.length">
      <div
        v-for="publication in publications" :key="publication"
        
        class="publicationCard"
      > 
           <!-- Si la publication est partagée -->
           
           <div v-if="publication.shared==1" class="publicationDate shared"> 
           <div  class="userAndImage shared">
   
            <img
              :src="
                require(`./../../../backend/images/${publication.shared_userProfil_picture}`)
              "
              width="100"
              alt=""
            />
                      
            </div>
            <p> partagé par {{ publication.shared_userName }}</p>
             <p class="datePub">Partagé le {{ publication.DATETIME_FR }}</p>
            <hr/>
            </div>
            
          <!-- 
          
          
          
          
          <p class="datePub">Partagée le {{ publication.DATETIME_FR }}</p>
          
          </div>
          </div>
          -->
          <!-- fin si publication partagée -->
      
        <div class="publicationDate">
          
         
          
          <div class="userAndImage">
            <img
              :src="
                require(`./../../../backend/images/${publication.profil_picture}`)
              "
              width="200"
              alt=""
            />
          </div>
          <p>{{ publication.user_send }}</p>
          <p v-if="publication.shared_number>0" class="datePub">Publié le {{ publication.shared_date }}</p>
          <p v-else class="datePub">Publié le {{ publication.DATETIME_FR }} </p>
        </div>

        <div v-if="publication.image" class="publicationPhoto">
          <img
            :src="require(`./../../../backend/images/${publication.image}`)"
            width="200"
            alt=" pas de photo"
          /> 
        </div>

        <p class="publicationText">{{ publication.post }}</p>

        <!-- Likes and dislikes -->
        <div class="likes">
          <div>
            <i
              @click="like_it(publication.postId)"
              class="fas fa-thumbs-up like"
            >
              <span class="like"> &#160; {{ publication.likes_number }} </span>
            </i>

            <i
              @click="deslike_it(publication.postId)"
              class="fas fa-thumbs-down deslike"
            >
              <span class="like">
                &#160; {{ publication.deslikes_number }}
              </span>
            </i>
          </div>

          <!-- Supprimer et modifier un post -->
          <div>
            <!-- Supprimer un post -->

            <i
              @click="deletePost(publication.postId)"
              v-if="
                publication.userId == userConnected.userId ||
                userConnected.isAdmin == 1
              "
              class="fas fa-trash delete"
            >
              <span> Supprimer </span></i
            >

            <!-- Modifier un post -->
            <i
              @click="btnModifyPost(publication.postId)"
              v-if="publication.userId == userConnected.userId && publication.shared==0"
              class="fas fa-pen-square modify"
              ><span> Modifier </span></i
            >
          </div>
        </div>

        <div
          v-if="okModifyPost && publication.postId == this.postId"
          class="publicationCard modifyPostCard"
        >
          <form @submit.prevent="onModify" enctype="multipart/form-data">
            <div>
              <textarea
                v-model="textModified"
                name="text"
                id=""
                cols="30"
                rows="10"
                placeholder=" Votre nouveau texte "
              >
              </textarea>
            </div>

            <div class="send-it">
              <div>
                <input type="file" ref="file" @change="onSelected" />
              </div>
              <div class="field">
                <button
                  @click="updatePost()"
                  type="submit"
                  class="btn btn-publier"
                >
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>

            <p v-if="error" class="errorMessage">{{ error }}</p>
          </form>
        </div>

        <!-- Commentaires -->

        <!-- 1/ Publier un commentaire -->
        <div class="commentCard">
       
          <div class="commentAndPartage likes" >

          <i class="far fa-comment-dots comment" @click="btnComment(publication.postId)">
            <span> Commenter  </span> 
          </i>
          <!-- Bouton Partager -->
          <i class="fas fa-share-square share">
            <span @click="share(publication)"> Partager <span class="shared_number"> {{ publication.shared_number}}</span> </span>
          </i>
                  
          </div>

          <form
            v-if="okComment && publication.postId == this.postId"
            @submit.prevent=""
          >
            <textarea 
              v-model="comment"
              cols="30"
              name="text"
              rows="10"
              placeholder=" Votre commentaire "
            >
            </textarea>
            <button
              v-if="comment"
              @click="createComment(publication.postId)"
              type="submit"
              class="btn btnComment"
            >
              Envoyer
            </button>
          </form>
        </div>
        <!--- Fin publier un commentaire    -->

        <!--  2/ Afficher tous les commentaires du postId-->
        <div class="allComments">
          
          <button
            v-if="afficherCommentaires && publication.commentNumber"
            @click="getAllComments(publication.postId)">
          
            Commentaires
          <span> {{ publication.commentNumber }} </span> 
          </button>

          <button
            v-if="!afficherCommentaires && publication.commentNumber"
            @click="getAllComments(publication.postId)"
          >
            Masquer les commentaires
          </button>

          <div v-if="showComments && publication.postId == comments[0].postId">
            <div v-for="comment in comments" :key="comment">
              <div class="oneCommentCard">
                <div class="publicationDate">
                  <div class="userAndImage">
                    <img
                      :src="
                        require(`./../../../backend/images/${comment.profil_picture}`)
                      "
                      width="200"
                      alt=""
                    />
                  </div>
                  <p>{{ comment.user_send }}</p>
                  <p class="datePub">Publié le {{ comment.DATETIME_FR }}</p>
                </div>

                <!-- Désactiver un commentaire -->
                <div class="notShowComment">

                  <p v-if="comment.masked == 1" class="masked">
                    Ce commentaire est masqué par l'administrateur !
                  </p>
                  <p v-if="comment.masked==0 || demasked" class="comment">{{ comment.comment }}</p>

                  <div>
                    <button @click="maskComment(comment.commentId)"
                      v-if="userConnected.isAdmin == 1 && comment.masked == 0"
                    >
                      Masquer 
                    </button>

                    <button @click="demask"
                      v-if="userConnected.isAdmin == 1 && comment.masked == 1"
                    >
                      Montrer
                    </button>
                  </div>

                </div>
                <!-- -->

                <hr/>
              </div>
            </div>
          </div>
        </div>
        <!-- Fin afficher les commentaires  -->
      </div>
    </div>
    <!-- Fin les publications -->

    <div v-else>Il n'y a aucune publication à afficher !</div>
    <p class="authentified">{{ authentified }}</p>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "AllPublications",

  data() {
    return {
      userId: "",
      text: "",
      file: "",
      publications: [],
      error: "",
      okModifyPost: false,
      postId: null,
      textModified: "",
      comment: "",
      okComment: false,
      okAllComments: false,
      commentNumber: 0,
      comments: [],
      showComments: false,
      status: 0,
      afficherCommentaires: true,
      authentified: "",
      Token: "",
      demasked:false,
    };
  },
  
  props: {
    userConnected: {
      type: Object,
      default() {
        return {
          userConnected: "userConnected",
        };
      },
    },
  },

  mounted() {
    this.getAllPosts();
     
  },
  created () {
  this.share()
  //this.message()
  },
  computed(){
  //  this.$store.commit("CONNEXION")
  //  this.$store.commit("USER_CONNECTED")
  },
  methods: {
   /* message(){
        this.error=null
      },
*/
    btnModifyPost(id) {
      this.okModifyPost = !this.okModifyPost;
      this.postId = id;
      console.log("postId:", this.postId);
    },
    btnComment(id) {
      this.okComment = !this.okComment;
      this.postId = id;
    },

    //----  1- Afficher toutes les publications ////////

    getAllPosts() {
      this.Token = JSON.parse(localStorage.getItem("Token"));
      this.user_id = this.Token.userId;
      console.log("Token:", this.Token.token);
      console.log("UserId:", this.Token.userId);
      axios
        .get("http://localhost:3000/api/posts", {
          headers: {
            authorization: `bearer ${this.Token.token}`,
          },
        })

        .then((response) => {
          this.publications = response.data;
          // Si requête non authentifiée
          if (response.data.message) {
            console.log("Requête non authentifié:", this.publications.message);
            this.authentified = response.data.message;
            // Si requête authentifiée
          } else {
            console.log(
              "Requête authentifiée: Tableau des bublications:",
              this.publications
            );
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ///// Fin Get All posts ////////

    
    // ------ Partager une publication ---//
    share(publication){
    
      axios.post("http://localhost:3000/api/posts/share",
      
      { 
        publication1:publication,
        publication2:{
          shared:1,
          shared_userId: this.userConnected.userId,
          shared_userName: this.userConnected.name,
          shared_userProfil_picture: this.userConnected.profil_picture,
        }
     
      },
      {
        headers: {
            authorization: `bearer ${this.Token.token}`,
          },
      })
    .then ((res)=> {
      console.log ("Partager:", res)
      
    })
    .catch ((err)=>{
      console.log (" Erreur:", err)
    })
    this.getAllPosts()
    },
    // ---- Fin partager une publication --- //

    // ---- 2- Publier un post //
    onSelect() {
      let file = this.$refs.file.files[0];
      this.file = file;
    },
   
    sendText(f) {
     
      if (!this.file && !this.text) {
        this.error = " Merci de joindre du texte ou une image à publier !";
      //  setTimeout(this.message(), 1000)
        f.preventDefault();
      }
    },
    /*
    message(){
      this.error=""
    },
*/
    async onSubmit() {
      this.error = "";
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      
      // Si le format du fichier n'est pas valide
      if (this.file && !allowedTypes.includes(this.file.type)) {
        this.error = "Merci de choisir un fichier PNG, JPG ou JPEG!";
        
      }
      // Si le fichier est trop volumineux
      else if (this.file && this.file.size > 500000) {
        this.error = "Votre fichier est trop volumineux: 500kb max! ";
        
      }
      // Si tout va bien
      else {
        
        const formData = new FormData();
        formData.append("file", this.file);
        formData.append("post", this.text);
        formData.append("user_send", this.userConnected.name);
        formData.append("userId", this.userConnected.userId);
        formData.append("profil_picture", this.userConnected.profil_picture);
        console.log("file: ", this.file);
        console.log("user_send: ", this.userConnected.name);
        try {
          await axios
            .post("http://localhost:3000/api/posts", formData, {
              headers: {
                authorization: `bearer ${this.Token.token}`,
              },
            })
            .then(function (res) {
              console.log(res);
            })
            .catch(function (err) {
              console.log(err);
            });
        } catch (err) {
          console.log(err);
        }
        location.reload();
        //this.getAllPosts();
        this.file = null;
        this.text = "";
      }
    },
    //---------- Fin publier un post ---------------//

    //---3/- Supprimer un post ------------ //
    deletePost(id) {
      console.log("postId:", id);
      const self = this;
      let Token = JSON.parse(localStorage.getItem("Token"));
      console.log("ici: Token: ", Token.token);
      axios
        .delete("http://localhost:3000/api/posts/" + id, {
          headers: {
            authorization: `bearer ${Token.token}`,
          },
        })
        .then(function (res) {
          console.log(res);
          self.getAllPosts();
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    // ----------- Fin supprimer un post ---------- //
    
    //-- 4/ ---------- Modifier un post -------------//
    
     onSelected() {
      const file = this.$refs.file.files[0];
      this.file = file;
      console.log ('Photo modifiée:', this.file)
    },

    updatePost() {
      this.error="";
      if (!this.file && !this.textModified) {
        this.error = " Merci de joindre du texte ou une image pour envoyer !";
        console.log("error:", this.error)
        
      //  this.okModifyPost=!this.okModifyPost
      }
      
    },
   

    onModify() {
       this.error="";
       const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!this.file && !this.textModified) {
        this.error = " Merci de joindre du texte ou une image pour envoyer !";
        
      } else if( this.file && !allowedTypes.includes(this.file.type)) {
      
      
      // Si le format du fichier n'est pas valide
       
        this.error = "Merci de choisir un fichier PNG, JPG ou JPEG!";
      
      // Si la photo est trop volumineuse
      } else if (this.file && this.file.size > 500000) {
        this.error = "Votre fichier est trop volumineux: 500kb max! ";
      
      // Si tout va bien
      } else {
      
      const formData = new FormData();
      if (this.textModified) {
        formData.append("textModified", this.textModified);
      }
      if (this.file) {
        formData.append("file", this.file);
      }
      console.log("FormData:", formData);

      axios
        .put("http://localhost:3000/api/posts/" + this.postId, formData, {
          headers: {
            authorization: `bearer ${this.Token.token}`,
          },
        })

        .then(function (res) {
          console.log(res);
          self.getAllPosts();
        })
        .catch(function (err) {
          this.error=" La modification n'a pas pu se faire !"
          console.log("Erreur :", err);
        });

      this.okModifyPost = !this.okModifyPost;
      this.textModified = "";
      this.error = "";
      this.getAllPosts();
      location.reload()
      }
    },
    
    // ---------- Fin modifier un post ------------//

    // --- 5/ --- Créer un commentaire -------------- //
    createComment(postId) {
      console.log("comment:", this.comment);
      console.log("postId:", postId);
      console.log("UserId", this.userConnected.userId);
      console.log("User_send:", this.userConnected.user_send);
      let self = this;
      axios
        .post(
          "http://localhost:3000/api/comments",
          {
            comment: this.comment,
            postId: postId,
            userId: this.userConnected.userId,
            user_send: this.userConnected.name,
            profil_picture: this.userConnected.profil_picture,
          },
          {
            headers: {
              authorization: `bearer ${this.Token.token}`,
            },
          }
        )
        .then(function (res) {
          console.log(res);
          self.getAllPosts()
          this.okComment = false;
        })
        .catch(function (err) {
          console.log(err);
        });
      this.comment = "";
      this.okComment = false;
      this.getAllPosts()
      location.reload()
    },
    // ------- Fin créer un commentaire --------- //

    // --6/ ----- Afficher tous les commentaires d'un post--------- //
    getAllComments(postId) {
      this.afficherCommentaires = !this.afficherCommentaires;
      this.showComments = !this.showComments;
      const self = this;
      axios
        .get("http://localhost:3000/api/comments/" + postId, {
          headers: {
            authorization: `bearer ${this.Token.token}`,
          },
        })
        .then(function (res) {
          self.getAllPosts();
          console.log("Commentaires: ", res.data);
          self.comments = res.data;
          console.log("comments:", self.comments[0].user_send);
        })
        .catch(function (err) {
          console.log("Erreur: ", err);
        });
    },
    //  ------- Fin afficher les comentaires d'un post ---------//

    // ----- Masquer un commentaire par l'administrateur  -------- //
    maskComment(commentId){
      console.log ('N° commentaire à masquer:', commentId)
      axios.patch("http://localhost:3000/api/comments/" + commentId, {
        headers:{
          authorization: `bearer ${this.Token.token}`,
        }
        })
        .then (function (res) {
          console.log ("Réponse de masquer un commentaire:", res.data.message)
        })
        .catch (function (err){
          console.log ("Erreur pour masquer un commentaire:", err)
        })
    },

    // ------ Fin masquer un commentaire par l'administrateur  ----//
    // --- Montrer le commentaire masqué pour l'administrateur
    demask () {
      this.demasked=true
    },
    ///--------


    // ------- Fin afficher tous les commentaires ------  //

    // -- 7/ -- Liker un post ---- //
    like_it(postId) {
      console.log("postId: ", postId);
      const self = this;
      axios
        .post(
          "http://localhost:3000/api/like/" + postId,
          {
            postId: postId,
            userId: this.userConnected.userId,
          },
          {
            headers: {
              authorization: `bearer ${this.Token.token}`,
            },
          }
        )
        .then(function (res) {
          console.log("La réponse du serveur: ", res.data.status);

          self.status = res.data.status;
          console.log("Le status du users est:", self.status);
          self.getAllPosts();
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    // --- Fin Liker un post ------- //

    // --8/ ----- Desliker un post ---- //
    deslike_it(postId) {
      console.log("postId: ", postId);
      const self = this;
      axios
        .post(
          "http://localhost:3000/api/deslike/" + postId,
          {
            postId: postId,
            userId: this.userConnected.userId,
          },
          {
            headers: {
              authorization: `bearer ${this.Token.token}`,
            },
          }
        )
        .then(function (res) {
          console.log(res.data.message);
          self.getAllPosts();
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    // --- Fin Liker un post ------- //

    //////// Fin methods ///////
  },
  ///// Fin export default ////////
};
</script>

<!-- ........ Style CSS  ............ -->

<style>
/* Publier un post */
.all {
  margin: auto;
  text-align: center;
}

.username {
  color: #000;
  text-shadow: 1px 1px 2px #222;
  margin-left: 18px;
}
.username i {
  color: rgb(10, 10, 248);
}
.username .admin {
  opacity: 0;
  color: rgb(61, 247, 15);
}

.profilPhoto {
  margin: 10px auto;
  width: 60px;
  border: 1px solid black;
  border-radius: 30px;
  box-shadow: 2px 2px 2px #000;
}
.profilPhoto img {
  border-radius: 30px;
}

.publicationCard {
  width: 80%;
  margin: 20px auto;
  padding: 10px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 2px 2px 5px grey;
}
.publicationText {
  text-align: justify;
  padding: 5px;
  font-family: "Courier New", Courier, monospace;
}
textarea {
  width: 85%;
  height: 100px;
  margin-top: 20px;
  border: 0.1px solid rgb(226, 219, 219);
  border-radius: 5px;
  box-shadow: 1px 2px 5px grey;
}
textarea:focus,
.btnComment:hover {
  outline: 2px solid rgb(21, 14, 65);
}

.send-it {
  width: 100%;
  margin: 15px 0px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  color: red;
  box-sizing: border-box;
}
.send-it i {
  color: rgb(8, 240, 8);
}
.errorMessage {
  /*
  animation-duration: 10s;
  animation-name: errors;
  opacity:0;*/
  color: crimson;
}

/*
@keyframes errors {
  0% {
    opacity:1;
  }
100% {
    opacity:0;
  }
  
}
*/
/* Fin publier un post */

button {
  background: rgb(21, 14, 65);
  color: white;
  height: 40px;
  border-radius: 20px;
  border: none;
  padding: 5px 15px;
  box-shadow: 2px 2px 2px rgb(245, 189, 189);
}
button:hover {
  background: #cfbaba;
  color: black;
}
.publicationCard {
  width: 50%;
  background: #fff;
  border-radius: 10px;
  box-shadow: 2px 2px 5px grey;
}

.userAndImage {
  width: 50px;
  height: 50px;
  background: #ffd7d7;
  border-radius: 50%;
  box-shadow: 2px 2px 2px black;
  line-height: 50px;
}
.userAndImage img {
  width: 80%;
  height: 80%;
  border-radius: 50%;
}
.userAndImage p {
  font-weight: 900;
  font-size: 0.6rem;
}
.publicationDate {
  display: flex;
  align-items: center;
  margin: 5px;
}
.publicationDate .datePub {
  flex-grow: 1;
  text-align: right;
}
.publicationDate p {
  margin-left: 10px;
  text-align: left;
  font-size: 1rem;
  font-style: italic;
  font-weight: 900;
  color: rgb(56, 55, 55);
  font-family: cursive;
}
/* user partage */
.shared {
  background: #cccaca;
  padding: 5px;
  border-radius: 5px;
  box-shadow: 1px 1px 5px;
}
.shared .userAndImage {
  background: #e5e5e9;
  display: flex;
  justify-content: center;
  align-items: center;
}
.shared img {
 width: 50px;
 height: 40px;
 box-shadow: 2px 1px 3px black;
}


/* Les commentaires -*/

.notShowComment {
  background: rgb(233, 228, 228);
  display: flex;
  justify-content: space-between;
}
.publicationPhoto {
  width: 60%;
  margin: auto;
  box-shadow: 2px 2px 5px black;
  border-radius: 10px;
}
.publicationPhoto img {
  border-radius: 10px;
  width: 100%;
}
.publicationText {
  margin: 10px;
  background: #f2f2f2;
}

/* Likes */
.likes {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  align-items: center;
  width: 100%;
  height: 40px;
  background: #ffd7d7;
  padding: 5px;
  border-radius: 5px;
}
.likes span.like, .shared_number {
  display: inline-block;
  width: 20px;
  height: 20px;
  background: black;
  line-height: 20px;
  border-radius: 10px;
  padding-right: 5px;
  color: white;
  margin-left: 5px;
  box-shadow: 2px 2px 1px grey;
  font-size: 10px;
  text-align: center;
}
.shared_number {
  padding-right: 0;
}
.like {
  color: green;
  text-shadow: 1px 1px 1px black;
}
.deslike {
  color: red;
  text-shadow: 1px 1px 1px black;
}
.likes .delete  {
  margin-right: -8px;
  color: rgb(240, 62, 62);
  text-shadow: 1px 1px 1px black;
}
.likes .modify {
  margin-right: -8px;
  margin-left: 5px;
  color: rgb(67, 87, 196);
}
.likes .share {
margin-right: -19px;
color:rgb(114, 179, 50);
text-shadow: 1px 1px 1px black;
}
.likes .comment {
  color:blue;
  text-shadow: 1px 1px 1px black;
}
.likes span {
  text-shadow: none;
  font-family: 'Times New Roman', Times, serif;
  font-weight: bold;
}
 i {
  cursor: pointer;
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
/* Requête non authentifiée */
.authentified {
  color: red;
}
/* The communts
.commentAndPartage {
  display: flex;
  justify-content: space-between;
  background:#ffd7d7;
} */
.commentCard textarea {
  height: 70px;
}
.commentCard form {
  display: flex;
  justify-content: center;
  align-items: center;
}

.commentCard form button {
  height: 70px;
  margin-top: 20px;
  margin-left: 10px;
  background: white;
  border: 0.1px solid rgb(226, 219, 219);
  border-radius: 5px;
  box-shadow: 1px 2px 5px grey;
  color: black;
}
.allComments {
  margin-top: 20px;
}
.allComments span {
  display: inline-block;
  width: 40px;
  height: 40px;
  line-height: 40px;
  margin-top:-5px;
  margin-right: -20px;
  border-radius: 0px 20px 20px 0px;
  background: rgb(34, 102, 190);
  color:#fff;
  font-size: 1em;
}
p.comment {
  padding-left: 10px;
  font-family: "Courier New", Courier, monospace;
}
.masked {
  color:crimson;
}
hr {
  box-shadow: 2px 2px 5px black;
}
/** MEDIAS QUERIES  */

@media screen and (max-width: 768px) {
  #formPub {
    width: 80%;
  }
  .publicationCard {
    width: 95%;
  }
}
</style>