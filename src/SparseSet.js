class SparseSet{
    sparse          = [];   // Entity Index to Dense Index
    dense           = [];   // Matches Dense Object to Entity ID
    data            = [];   // Actual Data
    _capacity       = 0;    // Available Size of Dense
    _len            = 0;    // Currently used elements of Dense
    maxSparseIdx    = -1;   // Max Index available in sparse array

    get len(){ return this._len; }
    get capacity(){ return this._capacity; }

    _setSparseValue( sID, idx ){
        // First Make sure our Sparse Array is big enough, if not resize
        if( sID > this.maxSparseIdx ){
            for( let i=this.sparse.length; i <= sID; i++ ) this.sparse.push( null );
            this.maxSparseIdx = sID;
        }

        this.sparse[ sID ] = idx;
    }

    [Symbol.iterator](){
        let idx     = 0;
        let result  = { value:{ value:null, sparseId:0 }, done:false };
    
        return { next:()=>{
            if( idx >= this._len ) result.done = true;
            else{
                result.value.value      = this.data[ idx ];
                result.value.sparseId   = this.dense[ idx ];
                idx++;
            }
            return result;
        }};
    }


    sparseExists( sID ){
        return ( this.sparse[ sID ] != undefined && this.sparse[ sID ] != null );
    }

    add( v, sID ){
        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // data is full, need to add to array
        if( this._len == this._capacity ){
            let idx = this.data.length;
            this.data.push( v );
            this.dense.push( sID );
            this._len++;
            this._capacity++;
            this._setSparseValue( sID, idx );
            return this;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        let idx = this._len;
        this._len++;
        this.dense[ idx ]   = sID;
        this.data[ idx ]    = v;
        this._setSparseValue( sID, idx );
        return this;
    }

    sparseGet( sID ){
        let idx = this.sparse[ sID ];
        if( idx == undefined || idx == null ) return null;
        return this.data[ idx ];
    }

    nextAvailable( sID ){
        if( this._len == this._capacity ) return null;

        let idx = this._len;                 // Index of Recycled Data
        this._setSparseValue( sID, idx );   // Update Sparse array
        this.dense[ idx ] = sID;            // Update Dense with SparseID
        this._len++;                         // Increment Length

        return this.data[ idx ];            // Return Existing Data 
    }

    // Remove by using Sparse index
    rmSparse( sID ){
        const idx = this.sparse[ sID ];
        if( idx === undefined || idx === null ){
            console.warn( "Sparse ID was not found for removing item from SparseSet" );
            return false;
        }

        //console.log( "Removing dense index", idx );

        this.rmIndex( idx );
        return true;
    }

    // Remove by using Dense Index
    rmIndex( idx ){
        const lastIdx = this._len - 1;

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // If only One Item Left, Just set size to zero and clear sparse value
        if( this._len == 1 && idx == 0 ){
            this._len = 0;
            this.sparse[ this.dense[ 0 ] ] = null;
            return;
        // If the item to remove is the final item in the array, just reset len and clear sparse value
        }else if( lastIdx == idx ){
            this._len--;
            this.sparse[ this.dense[ lastIdx ] ] = null;
            return;
        }

        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Move the final item in the array into the deleted spot.
        // Then update a the dense and sparse arrays. 
        let lastDat = this.data[ lastIdx ];         // Save Ref to Last Data in Array
        let lastSID = this.dense[ lastIdx ];        // AND what sID is has.
        
        this.sparse[ this.dense[ idx ] ]    = null;             // Clear out the sparse value of the deleting item.
        this.sparse[ lastSID ]              = idx;              // Update the last item's Sparse to Dense Index
        this.data[ lastIdx ]                = this.data[ idx ]; // Move Trash Data over to last element, So it can be recycled later
        this.data[ idx ]                    = lastDat;          // Last Data out into deleted spot
        this.dense[ idx ]                   = lastSID;          // ... along with its SID
        this._len--;                                             // Decrement Total Data Items
    }

    clear(){
        this._len = 0;
        for( let i=0; i < this.sparse.length; i++ ) this.sparse[ i ] = null;
        return this;
    }
}

export default SparseSet;