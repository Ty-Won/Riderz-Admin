<template>
    <div id="rankingboard">
        <h1>{{ msg }}</h1>
        <div id="time">
            <form>
                Start date:<br>
                <input id='startTimeStamp' type="date" name="startName" value="1600-01-01"><br>
                End date:<br>
                <input id='endTimeStamp' type="date" name="endDame" value="2400-01-01"> <br><br>
                <b-button @click="filterByDateWrapper()"> Submit parameters </b-button>
            </form>
        </div>
		<h2>{{ driverTitle }}</h2>
		<div id="driverPerformance"></div>
		<h2>{{ userTitle }}</h2>
		<div id="userPerformance"></div>
        <br>
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
        methods:{
            filterByDateWrapper(){
                fetchPerformance();    
            }
        },
		mounted () {
			// fetchPerformance()
		}
    }
	
	function fetchPerformance() {
		//fetch the data from the input
        var timeStart = document.getElementById('startTimeStamp').value;
        var timeEnd = document.getElementById('endTimeStamp').value;
        //check if anything is entered
        if(timeStart == '' || timeEnd == ''){
            timeStart = '1600-01-01';
            timeEnd = '2400-01-01';
        }
        timeStart += ' 00:00:00';
        timeEnd += ' 00:00:00';

        axios
			.get('https://riderz-t10.herokuapp.com/users/getDriverPerformance',
				 {params: {startingTime: timeStart, endingTime: timeEnd}})
			.then((response) => {
                // Await until promise is fulfilled
                var string = '<table cellpadding = 10 border = 1 align = "center" > <tr> <td> <b> Operator </b> </td> <td> <b> Number of Trips Completed </b> </td> </tr> ';
                var data = response.data
                var count = 0;
				data.forEach(function(element) {

					// document.getElementById('driverPerformance').innerHTML += 
                    // 	element['username'] + ' ' + element['tripCount'] + '<br>'
					// we want to have alternating white and grey background
                    count++;
                    if(count % 2 == 0){
                        string = string + '<tr> <td>' + element['username'] + '</td> <td>' + element['tripCount'] + '</td> </tr>'
                    }
                    else{
                        string = string + '<tr> <td bgcolor = "#d9d9d9">' + element['username'] + '</td> <td bgcolor = "#d9d9d9">' + element['tripCount'] + '</td> </tr>'
                    }

                });
                string = string + '</table>';
                document.getElementById('driverPerformance').innerHTML = string;
                
	
				// Fetch user performance after driver performance
				axios
					.get('https://riderz-t10.herokuapp.com/users/getUserPerformance',
				        {params: {startingTime: timeStart, endingTime: timeEnd}})
					.then((response) => {
                        var string = '<table cellpadding = 10 border = 1 align = "center" > <tr> <td> <b> Passenger </b> </td> <td> <b> Number of Trips Completed </b> </td> </tr> ';
                        var data = response.data
                        var count = 0;
						data.forEach(function(element) {
							// document.getElementById('userPerformance').innerHTML += 
                            // 	element['username'] + ' ' + element['tripCount'] + '<br>'
                            count++;
                            if(count % 2 == 0){
                                string = string + '<tr> <td>' + element['username'] + '</td> <td>' + element['tripCount'] + '</td> </tr>'
                            }
                            else{
                                string = string + '<tr> <td bgcolor = "#d9d9d9">' + element['username'] + '</td> <td bgcolor = "#d9d9d9">' + element['tripCount'] + '</td> </tr>'
                            }
                        });
                        string = string + '</table>';
                        document.getElementById('userPerformance').innerHTML = string;
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