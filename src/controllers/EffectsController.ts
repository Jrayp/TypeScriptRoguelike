import _EffectGenerator from "./../effects/_EffectGenerator";
import _Effect from "../effects/_Effect";
import UniquePointMap from "../util/UniquePointMap";
import { InputState } from "./../Enums";
import G from "./../G";
import Loop from "./../Loop";
import Point from "../util/Point";
import Input from "./../input/Input";

export default class EffectsController extends UniquePointMap<_Effect>{

    private _generators = new Set<_EffectGenerator>();

    currentLoop: Loop;

    addEffect(point: Point, effect: _Effect, doStepImmediatly: boolean) {
        this.set(point, effect);
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
        Input.SetState(InputState.EFFECT_LOOP);
        this.currentLoop = new Loop(this.updateAndDraw, () => { return this.count == 0 && this._generators.size == 0 }, this.finalize);
        this.currentLoop.start();
    }

    finalize() {
        Input.SetState(InputState.BOARD_CONTROL);
        G.updateAndDrawBoard();
    }

    updateAndDraw = () => {
        for (let gen of this._generators)
            gen.generate();
        for (let actionAndPoint of G.board.effects.iterateElements()) {
            const action = actionAndPoint[0];
            action.doStep();
        }
        G.board.lights.update();
        G.player.computeFov();
        G.drawBoard();
    }
}