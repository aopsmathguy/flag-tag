import { c } from './common/constants.js';
import { EVENTCODES, PacketSender, PacketHandler } from './common/packets.js';

export const t = {
    timeDiff : 0, 
    ping : 0,
    getServerTime : function(ctime){
        return ctime + this.timeDiff + this.ping/2;
    }
}
export const inputs = {
    keyToFunction : null,
    updateKeyToFunction : function(keyBinds){
        this.keyToFunction = Object.entries(keyBinds).reduce((newObj, [key, value]) => {
            newObj[value] = c.INPUTS[key];
            return newObj;
        }, {});
    }
}
export const game = {
    current : undefined,
    PID : undefined,
    inputs : 0x00000000,
    inputManager : undefined
}
export const ws = window.ws = new WebSocket(c.WS);
ws.binaryType = 'arraybuffer';
ws.packetSender = new PacketSender(ws);
ws.packetHandler = new PacketHandler(ws);