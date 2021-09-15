import Bitset from "./Bitset.js";

class Ent{
    bmCom = new Bitset();
    bmTag = new Bitset();
    inUse = true;

    clear(){
        this.bmCom.reset();
        this.bmTag.reset();
    }
}

class Entities{
    items       = [];   // List of all Available Entities
    recycled    = [];   // Index to recycled Entities

    new(){
        if( this.recycled.length != 0 ){
            let entId = this.recycled.pop();
            let ent   = this.items[ entId ];
            ent.inUse = true;
            if( this.onInit ) this.onInit( entId );
            return entId;
        }

        let entId = this.items.length;
        this.items.push( new Ent() );

        if( this.onInit ) this.onInit( entId );
        return entId;
    }

    recycle( entId ){
        this.items[ entId ].inUse = false;
        this.recycled.push( entId );
    }

    get( entId ){ return this.items[ entId ]; }
    exists( entId ){ return ( this.items[ entId ] ); }

    setCom( entId, comId ){ this.items[ entId ]?.bmCom.on( comId ); }
    rmCom( entId, comId ){ this.items[ entId ]?.bmCom.off( comId ); }
    hasCom( entId, comId ){ return ( this.items[ entId ]?.bmCom.has( comId ) ); }

    setTag( entId, tagId ){ this.items[ entId ]?.bmTag.on( tagId ); }
    rmTag( entId, tagId ){ this.items[ entId ]?.bmTag.off( tagId ); }
    hasTag( entId, tagId ){ return ( this.items[ entId ]?.bmTag.has( tagId ) ); }    
}

export default Entities;