import { Server } from "socket.io";

export var connectedClients: Array<{ id: string, room: string | undefined | string[], team: "red" | "blue" | "green" | "yellow" | "", activity: string }> = [];

let io: Server;

/**
 * 
 * Start the WebSocket for clients
 * @param httpServer The http server from express
 */

export default async function startWebSocket(httpServer: any) {
    console.log("Starting WebSocket...");
    io = new Server(httpServer);

    io.on("connection", (socket) => {
        if (socket.handshake.query.room) {
            console.log(`${socket.id} | Room ${socket.handshake.query.room} just connected\n`);
            connectedClients.push({
                id: socket.id,
                room: socket.handshake.query.room,
                team: "",
                activity: "",
            });
        } else {

        }

        socket.on("disconnect", (reason) => {
            console.log(`${socket.id} | Room ${socket.handshake.query.room} just disconnected\nReason: ${reason}\n`);
            console.log(connectedClients);
            connectedClients.splice(connectedClients.findIndex(element => element.id === socket.id));
            console.log(connectedClients);
        });
    });

    console.log(`WebSocket started`);
}

export function changeTeam(socketID: string, team: "red" | "blue" | "green" | "yellow") {
    return new Promise((resolve, reject) => {
        console.log("changing team");
        let socket = io.sockets.sockets.get(socketID);
        socket?.emit("update", team, () => {
            console.log(`Updated socket ${socket?.id} to team ${team}`);
        });
        resolve(true);
    });
}

export function changeActivity(socketID: string, activity: string) {
    return new Promise((resolve, reject) => {
        try {
            console.log("changing activity");

            let socket = io.sockets.sockets.get(socketID);
            socket?.emit("updateActivity", activity, () => {
                console.log(`Updated socket ${socket?.id} to activity ${activity}`);
            });
            resolve(true);
        } catch (error) {
            console.error(error);
            resolve(false);
        }
    });
}