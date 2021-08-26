import Coords from "./util/Coords";

export default class C {
    static readonly BOARD_WIDTH = 60;
    static readonly BOARD_HEIGHT = 30;

    static readonly MAX_LOG_LENGTH = 50;

    static readonly LOG_DISPLAY_WIDTH = C.BOARD_WIDTH;
    static readonly LOG_DISPLAY_HEIGHT = 5;

    static readonly LIGHT_DEFAULT_REFLECTIVITY = .3;

    static readonly DIR_COORDS = [
        new Coords(0, -1),
        new Coords(1, -1),
        new Coords(1, 0),
        new Coords(1, 1),
        new Coords(0, 1),
        new Coords(-1, 1),
        new Coords(-1, 0),
        new Coords(-1, -1),
    ]

    static readonly BOARD_DISPLAY_OPTIONS = {
        // Configure the display
        bg: "black", // background
        fg: "dimGrey", // foreground
        // fontFamily: "Liberation Mono", // font (use a monospace for esthetics)
        fontFamily: "monospace", // font (use a monospace for esthetics)
        width: C.BOARD_WIDTH,
        height: C.BOARD_HEIGHT, // canvas height and width
        fontSize: 24, // canvas fontsize
        //forceSquareRatio: true // make the canvas squared ratio
    };

    static readonly LOG_DISPLAY_OPTIONS = {
        width: C.LOG_DISPLAY_WIDTH,
        height: C.LOG_DISPLAY_HEIGHT, // canvas height and width
        fontSize: 24, // canvas fontsize6
    };

}





















