import SortedArray from "./SortedArray.js";

// Sorted Array function
function sortedIdx( ary, itm ){
	let s, i=-1, saveIdx = -1;
	for( s of ary ){
		i++;
		if(s.stage < itm.stage) continue;							// Order by Priority First
		if(s.stage == itm.stage && s.order < itm.order ) continue;	// Then by Order of Insertion
		
		saveIdx = i;
		break;
	}
	return saveIdx;
}

// Object Wrapper for a System
class SystemItem{
    constructor( sys, stage, ord ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        this.name       = "";       // Name of System
        this.obj        = null;     // Reference to the object if available
        this.fn         = null;     // Reference to System Execution
        this.stage      = stage;    // Stage Number
        this.order      = ord;      // Insert Order
        this.enabled    = true;     // Only Run if its enabled
        
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        switch( typeof sys ){
            //---------------------------------------
            case "object":
                // CLASS INSTANCE or OBJECT
                // Object will have a constructor name of Object, incase there is multiple of these systems
                // we will need to create unique names for it automaticlly incase the name isn't overwritten.
                
                this.name = ( sys.constructor.name == "Object" )? "Obj" + Math.floor( Math.random() * 10000000 ) : sys.constructor.name;
                this.fn   = sys.run.bind( sys ); // Bind func ref to base class so THIS will work;
                this.obj  = sys;
                break;

            //---------------------------------------
            case "function":
                // - Static Classes are Typed as a Function, So check if there is a RUN function attached
                // - Closures dont have names, so Auto Generate One.
                if( sys.run ){  // Static Class
                    this.name = sys.name;
                    this.fn   = sys.run.bind( sys ); // Bind Func ref to base class so THIS will work.
                    this.obj  = sys;

                }else{          // Actual functions and Closures
                    this.name = ( sys.name )? sys.name : "Closure" + Math.floor( Math.random() * 10000000 );
                    this.fn   = sys;
                }

                break;
        }
    }
}

// Manage Systems
class Systems{
    constructor(){
        this.items = new SortedArray( sortedIdx );  // Stage Sorted Array
        this.map   = new Map();                     // Name reference to Systems
    }

    run( ref ){
        let i;
        for( i of this.items ){
            if( i.enabled ) i.fn( ref );
        }
    }

    reg( sys, stage=0, opt=null ){
        let itm = new SystemItem( sys, stage, this.items.length );

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // OPTIONS
        if( opt ){
            if( opt.name ) itm.name = opt.name; // System Name Override
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        this.items.add( itm );
        this.map.set( itm.name, itm );

        console.log( "[ System Added : %s at stage %d ]", itm.name, stage );
        return this;
    }

    //#region SETTERS // GETTERS
    get( sName ){ return this.map.get( sName )?.obj; }
    enable( sName ){
        const sys = this.map.get( sName );

        if( !sys )  console.log( "System not found %s", sName );
        else        sys.enabled = true;

        return this;
    }

    disable( sName ){
        const sys = this.map.get( sName );

        if( !sys )  console.log( "System not found %s", sName );
        else        sys.enabled = false;

        return this;
    }
    //#endregion ///////////////////////////////////////////////////////

}

export default Systems;