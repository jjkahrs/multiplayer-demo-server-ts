"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const session_state_1 = __importDefault(require("./session.state"));
const command_1 = __importStar(require("./command"));
const actor_1 = __importDefault(require("./actor"));
class Session {
    constructor(s) {
        this.socket = s;
        this.state = session_state_1.default.Pending;
        this.sessionId = "";
        this.actor = new actor_1.default();
        this.tick = 0;
        this.buffer = "";
        this.socket.on('data', (data) => this.read(data.toString()));
        this.socket.on('end', () => this.cleanup(this.socket));
        this.socket.on('timeout', () => this.cleanup(this.socket));
        this.socket.on('error', (err) => this.socketError(err));
        this.state = session_state_1.default.WaitingForSessionId;
    }
    socketError(err) {
        console.log("ERROR", err);
        this.cleanup(this.socket);
    }
    send(data) {
        // Currently executed on a 100ms delay to simulate latency
        setTimeout(() => this.socket.write(data + ';'), 100);
        //this.socket.write( data +';');
    }
    read(data) {
        console.log('Session.read()', data);
        this.handleData(data);
    }
    cleanup(socket) {
        console.log('Session.cleanup()');
        // TO-DO: remove the player from the map and notify other sessions
        // remove this session from allSockets
        globalThis.allSockets = globalThis.allSockets.filter((s) => s.socket != socket);
    }
    load(data) {
        console.log('Loading session');
        this.state = session_state_1.default.LoadingSession;
        // Get the session token from data
        let parts = data.split(':');
        if (parts.length != 2) {
            return;
        }
        this.sessionId = parts[1];
        this.actor.id = this.sessionId;
        // TO-DO: Load player session from DB here
        // Mutate state and notify client
        this.actor.posX = 2;
        this.actor.posZ = 2;
        this.state = session_state_1.default.Listening;
        this.send('SessionReady');
        this.notifyOthersOfNewArrival();
    }
    queueCommand(data) {
        globalThis.commandQueue.push(new command_1.default(data, this));
    }
    notifyOthersOfNewArrival() {
        const timestamp = Date.now();
        globalThis.allSockets.forEach((other) => {
            if (other.sessionId === this.sessionId)
                return;
            let message = timestamp + '|NewRemoteActor|' + this.actor.toString();
            console.log("Notifying session ", other.sessionId, ' of new remote actor ', this.sessionId);
            other.send(message);
        });
    }
    handleData(data) {
        this.buffer += data;
        let endIndex = this.buffer.indexOf(command_1.COMMAND_TERMINATOR);
        while (endIndex >= 0) {
            let cmd = this.buffer.slice(0, endIndex);
            let remainder = this.buffer.slice(endIndex + 1);
            this.buffer = remainder;
            endIndex = this.buffer.indexOf(command_1.COMMAND_TERMINATOR);
            switch (this.state) {
                case session_state_1.default.WaitingForSessionId: {
                    this.load(cmd);
                    break;
                }
                case session_state_1.default.Listening: {
                    this.queueCommand(cmd);
                }
                default:
                    break;
            }
        }
    }
}
exports.default = Session;
