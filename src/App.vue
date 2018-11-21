<template>
  <div id="app">

    <!--if navbar is not signed in, no profile button-->
   <navbar signedIn=False></navbar>
   <jumbotron headerText="Riderz" leadText="Ride Sharing App Admin"></jumbotron>

  </div>
  
</template>

<script>
import navbar from './components/navbar.vue'
import jumbotron from './components/jumbotron.vue'

export default {
  name: 'app',
  components: {
    navbar,
    jumbotron
  }
}

</script>

<style>

</style>
