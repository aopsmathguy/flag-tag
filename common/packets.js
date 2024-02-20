import { build } from './schemapack.js';
export const EVENTCODES = {
    CODE : -1,
    JOIN : 0,
    PID : 1,
    PING : 2,
    PONG : 3,
    GAME_INITIAL : 4,
    ADD_PLAYER : 5,
    REMOVE_PLAYER : 6,
    UPDATE_STATES : 7,
    INPUT : 8
};
const packetSchemas = {
    [EVENTCODES.CODE] : build({
        eventCode : 'uint8'
    }),
    [EVENTCODES.JOIN] : build({
        username : 'string',
        roomcode : 'string'
    }),
    [EVENTCODES.PID] : build({
        PID : 'varuint'
    }),
    [EVENTCODES.PING] : build({
        ctime : 'float64'
    }),
    [EVENTCODES.PONG] : build({
        ctime : 'float64',
        stime : 'float64'
    }),
    [EVENTCODES.GAME_INITIAL] : build({
        time : 'float64',
        players : [
            {
                PID : 'varuint',
                cfg : {
                    color : 'string'
                },
                inputs : 'uint8'
            }
        ]
    }),
    [EVENTCODES.ADD_PLAYER] : build(
        {
            PID : 'varuint',
            cfg : {
                color : 'string'
            },
            inputs : 'uint8'
        }
    ),
    [EVENTCODES.REMOVE_PLAYER] : build(
        {
            PID : 'varuint'
        }
    ),
    [EVENTCODES.UPDATE_STATES] : build({
        time : 'float64',
        players : [
            {
                PID : 'varuint',
                dynamics : {
                    position : {
                        x : 'float32',
                        y : 'float32'
                    },
                    velocity : {
                        x : 'float32',
                        y : 'float32'
                    },
                    angle : 'float32',
                    angleVelocity : 'float32'
                },
                inputs : 'uint8',
                inputNum : 'uint8'
            }
        ]
    }),
    [EVENTCODES.INPUT] : build({
        time : 'float64',
        inputs : 'uint8'
    })
};

function serializePacket(ec, info){
    return packetSchemas[ec].encode(info);
};
function deserializePacket(ec, buffer){
    return packetSchemas[ec].decode(buffer);
};
export class PacketSender{
    ws;
    constructor(ws){
        this.ws = ws;
    };
    send(ec, info){
        if (this.ws.readyState === 1){
            this.ws.send(serializePacket(EVENTCODES.CODE, {
                eventCode : ec
            }));
            this.ws.send(serializePacket(ec, info));
        } else{
            console.log("packet fail " + this.ws.readyState);
        }
    }
}
export class PacketHandler{
    ws;

    nextPacketCode;
    listenerDictionary;
    constructor(ws){
        this.ws = ws;

        this.nextPacketCode = -1;
        this.listenerDictionary = {};
        
        this.ws.onmessage = (function(event){
            var data = event.data
            try{
                var packetInfo = deserializePacket(this.nextPacketCode, data);
            }catch{
                console.log("Packet does not fit schema. PacketCode: " + this.nextPacketCode + ".");
                this.onError();
                return;
            }
            if (this.nextPacketCode == EVENTCODES.CODE){
                this.nextPacketCode = packetInfo.eventCode;
            } else{
                if (this.listenerDictionary[this.nextPacketCode]){
                    this.listenerDictionary[this.nextPacketCode](packetInfo);
                    this.nextPacketCode = EVENTCODES.CODE;
                }else{
                    console.log("Unhandled PacketCode: " + this.nextPacketCode + ".");
                    this.onError();
                    return;
                }
            }
        }).bind(this);
    }
    removeAllMessageListeners(){
        this.listenerDictionary = {};
    }
    onMessage(ec, listener){
        this.listenerDictionary[ec] = listener;
    }
    onError(){
        console.log("Connection Terminated.")
        this.ws.close();
    }
}