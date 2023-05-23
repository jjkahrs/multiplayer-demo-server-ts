"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMAND_TERMINATOR = void 0;
exports.COMMAND_TERMINATOR = ';';
class Command {
    constructor(raw, session) {
        this.raw = raw;
        this.session = session;
        let parts = raw.split('|');
        this.timestamp = +parts[0];
        this.cmd = parts[1];
        this.payload = (parts.length === 3) ? parts[2] : "";
    }
}
exports.default = Command;
