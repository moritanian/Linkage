/*

js indexer class

example:  
	
	getter = (array, i)=> { return array[i] + "dummy" }
	setter = (array, i, value)=> { array[i] = value + "set" }
	arr = new ArrayPropertied([1,2,3], getter, setter)
	console.log( arr[0]) /// => "1dummyset" 
*/
function ArrayPropertied( array, option = {}){

	if( Array.isArray( array ) ){

		this._array = array;

	} else {

		this._array = new Array( array );

	}

	var getterDefault = ( array, index )=> {

		return array[index];

	};

	var setterDefault = ( array, index, value ) => {

		array[ index ] = value;

		return value;

	};

	this.__getter = option.getter || getterDefault;

	this.__setter = option.setter || setterDefault;

	for(var index = 0; index < this._array.length; index++ ){

		this.__defineProperty( index, this.__getter, this.__setter );

	};

	Object.defineProperty( this, "length", {
		get(){ return this._array.length } 
	});

}

ArrayPropertied.prototype.__defineProperty = function( index, getter, setter ){

	Object.defineProperties( this, {
		[index]: {
			enumerable: true,
			get: ()=> { return getter.call(this,　this._array, index ) },
			set: ( value )=> { return setter.call(this,　this._array, index, value) }
		}
	});

};

ArrayPropertied.prototype.push = function(){

	var index = this.length;

	Array.prototype.push.apply( this._array, arguments );

	for( var i=0; i<arguments.length; i++){

		this.__defineProperty( index, this.__getter, this.__setter );

		index ++;

	}

};

ArrayPropertied.prototype.concat = function(){

	return Array,prototype.concat.apply( this._array, arguments );

};

ArrayPropertied.prototype.getRawArray = function(){

	return this._array;

};

export default ArrayPropertied;
