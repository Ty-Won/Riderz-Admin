import Vue from 'vue'
import BootstrapVue from "bootstrap-vue"
import App from './App.vue'
import router from 'vue-router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-vue/dist/bootstrap-vue.css"
import "./stylesheet.css"

Vue.use(BootstrapVue);
Vue.use(router);

new Vue({
  el: '#app',
  render: h => h(App)
})
