import { createStore } from 'vuex'

export default createStore({
  state: {
    isConnected:0,
    name:"rabah"
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
        }
    
    
  },
   
  modules: {
  }
})
