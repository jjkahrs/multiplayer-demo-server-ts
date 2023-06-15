import {Socket} from 'net';
import SessionState from './session.state';
import Command, {COMMAND_TERMINATOR} from './command';
import Actor from './actor';

class Session {
    socket: Socket;
    state : SessionState;
    sessionId: string;
    actor: Actor;
    tick: number;
    buffer: string;

    constructor( s : Socket ) {
        this.socket = s;
        this.state = SessionState.Pending;
        this.sessionId = "";
        this.actor = new Actor();
        this.tick = 0;
        this.buffer = "";

        this.socket.on( 'data', ( data : string ) => this.read( data.toString() ) );
        this.socket.on( 'end', () => this.cleanup( this.socket ) );
        this.socket.on( 'timeout', () => this.cleanup( this.socket ) );
        this.socket.on( 'error', (err: Error) => this.socketError( err ));

        this.state = SessionState.WaitingForSessionId;
    }

    socketError( err: Error)
    {
        console.log("ERROR",err);
        this.cleanup(this.socket);
    }

    send( data: string ) {
        // Currently executed on a 100ms delay to simulate latency
        setTimeout( () => this.socket.write( data +';'), 100 );
        //this.socket.write( data +';');
    }

    read( data: string) {
        //console.log('Session.read()', data);
        this.handleData( data );
    }

    cleanup( socket: Socket ) {
        console.log('Session.cleanup()');
        // TO-DO: remove the player from the map and notify other sessions
        this.queueCommand(Date.now()+'|RemoveSession');

        // remove this session from allSockets
        globalThis.allSockets = globalThis.allSockets.filter( (s: Session) => s.socket != socket);
    }

    load( data: string ) {
        console.log('Loading session');
        this.state = SessionState.LoadingSession

        // Get the session token from data
        let parts = data.split(':');
        if(parts.length != 2) {
            return;
        }

        this.sessionId = parts[1];
        this.actor.id = this.sessionId;

        // TO-DO: Load player session from DB here

        // Mutate state and notify client
        this.actor.posX = 2;
        this.actor.posZ = 2;
        this.state = SessionState.Listening
        this.send('SessionReady');
        
        this.notifyOthersOfNewArrival();
    }

    queueCommand( data: string ) {
        globalThis.commandQueue.push( new Command( data, this ) );
    }

    notifyOthersOfNewArrival()
    {
        const timestamp = Date.now();
        globalThis.allSockets.forEach( (other: Session) => {
                if( other.sessionId === this.sessionId)
                    return;

                let message = timestamp + '|NewRemoteActor|'+ this.actor.toString();
                console.log("Notifying session ",other.sessionId,' of new remote actor ',this.sessionId);
                other.send(message);
            });
    }

    handleData( data: string ) {
        this.buffer += data;

        let endIndex = this.buffer.indexOf( COMMAND_TERMINATOR );
        while( endIndex >= 0 ) {
            let cmd = this.buffer.slice(0,endIndex);
            let remainder = this.buffer.slice(endIndex +1);
            
            this.buffer = remainder;
            endIndex = this.buffer.indexOf( COMMAND_TERMINATOR );

            switch( this.state ) {
                case SessionState.WaitingForSessionId: {
                    this.load( cmd );
                    break;
                }
                case SessionState.Listening: {
                    this.queueCommand( cmd );
                }
                default:
                    break;
            }
                
        }
    }
}

export default Session;