import { Server } from "socket.io";

export var connectedClients: Array<{ id: string, room: string | undefined | string[], team: "red" | "blue" | "green" | "yellow" }> = [];

let io: Server;

/**
 * 
 * Start the WebSocket for clients
 * @param httpServer The http server from express
 */

export default async function startWebSocket(httpServer: any) {
    console.log("Starting WebSocket...");
    io = new Server(httpServer);

    type Team = {

    }

    var clients: Array<{
        id: string,
        room: string | number,
        activity: string,
        currentTeam: Team,
        nextTeam: Team
    }>;

    io.on("connection", (socket) => {
        if (socket.handshake.query.room) {
            console.log(`${socket.id} | Room ${socket.handshake.query.room} just connected\n`);
            connectedClients.push({
                id: socket.id,
                room: socket.handshake.query.room,
                team: "red"
            });
        } else {

        }

        socket.on("disconnect", (reason) => {
            console.log(`${socket.id} | Room ${socket.handshake.query.room} just disconnected\nReason: ${reason}\n`);
            connectedClients.splice(connectedClients.findIndex(element => element.id === socket.id))
        });
    });

    console.log(`WebSocket started`);
}

export function changeTeam(socketID: string, team: "red" | "blue" | "green" | "yellow") {
    console.log("changing team")
    let socket = io.sockets.sockets.get(socketID);
    socket?.emit("update", team, () => {
        console.log(`Updated socket ${socket?.id} to team ${team}`);
    });
}