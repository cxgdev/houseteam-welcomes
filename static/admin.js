const serverURL = "https://motcharter.houseteams.cxgdev.com";

function log(content) {
    console.log(content);
    updateScroll();
}

function error(content) {
    console.error(content);
    updateScroll();
}

const teamChangeSubmitButton = document.getElementById("rtss");
const activityChangeSubmitButton = document.getElementById("atss");
const roomToChange1 = document.getElementById("room-select1");
const roomToChange2 = document.getElementById("room-select2");
const changeToTeam = document.getElementById("team-select");
const changeToActivity = document.getElementById("activity-select");
const token = document.getElementById("token");
const submitToken = document.getElementById("submit-token");

log("Fetching token from cookies...");
let authToken = getCookie("token");
token.value = authToken;

submitToken.addEventListener("click", () => {

    log("Submitting token");

    // Add connected rooms to dropdown menu
    try {
        roomToChange1.innerHTML = '<option value="">-- Select room --</option>';
        roomToChange2.innerHTML = '<option value="">-- Select room --</option>';
        fetch(`${serverURL}/connected`, { headers: { "Authorization": `Bearer ${token.value}` } })
            .then(response => response.json())
            .then(data => {
                if (data.error.error === true) {
                    console.error(`Error while submitting token. ${data.error.code} ${data.error.message}`);
                } else {
                    log("Token submitted");
                    log(data.data);
                    data.data.forEach((element, index) => {
                        roomToChange1.add(new Option(element.room, element.id));
                        roomToChange2.add(new Option(element.room, element.id));
                    });
                    document.cookie = `token=${token.value}`;
                    authToken = token.value;
                }
            });
    } catch (err) {
        log("Error while submitting token: " + err.message)
        error(err);

    }
});

teamChangeSubmitButton.addEventListener("click", () => {
    if (roomToChange1.value !== "") {
        log(`Changing room ${roomToChange1.value} to team ${changeToTeam.value}`);
        fetch(`${serverURL}/updateRotation`, {
            method: "POST", headers: { "Authorization": `Bearer ${authToken}`, "Content-Type": "application/json", }, body: JSON.stringify({
                id: roomToChange1.value,
                toTeam: changeToTeam.value
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error.error === true) {
                    error(`Error occurred while making request to ${serverURL}/updateRotation:`);
                    error(`Response Code: ${data.error.code}\nMessage: ${data.error.message}\nReason: ${data.error.reason}`)
                } else {
                    log("Request was a success");
                }
            });
    } else {
        error(`Cannot change room to team ${changeToTeam.value} because no room is selected`)
    }
});

activityChangeSubmitButton.addEventListener("click", () => {
    if (roomToChange2.value !== "") {
        log(`Changing room ${roomToChange1.value} to team ${changeToActivity.value}`);
        fetch(`${serverURL}/updateActivity`, {
            method: "POST", headers: { "Authorization": `Bearer ${authToken}`, "Content-Type": "application/json", }, body: JSON.stringify({
                id: roomToChange2.value,
                toActivity: changeToActivity.value
            })
        })
            .then(response => response.json())
            .then(data => {
                if (data.error.error === true) {
                    error(`Error occurred while making request to ${serverURL}/updateRotation:`);
                    error(`Response Code: ${data.error.code}\nMessage: ${data.error.message}\nReason: ${data.error.reason}`)
                } else {
                    log("Request was a success");
                }
            });
    } else {
        error(`Cannot change room to activity ${changeToActivity.value} because no room is selected`)
    }
});

// getCookie() method from https://w3schools.com

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

var scrolled = false;

function updateScroll() {
    let con = document.getElementById("console-log-div");
    con.scrollTop = con.scrollHeight;
}

let timer = null;

document.getElementById("console-log-div").addEventListener("scroll", () => {
    if(timer !== null) {
        clearTimeout(timer);
        scrolled = false;   
    }
    timer = setTimeout(function() {
          scrolled = true;
    }, 150);
});
