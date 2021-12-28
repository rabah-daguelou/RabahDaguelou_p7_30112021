<template>
    <div class="all">
      <!-- Publier un post -->

<!-- Formulaire -->
      <div v-if="userId==Token.userId" class="publicationCard">
        <h2> Publiez...</h2>
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
          <p class="errorMessage" v-if="error">{{ error }}</p>
        </form>
      </div>

<!-- Fin publier un post -->

<!-- Afficher les publications du profil -->

<!-- 
  
-->

<div v-if="publications.length">
          <div
        v-for="publication in publications"
        :key="publication"
        class="publicationCard"
      >
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
          <p> {{ publication.user_send }} </p>
          <p class="datePub">Publiée le: {{ publication.date_send }}</p>
        </div>

        <div v-if=" publication.image" class="publicationPhoto">
          <img
            :src="require(`./../../../backend/images/${publication.image}`)"
            width="200"
            alt=""
          />
         
        </div>

        <p class="publicationText">{{ publication.post }}</p>

         
        <!-- Likes and dislikes -->
        <div class="likes">
          <div >
            <i @click='like_it(publication.postId)' class="fas fa-thumbs-up like"> <span class="like"> &#160;  {{ publication.likes_number }}  </span> </i>
            
            <i @click='deslike_it(publication.postId)' class="fas fa-thumbs-down deslike"> <span class="like"> &#160; {{ publication.deslikes_number }} </span> </i>
          </div>

          <!-- Supprimer et modifier un post -->
          <div>
            <!-- Supprimer un post -->

            <i v-if="
                publication.userId == Token.userId ||
                Token.isAdmin == 1
              "
              @click="deletePost(publication.postId)"
              
              class="fas fa-trash delete"
            >
              <span> Supprimer </span></i
            >

            <!-- Modifier un post -->
           
            <i v-if="publication.userId==Token.userId"
              @click="btnModifyPost(publication.postId)"
                         
              class="fas fa-pen-square modify"
              ><span > Modifier </span></i
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
                  Valider
                </button>
              </div>
            </div>
            <p v-if="error" class="errorMessage">{{ error }}></p>
          </form>
        </div>

        <!-- Commentaires -->

        <!-- 1/ Publier un commentaire -->
        <div class="commentCard">
          <button @click="btnComment(publication.postId)">Commenter</button>
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
              class="btn"
            >
              Envoyer
            </button>
          </form>
        </div>
        <!--- Fin publier un commentaire    -->

        <!--  2/ Afficher tous les commentaires du postId-->
        <div class="allComments">
          
          <button v-if="!showComments && publication.commentNumber>0" @click="getAllComments(publication.postId)">
            Afficher tous les commentaires ( {{ publication.commentNumber }})
          </button>
          <button v-if="showComments" @click="getAllComments(publication.postId)">
            Masquer les commentaires
          </button>       
     
          
            <div v-for="comment in comments" :key="comment">
              <div v-if="showComments && publication.postId==comments[0].postId" >
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
                  <p>{{ comment.user_send }}  </p>
                  <p class="datePub">Publiée le: {{ comment.date_send }}</p>
                  
                </div>
                <p class="comment"> {{ comment.comment }}</p>
                <hr>
              </div>
            </div>
          </div>

        </div>
        <!-- Fin afficher les commentaires  -->


      </div>
    </div>

<div v-else> Il n'y a aucune publication à afficher !</div>
<p class="authentified"> {{ authentified }}</p>


<!--  -->       
    </div>
</template>

<script>
import axios from "axios";

export default {
    name:"MyPublications",

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

    data() {
    return {
      userId:"",
      text: "",
      file: "",
      publications: [],
      error: "",
      okModifyPost: false,
      postId: null,
      textModified: "",
      comment: "",
      okComment: false,
      okAllComments:true,
      commentNumber: 0,
      comments: [],
      showComments:false,
      status:0,
      afficherCommentaires:true,
      authentified:"",
      Token:"",
      id:""
    };
    },

    created() {
    this.getAllMyPosts();
    this.userId=this.$route.params.id
    this.messageThreeSeconds()
    },

    computed (){
      this.$route.params.id
    },

    mounted(){
    this.getAllMyPosts();
  },
  
    methods: {

    messageThreeSeconds:function(){
       setTimeout(()=> {
          this.error=""
        }, 3000)
     },

    btnModifyPost(id) {
      this.okModifyPost = !this.okModifyPost;
      this.postId = id;
      console.log("postId:", this.postId);
    },

    btnComment(id) {
      this.okComment = !this.okComment;
      this.postId = id;
    },  


//----  1- Afficher toutes mes publications ////////
    getAllMyPosts() {
      this.Token = JSON.parse(localStorage.getItem("Token"));
           
     if (this.Token.userId==this.$route.params.id) {
        this.id=this.Token.userId
      } else {
        this.id=this.$route.params.id
      }
      axios
        .get("http://localhost:3000/api/posts/" + this.id, {
          headers: {
          authorization: `bearer ${this.Token.token}`,
          },
        })

        .then((response) => {
          
          // Si requête non authentifiée
          if (response.data.disconnected){
            
            this.authentified=response.data.disconnected
          // Si requête authentifiée
          } else {
            this.publications = response.data;
            console.log ("response:",response)
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    ///// Fin afficher tous mes posts ////////
  
  // ---- 2- Publier un post //

    sendText(f) {
     
      if (!this.file && !this.text) {
        this.error = " Merci de joindre du texte ou une image à publier !";
        this.messageThreeSeconds()
        f.preventDefault();
      }
    },

    onSelect() {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      const file = this.$refs.file.files[0];
      this.file = file;
      if (!allowedTypes.includes(file.type)) {
        this.error = "Merci de choisir un fichier PNG, JPG ou JPEG!";
        this.file="";
      }
      if (file.size > 500000) {
        this.error = "Votre fichier est trop volumineux: 500kb max! ";
        this.file="";
      }
    },

    async onSubmit() {
      const formData = new FormData();
      formData.append("file", this.file);
      formData.append("post", this.text);
      formData.append("user_send", this.userConnected.name);
      formData.append("userId", this.userConnected.userId);
      formData.append("profil_picture", this.userConnected.profil_picture)
           console.log ('file: ', this.file)
           console.log ('user_send: ', this.userConnected.name)
      try {
        await axios.post("http://localhost:3000/api/posts", formData,
        {
          headers: {
          authorization: `bearer ${this.Token.token}`,
          },
                  
          })
          
          .then(function (res) {

            // Si requête non authentifiée
          if (res.data.disconnected) {
            this.authentified = res.data.disconnected;
            localStorage.removeItem("Token");
            this.$store.commit("DECONNEXION");
            // Si requête authentifiée
          } else {
            console.log(res);
          }  
          })
          .catch(function (err) {
            console.log(err);
          });
      } catch (err) {
        console.log(err);
      }
      
      this.text="";
      this.getAllMyPosts();
      !this.onSelect
    },
//---------- Fin publier un post ---------------//

//---3/- Supprimer un post ------------ //
    deletePost(id) {
      console.log("postId:", id);
      const self = this;
      axios
        .delete("http://localhost:3000/api/posts/" + id,
        {
        headers: {
          authorization: `bearer ${this.Token.token}`,
          }
        })
        

        .then(function (res) {

          // Si requête non authentifiée
          if (res.data.disconnected) {
            this.authentified = res.data.disconnected;
            localStorage.removeItem("Token");
            this.$store.commit("DECONNEXION");
            // Si requête authentifiée
          } else {
          console.log(res);
          self.getAllMyPosts();
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    },
    // ----------- Fin supprimer un post ---------- //

//-- 4/ ---------- Modifier un post -------------//
    onModify(f2) {
      if (!this.file && !this.textModified) {
        this.error = " Merci de joindre du texte ou une image pour envoyer !";
        this.messageThreeSeconds()
        f2.preventDefault();
        this.okModifyPost=!this.okModifyPost
      }
    },
    onSelected() {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      const file = this.$refs.file.files[0];
      this.file = file;
      if (!allowedTypes.includes(file.type)) {
        this.error = "Merci de choisir un fichier PNG, JPG ou JPEG!";
      }
      if (file.size > 500000) {
        this.error = "Votre fichier est trop volumineux: 500kb max! ";
      }
    },
    updatePost(f) {
      if (!this.textModified && !this.file.name) {
        f.preventDefault();
      }
      const formData = new FormData();
      if (this.textModified) {
        formData.append("textModified", this.textModified);
      }
      if (this.file) {
        formData.append("file", this.file);
      }
      console.log(formData);
      const self=this
      axios
          .put("http://localhost:3000/api/posts/" + this.postId, formData,
          {
        headers: {
          authorization: `bearer ${this.Token.token}`,
          }
        })
          
          .then(function (res) {

            // Si requête non authentifiée
          if (res.data.disconnected) {
            this.authentified = res.data.disconnected;
            localStorage.removeItem("Token");
            this.$store.commit("DECONNEXION");
            // Si requête authentifiée
          } else {
            
            self.getAllMyPosts();
            }
          })
          .catch(function (err) {
            console.log("Erreur :", err);
            
          });
          
          this.okModifyPost = !this.okModifyPost;
          this.textModified="";
          this.error="";
          this.getAllMyPosts();
          location.reload()
    },
    
    // ---------- Fin modifier un post ------------//

// --- 5/ --- Créer un commentaire -------------- //
    createComment(postId) {
      console.log("comment:", this.comment);
      console.log("postId:", postId);
      console.log("UserId", this.userConnected.userId);
      console.log("User_send:", this.userConnected.user_send);

      axios
        .post("http://localhost:3000/api/comments", {
          comment: this.comment,
          postId: postId,
          userId: this.userConnected.userId,
          user_send: this.userConnected.name,
          profil_picture: this.userConnected.profil_picture,
        },
        {
        headers: {
          authorization: `bearer ${this.Token.token}`,
          }
        })
        
        .then(function (res) {

          // Si requête non authentifiée
          if (res.data.disconnected) {
            this.authentified = res.data.disconnected;
            localStorage.removeItem("Token");
            this.$store.commit("DECONNEXION");
            // Si requête authentifiée
          } else {
          console.log(res);
          this.okComment=false
          }
          
        })
        .catch(function (err) {
          console.log(err);
        });
         this.okComment=false
         this.comment=""
         //this.getAllComments()
    },
    // ------- Fin créer un commentaire --------- //

// --6/ ----- Afficher tous les commentaires d'un post--------- //
    getAllComments(postId) {
      //this.afficherCommentaires=false;
      //this.afficherCommentaires=!this.afficherCommentaires;
      this.showComments=!this.showComments
      const self=this
      axios.get("http://localhost:3000/api/comments/" + postId,
      {
        headers: {
          authorization: `bearer ${this.Token.token}`,
          }
        })
      
        .then(function (res) {

          // Si requête non authentifiée
          if (res.data.disconnected) {
            this.authentified = res.data.disconnected;
            localStorage.removeItem("Token");
            this.$store.commit("DECONNEXION");
            
            // Si requête authentifiée
          } else {
        
          if (res.data.length>0){
            self.comments=res.data
            self.showComments==true
          } else {
            self.showComments==false
          }
          
          }  
        
        })
        .catch(function (err) {
          console.log("Erreur: ", err);
        });
    },

    // ------- Fin afficher tous les commentaires ------  //

// -- 7/ -- Liker un post ---- //
like_it(postId) {
  console.log ("postId: ", postId)
  const self = this
  axios
        .post("http://localhost:3000/api/like/"+ postId, {
          
          postId: postId,
          userId: this.userConnected.userId,
          
        },
        {
        headers: {
          authorization: `bearer ${this.Token.token}`,
          }
        })
        
        .then(function (res) {

          // Si requête non authentifiée
          if (res.data.disconnected) {
            this.authentified = res.data.disconnected;
            localStorage.removeItem("Token");
            this.$store.commit("DECONNEXION");
            // Si requête authentifiée
          } else {
          console.log("La réponse du serveur: ", res.data.status);
          
          self.status=res.data.status
          console.log("Le status du users est:", self.status)
          self.getAllMyPosts()
          }
        })
        .catch(function (err) {
          console.log(err);
        });
},
// --- Fin Liker un post ------- //

// --8/ ----- Desliker un post ---- //
deslike_it(postId) {
  console.log ("postId: ", postId)
  const self=this
  axios
        .post("http://localhost:3000/api/deslike/"+ postId, {
          
          postId: postId,
          userId: this.userConnected.userId,
          
        },
        {
        headers: {
          authorization: `bearer ${this.Token.token}`,
          }
        })
        
        .then(function (res) {

          // Si requête non authentifiée
          if (res.data.disconnected) {
            this.authentified = res.data.disconnected;
            localStorage.removeItem("Token");
            this.$store.commit("DECONNEXION");
            // Si requête authentifiée
          } else {
          console.log(res.data.message);
          self.getAllMyPosts()
          }
        })
        .catch(function (err) {
          console.log(err);
        });
}
// --- Fin Liker un post ------- //
  
  },
/////
}


</script>

<style scoped>

</style>