<template>
    <div id="statuslist">
        <h1>{{ msg }}</h1>
		<div id="table"></div>
		<b-button variant="primary" @click="filterByUserWrapper()">Users</b-button>
		<b-button variant="primary" @click="filterByDriverWrapper()">Drivers</b-button>
		<b-button variant="primary" @click="filterByRouteWrapper()">Routes</b-button>
		<h2 id="title">{{ title }}</h2>
		<b-input-group class="limited_size">
			<b-form-input></b-form-input>
			<b-button variant="primary">Apply Filter</b-button>
		</b-input-group>
    </div>
</template>

<script>
	import axios from 'axios'

    export default {
        name: "statuslist",
        data () {
            return {
                msg: 'Status List',
				title: 'Users'
            }
        },
		methods: {
			filterByUserWrapper() {
				filterByUser()
			},
			filterByDriverWrapper() {
				filterByDriver()
			},
			filterByRouteWrapper() {
				filterByRoute()
			}
		},
		mounted () {
			fetchActive()
		}
    }

	// Stores active username -> lastLoginTime pair
	var usersHash = {}

	// Stores active drivers -> [rating, personsRated, tripsCompleted] 
	var driversHash = {}
	
	// Stores active passengers -> []
	var passengersHash = {}
	
	// Stores active routes = [[startingAddress, startingTime, endingAddress, endingTime]]
	var routesArray = []
	
	/**
	 * Fetches all active drivers, passengers and routes from the database
	 */
	function fetchActive() {
		// Fetches all users first
		axios
			.get('https://riderz-t10.herokuapp.com/session')
			.then((response) => {
				// Await until promise is fulfilled
				var data = response.data
				data.forEach(function(element) {
					// Only store into usersHash if the user is active
					if (element['active'] == true) {
						usersHash[element['username']] = element['sessionTime']
					}
				})
				
				// Fetches all drivers and insert them into driversHash
				// Then insert
				axios
					.get('https://riderz-t10.herokuapp.com/driver/all')
					.then((response) => {
						var data = response.data
						// Insert all active drivers into driversHash
						data.forEach(function(element) {
							if (usersHash[element['operator']]) {
								driversHash[element['operator']] = 
									[element['rating'], 
									 element['personsRated'],
									 element['tripsCompleted']]
							}
						})
						
						// For keys in usersHash not found in driversHash
						// Insert them into passengersHash
						for (var key in usersHash) {
							if (!driversHash[key]) {
								passengersHash[key] = []
							}
						}
						
						// Fetches all routes and insert them into routesHash
						axios
							.get('https://riderz-t10.herokuapp.com/getAllActiveItineraries')
							.then((response) => {
								var data = response.data
								// Insert all active routes into routesHash
								data.forEach(function(element) {
									var startingLongitude = element['startingLongitude']
									var startingLatitude = element['startingLatitude']
									var startingTime = element['startingTime']
									var endingLongitude = element['endingLongitude']
									var endingLatitude = element['enedingLatitude']
									var endingTime = element['endingTime']
									
									const GMAPS_URL = 'https://maps.googleapis.com/maps/api/geocode/json?'
									const API_KEY = '&key=AIzaSyARBA8OOAyllhaTKzyroPqIJW8I47b7Nv8'
									
									// Build 2 URL to call to perform reverse geocoding
									var startingURL = GMAPS_URL + 'latlng=' + startingLatitude 
														+ ',' + startingLongitude + API_KEY
									var endingURL = GMAPS_URL + 'latlng=' + endingLongitude
														+ ',' + endingLongitude + API_KEY
									console.log(startingURL)
									console.log(endingURL)
									
									// New array to store into routesArray
									var insert = [startingTime, 1, endingTime, 3]
									
									// Perform reverse geocoding using Google Maps API
									axios
										.get(startingURL)
										.then((response) => {
											insert[1] = response.data.results[0].formatted_address
											axios
												.get(endingURL)
												.then((response) => {
													// Pushes the array of information on an active route into routesArray
													insert[3] = response.data.results[0].formatted_address
													routesArray.push(insert)
												})
										})
								})
								console.log(usersHash)
								console.log(driversHash)
								console.log(passengersHash)
								console.log(routesArray)
							})
					})
			})
			.catch((error) => {
				// Log error for easy debugging
				console.error(error)
			})
	}
	
	// TODO
	function filterByUser() {
		document.getElementById('title').innerHTML = 'Users'
	}
	
	// TODO
	function filterByDriver() {
		document.getElementById('title').innerHTML = 'Drivers'
	}
	
	// TODO
	function filterByRoute() {
		document.getElementById('title').innerHTML = 'Routes'
	}
</script>

<style scoped>
	.limited_size {
		width: 80%;
		margin: 0 auto;
	}
</style>