
let TAG_ID = 0;

class Tags{
    items = {};

    get( name ){ return this.items[ name ] ?? null; }

    add( name ){ return this.items[ name ] ?? ( this.items[ name ] = TAG_ID++ ); }

    batchAdd( ...args ){
        const rtn = new Array( args.length );
        for( let i=0; i < args.length; i++ ){
            rtn[ i ] = this.add( args[ i ] );
        }
        return rtn;
    }
}

export default Tags;