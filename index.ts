import net, { Socket } from 'net';
import Session from './src/session';
import Command from './src/command';
import MapServer from './src/map.server';

const PORT = 4201;
const COMMAND_FRAME_RATE = 1000 / 5;
const PHYSICS_FRAME_RATE = 1000 / 10; // 10 ticks per second

declare global {
    var allSockets : Array<Session>;
    var commandQueue: Array<Command>;
    var serverTick: number;
}

globalThis.allSockets = [];
globalThis.commandQueue = [];
globalThis.serverTick = 0;

const server = net.createServer();
const mapServer = new MapServer();

server.on( 'connection', ( socket ) => {
    console.log("Connection accepted");
    initConnection( socket );
});

server.listen( PORT, () => {
    console.log( "Server started on port ", PORT );
});

setInterval( mapServer.loopPhysics.bind( mapServer ), PHYSICS_FRAME_RATE );
//setInterval( mapServer.loopCommands.bind( mapServer ), COMMAND_FRAME_RATE );

const initConnection = ( socket: Socket ) => {
    let session = new Session( socket );
    globalThis.allSockets.push( session );
    
}

