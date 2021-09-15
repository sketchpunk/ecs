// https://github.com/skypjack/entt

import Components   from "./Components.js";
import Entities     from "./Entities.js";
import Systems      from "./Systems.js";
import Tags         from "./Tags.js";

class Ecs{
    //#region MAIN
    com = new Components();
    ent = new Entities();
    sys = new Systems();
    tag = new Tags();
    //#endregion ///////////////////////////////////////////

    //#region ENTITIES
    newEnt(){ return this.ent.new(); }

    recycleEnt( entId ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Does the Entity Exist?
        const e = this.ent.get( entId );
        if( !e ){ console.warn( "Recycle Entity : Entity not found - %s", entId ); return null; }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Recycle all the Components it has
        let i;
        for( i of e.bmCom ) this.com.recycle( entId, i );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        e.clear();                  // Reset Bitsets
        this.ent.recycle( entId );  // Add it its available list
        
        return this;
    }

    debugEnt( entId ){
        const e = this.ent.get( entId );
        console.log( "%c [ Debug Entity : %d ] ", "color:#00ffff; background:#2a2a2a; padding:3px 0px;", entId );

        console.log( e );
        console.log( "-- In Use :", e.inUse );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Output Tags
        for( let i of e.bmTag ){
            console.log( "-- Tag [ %d.%s ] ", i, this.tag.getName( i ) );
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Output Components
        for( let i of e.bmCom ){
            console.log( "-- Component [ %d.%s ]", i, this.com.getComponentName( i ), this.com.getEntityComponent( entId, i ) );
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        console.log( "%c [ END Debug Entity : %d ] ", "color:#00ffff; background:#2a2a2a; padding:3px 0px;", entId );
    }
    //#endregion ///////////////////////////////////////////
    
    //#region COMPONENTS

    assignCom( entId, comName ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Does the Entity Exist?
        if( !this.ent.exists( entId ) ){ console.warn( "Assign Component : Entity not found - %s", entId ); return null; }

        // Does the component Exists?
        const comId = this.com.getComponentId( comName );
        if( comId === undefined ){ console.warn( "Assign Component : Component Type not found - %s", comName ); return null; }

        // Does the Component 
        if( this.ent.hasCom( entId, comId ) ){ 
            console.warn( "Assign Component : Entity already has component assigned - %s", comName ); 
            return null;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const com = this.com.new( comId, entId );   // Create Com Instance for Entity
        this.ent.setCom( entId, comId );            // Set Com to Entity
        return com;
    }

    assignComs( entId, ...comList ){
        let i, com, rtn = new Array();
        for( i of comList ){
            com = this.assignCom( entId, i );
            if( com ) rtn.push( com );
        }
        return rtn;
    }

    recycleCom( entId, comName ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Does the Entity Exist?
        if( !this.ent.exists( entId ) ){ console.warn( "Recycle Component : Entity not found - %s", entId ); return this; }

        // Does the component Exists?
        const comId = this.com.getComponentId( comName );
        if( comId === undefined ){ console.warn( "Recycle Component : Component Type not found - %s", comName ); return this; }

        // Does the Component 
        if( !this.ent.hasCom( entId, comId ) ){ 
            console.warn( "Recycle Component : Entity doesn't have component assigned - %s", comName ); 
            return this;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        this.com.recycle( entId, comId );   // Recycle Component thats assigned to entity
        this.ent.rmCom( entId, comId );     // Set Com to Entity
        return this;
    }

    //#endregion ///////////////////////////////////////////

    //#region TAGS
    tagEnt( entId, tagName ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Does the Entity Exist?
        if( !this.ent.exists( entId ) ){ console.warn( "Tag Entity : Entity not found - %s", entId ); return this; }

        // Does the component Exists?
        const tagId = this.tag.get( tagName );
        if( tagId === undefined ){ console.warn( "Tag Entity : Tag not found - %s", tagName ); return this; }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        this.ent.setTag( entId, tagId );
        return this;
    }

    untagEnt( entId, tagName ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Does the Entity Exist?
        if( !this.ent.exists( entId ) ){ console.warn( "UnTag Entity : Entity not found - %s", entId ); return this; }

        // Does the component Exists?
        const tagId = this.tag.get( tagName );
        if( tagId === undefined ){ console.warn( "UnTag Entity : Tag not found - %s", tagName ); return this; }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        this.ent.rmTag( entId, tagId );
        return this;
    }
    //#endregion ///////////////////////////////////////////

    //#region SYSTEMS
    runSystems(){ this.sys.run( this ); return this; }
    //#endregion ///////////////////////////////////////////
}

export default Ecs;