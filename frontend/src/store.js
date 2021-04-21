import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist';
import localForage from 'localforage';
import axios from './services/axios-auth'
import router from './router';

Vue.use(Vuex)

const vuexStorage = new VuexPersist({
  key: 'sourcelink',
  storage: localForage,
})

export default new Vuex.Store({
  plugins: [vuexStorage.plugin],
  state: {
    authToken: null,
    userId: null,
    books: [],
    currentBook: null,
    status: null,
    message: null,
  },
  getters: {
    loggedIn: state => !!state.authToken,
    userId: state => state.userId,
    books: state => state.books,
    status: state => state.status,
    message: state => state.message
  },
  mutations: {
    login(state, userData) {
      state.authToken = userData.auth_token
      state.userId = userData.user_id
    },
    logout(state) {
      state.authToken = ''
      state.userId = ''
    },
    setBooks(state, books) {      
      state.books = books.list
    },
    setStatus(state, data) {
      state.status = data.code
      state.message = data.message
    }
  },
  actions: {
    async login({ commit }, authData) {
      try {
        const res = await axios.post('/auth/token/login', {
          username: authData.username,
          password: authData.password
        })

        const data = res.data
        const token = `Token ${data.auth_token}`
        localStorage.setItem('token', token)
        const currentUser = await axios.get('/auth/users/me', {
          headers: {
            'Authorization': token
          }
        })

        commit('login', {
          auth_token: token,
          user_id: currentUser.data.id
        })

        router.push({name: 'dashboard'})
      } catch (error) {
        const errorData = error.response.data
        const errorMsg = errorData.non_field_errors[0]
        localStorage.setItem('login_err', errorMsg)
      }
    },

    logout({ commit }) {      
      commit('logout')
      router.push('/login')
    },

    async myBooks({ commit }) {
      try {
        const token = localStorage.getItem('token')
        
        const res = await axios.get('/v1/books/mine', {
          headers: {
            'Authorization': token
          }
        })
        
        const data = res.data
        commit('setBooks', {
          list: data
        })
      } catch (error) {
        console.log(error)
      }
    },

    async createBook({commit}, data) {
      try {
        const token = localStorage.getItem('token')
        const res = await axios.post('/v1/books/', data, {
          headers: {
            'Authorization': token,
            'Content-Type': 'multipart/form-data'
          }
        })        
        commit('setStatus', {
          code: 200,
          message: 'Book has been created'
        })
      } catch (error) {
        const status = error.response.status

        commit('setStatus', {
          code: status,
          message: 'Duplicated issue'
        })
      }
    },

    async updateBook({commit}, data) {
      try {        
        const token = localStorage.getItem('token')
        const res = await axios.put(`/v1/books/${data.id}/`, data.form, {
          headers: {
            'Authorization': token,
            'Content-Type': 'multipart/form-data'
          }
        })
        
        commit('setStatus', {
          code: 200,
          message: 'Book has been updated'
        })
      } catch (error) {
        commit('setStatus', {
          code: 400,
          message: 'Duplicated issue'
        })
      }
    },

    async removeBook({commit}, data) {
      try {        
        const token = localStorage.getItem('token')
        const res = await axios.delete(`/v1/books/${data.id}/`, {
          headers: {
            'Authorization': token,            
          }
        })
      } catch (error) {
        console.log(error)
      }
    }
  },
})