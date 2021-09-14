
export enum InputState {
    BOARD_CONTROL,
    EFFECT_LOOP,
    TARGETING
}

export enum Dir {
    N = 0,
    NE = 1,
    E = 2,
    SE = 3,
    S = 4,
    SW = 5,
    W = 6,
    NW = 7
}

export enum PathDir{
    STRAIGHT,
    DIAGONAL,
    VERTICAL
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

export enum SwitchSetting {
    ACTIVATE,
    DEACTIVATE,
    TOGGLE
}

export enum ActionState {
    PENDING = 'pending',
    PERFORMING = 'performing',
    SUCCESSFUL = 'successful',
    UNSUCCESSFUL = 'unsuccessful',
    START_EFFECT = 'start effect'
}

export enum Layer {
    ABOVE = 0,
    BELOW = 1
}

export enum TraversibilityFlags {
    CLEAR = 0,
    WATER = 1,
    SOLID_ROCK = 2,
    VEGETATION = 4
}