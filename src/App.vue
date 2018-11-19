<template>
  <div id="app">
      <b-navbar class="nav-color" toggleable="md" type="dark">

          <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

          <b-navbar-brand href="#">Riderz</b-navbar-brand>

          <b-collapse is-nav id="nav_collapse">

              <b-navbar-nav>
                  <b-nav-item href="#">Status List</b-nav-item>
                  <b-nav-item href="#">Ranking Board</b-nav-item>
              </b-navbar-nav>

              <!-- Right aligned nav items -->
              <b-navbar-nav class="ml-auto">
                      <b-nav-item v-show="isLoggedIn" href="#">Profile</b-nav-item>
                      <b-nav-item @click="isLoggedIn = false" v-show="isLoggedIn" href="#">Signout</b-nav-item>
                      <b-nav-item @click="isLoggedIn = true" v-show="!isLoggedIn" href="#">Login</b-nav-item>
              </b-navbar-nav>

          </b-collapse>
      </b-navbar>
    <img src="./assets/logo.png">
    <h1>{{ isLoggedIn }}</h1>
    <h2>Essential Links</h2>
    <ul>
      <li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
      <li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
    </ul>
    <h2>Ecosystem</h2>
    <ul>
      <li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
      <li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
      <li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
    </ul>
  </div>

  
</template>

<script>
import navbar from './components/navbar.vue'

export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App',
      tests:"jjojojoj",
      isLoggedIn: false,
      count: 0
    }
  }
}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.nav-color {
    background-color: blue;
}
</style>
