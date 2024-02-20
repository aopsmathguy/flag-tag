import express from 'express';
const app = express();
import http from "http";
import cors from "cors";
import { WebSocketServer } from "ws";
app.use(cors());
const server = http.createServer(app);

import { c } from './common/constants.js';
import { EVENTCODES, PacketSender, PacketHandler } from './common/packets.js';
import { f2 } from './common/fisyx2d.js';
import { Rooms } from './rooms.js';
import { Game } from './common/gamelogic/game.js'
import { GameManager } from './common/gamelogic/gameManager.js';

const wss = new WebSocketServer({
    server : server,
    cors : {
        origin: "http://localhost:3000",
        methods : ["GET", "POST"],
    }
});
const rooms = new Rooms();
const gameMan = new GameManager();

wss.on("connection", (ws)=>{
    console.log("socket connected");
    ws.packetSender = new PacketSender(ws);
    ws.packetHandler = new PacketHandler(ws);

    let room = undefined;
    let player = undefined;
    let game = undefined;
    let lastInputTime = 0;
    ws.packetHandler.onMessage(EVENTCODES.JOIN, (data)=>{
        if (room == data.roomcode){
            return;
        }
        if (player && room){
            gameMan.leave(room, player);
        }
        room = data.roomcode;
        rooms.join(ws, room);
        player = gameMan.join(room);
        game = gameMan.getGame(room);

        ws.packetSender.send(EVENTCODES.PID, {PID : player.PID});
        ws.packetSender.send(EVENTCODES.GAME_INITIAL, Game.MessageManager.getGameInitialization(game));

        rooms.broadcastToRoom(room, EVENTCODES.ADD_PLAYER, Game.MessageManager.getPlayerInitialization(player));

        console.log('socket join room ' + room);
    });
    ws.packetHandler.onMessage(EVENTCODES.INPUT, (data)=>{
        lastInputTime = Math.max(data.time, lastInputTime + 0.0001);
        gameMan.onInput({
            time : lastInputTime,
            roomnum : room,
            player : player,
            inputs : data.inputs
        });
    });
    ws.packetHandler.onMessage(EVENTCODES.PING, (data)=>{
        ws.packetSender.send(EVENTCODES.PONG, {
            ctime : data.ctime,
            stime : Date.now()/1000
        });
    });
    ws.addEventListener('close', function(reasonCode, description) {
        if (player && room){
            rooms.broadcastToRoom(room, EVENTCODES.REMOVE_PLAYER, Game.MessageManager.getPlayerRemoval(player));
            rooms.leave(ws);
            gameMan.leave(room, player);
        }
        console.log('Socket disconnected');
    });
});

(function step_loop(dt){
    gameMan.stepAll(dt);
    setTimeout(step_loop.bind(this, dt), 1);
})(c.TIME_STEP);

(function broad_cast(){
    rooms.forEachRoom((roomcode)=>{
        const game = gameMan.getGame(roomcode);
        rooms.broadcastToRoom(roomcode, EVENTCODES.UPDATE_STATES, Game.MessageManager.getDynamicsUpdate(game));
    });
    setTimeout(broad_cast, c.UPDATE_TIME * 1000);
})();

server.listen(process.env.PORT || 3001, ()=>{
    console.log("SERVER RUNNING")
});