import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'
import app from './modules/app'
import menu from './modules/menu'
import role from './modules/role'
import user from './modules/user'
import dict from './modules/dict'
import org from './modules/org'
Vue.use(Vuex)

const state = {
  loading: false
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    app,
    menu,
    role,
    user,
    dict,
    org
  }
})

