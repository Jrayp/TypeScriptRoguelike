
export enum GameState {
    PLAYER_CONTROL,
    EFFECT_LOOP,
    TILE_SELECTION
}

export enum Direction {
    N,
    NE,
    E,
    SE,
    S,
    SW,
    W,
    NW
}

export enum TryMoveResult {
    SUCCESFUL,
    ENEMY,
    FRIENDLY,
    IMPASSABLE
}

export enum DrawDataType {
    GLYPH,
    FOREGROUND_COLOR,
    BACKGROUND_COLOR
}