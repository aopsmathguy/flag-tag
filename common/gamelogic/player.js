import { f2 } from '../fisyx2d.js';
import { c } from '../constants.js'
export class Player{
    cfg;
    PID;
    f2body;
    inputs;
    inputNum;
    constructor(cfg){
        this.cfg = new Player.Config(cfg);
        this.f2body = new f2.Body({
            fixtures : [
                {
                    ...c.PLAYER_PROPERTIES,
                    shape : new f2.Circle(new f2.Vec2(0,0), c.PLAYER_RADIUS),
                    categoryBits : c.FIXTURE_CATEGORIES.PLAYER,
                    maskBits : c.FIXTURE_CATEGORIES.WALL | c.FIXTURE_CATEGORIES.PLAYER
                }
            ],
            position : new f2.Vec2(10,5)
        });
        this.f2body.userData['body'] = this.f2body;
        this.f2body.setCustomDisplay((ctx, {position, angle})=>{
            ctx.save();
            ctx.translate(position.x, position.y);
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.arc(0, 0, c.PLAYER_RADIUS, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(c.PLAYER_RADIUS/2, 0, c.PLAYER_RADIUS/4, 0, 2 * Math.PI, false);
            ctx.stroke();
            ctx.restore();
        })
        this.inputs = 0;
        this.inputNum = 0;
        this.PID = undefined;
    }
    setInput(inputs){
        this.inputs = inputs;
        this.inputNum = (this.inputNum + 1) % 256;
    }
    stepPhysics(dt){
        var dir = new f2.Vec2(0,0);
        if (this.inputs & c.INPUTS.UP){
            dir = dir.add(new f2.Vec2(0, -1));
        }
        if (this.inputs & c.INPUTS.DOWN){
            dir = dir.add(new f2.Vec2(0, 1));
        }
        if (this.inputs & c.INPUTS.LEFT){
            dir = dir.add(new f2.Vec2(-1, 0));
        }
        if (this.inputs & c.INPUTS.RIGHT){
            dir = dir.add(new f2.Vec2(1, 0));
        }
        if (dir.x != 0 || dir.y != 0){
            dir = dir.normalize();
        }
        this.f2body.applyImpulse(dir.multiply(this.f2body.mass * c.PLAYER_ACC * dt));
        this.f2body.applyImpulse(this.f2body.velocity.multiply(- this.f2body.mass * c.PLAYER_DRAG * dt));
        this.f2body.applyAngImpulse(- c.PLAYER_ANG_DRAG * this.f2body.inertia * this.f2body.angleVelocity * dt);
    }
}
Player.Config = class{
    color;
    constructor(cfg){
        cfg = cfg || {};
        this.color = cfg.color || '#0000ff';
    }
}