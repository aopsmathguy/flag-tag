export const c = {
    // WS : 'ws://localhost:3001',
    WS : 'wss://flag-tag.onrender.com',
    TIME_STEP : 0.008,
    UPDATE_TIME : 0.05,
    WALL_PROPERTIES : {
        kFriction : 0,
        sFriction : 0,
        elasticity : 1
    },
    PLAYER_PROPERTIES : {
        kFriction : 0.1,
        sFriction : 0.2,
        elasticity : 1
    },
    FIXTURE_CATEGORIES : {
        WALL :      0b00000001,
        PLAYER :    0b00000010,
        GROUND :    0b00000100
    },
    PLAYER_SHAPE : {
        sType : "p",
        vs : [
            {x : -4, y : -3},
            {x : -4, y : 3},
            {x : 2, y : 3},
            {x : 4, y : 2},
            {x : 5, y : 0},
            {x : 4, y : -2},
            {x : 2, y : -3}
        ]
    },
    GRAVITY : 32,
    PLAYER_HALF_AXLE : 3,
    PLAYER_GRIP : 40,
    PLAYER_ACC : 14,
    PLAYER_DRAG : 1,
    INPUTS : {
        UP : 1 << 0,
        DOWN : 1 << 1,
        LEFT : 1 << 2,
        RIGHT : 1 << 3,
        BRAKE : 1 << 4
    }
}