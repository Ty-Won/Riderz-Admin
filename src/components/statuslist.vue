<template>
    <b-container id="statuslist" >
		<b-row>
			<b-col class="mx-auto">
				<h1>{{ msg }}</h1>
				<b-button @click="filterByUserWrapper()">Users</b-button>
				<b-button @click="filterByDriverWrapper()">Drivers</b-button>
				<b-button @click="filterByRouteWrapper()">Routes</b-button>
			</b-col>
		</b-row>
       <b-row>
		   <b-col>
			   <h2 id="title">{{ title }}</h2>
			   <h5 id="subTitle">{{ msg }}</h5>
			   <h6 id="filterIndication">{{ msg }}</h6>
			   <b-input-group class="limited_size">
				   <b-form-input id="searchBox"></b-form-input>
			   </b-input-group>
			   <div id="results" class="mb-3"></div>
			   <h5 id="loadWarning">{{ msg }}</h5>
		   </b-col>
	   </b-row>
    </b-container>
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
		}, created() {
			if(!parseBool(get_cookie("isSignedIn"))){
				this.$router.push("/");
			}
        },
		mounted () {
			fetchActive()
		}
    }
	
	var mode = "none"

	// Stores active username -> [lastLoginTime, firstName, lastName, email, phone]
	var usersHash = {}

	// Stores active drivers -> [rating, personsRated, tripsCompleted] 
	var driversHash = {}
	
	// Stores active passengers -> [username]
	var passengersArray = []
	
	// Stores active routes = [[tripID, startingTime,startingAddress,  endingTime, endingAddress, ]]
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
						usersHash[element['username']] = [element['sessionTime']]
					}
				})
				
				// Obtains user information and push relevant information into usersHash if they are active
				axios
					.get('https://riderz-t10.herokuapp.com/users/getAllUsers', {params: {username: '123'}})
					.then((response) => {
						var data = response.data
						data.forEach(function(element) {
							if (usersHash[element['username']]) {
								usersHash[element['username']].push(element['firstName'])
								usersHash[element['username']].push(element['lastName'])
								usersHash[element['username']].push(element['email'])
								usersHash[element['username']].push(element['phone'])
							}
						})
					
						// Fetches all drivers and insert them into driversHash
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
								axios
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
											var endingLatitude = element['endingLatitude']
											var endingTime = element['endingTime']
											
											const GMAPS_URL = 'https://maps.googleapis.com/maps/api/geocode/json?'
											const API_KEY = '&key=AIzaSyARBA8OOAyllhaTKzyroPqIJW8I47b7Nv8'
											
											// Build 2 URL to call to perform reverse geocoding
											var startingURL = GMAPS_URL + 'latlng=' + startingLatitude 
																+ ',' + startingLongitude + API_KEY
											var endingURL = GMAPS_URL + 'latlng=' + endingLatitude
																+ ',' + endingLongitude + API_KEY
											
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
															try {
																insert[4] = response.data.results[0].formatted_address
																routesArray.push(insert)
															} catch (err) {
																console.error(endingURL + " reverse geolocation failed to return a valid address")
															}
														})
												})
										})
										console.log(usersHash)
										console.log(driversHash)
										console.log(passengersArray)
										console.log(routesArray)
									})
									
							})
					})
			})
			.catch((error) => {
				// Log error for easy debugging
				console.error(error)
			})
	}
	
	function filterByUser() {
	
		// Provide web user important information of the current web page
		document.getElementById('title').innerHTML = 'Users'
		document.getElementById('subTitle').innerHTML = 'Filter User Name'
		document.getElementById('filterIndication').innerHTML = '(Click again on Users to apply filter)'
		
		// Obtain information from the text box (filter)
		var textToSearch = document.getElementById('searchBox').value;

		// Create Table
		var placeHolder = document.getElementById('results');
		
		// Instantiate warning message in case data did not fully uploaded yet
		var warningField = document.getElementById('loadWarning');
		warningField.style.padding = "40px";
		
		// Clear necessary fields
		placeHolder.innerHTML = "";
		warningField.innerHTML = "";
		
		// Table format
		var table = document.createElement('table');
		table.style.margin = 'auto' 
		table.cellPadding = "10";
		
		// Establish the columns layout for row 1
		var row1 = document.createElement('tr');
		
		var cell1 = document.createElement('td');
		cell1.innerHTML = "User name"
		cell1.style.backgroundColor = "#d9d9d9"
		cell1.style.fontWeight = 'bold';
		
		var cell2 = document.createElement('td');
		cell2.innerHTML = "First Name"
		cell2.style.fontWeight = 'bold';
		
		var cell3 = document.createElement('td');
		cell3.innerHTML = "Last Name"
		cell3.style.backgroundColor = "#d9d9d9"
		cell3.style.fontWeight = 'bold';
		
		var cell4 = document.createElement('td');
		cell4.innerHTML = "Email"
		cell4.style.fontWeight = 'bold';
		
		var cell5 = document.createElement('td');
		cell5.innerHTML = "Phone"
		cell5.style.backgroundColor = "#d9d9d9"
		cell5.style.fontWeight = 'bold';
		
		row1.appendChild(cell1);
		row1.appendChild(cell2);
		row1.appendChild(cell3);
		row1.appendChild(cell4);
		row1.appendChild(cell5);
		
		table.appendChild(row1);
		placeHolder.appendChild(table);
		
		// Warn web users in case the content was not fully uploaded
		if(Object.keys(usersHash).length == 0){
			warningField.innerHTML = 'Content did not yet fully uploaded, Click again on Users'
		}else{
			// Fill table
			for (var key in usersHash) {
				
				var values = usersHash[key];
				
				var rowX = document.createElement('tr');
			
				var userName = document.createElement('td');
				userName.innerHTML = key;
				userName.style.backgroundColor = "#d9d9d9"
				
				var firstName = document.createElement('td');
				firstName.innerHTML = values[1];
				
				var lastName = document.createElement('td');
				lastName.innerHTML = values[2];
				lastName.style.backgroundColor = "#d9d9d9"
				
				var email = document.createElement('td');
				email.innerHTML = values[3];
				
				var phone = document.createElement('td');
				phone.innerHTML = values[4];
				phone.style.backgroundColor = "#d9d9d9"
				
				if(key.toUpperCase().indexOf(textToSearch.toUpperCase()) > -1){
					rowX.appendChild(userName);
					rowX.appendChild(firstName);
					rowX.appendChild(lastName);
					rowX.appendChild(email);
					rowX.appendChild(phone);
					table.appendChild(rowX);
				}
			}	
		}			
	}
	
	function filterByDriver() {
		// Provide web user important information of the current web page
		document.getElementById('title').innerHTML = 'Drivers'
		document.getElementById('subTitle').innerHTML = 'Filter Operator'
		document.getElementById('filterIndication').innerHTML = '(Click again on Drivers to apply filter)'
		
		// Obtain information from the text box (filter)
		var textToSearch = document.getElementById('searchBox').value;

		// Create Table
		var placeHolder = document.getElementById('results');
		
		// Instantiate warning message in case data did not fully uploaded yet
		var warningField = document.getElementById('loadWarning');
		warningField.style.padding = "40px";
		
		// Clear necessary fields
		placeHolder.innerHTML = "";
		warningField.innerHTML = "";
		
		// Table format
		var table = document.createElement('table');
		table.style.margin = 'auto'
		table.cellPadding = "10";
		
		// Establish the columns layout for row 1
		var row1 = document.createElement('tr');
		
		var cell1 = document.createElement('td');
		cell1.innerHTML = "Operator"
		cell1.style.backgroundColor = "#d9d9d9"
		cell1.style.fontWeight = 'bold';
		
		var cell2 = document.createElement('td');
		cell2.innerHTML = "Rating"
		cell2.style.fontWeight = 'bold';
		
		var cell3 = document.createElement('td');
		cell3.innerHTML = "Number of Persons Who Rated"
		cell3.style.backgroundColor = "#d9d9d9"
		cell3.style.fontWeight = 'bold';
		
		var cell4 = document.createElement('td');
		cell4.innerHTML = "Number of Trips Completed"
		cell4.style.fontWeight = 'bold';
		
		row1.appendChild(cell1);
		row1.appendChild(cell2);
		row1.appendChild(cell3);
		row1.appendChild(cell4);
		
		table.appendChild(row1);
		placeHolder.appendChild(table);
		
		// Warn web users in case the content was not fully uploaded
		if(Object.keys(driversHash).length == 0){
			warningField.innerHTML = 'Content did not yet fully uploaded, Click again on Drivers'
		}else{
			// Fill in the table
			for (var key in driversHash) {
				
				var values = driversHash[key];
				
				var rowX = document.createElement('tr');
			
				var operator = document.createElement('td');
				operator.innerHTML = key;
				operator.style.backgroundColor = "#d9d9d9"
				
				var rating = document.createElement('td');
				rating.innerHTML = values[0];
				
				var personsRated = document.createElement('td');
				personsRated.innerHTML = values[1];
				personsRated.style.backgroundColor = "#d9d9d9"
				
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
	}
	
	function filterByRoute() {
		// Provide web user important information of the current web page
		document.getElementById('title').innerHTML = 'Routes'
		document.getElementById('subTitle').innerHTML = 'Filter End Address'
		document.getElementById('filterIndication').innerHTML = '(Click again on Routes to apply filter)'
		
		// Obtain information from the text box (filter)
		var textToSearch = document.getElementById('searchBox').value;

		// Create Table
		var placeHolder = document.getElementById('results');
		
		// Instantiate warning message in case data did not fully uploaded yet
		var warningField = document.getElementById('loadWarning');
		warningField.style.padding = "40px";
		
		// Clear necessary fields
		placeHolder.innerHTML = "";
		warningField.innerHTML = "";
		
		// Table format
		var table = document.createElement('table');
		table.style.margin = 'auto'
		table.cellPadding = "10";
		
		// Establish the columns layout for row 1
		var row1 = document.createElement('tr');
		
		var cell1 = document.createElement('td');
		cell1.innerHTML = "TripID"
		cell1.style.backgroundColor = "#d9d9d9"
		cell1.style.fontWeight = 'bold';
		
		var cell2 = document.createElement('td');
		cell2.innerHTML = "Starting Address"
		cell2.style.fontWeight = 'bold';
		
		var cell3 = document.createElement('td');
		cell3.innerHTML = "Starting Time"
		cell3.style.backgroundColor = "#d9d9d9"
		cell3.style.fontWeight = 'bold';
		
		var cell4 = document.createElement('td');
		cell4.innerHTML = "End Address"
		cell4.style.fontWeight = 'bold';
		
		var cell5 = document.createElement('td');
		cell5.innerHTML = "End Time"
		cell5.style.backgroundColor = "#d9d9d9"
		cell5.style.fontWeight = 'bold';
		
		row1.appendChild(cell1);
		row1.appendChild(cell2);
		row1.appendChild(cell3);
		row1.appendChild(cell4);
		row1.appendChild(cell5);
		
		table.appendChild(row1);
		placeHolder.appendChild(table);
		
		// Warn web users in case the content was not fully uploaded
		if( routesArray.length == 0){
			warningField.innerHTML = 'Content did not yet fully uploaded, Click again on Routes'
		
		}else{
			// Fill in the table
			for (var i = 0; i < routesArray.length; i++) {
				console.log(i)
				var rowX = document.createElement('tr');
				
				var tripID = document.createElement('td');
				tripID.innerHTML = routesArray[i][0];
				tripID.style.backgroundColor = "#d9d9d9"
				
				var startAddr = document.createElement('td');
				startAddr.innerHTML = routesArray[i][2]
				
				
				var startTime = document.createElement('td');
				startTime.innerHTML = routesArray[i][1];
				startTime.style.backgroundColor = "#d9d9d9"
				
				var endAddr = document.createElement('td')
				endAddr.innerHTML = routesArray[i][4]
				
				var endTime = document.createElement('td')
				endTime.innerHTML = routesArray[i][3]
				endTime.style.backgroundColor = "#d9d9d9"
				
				// Filter operators in the search box
				if(routesArray[i][4].toUpperCase().indexOf(textToSearch.toUpperCase()) > -1){
					rowX.appendChild(tripID);
					rowX.appendChild(startAddr);
					rowX.appendChild(startTime);
					rowX.appendChild(endAddr);
					rowX.appendChild(endTime);
					table.appendChild(rowX);
				}
			}
		}
	}

    function get_cookie ( cookie_name )
    {
        // https://www.thesitewizard.com/javascripts/cookies.shtml
        var cookie_string = document.cookie ;
        if (cookie_string.length != 0) {
            var cookie_array = cookie_string.split( '; ' );
            for (var i = 0 ; i < cookie_array.length ; i++) {
                var cookie_value = cookie_array[i].match ( cookie_name + '=(.*)' );
                if (cookie_value != null) {
                    return decodeURIComponent ( cookie_value[1] ) ;
                }
            }
        }
        return '' ;
    }

    function parseBool(val) { return val === true || val === "true" }
</script>

<style scoped>
	.limited_size {
		width: 80%;
		margin: 0 auto;
	}
</style>