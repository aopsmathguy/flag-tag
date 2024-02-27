import { f2 } from '../fisyx2d.js';
import { c } from '../constants.js'
export class Player{
    cfg;
    PID;
    f2body;

    steerAng;

    inputs;
    inputNum;
    constructor(cfg){
        this.cfg = new Player.Config(cfg);
        this.f2body = new f2.Body({
            fixtures : [
                {
                    ...c.PLAYER_PROPERTIES,
                    shape : f2.Shape.deserialize(c.PLAYER_SHAPE),
                    categoryBits : c.FIXTURE_CATEGORIES.PLAYER,
                    maskBits : c.FIXTURE_CATEGORIES.WALL | c.FIXTURE_CATEGORIES.PLAYER
                }
            ],
            position : new f2.Vec2(10,5)
        });
        this.f2body.userData['body'] = this.f2body;
        this.inputs = 0;
        this.inputNum = 0;
        this.PID = undefined;
    }
    setInput(inputs){
        this.inputs = inputs;
        this.inputNum = (this.inputNum + 1) % 256;
    }
    stepPhysics(dt){
        // var dir = new f2.Vec2(0,0);
        // if (this.inputs & c.INPUTS.UP){
        //     dir = dir.add(new f2.Vec2(0, -1));
        // }
        // if (this.inputs & c.INPUTS.DOWN){
        //     dir = dir.add(new f2.Vec2(0, 1));
        // }
        // if (this.inputs & c.INPUTS.LEFT){
        //     dir = dir.add(new f2.Vec2(-1, 0));
        // }
        // if (this.inputs & c.INPUTS.RIGHT){
        //     dir = dir.add(new f2.Vec2(1, 0));
        // }
        // if (dir.x != 0 || dir.y != 0){
        //     dir = dir.normalize();
        // }
        // this.f2body.applyImpulse(dir.multiply(this.f2body.mass * c.PLAYER_ACC * dt));
        // this.f2body.applyImpulse(this.f2body.velocity.multiply(- this.f2body.mass * c.PLAYER_DRAG * dt));
        // this.f2body.applyAngImpulse(- c.PLAYER_ANG_DRAG * this.f2body.inertia * this.f2body.angleVelocity * dt);
        
        let steer = (this.inputs & c.INPUTS.LEFT ? -1 : 0) + (this.inputs & c.INPUTS.RIGHT ? 1 : 0);
        let forward = this.inputs & c.INPUTS.UP;
        let backwards = this.inputs & c.INPUTS.DOWN;
        let brake = this.inputs & c.INPUTS.BRAKE;


        if (forward){
            this.f2body.applyImpulse(f2.Vec2.fromPolar(this.f2body.mass * c.PLAYER_ACC * dt, this.f2body.angle));
        } if (backwards){
            this.f2body.applyImpulse(f2.Vec2.fromPolar(- this.f2body.mass * c.PLAYER_ACC * dt, this.f2body.angle));
        }
        this.wheelStep(new f2.Vec2(-c.PLAYER_HALF_AXLE,0), 0, brake, dt);
        this.wheelStep(new f2.Vec2(c.PLAYER_HALF_AXLE,0), this.cfg.maxSteer * steer, false, dt);
    }
    wheelStep(dr, angle, locked, dt){
        const g = c.GRAVITY;
        const drRot = dr.rotate(this.f2body.angle);
        const velP = this.f2body.getVelocity(drRot);
        if (!locked){
            const wheelAngle = this.f2body.angle + angle;
            const angleAttack = (velP.ang() - wheelAngle + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
            const wheelNormal = f2.Vec2.fromPolar(1, wheelAngle + Math.PI/2);
            const invEffMass = 1/this.f2body.mass + wheelNormal.cross(drRot) ** 2 / this.f2body.inertia;
            const impulseNeededToStop = velP.dot(wheelNormal)/invEffMass;
            const maxImpulse = dt * g * c.PLAYER_GRIP * 5 * Math.min(0.2,Math.max(-0.2,Math.sin(angleAttack)));
            let impulse = 0;
            if (Math.abs(maxImpulse) < Math.abs(impulseNeededToStop)){
                impulse = maxImpulse;
            }else{
                impulse = impulseNeededToStop;
            }
            this.f2body.applyImpulse(wheelNormal.multiply(-impulse), drRot);
        }else{
            this.f2body.applyImpulse(velP.normalize().multiply(-dt * g * c.PLAYER_GRIP), drRot);
        }
    }
}
Player.Config = class{
    maxSteer;
    color;
    constructor(cfg){
        cfg = cfg || {};
        this.maxSteer = cfg.maxSteer || 0.5;
        this.color = cfg.color || '#0000ff';
    }
}