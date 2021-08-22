import Player from "./actors/Player";
import Board from "./Board";
import BoardDisplay from "./displays/BoardDisplay";
import LogDisplay from "./displays/LogDisplay";
import Log from "./Log";


export default class G {

    static readonly BoardDisplay: BoardDisplay = new BoardDisplay();
    static readonly LogDisplay: LogDisplay = new LogDisplay();

    static Board: Board;
    static Log: Log;
    static Player: Player;
}
