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
                                placeholder="Enter Username"
                                ref="username">
                </b-form-input>
            </b-form-group>   


            <b-form-group id="passwordInputGroup"
                            label="Password">
                <b-form-input id="password"
                                type="password"
                                v-model="form.password"
                                required 
                                placeholder="Password"
                                ref="password">
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
      var bodyFormData = new FormData();
      bodyFormData.set("username", this.$refs.username.value);
      bodyFormData.set("password", this.$refs.username.value);

        axios({
            method: 'post',
            url: "https://riderz-t10.herokuapp.com/login",
            data: bodyFormData
        })
        .then(response => this.$router.push("/profile"))
        .catch(e => {
          console.log("LOL");
        });
    }
  }
};
</script>

<style>