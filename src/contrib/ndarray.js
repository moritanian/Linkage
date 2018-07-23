
function Ndarray( ){
	
	var _array = Array.apply(this, arguments);

	var length = _array.length;

	var instance = new ArrayPropertied( _array, 

		{

			getter: (array, index)=>{

				if( index < 0){

					index = array.length + index

				}

				array[index] ++;

				return array[index];
			
			},

			setter: (array, index, value) => {
			
				if( index < 0){

					index = array.length + index
				}

				array[index] = value;
			
			}

		}
	);

	for( var index = -1; index > -length-1; index--){

		instance.__defineProperty( index, instance.__getter, instance.__setter );

	};

	return instance;

}
a = new Ndarray(1,2,3)
a[-1]