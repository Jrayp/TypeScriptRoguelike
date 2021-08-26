import _Npc from "./actors/_Npc";

export default class NPCManager {

    // Can make player control npcs via command system
    // Send command verb with 'any' type parameter

    private _npcSet = new Set<_Npc>();

    update() {
        for (let npc of this._npcSet)
            npc.act();
    }

    addNpc(npc: _Npc) {
        this._npcSet.add(npc);
    }



}