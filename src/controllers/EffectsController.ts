import _Effect from "../effects/_Effect";
import UniqueCoordsMap from "../util/UniqueCoordsMap";
import { GameState } from "./../Enums";
import G from "./../G";
import Loop from "./../Loop";

export default class EffectsController extends UniqueCoordsMap<_Effect>{

    fps = 14;
    changeEvery = 1000 / this.fps;
    elapsed = this.changeEvery;
    start: number | null;

    handleEffects() {
        G.state = GameState.ACTION;
        let loop = new Loop(this.updateAndDraw, () => { return this.count == 0 }, this.finalize);
        loop.start();
    }

    finalize() {
        G.board.actors.update();
        G.board.lights.update();
        let playerSeenCoords = G.player.computeFov();
        G.board.draw(playerSeenCoords, G.player.percievedOpaqueColors);
        G.state = GameState.PLAYER_CONTROL;
    }

    updateAndDraw() {
        for (let coordsAndAction of G.board.effects.iterateElements()) {
            const action = coordsAndAction[0];
            action.doStep();
        }
        G.board.lights.update();
        let seenCells = G.player.computeFov();
        G.board.draw(seenCells, G.player.percievedOpaqueColors);
    }
}