import { io } from "socket.io-client";

const params = new URLSearchParams(location.search);
document.body.classList.add(params.get("team"));

const serverURL = "https://motcharter.houseteams.cxgdev.com";
const socket = io(serverURL, {
    query: {
        "room": params.get("room")
    }
});

socket.on("update", (team) => {
    try {
        console.log(`Requested team change to ${team}`);
        document.body.className = `constellation ${team.toLowerCase()}`;
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