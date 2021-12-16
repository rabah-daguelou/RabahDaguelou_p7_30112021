import { createStore } from 'vuex'

export default createStore({
  state: {
    isConnected:0,
    userConnected:{}
  },
 
  mutations: {
    CONNEXION(state){
      state.isConnected=true
      },
    
    DECONNEXION(state){
      state.isConnected=false
      state.userConnected=null
      },
    
    USER_CONNECTED (state){
      state.userConnected=JSON.parse(localStorage.getItem("Token"))
    }
  
  },

})
