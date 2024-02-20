export const c = {
    WS : 'wss://flag-tag.onrender.com',
    TIME_STEP : 0.008,
    UPDATE_TIME : 0.05,
    WALL_PROPERTIES : {
        kFriction : 0.5,
        sFriction : 0.7,
        elasticity : 1
    },
    PLAYER_PROPERTIES : {
        kFriction : 0.5,
        sFriction : 0.7,
        elasticity : 1
    },
    FIXTURE_CATEGORIES : {
        WALL :      0b00000001,
        PLAYER :    0b00000010,
        GROUND :    0b00000100
    },
    PLAYER_RADIUS : 1,
    PLAYER_DRAG : 0.8,
    PLAYER_ANG_DRAG : 0.4,
    PLAYER_ACC : 10,
    INPUTS : {
        UP : 1 << 0,
        DOWN : 1 << 1,
        LEFT : 1 << 2,
        RIGHT : 1 << 3
    }
}