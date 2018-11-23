<template>
  <div id="app">

    <!--if navbar is not signed in, no profile button-->
   <navbar signedIn=False></navbar>

   <b-container>

    <b-jumbotron header="Riderz" lead="Ride Sharing App">
      <p>Ride Sharing Admin</p>
      <signInModal align-v="center" v-bind:title="modal_title" v-bind:modalButtonTitle="modalButtonTitle" >
      </signInModal>
    </b-jumbotron>

    <!-- <bModal id="signInModal" centered align-v="center" title="hello">
    <div>
      <b-form @submit="login"> 

            <b-form-group   id="usernameInputGroup"
                            label="Username">

                <b-form-input id="usernameInput"
                                type="text"
                                v-model="form.username"
                                required 
                                placeholder="Enter Username"
                                ref="signInUser">
                </b-form-input>
            </b-form-group>   


            <b-form-group>
                <b-form-input id="password"
                                type="password"
                                v-model="form.password"
                                label="Password"
                                required 
                                placeholder="Password"
                                ref="signInPass">
                </b-form-input>
            </b-form-group>

      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>

      </b-form>
    </div>
    
    </bModal> -->



   </b-container>
   

  </div>
  
</template>

<script>
import navbar from "./components/navbar.vue";
import signInModal from "./components/modal.vue";
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
      modalButtonTitle:"Sign In"
    };
  },
  components: {
    navbar,
    signInModal,

  }
};
</script>

<style>
</style>
