import _Actor from "./../actors/_Actor";
import UniquePointMap from "./../util/UniquePointMap"

export default class ActorController extends UniquePointMap<_Actor>{

    update() {
        for (let actorAndPoint of this.iterateElements()) {
            actorAndPoint[0].act();
        }
    }

}