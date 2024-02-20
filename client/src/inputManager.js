export class InputManager{
    inputs;
    inputNum;
    constructor(){
        this.inputs = new Array(256);
        this.inputNum = 0;
    }
    addInput({time, inputs}){
        this.inputs[this.inputNum] = {time, inputs};
        this.inputNum = (this.inputNum + 1)%256;
    }
    actInputs(game, PID, dt){
        const inputsUntil = game.f2world.time + dt;
        const player = game.players[PID];
        while(player.inputNum != this.inputNum){
            if (this.inputs[player.inputNum]){
                const {time, inputs} = this.inputs[player.inputNum];
                if (time >= inputsUntil){
                    break;
                }
                player.setInput(inputs)
            } else{
                break;
            }
        }
    }
}