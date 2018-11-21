<template>

    <b-jumbotron :header="headerText" :lead="leadText">
        <p id="jumbo-info"></p>
        <btn id="jumbo-button" variant='primary' href="#"></btn>
    </b-jumbotron>
</template>

<script>
    export default {
        name:'jumbotron',
        props:{
            headerText:String,
            leadText:String
        }
    }

  
</script>