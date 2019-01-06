// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import echarts from 'echarts'
import 'iview/dist/styles/iview.css'
// import './mock'
import 'babel-polyfill'
Vue.config.productionTip = false;

Vue.prototype.$echarts = echarts;

Vue.use(iView)



const app = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

store.dispatch('initMenus', app);

