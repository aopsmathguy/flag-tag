
import React, { useRef, useEffect } from 'react'
import { ws, t, inputs, game } from './sharedVars.js';
import { EVENTCODES, PacketSender, PacketHandler } from './common/packets.js';
import { InputManager } from './inputManager.js';
import { c } from './common/constants.js';

function Canvas() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animateId = 0;
        const animate = function(){
          console.log("frame");
          animateId = requestAnimationFrame(animate);
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
          if (game.current){
            while (game.current.f2world.time < Date.now()/1000 + t.timeDiff){
              game.inputManager.actInputs(game.current, game.PID, c.TIME_STEP);
              game.current.stepPhysics(c.TIME_STEP);
            }
            const player = game.current.players[game.PID];
            const delt = (Date.now()/1000 + t.timeDiff) - game.current.f2world.time;
            ctx.translate(canvas.width/2, canvas.height/2);
            ctx.scale(20,20);
            const {position} = player.f2body.createPlacement(delt);
            // ctx.rotate(-angle);
            ctx.translate(-position.x, -position.y);
            ctx.lineWidth = 0.1;
            ctx.fillStyle = "rgba(0,0,0,0)";
            game.current.f2world.display(ctx, delt);
            ctx.restore();
          }
        }
        animateId = requestAnimationFrame(animate);
        return ()=>{
          cancelAnimationFrame(animateId);
        }
    }, []);
    useEffect(()=>{
        game.inputManager = new InputManager();
        const broadcast = ()=>{
          const timeActuate = Date.now()/1000 + t.timeDiff + t.ping/2;
          game.inputManager.addInput({
            time : timeActuate, inputs : game.inputs
          })
          ws.packetSender.send(EVENTCODES.INPUT, {
            time : timeActuate, inputs : game.inputs
          });
        }
        const keyDown = (event)=>{
          if (event.repeat) { return }
          if (game.current && game.PID != undefined){
            const bitChange = inputs.keyToFunction[event.key];
            game.inputs |= bitChange;
            broadcast();
          }
        }
        const keyUp = (event)=>{
          if (event.repeat) { return }
          if (game.current && game.PID != undefined){
            const bitChange = inputs.keyToFunction[event.key];
            game.inputs &= ~bitChange;
            broadcast();
          }
        }
        window.addEventListener("keydown", keyDown);
        window.addEventListener("keyup", keyUp);
        return ()=>{
          game.inputManager = undefined;
          window.removeEventListener("keydown", keyDown);
          window.removeEventListener("keyup", keyUp);
        }
    }, []);
    return (<canvas ref={canvasRef} className = "Canvas"></canvas>);
}
export default Canvas;
