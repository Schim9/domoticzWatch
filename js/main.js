
window.onload = function() {
  console.log('+[window.onload]');
  handleClickRefresh();
  // Call domoticz
  // Change icons depending on switches status
};

function handleClickLight(){
	console.log("Handle light action");
	// Call domoticz
	// Change icon status
}

function handleClickDoor(){
	console.log("Handle door action");
}

function handleClickGarage(){
	console.log("Handle garage action");
}


function handleClickRefresh(){
	
	
	var domoticz_pwd = Config.domoticz_pwd;
	var pushbullet_apikey = Config.pushbullet_apikey
	// Call domoticz and change icons	
	setTimeout(function() {
	    console.log("Init ok, icons loaded and domoticz_pwd set to ", domoticz_pwd);
	    console.log("pushbullet Api Key ", pushbullet_apikey);
	    document.getElementById("light").src="assets/light_on.png";
	}, 2000);
}

function handleError(errorMessage) {
	// Send request to Pushbullet
}