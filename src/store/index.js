import { store } from 'quasar/wrappers'
import { createStore } from 'vuex'
import { ref } from 'vue'
import settings from 'assets/settings.json'

export default store(function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
    },
    state: {
      isAuthenticated: false,
      server: "",
      api_key: "",
      tab: "",

    },
    mutations: {
      initializeStore(state) {
        var storage_name = localStorage.getItem('username')
        var storage_pass = localStorage.getItem('password')
        state.tab = localStorage.getItem('tab')
        state.api_key = localStorage.getItem('api_key')
        state.server = localStorage.getItem('server')
        if ((storage_name == settings.USERNAME && storage_pass == settings.PASSWORD) ) {
          state.isAuthenticated = true
        } else {
          state.isAuthenticated = false
        }
      },
    },
  })

  return Store
})
