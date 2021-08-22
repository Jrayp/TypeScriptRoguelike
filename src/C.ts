
export default class C {
    static readonly ARENA_WIDTH = 60;
    static readonly ARENA_HEIGHT = 30;

    static readonly MAX_LOG_LENGTH = 50;

    static readonly LOG_DISPLAY_WIDTH = C.ARENA_WIDTH;
    static readonly LOG_DISPLAY_HEIGHT = 5;


    static readonly BOARD_DISPLAY_OPTIONS = {
        // Configure the display
        bg: "black", // background
        fg: "dimGrey", // foreground
        // fontFamily: "Liberation Mono", // font (use a monospace for esthetics)
        fontFamily: "monospace", // font (use a monospace for esthetics)
        width: C.ARENA_WIDTH,
        height: C.ARENA_HEIGHT, // canvas height and width
        fontSize: 24, // canvas fontsize
        //forceSquareRatio: true // make the canvas squared ratio
    };

    static readonly LOG_DISPLAY_OPTIONS = {
        width: C.LOG_DISPLAY_WIDTH,
        height: C.LOG_DISPLAY_HEIGHT, // canvas height and width
        fontSize: 24, // canvas fontsize6
    };

}





















