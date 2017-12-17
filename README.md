######### STATION APIS#########

### What is this repository for? ###
	- APIs for login and do actions (rent/back)

### How do I get set up? ###
	- git clone git clone https://zaynabm@bitbucket.org/zaynabm/stebn-apis.git
	- cd stebn-apis
	- npm install
	- edit config.js, set "stationID" to your station's ID 
	- node app
	
### APIs ? ###
- for all requests use :
	- Method: POST
	- headers: {Content-Type:application/json} 

1) check user RFID
		- url: http://[RPI IP]:9999/login/checkRFID
		- Body: {"userRFID":"[user RFID]"}
		
2) check user password 
		- url: http://[RPI IP]:9999/login/checkPassword
		- Body: {"userRFID":"[user RFID]","userPassword":"[user password]"}
		
3) Rent action   
		- url: http://[RPI IP]:9999/actions/rent
		- Body: {"userRFID":"[user RFID]","bikeRFID":"[bike RFID]"}
		
4) Back action 
		- url: http://[RPI IP]:9999/actions/back
		- Body: {"bikeRFID":"[bike RFID]"}
		