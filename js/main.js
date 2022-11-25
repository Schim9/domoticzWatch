window.onload = function() {
  console.log('+[window.onload]');
  handleClickRefresh();
};

function handleClickLight(){
	console.log("Handle light action");
	const idxSpot = Device.spot;
	const commandParam = "&type=command&param=switchlight&idx="+idxSpot+"&switchcmd=Toggle";
	callApi(commandParam, fetchStatusAfterAction);
}

function handleClickDoor(){
	console.log("Handle door action");
	const idxPorteCave = Device.porte_cave;
	const commandParam = "&type=command&param=switchlight&idx="+idxPorteCave+"&switchcmd=On";
	callApi(commandParam);
}

function handleClickGarage(){
	console.log("Handle garage action");
	const idxPorteGarage = Device.porte_garage;
	const commandParam = "&type=command&param=switchlight&idx="+idxPorteGarage+"&switchcmd=On";
	callApi(commandParam, fetchStatusAfterAction)
}

function handleClickRefresh(){
	const commandParam = "&type=devices";
	callApi(commandParam, updateDevicesStatus);
}

function fetchStatusAfterAction() {
	setTimeout(function() {
		handleClickRefresh();
	}, 3000);
}


function updateDevicesStatus(devices) {
	const relevantDevices = [Device.spot, Device.etat_porte_garage];
	devices.forEach(function(device) {
		if (relevantDevices.includes(device.idx)) {
			console.log("status of "+device.idx+" is", device.Status);	
			document.getElementById("door").src="assets/door_closed.png";
			switch (device.idx) {
			  case Device.spot:
				  if (device.Status === "Off") {
					  document.getElementById("light").src="assets/light_off.png";
				  } else {
					  document.getElementById("light").src="assets/light_on.png";
				  }
			    break;
			  case Device.etat_porte_garage:
				  if (device.Status === "Off") {
					  document.getElementById("garage").src="assets/garage_closed.png";
				  } else {
					  document.getElementById("garage").src="assets/lgarage_open.png";
				  }
			    break;
			  default:
			    console.log("Should not happen", device.idx);
			}
		}
	});
}

function callApi(commandParam, callBack) {
	const domoticz_host = Config.domoticz_host;
	const domoticz_usr = Config.domoticz_usr;
	const domoticz_pwd = Config.domoticz_pwd;
	const httpClient = new XMLHttpRequest();
	const url = domoticz_host + "/json.htm?username=" + domoticz_usr + "&password=" + domoticz_pwd + commandParam;
	httpClient.open("GET", url);
	httpClient.onreadystatechange = function () {
	    if (this.readyState === 4) {
	        if (this.status === 200) {
	        	navigator.vibrate(1000);
	            console.log(JSON.parse(this.responseText).result);
	            if (callBack) {
	            	callBack(JSON.parse(this.responseText).result);
	            } else {
	            	console.log("no callback");
	            }
	        } else {
	        	handleError();
	        	console.log("error", this); // handle error
	        }
	    }
	};

	httpClient.send();
}

function handleError(errorMessage) {
	// navigator.vibrate([1000, 1000, 1000, 1000, 1000]);
	 document.getElementById("light").src="assets/error.png";
	 document.getElementById("garage").src="";
	 document.getElementById("door").src="";
	// Send request to Pushbullet
	// POST / https://api.pushbullet.com/v2/pushes
	// post.addHeader("Access-Token", pushBulletProperties.getApiKey());
    // post.addHeader("Content-Type", "application/json");
	// StringEntity params =new StringEntity("{\"body\":\""+message+"\", " +
    //        "\"info\":\"" + title + "\"," +
    //        "\"type\":\"note\"} ", StandardCharsets.UTF_8);
}