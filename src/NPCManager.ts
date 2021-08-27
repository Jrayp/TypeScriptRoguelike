import _Npc from "./actors/_Npc";

export default class NPCManager {

    private _npcSet = new Set<_Npc>();

    update() {
        for (let npc of this._npcSet)
            npc.act();
    }

    add(npc: _Npc) {
        this._npcSet.add(npc);
    }

    remove(npc: _Npc) {
        this._npcSet.delete(npc);
    }

}