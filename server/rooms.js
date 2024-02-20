import { EVENTCODES, PacketSender, PacketHandler } from './common/packets.js';
export class Rooms{
    clientsInRooms;
    constructor(){
        this.clientsInRooms = {};
    }
    join(ws, room){
        this.leave(ws);
        ws.room = room;
        if (!this.clientsInRooms[room]){
            this.clientsInRooms[room] = new Set();
        } this.clientsInRooms[room].add(ws);
    }
    leave(ws){
        if (ws.room){
            this.clientsInRooms[ws.room].delete(ws);
            if (this.clientsInRooms[ws.room].size == 0){
                delete this.clientsInRooms[ws.room];
            }
        }
    }
    broadcastToRoom(room, ec, info){
        this.clientsInRooms[room].forEach((ws) => {
            ws.packetSender.send(ec, info);
        });
    }
    forEachRoom(f){
        for (const room in this.clientsInRooms){
            f(room);
        }
    }
}