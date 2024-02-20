import { f2 } from '../fisyx2d.js';
import { createWorld } from './maps.js';
import { Player } from './player.js';

export class Game{
    f2world;
    players;
    nextPID;
    constructor(time){
        this.f2world = createWorld(time);
        this.players = {};
        this.nextPID = 0;
    }
    isEmpty(){
        return !Object.keys(this.players).length;
    }
    addPlayer(PID, cfg){
        if (this.players[PID]){
            return false;
        }
        if (!PID){
            PID = this.nextPID ++;
        } else{
            this.nextPID = Math.max(this.nextPID, PID + 1);
        }
        var player = new Player(cfg);
        player.PID = PID;
        this.players[PID] = player;

        this.f2world.addBody(player.f2body);
        return player;
    }
    removePlayerID(PID){
        const player = this.players[PID];
        this.f2world.removeBody(player.f2body);

        player.PID = undefined;
        delete this.players[PID];
    }
    removePlayer(player){
        this.f2world.removeBody(player.f2body);

        const PID = player.PID;
        player.PID = undefined;
        delete this.players[PID];
    }
    stepPhysics(dt){
        for (var PID in this.players){
            this.players[PID].stepPhysics(dt);
        }
        this.f2world.step(dt);
    }
}
Game.MessageManager = {
    getPlayerInitialization : function(player){
        return {
            PID : player.PID,
            cfg : player.cfg,
            inputs : player.inputs
        }
    },
    getGameInitialization : function (game){
        let players = [];
        for (const PID in game.players){
            players.push(this.getPlayerInitialization(game.players[PID]));
        }
        return {time : game.f2world.time, players : players};
    },
    createGameInitialization : function (info){
        const game = new Game(info.time);
        const players = info.players;
        for (var i = 0; i < players.length; i++){
            const playerInfo = players[i];
            this.addPlayerInitialization(game, playerInfo);
        }
        return game;
    },
    addPlayerInitialization : function(game, playerInfo){
        const player = game.addPlayer(playerInfo.PID, playerInfo.cfg);
        if (player){
            player.inputs = playerInfo.inputs;
        }
    },
    getPlayerRemoval : function(player){
        return {PID: player.PID};
    },
    removePlayer : function(game, info){
        game.removePlayerID(info.PID);
    },
    getPlayerDynamics : function(player){
        const out = {
            PID : player.PID,
            dynamics : f2.Body.serializeDynamics(player.f2body),
            inputs : player.inputs,
            inputNum : player.inputNum
        }
        return out;
    },
    getDynamicsUpdate : function(game){
        const players = [];
        for (const PID in game.players){
            players.push(this.getPlayerDynamics(game.players[PID]));
        }
        const out = {time : game.f2world.time, players : players};
        return out;
    },
    updatePhysics : function(game, info){
        game.f2world.time = info.time;
        const players = info.players;
        for (var i = 0; i < players.length; i++){
            const playerInfo = players[i];
            const player = game.players[playerInfo.PID];
            player.f2body.updateDynamics(playerInfo.dynamics);
            player.inputs = playerInfo.inputs;
            player.inputNum = playerInfo.inputNum;
        }
    }
}