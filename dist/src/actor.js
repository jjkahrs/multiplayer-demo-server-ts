"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Actor {
    constructor() {
        this.id = "";
        this.posX = 0;
        this.posY = 0;
        this.posZ = 0;
        this.headingX = 0;
        this.headingY = 0;
        this.headingZ = 0;
        this.duration = 0;
        this.speed = 2;
        this.facingX = 0;
        this.facingY = 0;
        this.facingZ = 0;
    }
    toString() {
        return 'sessionId:' + this.id + ',' +
            `posX:` + this.posX.toFixed(3) + ',' +
            `posY:` + this.posY.toFixed(3) + ',' +
            `posZ:` + this.posZ.toFixed(3) + ',' +
            `headingX:` + this.headingX.toFixed(3) + ',' +
            `headingY:` + this.headingY.toFixed(3) + ',' +
            `headingZ:` + this.headingZ.toFixed(3) + ',' +
            `speed:` + this.speed.toFixed(3) + ',' +
            `facingX:` + this.facingX.toFixed(3) + ',' +
            `facingY:` + this.facingY.toFixed(3) + ',' +
            `facingZ:` + this.facingZ.toFixed(3);
    }
}
exports.default = Actor;
