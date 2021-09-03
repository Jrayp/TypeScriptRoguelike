
export enum GameState {
    PLAYER_CONTROL,
    EFFECT_LOOP,
    TARGETING
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

export enum PlayerAction {

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
    UNSUCCESSFUL = 'unsuccessful'
}