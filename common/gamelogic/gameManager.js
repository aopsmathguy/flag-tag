import { Game } from './game.js';
import { PriorityQueue } from '../utils.js';

export class GameManager{
    inputHeaps;
    games;
    constructor(){
        this.inputHeaps = {};
        this.games = {};
    }
    createGame(roomnum){
        this.inputHeaps[roomnum] = new PriorityQueue((a, b)=>{return a.time < b.time});
        this.games[roomnum] = new Game(Date.now()/1000);
    }
    onInput({time, roomnum, player, inputs}){
        this.inputHeaps[roomnum].add({time, player, inputs});
    }
    getGame(roomnum){
        return this.games[roomnum];
    }
    join(roomnum){
        if (!this.games[roomnum]){
            this.createGame(roomnum);
        }
        const game = this.games[roomnum];
        const player = game.addPlayer();
        return player;
    }
    leave(roomnum, player){
        const game = this.games[roomnum];
        if (game){
            game.removePlayer(player);
            if (game.isEmpty()){
                delete this.games[roomnum];
                delete this.inputHeaps[roomnum];
            }
        }
    }
    stepAll(dt){
        for (const room in this.games){
            const game = this.games[room];
            while(game.f2world.time < Date.now()/1000){
                const inputsUntil = game.f2world.time + dt;
                const heap = this.inputHeaps[room];
                while (heap.peek() && heap.peek().time <= inputsUntil){
                    const {time, player, inputs} = heap.remove();
                    player.setInput(inputs);
                    // console.log(time + " " + inputs);
                }
                game.stepPhysics(dt);
            }
        }
    }
}