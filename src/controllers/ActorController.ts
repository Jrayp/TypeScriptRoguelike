import _Actor from "./../actors/_Actor";
import CellElementBiMap from "../util/CellElementBiMap"

export default class ActorController extends CellElementBiMap<_Actor>{

    update() {
        for (let actorAndCell of this.iterateElements()) {
            actorAndCell[0].act();
        }
    }

}