import Components from "Components.js";
import Entities   from "Entities.js";
import Systems    from "Systems.js";

class Ecs{
    //#region REGISTRATION
    regCom( com, onNew, onRecycle ){ return this; }
    regSys( sys, stage=0 ){ return this; }
    //#endregion ///////////////////////////////////////////

    //#region ENTITIES
    newEnt(){ return 0; }
    recycleEnt(){}
    //#endregion ///////////////////////////////////////////
    
    //#region COMPONENTS
    addComs( eID, ...comNames ){
        // Check Ent Bitset if Com Exists?
        // if not, get new Com from Stack
        // Update Bitset that Ent has this component 
        

    } // Return Array of Components

    addCom( eID, comName ){ } // Return Component

    pushCom( eID, com ){} // Push Unregistered Component Or new Component Instance

    recycleCom( eID, comName ){};
    //#endregion ///////////////////////////////////////////

    //#region EVENTS
    onNewEntity(){}
    onRecycleEntity(){}
    //#endregion ///////////////////////////////////////////
}

export default Ecs;