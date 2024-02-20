import { c } from '../constants.js';
import { f2 } from '../fisyx2d.js';
import { PRG } from '../utils.js';

function createBounds(width, height){
    var bounds = new f2.Body({
        mass : Infinity,
        fixtures : [
            {
                ...c.WALL_PROPERTIES,
                shape : new f2.Rectangle(width, 2, new f2.Vec2(width/2, -1)),
                categoryBits : c.FIXTURE_CATEGORIES.WALL,
                maskBits : c.FIXTURE_CATEGORIES.PLAYER
            }, {
                ...c.WALL_PROPERTIES,
                shape : new f2.Rectangle(width, 2, new f2.Vec2(width/2, height + 1)),
                categoryBits : c.FIXTURE_CATEGORIES.WALL,
                maskBits : c.FIXTURE_CATEGORIES.PLAYER
            }, {
                ...c.WALL_PROPERTIES,
                shape : new f2.Rectangle(2, height, new f2.Vec2(-1, height/2)),
                categoryBits : c.FIXTURE_CATEGORIES.WALL,
                maskBits : c.FIXTURE_CATEGORIES.PLAYER
            },{
                ...c.WALL_PROPERTIES,
                shape : new f2.Rectangle(2, height, new f2.Vec2(width + 1, height/2)),
                categoryBits : c.FIXTURE_CATEGORIES.WALL,
                maskBits : c.FIXTURE_CATEGORIES.PLAYER
            }
        ]
    });
    return bounds;
}
function createBox(size, position){
    var box = new f2.Body({
        mass : Infinity,
        fixtures : [
            {
                ...c.WALL_PROPERTIES,
                shape : new f2.Rectangle(size, size),
                categoryBits : c.FIXTURE_CATEGORIES.WALL,
                maskBits : c.FIXTURE_CATEGORIES.PLAYER
            }
        ],
        position : position
    });
    return box;
}
export function createWorld(timeNow){
    const rng = new PRG(1234);

    var world = new f2.World({
        time : timeNow,
        gravity : 0,
        gridSize : 2
    });
    world.addBody(createBounds(400,150));
    for (var i = 0; i < 700; i++){
        var body = createBox(4, new f2.Vec2(rng.next() * 400, rng.next() * 150));
        world.addBody(body);
    }
    return world;
}