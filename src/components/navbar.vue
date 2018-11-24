<template>
        <b-navbar class="nav-color" toggleable="md" type="dark">
            <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
            <b-navbar-brand href="#">Riderz</b-navbar-brand>
            <b-collapse is-nav id="nav_collapse">
                <b-navbar-nav>
                    <b-nav-item v-show="isLoggedIn" href="#/status_list">Status List</b-nav-item>
                    <b-nav-item v-show="isLoggedIn" href="#/ranking_board">Ranking Board</b-nav-item>
                </b-navbar-nav>


                <b-navbar-nav class="ml-auto">
                  <b-nav-item v-show="isLoggedIn" @click="logOut">Sign Out</b-nav-item>
                </b-navbar-nav>
            </b-collapse>
        </b-navbar>

</template>



<script>
import { serverBus } from "../main";

export default {
  name: "mainNavbar",
  data() {
    return {
      isLoggedIn: false
    };
  },
  created() {
    serverBus.$on("signIn", () => {
      this.isLoggedIn = true;
    });
  },
  methods:{
    logOut(evt){
      this.$router.push("/");
      this.isLoggedIn = false;
    }
  }
};
</script>


<style>
.nav-color {
  background-color: #2b3a41;
}
</style>