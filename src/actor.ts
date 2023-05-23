class Actor {

    id: string;

    posX: number;
    posY: number;
    posZ: number;

    headingX: number;
    headingY: number;
    headingZ: number;

    speed: number;
    duration: number;

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

    }

    toString() {
        return 'sessionId:'+this.id+','+
            `posX:`+this.posX.toFixed(3)+','+
            `posY:`+this.posY.toFixed(3)+','+
            `posZ:`+this.posZ.toFixed(3)+','+
            `headingX:`+this.headingX.toFixed(3)+','+
            `headingY:`+this.headingY.toFixed(3)+','+
            `headingZ:`+this.headingZ.toFixed(3)+','+
            `speed:`+this.speed.toFixed(3);
    }
}

export default Actor;