import Command from './command';
import Session from './session';
import {Vector3d, Point3d, Transform} from 'open3d';

class MapServer {

    lastTimestamp: number;
    constructor() {
        this.lastTimestamp = Date.now();
    }

    // Update the position based on vector states
    loopPhysics() {
        globalThis.serverTick++;

        this.loopCommands();

        const newTimestamp = Date.now();
        const deltaTime = (newTimestamp - this.lastTimestamp) / 1000;

        let header = newTimestamp+'|WorldDelta|'+deltaTime+'|';
        let payload = "|";

        for( let i = 0; i< globalThis.allSockets.length; i++ ) {
            let session: Session = globalThis.allSockets[i];
                
            const headingVector = new Vector3d( session.actor.headingX, session.actor.headingY, session.actor.headingZ );
            const poisitionPoint = new Point3d( session.actor.posX, session.actor.posY, session.actor.posZ);
            const velocityVector = headingVector.Multiply( session.actor.speed * Math.min(deltaTime, session.actor.duration) );

            const translation = Transform.Translation( velocityVector );
            const translatedPoint = poisitionPoint.Transform( translation );

            session.actor.posX = translatedPoint.X;
            session.actor.posY = translatedPoint.Y;
            session.actor.posZ = translatedPoint.Z;

            let sessionData = (i === 0)?'':'^';
            sessionData = sessionData + 'sessionId:'+session.sessionId+","+session.actor.toString();
            payload = payload + sessionData;
        }

        for( let i = 0; i< globalThis.allSockets.length; i++ ) {
            globalThis.allSockets[i].tick++;
            globalThis.allSockets[i].send( header + globalThis.serverTick + payload );
        }
        this.lastTimestamp = newTimestamp;
    }

    // Process sent commands to update the vector states
    loopCommands() {
        globalThis.commandQueue.forEach( (command: Command) =>  this.processCommand( command ));
        globalThis.commandQueue = [];
    }

    processCommand( command: Command ){
        let timestamp: number = Date.now() / 1000;

        switch( command.cmd )
        {
            case 'RemoveSession':
                globalThis.allSockets.forEach( ( s : Session ) => {
                    s.send(command.timestamp+'|RemoveRemoteActor|id:'+command.session.sessionId);
                });
                break;
            case 'ReqPlayerState':
                let playerStateMsg = timestamp + '|PlayerState|' + command.session.actor.toString();
                command.session.send( playerStateMsg );
                break;
            case 'ReqWorldState':
                let worldStateMsg = timestamp + '|WorldState|' + this.currentWorldSnapshot();
                command.session.send( worldStateMsg );
                break;    
            case 'Heading':
                let parts = command.payload.split(',');
                command.session.actor.headingX = +parts[0];
                command.session.actor.headingY = +parts[1];
                command.session.actor.headingZ = +parts[2];
                break;
            case 'PlayerInput':
                let keyValPairs = command.payload.split(',');
                let clientTick = 0;
                keyValPairs.forEach( ( keyValPair: string ) => {
                    let pair = keyValPair.split(':');

                    switch( pair[0] ) {
                        case 'headingX':
                            command.session.actor.headingX = +pair[1];
                            break;
                        case 'headingY':
                            command.session.actor.headingY = +pair[1];
                            break;
                        case 'headingZ':
                            command.session.actor.headingZ = +pair[1];
                            break;
                        case 'tick':
                            clientTick = +pair[1];
                            break;
                        case 'duration':
                            command.session.actor.duration = +pair[1];
                            break;
                        case 'facingX':
                            command.session.actor.facingX = +pair[1];
                            break;
                        case 'facingY':
                            command.session.actor.facingY = +pair[1];
                            break;
                        case 'facingZ':
                            command.session.actor.facingZ = +pair[1];
                            break;
        
                        default:
                            break;
                    }
                });

            default:
                break;
        }
    }

    currentWorldSnapshot() {
        let payload = "";
        for( let i = 0; i< globalThis.allSockets.length; i++ ) {
            if( i > 0 )
                payload = payload + "^";
            
            payload = payload + globalThis.allSockets[i].actor.toString();
        }

        return payload;
    }
}

export default MapServer;