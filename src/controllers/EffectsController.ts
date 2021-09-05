import _EffectGenerator from "./../effects/_EffectGenerator";
import _Effect from "../effects/_Effect";
import UniqueCoordsMap from "../util/UniqueCoordsMap";
import { InputState } from "./../Enums";
import G from "./../G";
import Loop from "./../Loop";
import Coords from "../util/Coords";
import Input from "./../input/Input";

export default class EffectsController extends UniqueCoordsMap<_Effect>{

    private _generators = new Set<_EffectGenerator>();

    currentLoop: Loop;

    addEffect(coords: Coords, effect: _Effect, doStepImmediatly: boolean) {
        this.set(coords, effect);
        if (doStepImmediatly)
            effect.doStep();
    }

    addGenerator(generator: _EffectGenerator, generateImmediatly: boolean) {
        this._generators.add(generator);
        if (generateImmediatly)
            generator.generate();
    }

    removeGenerator(generator: _EffectGenerator) {
        this._generators.delete(generator);
    }

    handleEffects() {
        Input.state = InputState.EFFECT_LOOP;
        this.currentLoop = new Loop(this.updateAndDraw, () => { return this.count == 0 && this._generators.size == 0 }, this.finalize);
        this.currentLoop.start();
    }

    finalize() {
        Input.state = InputState.BOARD_CONTROL;
        G.update();
    }

    updateAndDraw = () => {
        for (let gen of this._generators)
            gen.generate();
        for (let actionAndCoords of G.board.effects.iterateElements()) {
            const action = actionAndCoords[0];
            action.doStep();
        }
        G.board.lights.update();
        let seenCells = G.player.computeFov();
        G.board.draw(seenCells, G.player.percievedOpaqueColors);
    }
}