<template>
    <b-container id="rankingboard">
        <b-row>
            <b-col class="mx-auto">
                <h1>{{ msg }}</h1>
                <div id="time">
                    <b-alert variant="warning"
                             dismissible
                             :show="showDismissibleAlert"
                             @dismissed="showDismissibleAlert=false">
                        {{warningMessage}}
                    </b-alert>
                    <form>
                        Start date:<br>
                        <input id='startTimeStamp' type="date" name="startName" :value="startTime" class="mb-3 timepicker"><br>
                        End date:<br>
                        <input id='endTimeStamp' type="date" name="endName" :value="endTime" class="timepicker"> <br><br>
                        <b-button @click="filterByDateWrapper()"> Apply date filter </b-button>
                    </form>
                </div><br>
            </b-col>
        </b-row>
        <b-row>
            <b-col>
                <h2>{{ driverTitle }}</h2>
                <div id="driverPerformance"></div>
            </b-col>
            <b-col>
                <h2>{{ userTitle }}</h2>
                <div id="userPerformance"></div>
            </b-col>
        </b-row>
    </b-container>
</template>

<script>
	import axios from 'axios'

    export default {
        name: "rankingboard",
        data () {
            const currentDate = new Date();
            const previousYear = new Date();
            previousYear.setFullYear(currentDate.getFullYear() - 1);

            return {
                msg: 'Ranking Board',
				driverTitle: 'Driver Performance',
				userTitle: 'User Performance',
                endTime: currentDate.toJSON().slice(0, 10),
                startTime: previousYear.toJSON().slice(0, 10),
                missingValues: false,
                showDismissibleAlert: false,
                warningMessage: ""
            }
        }, created() {
            if(!parseBool(get_cookie("isSignedIn"))){
                this.$router.push("/");
            }
        },
        methods:{
            filterByDateWrapper(){
                var timeStart = document.getElementById('startTimeStamp').value;
                var timeEnd = document.getElementById('endTimeStamp').value;
                if(timeStart == ''){
                    this.showDismissibleAlert=true;
                    this.warningMessage = "Please choose a start date to filter your search.";
                } else if (timeEnd == ''){
                    this.showDismissibleAlert=true;
                    this.warningMessage = "Please choose an end date to filter your search.";
                }else{
                    fetchPerformance(timeStart,timeEnd);
                }
            }
        },
		mounted () {
            var timeStart = document.getElementById('startTimeStamp').value;
            var timeEnd = document.getElementById('endTimeStamp').value;
            fetchPerformance(timeStart,timeEnd);
		}
    }
	
	function fetchPerformance(timeStart, timeEnd) {
        timeStart += ' 00:00:00';
        timeEnd += ' 00:00:00';

        axios
			.get('https://riderz-t10.herokuapp.com/users/getDriverPerformance',
				 {params: {startingTime: timeStart, endingTime: timeEnd}})
			.then((response) => {
                // Await until promise is fulfilled
                var string = '<table cellpadding = 10 border = 1 align = "center" > <tr> <td> <b> Operator </b> </td> <td> <b> Number of Trips Completed </b> </td> </tr> ';
                var data = response.data;
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
