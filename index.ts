import express from "express";
import path from "path";
import startWebSocket, { changeTeam, connectedClients } from "./websocket.js";

console.log("Starting HTTP server...");

const __dirname = path.resolve();

const app = express();
// Reason for port 80: https://docs.bitnami.com/general/infrastructure/nodejs/get-started/understand-default-ports/
const port = 80;

app.use(express.json());

// Serve ./assets folder with express.static()
console.log("Serving assets...");
app.use("/static", express.static("./static"));

app.get("/display", (req, res) => {
    res.sendFile("pages/display.html", {root: __dirname })
});

app.get("/admin", (req, res) => {
    res.sendFile("pages/admin.html", {root: __dirname })
});

// The token required to allow an update
const updateToken = "Bearer CiGtOSWVa2XGea75S8Or8KkWEv7eHb8TQNInHFTrAquWYgD1UaiI7EgdZOyNNTazDE8eQOYn9HJdcUb7XfziMuEndZb7OUkUF24WfLERixMZAeJhPAPesrk0MEMuVK7gm0XosJpqs4QTluXBv963yxakPIXJTpjwRy93utiaJaQZcq9KfjjkD4KAUPKr9fU0oakgrne45nMyHSfrZWOBySuJ9Vokv7UlJtvgpRHEpNFW3bnonQq2CxedkyKgwFjp"

app.post("/updateRotation", (req, res) => {
    console.log(req.header("Authorization"));
    console.log(req.body);
    if(req.header("Authorization") === updateToken) {
        if (connectedClients.find(element => element.id === req.body.id) != undefined) {
            console.log("OK")
            connectedClients.find(element => element.id === req.body.id)!.team = req.body.toTeam;
            changeTeam(req.body.id, req.body.toTeam);
            res.send({
                error: {
                    error: false
                },
                data: "OK"
            })
        }
    } else {
        // Send error if token is wrong or not set
        res.status(401).send({
            error: {
                error: true,
                code: 401,
                message: "Unauthorized"
            }
        })
    }
});

app.get("/connected", (req, res) => {
    console.log("Request at /connected.");
    if(req.header("Authorization") === updateToken) {
        console.log("Request authorized");
        res.send({ error: { error: false }, data: connectedClients });
    } else {
        console.log("Request is unauthorized. Token given: " + req.header("Authorization"));
        // Send error if token is wrong or not set
        res.status(401).send({
            error: {
                error: true,
                code: 401,
                message: "Unauthorized"
            }
        })
    }
});

const server = app.listen(port, () => {
    console.log(`HTTP server listening on port ${port}`);
});

startWebSocket(server);