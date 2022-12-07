window.onload = function () {
    console.log("ERK - widget loaded 13:18");
    handleClickRefresh();
};

function handleClickRefresh() {
    console.log("ERK - handleClickRefresh");
    const commandParam = "&type=devices";
    callApi(commandParam, updateDevicesStatus);
}

function handleClickLight() {
    const idxSpot = Device.spot;
    const commandParam = "&type=command&param=switchlight&idx=" + idxSpot + "&switchcmd=Toggle";
    callApi(commandParam, fetchStatusAfterAction);
}

function handleClickGarage() {
    const idxPorteGarage = Device.porte_garage;
    const commandParam = "&type=command&param=switchlight&idx=" + idxPorteGarage + "&switchcmd=On";
    callApi(commandParam, fetchStatusAfterAction)
}

function handleClickDoor() {
    const idxPorteCave = Device.porte_cave;
    const commandParam = "&type=command&param=switchlight&idx=" + idxPorteCave + "&switchcmd=On";
    callApi(commandParam);
}

function fetchStatusAfterAction(result) {
    console.log("ERK - fetchStatusAfterAction");
    console.log("ERK - fetchStatusAfterAction. result ==" + JSON.stringify(result));

    setTimeout(function () {
        console.log("ERK - fetchStatusAfterAction - action triggered");
        handleClickRefresh();
    }, 3000);
}

function updateDevicesStatus(response) {
    var devices = [];
    if (response.result) {
        devices= response.result
    }
    console.log("ERK - updateDevicesStatus: status updated for " + devices.length + " element(s)");
    const devicesThatHaveStatus = [Device.spot, Device.etat_porte_garage];
    devices.forEach(function (device) {
        if (devicesThatHaveStatus.includes(device.idx)) {
            // In case of any error, door icon has been cleared
            document.getElementById("door").src = "assets/door_closed.png";
            switch (device.idx) {
                case Device.spot:
                    if (device.Status === "Off") {
                        document.getElementById("light").src = "assets/light_off.png";
                    } else {
                        document.getElementById("light").src = "assets/light_on.png";
                    }
                    break;
                case Device.etat_porte_garage:
                    if (device.Status === "Off") {
                        document.getElementById("garage").src = "assets/garage_closed.png";
                    } else {
                        document.getElementById("garage").src = "assets/lgarage_open.png";
                    }
                    break;
                default:
                    console.log("Should not happen", device.idx);
            }
        }
    });
}

function callApi(commandParam, callBack) {

    console.log("ERK - callAPI");
    const domoticz_host = Param.domoticz_host;
    const domoticz_usr = Param.domoticz_usr;
    const domoticz_pwd = Param.domoticz_pwd;
    const urlDomoticzQuery = domoticz_host + "/json.htm?username=" + domoticz_usr + "&password=" + domoticz_pwd + commandParam;

    // const urlDev = "https://httpbin.org/ip";
    const urlDev = "http://httpbin.org/anything";
    // const urlDev = "https://smoothiz-back.xpertiz.lu/api/conf/app-info";
    // const urlDev = 'https://domotique.kaminski.lu/json.htm?type=command&param=getversion';
    // const urlDev = 'http://192.168.0.97:8084/json.htm?type=command&param=getversion';
    // const urlDev = "http://192.168.0.97:8084/json.htm?username=" + domoticz_usr + "&password=" + domoticz_pwd + commandParam;
    console.log("ERK - urlDev (" + urlDev + ")");

    const httpClient = new XMLHttpRequest();
    httpClient.open("GET", urlDomoticzQuery);
    httpClient.send();


    httpClient.onreadystatechange = function () {
        console.log("ERK onreadystatechange - readyState == (" + JSON.stringify(this.readyState) + ")" +
            "status == " + this.status + ".");
        if (this.readyState === 4) {
            console.log("ERK onreadystatechange - readyState is 4");
            if (this.status === 200) {
                console.log("ERK onreadystatechange - status is 200");
                // navigator.vibrate(1000);

                var results = {};
                if (this.responseText) {
                    console.log("ERK onreadystatechange - responseText is parsed and result is set");
                    result = JSON.parse(this.responseText);
                } else {
                    console.log("ERK onreadystatechange - no responseText");
                }

                // for test purpose
                // if (commandParam.includes("&type=devices")) {
                //     console.log("ERK onreadystatechange - it was a status request");
                //     results = mockStatusResponse;
                // } else {
                //     console.log("ERK onreadystatechange - it was an action request");
                //     results = mockActionResponse;
                // }
                //////////////////////////////

                if (callBack) {
                    callBack(result);
                }
            } else {
                console.log("ERK onreadystatechange - status is " + this.status);
                handleError();
                console.log("ERK onreadystatechange - error", this); // handle error
            }
        }
    };
    console.log("ERK - SEND REQUEST");
}

function handleError(errorMessage) {
    // navigator.vibrate([1000, 1000, 1000, 1000, 1000]);
    document.getElementById("light").src = "assets/error.png";
    document.getElementById("garage").src = "";
    document.getElementById("door").src = "";
    // TODO: Send request to Pushbullet
    // POST / https://api.pushbullet.com/v2/pushes
    // post.addHeader("Access-Token", pushBulletProperties.getApiKey());
    // post.addHeader("Content-Type", "application/json");
    // StringEntity params =new StringEntity("{\"body\":\""+message+"\", " +
    //        "\"info\":\"" + title + "\"," +
    //        "\"type\":\"note\"} ", StandardCharsets.UTF_8);
}