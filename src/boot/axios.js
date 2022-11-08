import { boot } from 'quasar/wrappers'
import axios from 'axios'
import { useStore } from 'vuex'


let config = {
  baseURL: 'http://78.46.86.177:3000'
}

const api = axios.create(config)


export default boot(({ app }) => {
  app.config.globalProperties.$api = api
})


export { api }
