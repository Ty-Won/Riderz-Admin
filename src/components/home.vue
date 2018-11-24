<template>
    <div id="home">
    <b-jumbotron header="Riderz" lead="Ride Sharing App">
      <img src="../assets/logo.png">
      <signInModal align-v="center" v-bind:title="modal_title" v-bind:modalButtonTitle="modalButtonTitle" >
      </signInModal>
    </b-jumbotron>
    </div>
</template>

<script>
import signInModal from "./signInModal.vue"
export default {
        name: "home",
        data() {
            return {
                msg: 'Welcome to Rider-z Admin Panel',
                modal_title:"Sign In",
                modalButtonTitle:"Sign In"
    };
  },
  components: {
    signInModal,

  }
}


    
</script>
