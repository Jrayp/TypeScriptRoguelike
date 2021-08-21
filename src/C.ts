export const ARENA_WIDTH = 60;
export const ARENA_HEIGHT = 30;

export const MAX_LOG_LENGTH = 50;

export const LOG_DISPLAY_WIDTH = ARENA_WIDTH;
export const LOG_DISPLAY_HEIGHT = 5;


export const GAME_DISPLAY_OPTIONS = {
    // Configure the display
    bg: "black", // background
    fg: "dimGrey", // foreground
    // fontFamily: "Liberation Mono", // font (use a monospace for esthetics)
    fontFamily: "monospace", // font (use a monospace for esthetics)
    width: ARENA_WIDTH,
    height: ARENA_HEIGHT, // canvas height and width
    fontSize: 24, // canvas fontsize
    //forceSquareRatio: true // make the canvas squared ratio
};

export const LOG_DISPLAY_OPTIONS = {
    width: LOG_DISPLAY_WIDTH,
    height: LOG_DISPLAY_HEIGHT, // canvas height and width
    fontSize: 24, // canvas fontsize6
};