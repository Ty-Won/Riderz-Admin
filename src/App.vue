<template>
    <div id="app">

        <mainNavbar></mainNavbar>
        <router-view></router-view>
        <pageFooter></pageFooter>
        <link rel="stylesheet" type="text/css" href="./stylesheet.css">
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
    </div>


</template>

<script>
import mainNavbar from "./components/navbar.vue";
import signInModal from "./components/signInModal.vue";
import pageFooter from "./components/footer.vue";
import axios from "axios";

export default {
  name: "app",
  data() {
    return {
       form: {
       username: "",
       password: ""
       },
      modal_title:"Sign In",
      modalButtonTitle:"Sign In",
    };
  },
  props: {
      isSignedIn:false

  },
  components: {
    mainNavbar,
    signInModal,
    pageFooter

  }
};
</script>

