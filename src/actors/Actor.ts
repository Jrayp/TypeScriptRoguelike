import ArenaMap from './../ArenaMap';
import * as G from './../G'

export default abstract class Actor {

    abstract glyph: string;
    abstract fg: string;

    move(newPos: number) {
        if (G.CurrentArena.tileLayer.getElementViaPosition(newPos)?.passable) {
            G.CurrentArena.actorLayer.moveViaElement(this, newPos);
            return true;
        }
        else {
            return false;
        }
    }

    getPosition() {
        return G.CurrentArena.actorLayer.getPositionViaElement(this);
    }

    getCoords(): [number, number] {
        let p = this.getPosition();
        return ArenaMap.convert1Dto2D(p!);
    }

}