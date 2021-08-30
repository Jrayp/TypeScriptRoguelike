import _Actor from "./../actors/_Actor";
import UniqueCoordsMap from "./../util/UniqueCoordsMap"

export default class ActorController extends UniqueCoordsMap<_Actor>{

    update() {
        for (let actorAndCoords of this.iterateElements())
            actorAndCoords[0].act();
    }

}