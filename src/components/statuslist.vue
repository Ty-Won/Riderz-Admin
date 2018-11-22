<template>
    <div id="statuslist"  style="align:center">
        <h1>{{ msg }}</h1>
		<div id="table"></div>
		<b-button variant="primary" @click="filterByUserWrapper()">Users</b-button>
		<b-button variant="primary" @click="filterByDriverWrapper()">Drivers</b-button>
		<b-button variant="primary" @click="filterByRouteWrapper()">Routes</b-button>
		<h2 id="title">{{ title }}</h2>
		<h5 id="subTitle">{{ subTitle }}</h5>
		<h6 id="filterIndication">{{ filterIndication }}</h6>
		<b-input-group class="limited_size">
			<b-form-input id="searchBox"></b-form-input>
		</b-input-group>
		<div id="results" style="align:center;margin-left:325px;"></div>
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
			/*
			searchFilter() {
				listChecker()
			}
			*/
		},
		mounted () {
			fetchActive()
		}
    }
	
	var mode = "none"

	// Stores active username -> lastLoginTime pair
	var usersHash = {}

	// Stores active drivers -> [rating, personsRated, tripsCompleted] 
	var driversHash = {}
	
	// Stores active passengers -> [username]
	var passengersArray = []
	
	// Stores active routes = [[tripID, startingAddress, startingTime, endingAddress, endingTime]]
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
								passengersArray.push(key)
							}
						}
						
						// Fetches all routes and insert them into routesHash
						/*axios
							.get('https://riderz-t10.herokuapp.com/getAllActiveItineraries')
							.then((response) => {
								var data = response.data
								// Insert all active routes into routesHash
								data.forEach(function(element) {
									var tripID = element['tripID']
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
									var insert = [tripID, startingTime, 2, endingTime, 4]
									
									// Perform reverse geocoding using Google Maps API
									axios
										.get(startingURL)
										.then((response) => {
											insert[2] = response.data.results[0].formatted_address
											axios
												.get(endingURL)
												.then((response) => {
													// Pushes the array of information on an active route into routesArray
													insert[4] = response.data.results[0].formatted_address
													routesArray.push(insert)
												})
										})
								})
								console.log(usersHash)
								console.log(driversHash)
								console.log(passengersArray)
								console.log(routesArray)
							})*/
							
					})
			})
			.catch((error) => {
				// Log error for easy debugging
				console.error(error)
			})
	}
	
	// TODO
	function filterByUser() {
	
		// Show important information when Users button is clicked
		document.getElementById('title').innerHTML = 'Users'
		document.getElementById('subTitle').innerHTML = 'Filter User Name'
		document.getElementById('filterIndication').innerHTML = '(Click again on Users to apply filter)'
		var textToSearch = document.getElementById('searchBox').value;
		
		var array_keys = new Array();
		var array_values = new Array();

		var placeHolder = document.getElementById('results');
		placeHolder.innerHTML = "";
		
		var table = document.createElement('table');
		
		var row1 = document.createElement('tr');
		
		var cell1 = document.createElement('td');
		cell1.innerHTML = "User name"
		
		var cell2 = document.createElement('td');
		cell2.innerHTML = "Email"
		
		var cell3 = document.createElement('td');
		cell3.innerHTML = "Phone"
		
		var cell4 = document.createElement('td');
		cell4.innerHTML = "First Name"
		
		var cell5 = document.createElement('td');
		cell5.innerHTML = "Last Name"
		
		row1.appendChild(cell1);
		row1.appendChild(cell2);
		row1.appendChild(cell3);
		row1.appendChild(cell4);
		row1.appendChild(cell5);
		
		table.appendChild(row1);
		placeHolder.appendChild(table);
	
		for (var key in driversHash) {
			
			var values = driversHash[key];
			
			var rower1 = document.createElement('tr');
		
			var col1 = document.createElement('td');
			col1.innerHTML = key;
			
			var col2 = document.createElement('td');
			col2.innerHTML = values[0];
			
			var col3 = document.createElement('td');
			col3.innerHTML = values[1];
			
			var col4 = document.createElement('td');
			col4.innerHTML = values[2];
			
			var col5 = document.createElement('td');
			col5.innerHTML = "value ... ";
			
			if(key.toUpperCase().indexOf(textToSearch.toUpperCase()) > -1){
				rower1.appendChild(col1);
				rower1.appendChild(col2);
				rower1.appendChild(col3);
				rower1.appendChild(col4);
				rower1.appendChild(col5);
				table.appendChild(rower1);
			}
		}		
	}
	
	// TODO
	function filterByDriver() {
		// Provide web user important information of the current web page
		document.getElementById('title').innerHTML = 'Drivers'
		document.getElementById('subTitle').innerHTML = 'Filter Operator'
		document.getElementById('filterIndication').innerHTML = '(Click again on Drivers to apply filter)'
		
		// Obtain information from the text box (filter)
		var textToSearch = document.getElementById('searchBox').value;

		// Initialize variable to deal with hash/array
		var array_keys = new Array();
		var array_values = new Array();

		// Create Table
		var placeHolder = document.getElementById('results');
		// Reset table when button click (to not generate multiple tables)
		placeHolder.innerHTML = "";
		
		// Establish the columns layout for row 1
		var table = document.createElement('table');
		var row1 = document.createElement('tr');
		
		var cell1 = document.createElement('td');
		cell1.innerHTML = "Operator |"
		
		var cell2 = document.createElement('td');
		cell2.innerHTML = "Rating |"
		
		var cell3 = document.createElement('td');
		cell3.innerHTML = "Number of Persons Who Rated |"
		
		var cell4 = document.createElement('td');
		cell4.innerHTML = "Number of Trips Completed"
		
		row1.appendChild(cell1);
		row1.appendChild(cell2);
		row1.appendChild(cell3);
		row1.appendChild(cell4);
		
		table.appendChild(row1);
		placeHolder.appendChild(table);
		
		// Fill in the table
		for (var key in driversHash) {
			
			var values = driversHash[key];
			
			var rowX = document.createElement('tr');
		
			var operator = document.createElement('td');
			operator.innerHTML = key;
			
			var rating = document.createElement('td');
			rating.innerHTML = values[0];
			
			var personsRated = document.createElement('td');
			personsRated.innerHTML = values[1];
			
			var tripsCompleted = document.createElement('td');
			tripsCompleted.innerHTML = values[2];
			
			// Filter operators in the search box
			if(key.toUpperCase().indexOf(textToSearch.toUpperCase()) > -1){
				rowX.appendChild(operator);
				rowX.appendChild(rating);
				rowX.appendChild(personsRated);
				rowX.appendChild(tripsCompleted);
				table.appendChild(rowX);
			}
		}
	}
	
	// TODO
	function filterByRoute() {
		document.getElementById('title').innerHTML = 'Routes'
		document.getElementById('subTitle').innerHTML = 'Filter End Location'
		document.getElementById('filterIndication').innerHTML = '(Click again on Routes to apply filter)'
	}
</script>

<style scoped>
	.limited_size {
		width: 80%;
		margin: 0 auto;
	}
</style>