<template>
    <div>

        <b-btn v-b-modal.modal_component_container>{{modalButtonTitle}}</b-btn>

        <b-modal id="modal_component_container" v-bind:title="modal_title">
                <div>
        <b-form @submit="login"> 

            <b-form-group   id="usernameInputGroup"
                            label="Username">

                <b-form-input id="usernameInput"
                                type="text"
                                v-model="form.username"
                                required 
                                placeholder="Enter Username">
                </b-form-input>
            </b-form-group>   


            <b-form-group id="passwordInputGroup"
                            label="Password">
                <b-form-input id="password"
                                type="password"
                                v-model="form.password"
                                required 
                                placeholder="Password">
                </b-form-input>
            </b-form-group>


                    <b-button type="submit" variant="primary">Submit</b-button>
                    <b-button type="reset" variant="danger">Reset</b-button>



                </b-form>
            </div>
            <div slot="modal-footer"></div>
        </b-modal>
    </div>
</template>

<script>
import axios from "axios";

export default {
  name: "signInModal",
  props: {
    modal_title: String,
    modalButtonTitle: String
  },
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },
  methods: {
    login(evt) {
      evt.preventDefault();
      axios
        .post("https://riderz-t10.herokuapp.com/login", {
          username: "Marlon",
          password: "Bernardes"
        })
        .then(response => console.log(response))
        .catch(e => {
          console.log("LOL");
        });
    }
  }
};
</script>

<style>