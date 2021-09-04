
let TAG_ID = 0;

class Tags{
    items = {};

    add( name ){
        if( this.items[ name ] !== undefined ) return null;        
        return this.items[ name ] = TAG_ID++;
    }

    getTagID( name ){ return this.items[ name ] ?? null; }
}

export default Tags;