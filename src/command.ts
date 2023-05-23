import Session from './session';

export const COMMAND_TERMINATOR : string = ';';

class Command {

    raw: string;
    session: Session;
    timestamp: number;
    cmd: string;
    payload: string;

    constructor( raw: string, session: Session ) {
        this.raw = raw;
        this.session = session;
        let parts = raw.split('|');
        this.timestamp = +parts[0];
        this.cmd = parts[1];
        this.payload = (parts.length === 3) ? parts[2] : "";
    }
}

export default Command;