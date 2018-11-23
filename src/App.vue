<template>
    <div id="app">
        <b-navbar class="nav-color" toggleable="md" type="dark">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand href="#/">Riderz</b-navbar-brand>
            <b-collapse is-nav id="nav_collapse">
                <b-navbar-nav>
                    <b-nav-item v-show="isLoggedIn" href="#/status_list">Status List</b-nav-item>
                    <b-nav-item v-show="isLoggedIn" href="#/ranking_board">Ranking Board</b-nav-item>
                </b-navbar-nav>

                <!-- Right aligned nav items -->
                <b-navbar-nav class="ml-auto">
                    <b-nav-item @click="isLoggedIn = false" v-show="isLoggedIn" href="#/">Signout</b-nav-item>
                    <b-nav-item @click="isLoggedIn = true" v-show="!isLoggedIn" href="#/login">Login</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>
        <router-view></router-view>
        <link rel="stylesheet" type="text/css" href="./stylesheet.css">
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

