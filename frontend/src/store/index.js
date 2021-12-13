import { createStore } from 'vuex'

export default createStore({
  state: {
    isConnected:0,
    userConnected:{}
  },
/*
  getters: {
    connexion(){
      return JSON.parse(localStorage.getItem("Token"))
    }
  },
*/  
  mutations: {
    CONNEXION(state){
      state.isConnected=true
      },
    
    DECONNEXION(state){
      state.isConnected=false
      },
    
    USER_CONNECTED (state){
      state.userConnected=JSON.parse(localStorage.getItem("Token"))
    }
    
    
  },
   
  modules: {
  }
})
