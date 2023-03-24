const serverURL = "https://motcharter.houseteams.cxgdev.com";

const teamChangeSubmitButton = document.getElementById("rtss");
const roomToChange = document.getElementById("room-select");
const changeToTeam = document.getElementById("team-select");
const token = document.getElementById("token");
const submitToken = document.getElementById("submit-token");

console.log("Fetching token from cookies...");
let authToken = getCookie("token");
token.value = authToken;

submitToken.addEventListener("click", () => {

    console.log("Submitting token");

    // Add connected rooms to dropdown menu
    try {
        fetch(`${serverURL}/connected`, { headers: { "Authorization": `Bearer ${token.value}` } })
            .then(response => response.json())
            .then(data => {
                if (data.error.error === true) {
                    console.error(`Error while submitting token. ${data.error.code} ${data.error.message}`);
                } else {
                    console.log("Token submitted");
                    console.log(data.data);
                    data.data.forEach((element, index) => {
                        let option = document.createElement("option");
                        option.text = element.room;
                        option.value = element.id;
                        roomToChange.add(option, index + 1);
                    });
                    document.cookie = `token=${token.value}`;
                    authToken = token.value;
                }
            });
    } catch (err) {
        console.log("Error while submitting token: " + err.message)
        console.error(err);
    }
});

teamChangeSubmitButton.addEventListener("click", () => {
    if (roomToChange.value !== "") {
        console.log(`Changing room ${roomToChange.value} to team ${changeToTeam.value}`);
        fetch(`${serverURL}/updateRotation`, { method: "POST", headers: { "Authorization": `Bearer ${authToken}`, "Content-Type": "application/json", }, body: JSON.stringify({
            id: roomToChange.value,
            toTeam: changeToTeam.value
        })})
            .then(response => response.json())
            .then(data => {
                if (data.error.error === true) {
                    console.error(`Error occured while making request to ${serverURL}/updateRotation`)
                } else {

                }
            });
    } else {
        console.error(`Cannot change room to team ${changeToTeam.value} because no room is selected`)
    }
});

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