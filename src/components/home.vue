<template>
    <div id="home">
        <img src="../assets/logo.png">
        <h1>{{ msg }}</h1>
    </div>
</template>

<script>
    export default {
        name: "home",
        data () {
            return {
                msg: 'Welcome to Rider-z Admin Panel'
            }
        }
    }
</script>

<style scoped>

</style>