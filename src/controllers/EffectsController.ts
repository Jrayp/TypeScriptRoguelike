import { GameState } from "./../Enums";
import G from "./../G";
import _Effect from "../effects/_Effect";
import UniqueCoordsMap from "../util/UniqueCoordsMap";

export default class EffectsController extends UniqueCoordsMap<_Effect>{

    fps = 18;
    changeEvery = 1000 / this.fps;
    elapsed = this.changeEvery;
    start: number | null;

    removeAction(action: _Effect) {
        G.board.effects.removeViaElement(action);
    }

    getAction(key: string) {
        return G.board.effects.getElementViaKey(key);
    }

    startLoop() {
        G.state = GameState.ACTION;
        this.start = null;
        this.elapsed = this.changeEvery;
        requestAnimationFrame(this.loop);
    }

    finalize() {
        G.board.actors.update();
        G.board.lights.update();
        let playerSeenCoords = G.player.computeFov();
        G.board.draw(playerSeenCoords, G.player.percievedOpaqueColors);
        G.state = GameState.PLAYER_CONTROL;
    }

    updateAndDraw(dt: any) {
        this.elapsed += dt;
        if (this.elapsed > this.changeEvery) {
            this.elapsed = 0;
            // index = (index + 1) % 3;

            for (let coordsAndAction of G.board.effects.iterateElements()) {
                const coords = coordsAndAction[1];
                const action = coordsAndAction[0];
                action.doStep();
            }
            G.board.lights.update();
            let seenCells = G.player.computeFov();
            G.board.draw(seenCells, G.player.percievedOpaqueColors);
        }
    }

    loop = (timestamp: any) => {
        if (!this.start)
            this.start = timestamp;
        let dt = timestamp - this.start!;
        this.start = timestamp;
        this.updateAndDraw(dt);
        if (G.board.effects.count() > 0)
            requestAnimationFrame(this.loop);
        else
            this.finalize();
    }

}