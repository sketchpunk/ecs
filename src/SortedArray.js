/*
function sortIndex( ary, itm ){
	let s, i=-1, saveIdx = -1;
	for( s of ary ){
		i++;
		if(s.priority < itm.priority) continue;							// Order by Priority First
		if(s.priority == itm.priority && s.order < itm.order) continue;	// Then by Order of Insertion
		
		saveIdx = i;
		break;
	}
	return saveIdx;
}
*/

class SortedArray extends Array{
	constructor( sFunc, size = 0 ){
		super( size );
		this._fnSortIndex = sFunc;
	}

	add( itm ){
		let saveIdx	= this._fnSortIndex( this, itm );

		if( saveIdx == -1 ) this.push( itm );
		else{
			this.push( null );								// Add blank space to the array

			let x;
			for(x = this.length-1; x > saveIdx; x-- ){		// Shift the array contents one index up
				this[ x ] = this[ x-1 ];
			}

			this[ saveIdx ] = itm;							// Save new Item in its sorted location
		}

		return this;
	}
}

export default SortedArray;