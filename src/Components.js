

import SparseSet from "./SparseSet.js";

class ComponentStack{
    id          = 0;                // Component Type ID
    name        = "";               // Name of Component
    ref         = null;             // Object Reference used for creating instances
    onRecycle   = null;             // Handle special cases of recycling objects
    onInit      = null;             // Handle special cases of initializing objects
    data        = new SparseSet();  // Store the Components in a special array

    constructor( comId, comName, comRef ){
        this.id     = comId;
        this.name   = comName;
        this.ref    = comRef;
    }

    // Initialize a instance of a component for an Entity
    entityInit( entId ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Make sure not creating more then one component per Entity.
        if( this.data.sparseExists( entId ) ){
            console.warn( "Can not get new component : %s because the entity id %d already exists.", this.name, entId );
            return null;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        let com = this.data.nextAvailable( entId ); // Get a Recycled Object
        if( !com ){
            com = new this.ref();                   // If none exists, create one...
            this.data.add( com, entId );            // then add it to the set
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Execute any Custom Initialization for Component
        if( this.onInit ) this.onInit( com, entId ); 

        return com;
    }

    // User is pushing an object instance into the stack.
    entityPush( entId, comInst ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Make sure not creating more then one component per Entity.
        if( this.data.sparseExists( entId ) ){
            console.warn( "Can not get new component : %s because the entity id %d already exists.", this.name, entId );
            return null;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        this.data.add( comInst, entId );
    }

    // Get a component based on the entity ID
    entityGet( entId ){ return this.data.sparseGet( entId ); }

    // Recycle the component that is assigned the entity id
    entityRecycle( entId ){
        if( this.onRecycle ) this.onRecycle( this.entityGet( entId ), entId );
        this.data.rmSparse( entId );
    }
}

/*
OPTIONS
{ 
    name        : "", // Override the name of the component
    onRecycle   : fn
    onNew       : fn
}   
*/

class Components{
    constructor( opt=null ){
        this.stacks     = [];   // List of Component Stacks
        this.nameMap    = {};   // Name to Index ID Reference   (TODO: Use Map Instead?)
        
        // Callbacks
        this.onReg      = opt?.onReg ?? null;
    }

    reg( com, opt=null ){
        const comName   = opt?.name ?? com.name;                        // Whats the Components Name?
        if( this.nameMap[ comName ] !== undefined ){
            console.warn( "Component Already Exists : %s", comName );
            return this;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        const comId     = this.stacks.length;                           // Next ID to use for Component
        const stack     = new ComponentStack( comId, comName, com );    // Create the object that will manage the component

        // Apply any other Options in relation to components
        if( opt ){
            if( opt.onNew )         stack.onNew     = opt.onNew;
            if( opt.onRecycle )     stack.onRecycle = opt.onRecycle;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        this.stacks.push( stack );                      // Save Stack
        this.nameMap[ comName ] = comId;                // Map Name to Id for Quick Lookups
        if( this.onReg ) this.onReg( comId, comName );  // Tell any callback that a component has been created.

        console.log( "[ Component Added : %d.%s ]", comId, stack.name );
        return this;
    }

    getComponentName( comId ){ return this.stacks[ comId ].name; }
    getComponentId( name ){ return this.nameMap[ name ]; }
    getStackByName( name ){ return this.stacks[ this.nameMap[ name ] ].data; }
    getBitmask( ...names ){ return null; } // Get a Bitmask for all the components.

    getEntityComponent( entId, comId ){ return this.stacks[ comId ].entityGet( entId ); }

    // Handle creating a new instance of a component for an entity
    new( obj, entId ){

        switch( typeof obj ){
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // INSTANCE OF AN OBJECT
            case "object":
                // Name is actually an Instance of an Object, So lets save the instance to the stack
                if( obj.constructor ){
                    let comName = obj.constructor.name;

                    // If it hasn't been registered, Auto Reg it now.
                    if( this.nameMap[ comName ] === undefined ) this.reg( obj.constructor );   

                    this.stacks[ this.nameMap[ comName ] ].entityPush( entId, obj );
                    return obj;
                }
            break;
            
            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // CLASS REFERENCE
            case "function":
                let comName = obj.name;

                // If it hasn't been registered, Auto Reg it now.
                if( this.nameMap[ comName ] === undefined ) this.reg( obj );   

                return this.stacks[ this.nameMap[ comName ] ].entityInit( entId );
            break;

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // COMPONENT NAME
            case "string":
                const comId = this.nameMap[ obj ];
                if( comId == undefined ){
                    console.warn( "Component not found : %s", obj );
                    return null;
                }

                return this.stacks[ comId ].entityInit( entId );
            break;

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            // COMPONENT ID
            case "number":
                return this.stacks[ obj ].entityInit( entId );
            break;

            //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
            default:
                console.log( "Component New - Unknown Typeof - ", obj, typeof obj );
            break;
        }

        return null;
    }

    // Recycle an Entitie's Component since it wont be used anymore.
    recycle( entID, com ){
        if( typeof com == "string" ) com = this.nameMap[ com ];
        if( !this.stacks[ com ] ){
            console.warn( "Component stack not found : %s", com );
            return;
        }

        this.stacks[ com ].entityRecycle( entID );
    }

    debugStack( comName ){
        const stack = this.stacks[ this.nameMap[ comName ] ];
        console.log( "%c [ Debug Stack : %d.%s ] ", "color:#00ffff; background:#2a2a2a; padding:3px 0px;", stack.id, stack.name );
        console.log( "-- Sparse Len : %d ", stack.data.sparse.length );
        console.log( "-- Capacity   : %d", stack.data.capacity );
        console.log( "-- Length     : %d", stack.data.len );

        for( let i of stack.data ){
            console.log( "---- Entity [ %d ]", i.sparseId, i.value );
        }

        console.log( "%c [ END Debug Stack : %d.%s ] ", "color:#00ffff; background:#2a2a2a; padding:3px 0px;", stack.id, stack.name );
    }
}

export default Components;