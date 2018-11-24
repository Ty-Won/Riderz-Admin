import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import "./stylesheet.css"
// import "https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"


    Vue.use(BootstrapVue);

export const serverBus = new Vue();

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
