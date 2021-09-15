class Tags{
    items   = new Array();
    map     = {};

    get( name ){ return this.map[ name ] ?? null; }
    getName( id ){ return this.items[ id ]; }

    add( name ){
        let id = this.map[ name ];
        if( id !== undefined ) return id;

        id = this.items.length;
        this.items.push( name );
        this.map[ name ] = id;

        console.log( "[ Tag Added : %d.%s ]", id, name );
        return id;
    }

    batchAdd( ...args ){
        const rtn = new Array( args.length );
        for( let i=0; i < args.length; i++ ){
            rtn[ i ] = this.add( args[ i ] );
        }
        return rtn;
    }
}

export default Tags;