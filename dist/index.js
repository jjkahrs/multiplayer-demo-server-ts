"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = __importDefault(require("net"));
const session_1 = __importDefault(require("./src/session"));
const map_server_1 = __importDefault(require("./src/map.server"));
const PORT = 4201;
const COMMAND_FRAME_RATE = 1000 / 5;
const PHYSICS_FRAME_RATE = 1000 / 10; // 10 ticks per second
globalThis.allSockets = [];
globalThis.commandQueue = [];
globalThis.serverTick = 0;
const server = net_1.default.createServer();
const mapServer = new map_server_1.default();
server.on('connection', (socket) => {
    console.log("Connection accepted");
    initConnection(socket);
});
server.listen(PORT, () => {
    console.log("Server started on port ", PORT);
});
setInterval(mapServer.loopPhysics.bind(mapServer), PHYSICS_FRAME_RATE);
//setInterval( mapServer.loopCommands.bind( mapServer ), COMMAND_FRAME_RATE );
const initConnection = (socket) => {
    let session = new session_1.default(socket);
    globalThis.allSockets.push(session);
};
