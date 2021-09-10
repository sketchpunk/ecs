// https://github.com/skypjack/entt

import Components   from "Components.js";
import Entities     from "Entities.js";
import Systems      from "Systems.js";
import Tags         from "Tags.js";

class Ecs{
    //#region MAIN
    com = new Components();
    ent = new Entities();
    sys = new Systems();
    tag = new Tags();
    //#endregion ///////////////////////////////////////////

    //#region ENTITIES
    newEnt(){ return 0; }
    recycleEnt(){}
    //#endregion ///////////////////////////////////////////
    
    //#region COMPONENTS
    addComs( entId, ...comNames ){
        // Check Ent Bitset if Com Exists?
        // if not, get new Com from Stack
        // Update Bitset that Ent has this component 
        // Return Array of Components
    }

    addCom( entId, comName ){} // Return Component

    recycleCom( entId, comName ){};
    //#endregion ///////////////////////////////////////////

    //#region EVENTS
    //onNewEntity(){}
    //onRecycleEntity(){}
    //#endregion ///////////////////////////////////////////
}

export default Ecs;