
// https://github.com/skypjack/entt


class ComStack{
    id          = 0;
    name        = "ComponentName";
    objRef      = null;
    list        = []; // Maybe a SparseArray??

    onRecycle   = null; // What to do when a Component is requested to be recycled back
    onNew       = null; // What to do when a new Comp is asked for.

    fromEntity( entID ){} // Return Component that Belongs to Entity.

    new( entID ){}
    recycle( entID ){}
}


class Com{ // Maybe Wrap all Component References with Com?
    value = null;
    entID = null;
}


class Components{
    stacks  = [];   // List of Component Stacks
    nameMap = {};   // Name to Index ID Reference

    getComponentId( name ){ return this.nameMap[ name ]; }
    getStackByName( name ){ return this.comList[ this.nameMap[ name ] ]; }
    getBitmask( ...name ){ return null; } // Get a Bitmask for all the components.

    new( name, entID ){
        let idx;
        return ( (idx = this.nameMap[ name ]) != undefined )? this.stacks[ idx ].new( entID ) : null;
    }
    recycle( entID, comID ){ return this.stacks[ comID ].recycle( entID ); }
}

export default Components;