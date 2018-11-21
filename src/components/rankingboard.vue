<template>
    <div id="rankingboard">
        <h1>{{ msg }}</h1>
		<h2>{{ driverTitle }}</h2>
		<div id="driverPerformance"></div>
		<h2>{{ userTitle }}</h2>
		<div id="userPerformance"></div>
    </div>
</template>

<script>
	import axios from 'axios'
	
    export default {
        name: "rankingboard",
        data () {			
            return {
                msg: 'Ranking Board',
				driverTitle: 'Driver Performance',
				userTitle: 'User Performance'
            }
        }, 
		mounted () {
			fetchPerformance()
		}
    }
	
	function fetchPerformance() {
		axios
			.get('https://riderz-t10.herokuapp.com/users/getDriverPerformance',
				 {params: {startingTime:'1600-01-01 00:00:00', endingTime:'2400-01-01 00:00:00'}})
			.then((response) => {
				// Await until promise is fulfilled
				var data = response.data
				data.forEach(function(element) {
					document.getElementById('driverPerformance').innerHTML += 
						element['username'] + ' ' + element['tripCount'] + '<br>'
				});
	
				// Fetch user performance after driver performance
				axios
					.get('https://riderz-t10.herokuapp.com/users/getUserPerformance',
						 {params: {startingTime:'1600-01-01 00:00:00', endingTime:'2400-01-01 00:00:00'}})
					.then((response) => {
						var data = response.data
						data.forEach(function(element) {
							document.getElementById('userPerformance').innerHTML += 
								element['username'] + ' ' + element['tripCount'] + '<br>'
						});
					})
					.catch((error) => {
						// Handle any errors here
						// Log error for easy debugging
						console.error(error)
					})
			})
			.catch((error) => {
				// Log error for easy debugging
				console.error(error)
			})
	}
</script>

<style scoped>

</style>