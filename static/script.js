import { io } from "socket.io-client";

const params = new URLSearchParams(location.search);
document.body.classList.add(params.get("team"));

const serverURL = "http://localhost:3000";
const socket = io(serverURL, {
    query: {
        "room": params.get("room")
    }
});

socket.on("update", (team) => {
    try {
        console.log(`Requested team change to ${team}`);
        document.body.className = `constellation ${team.toLowerCase()}`;
        document.getElementById("team").innerHTML = `Welcome ${team} Team!`;

        let bgText = document.getElementById("bgtxt");
        let text = team === "Red" ? "Friendship": team === "Blue" ? "Courage": team === "Green" ? "Vision": team === "Yellow" ? "Inspiration" : " ";
        console.log(text);
        bgText.innerHTML = text;

    } catch (error) {
        console.error(error);
        callback({
            error: {
                error: true,
                object: error
            }
        })
    }
});

socket.on("updateActivity", (activity) => {
    try {

        console.log(`Requested activity change to ${activity}`);
        let activityText = document.getElementById("atxt");

        activityText.innerHTML = activity;

    } catch (error) {
        console.error(error);
        callback({
            error: {
                error: true,
                object: error
            }
        })
    }
});

socket.on("connect", () => {
    console.log(`Connected to WebSocket at ${serverURL}`);
});