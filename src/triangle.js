import Vector2 from "./Vector2.js";
import ArrayPropertied from "./array_propertied.js";

/*
	class for calculate position 
	
	positions[0], positions[1] : fixed
	calculate position[2]

	position 0, 1, 2 are positioned in a counterclockwise direction

*/
var TRI_NUM = 3;

function Triangle(){
	
	let self = this;

	var propertiesGenerator = ( name, _fixedArray ) => {

		let fixedArray = _fixedArray;
		
		return {

			getter: function( array, index ){

				if( !fixedArray[index] ){

					self.invalidRead( name, index );

					return null;

				}

				return array[index];
			},

			setter: function( array, index, value ){

				fixedArray[ index ] = true;

				array[ index ] = value;

			}

		};
	
	};

	this.positionFixed = Array( TRI_NUM ).fill( false );

	/*this.positions = new ArrayPropertied( TRI_NUM, 
		propertiesGenerator( "positioins", this.positionFixed) );
	*/
	this.points = []; 
	
	this.positions = new ArrayPropertied( TRI_NUM, 
	{
		getter: function( array, index ){

			if( !self.positionFixed[ index ]){

				self.invalidRead( 'positions', index);

				return null;
			
			}

			return self.points[ index ].position;

		},

		setter: function( array , index, value ){

			self.positionFixed[index] = true;

			self.points[index].position = value;

		}
	});

	this.lengthFixed = Array( TRI_NUM ).fill( false );

	this.lengths = new ArrayPropertied( TRI_NUM, 
		propertiesGenerator( "lengths", this.lengthFixed ) );

	this.angleFixed = Array( TRI_NUM ).fill( false );
	
	this.angles = new ArrayPropertied( TRI_NUM, 
		propertiesGenerator( "angles", this.angleFixed ) );

	this.lineAngleFixed = Array( TRI_NUM ).fill( false );

	this.lineAngles = new ArrayPropertied ( TRI_NUM,
		propertiesGenerator( "lineAngles", this.lineAngleFixed ) );

}

Triangle.prototype.invalidRead = function( propertyName, index ){

	var obj = {};

	Error.captureStackTrace( obj );

	console.error( `Linkage.Triangle: read invalid ( ${propertyName}[ ${index} ] )` );	

	console.error( obj.stack );
};

Triangle.prototype.clear = function(){

	for( var i = 0; i < TRI_NUM; i++){

		this.lengthFixed[i] = false;

		this.angleFixed[i] = false;

		this.lineAngleFixed[i] = false;

	}

};

Triangle.prototype.setPoint = function(index, point, fixed = true ){

	this.positionFixed[ index ] = fixed;

	this.points[index] = point;

	return this;

};

Triangle.prototype.setLength = function(index, value){

	this.lengths[index] = value;

	return this;

};

Triangle.prototype.setAngle = function(index, value){

	this.angles[index] = value;

	return this;

};

Triangle.prototype.solvePosition = function(){

	if( this.lengthFixed[0] && this.lengthFixed[1]){



	}

};


Triangle.prototype.solveTwoLinear = function( ){



};

/*
	calculate length form two positions 
*/
Triangle.prototype.calculateLengthFromPositions = function( index ){

	var index1 = this.validateIndex( index + 1);

	var index2 = this.validateIndex( index + 2);
	
	this.lengths[ index ] = this.positions[ index1 ].distanceTo( this.positions[ index2] );

	return this;

};

/*
	calculate length by cosine theory
	a^2 = b^2 + c^2 - 2 b c cos( A )
	calculate A
*/

Triangle.prototype.calculateLengthFromDiagonalAngleAndSideLengths = function( indexA ){

	var indexB = this.validateIndex　(indexA + 1);
	
	var indexC = this.validateIndex　(indexB + 1);

	var lengthB = this.lengths[ indexB ];
	
	var lengthC = this.lengths[ indexC ];

	var A = this.angles[ indexA ];

	var lengthASq = lengthB * lengthB + lengthC - 2 * lengthB * lengthC * Math.cos( A );

	this.lengths[ indexA ] = Math.sqrt( lengthASq );

	return this;

};

/*
	calculate angle by cosine theory
	a^2 = b^2 + c^2 - 2 b c cos( A )
	calculate A
*/

Triangle.prototype.calculateAngleFromThreeLengths = function( indexA ){

	var indexB = this.validateIndex　(indexA + 1);
	
	var indexC = this.validateIndex　(indexB + 1);

	var lengthA = this.lengths[ indexA ];
	
	var lengthB = this.lengths[ indexB ];
	
	var lengthC = this.lengths[ indexC ];

	var cosA = - ( lengthB * lengthB + lengthC * lengthC - lengthA * lengthA ) / ( 2.0 * lengthB * lengthC);

	var A = Math.acos( this.crop( cosA, -1, 1) );

	var A2 = -A;

	var angle = this.getNearest( this.angles, indexA, [A, A2] );

	if( Math.abs( angle ) < 0.01 || Math.abs( angle - Math.PI ) < 0.01  ){

		console.warn( 'calculateAngleFromThreeLengths : Triangle cannot be constructed');

	}

	this.angles[ indexA ] = angle;

	return this;

};


/*
	calculate length by sine theory

	a / sin( A ) = b / sin( B ) 
	calculate a;
*/
Triangle.prototype.calculateLengthFromTwoAngleAndLength = function( indexA, indexB ){

	var lengthB = this.lengths[ indexB ];

	var angleA = this.angles[ this.indexA ];

	var angleB = this.angles[ this.indexB ];
	
	this.lengths[ indexA ] = Math.sin( angleA ) * lengthB / Math.sin( angleB );

	return this;

};

/*
	calculate length by sine theory

	a / sin( A ) = b / sin( B ) 
	calculate A;
*/
Triangle.prototype.calculateAngleFromTwoAngleAndLength = function( indexA, indexB ){

	var lengthA = this.lengths[ indexA ];

	var lengthB = this.lengths[ indexB ];

	var angleB = this.angles[ this.indexB ];
	
	var sinA = Math.sin( angleB ) * lengthA / lengthB;

	var A = Math.asin( this.crop( sinA, -1, 1) );

	var A2 = Math.PI - A;

	this.angles[ indexA ] = this.getNearest( this.angles, indexA, [A, A2] );

	return this;

};

Triangle.prototype.calculateAngleFromOtherAngles = function( index ){

	var index1 = this.validateIndex( index + 1);

	var index2 = this.validateIndex( index + 2);
	
	this.angles[ index ] = Math.PI - this.angles[ index1 ] - this.angles[ index2 ];

	return this;

};


/*
	calculate length by cosine theory
	
	a^2 = b^2 + c^2 - 2 b c cos( sita )
	=> 
	b^2 - 2 b c cos(sita) + c^2 - a^2 = 0 

	return b 
*/
/*
Triangle.prototype.calculateLengthFromSideAngle = function( index, angleIndex ){

	var anotherIndex = this.validateIndex( index, angleIndex );

	var angleLength = this.lengths[ angleIndex ];

	var anotherLength = this.lengths[ anotherLength ];

	var sita = this.angles[ angleIndex ];

	var k1 = 1,
		k2 = - 2 * anotherLength * Math.cos( sita ), 
		k3 = anotherLength * anotherLength - angleLength * angleLength;

	var lengthList = this.solveQuadEq( k1, k2, k3);

	if( lengthList.length == 0){

		console.error( "Triangle.calculateLengthFromSideAngle: quadratic equation has no solutions.");

		return this;

	} else if ( lengthList.length == 2){

		// select nearest
	}
};
*/

/*
	calculate position from other position and lineAngle and lineLength
*/
Triangle.prototype.calculatePositionFromLineAngle = function( index, lineAngleIndex ){

	var order = this.indexOrder( index, lineAngleIndex);

	var fromPositionIndex = this.getRemainIndex( index, lineAngleIndex);

	this.positions[ index ] = this.positions[ fromPositionIndex ].clone() ;

	var angle = this.lineAngles[ lineAngleIndex ];

	var length = this.lengths[ lineAngleIndex ];

	this.positions[ index ].x += order * Math.cos( angle ) * length; 

	this.positions[ index ].y += order * Math.sin( angle ) * length; 

}

/*
	calculate LineAngle( LA ) from angle and other LineAngle

	LA(i) = LA(k) - Angle(j) + PI
		or 
	LA(i) = LA(j) + Angle(k) + PI
*/
Triangle.prototype.calculateLineAngleFromAngle = function( index, fromLineAngleIndex ){

	var order = this.indexOrder( index, fromLineAngleIndex );　

	var angleIndex  = this.getRemainIndex( index, fromLineAngleIndex );　

	this.lineAngles[ index ] = 
		this.lineAngles[ fromLineAngleIndex ] - order * this.angles[ angleIndex ];

	return this;

};

Triangle.prototype.calculateLineAngleFromPositions = function( index ){

	var startIndex = this.validateIndex( index + 1 );

	var endIndex = this.validateIndex( index + 2) 

	this.lineAngles[ index ] = this.positions[ endIndex ]
		.clone()
		.sub( this.positions[ startIndex ])
		.angle();

	return this;

};

/* 
	get nearest value to the previous one between candidate values
 */
Triangle.prototype.getNearest = function( array, index, candidates ){

	var previous = array.getRawArray()[ index ];

	if( previous == null){

		return candidates[0];

	}

	var distanceFunc;

	if( !!previous.distanceToSquared ){

		distanceFunc = (i, j) => { return i.distanceToSquared(j); };

	} else {

		distanceFunc = (i, j) => { return (i - j ) * (i - j); };

	}

	var nearest = candidates[0];

	var minDistance = distanceFunc( previous, candidates[0] );

	for( var i=1; i<candidates.length; i++){

		var distance = distanceFunc( previous, candidates[i] );

		if( distance < minDistance ){

			nearest = candidates[ i ];

			minDistance = distance;

		}

	}

	return nearest;

};
/*
	solve quadratic equation
		a x^2 + b x + c = 0

	return [x0, x1] or [x0] or [] 
*/
Triangle.prototype.solveQuadEq= function( a, b, c){

	var D = b * b - 4 * a * c;

	if( D < 0){

		return [];

	} 

	var k = - b / (2 * a);

	var l = Math.sqrt( D ) / (2 * a);

	if ( D == 0 ){

		return [k];

	} 

	return [ k - l, k + l ];

};

/*
	i, j, k = (0, 1, 2), (1, 2, 0), (2, 0, 1) : 1
			   (2, 1, 0), (1, 0, 2), (0, 2, 1) : -1
			  otherWise : 0
	i, j = (0, 1), (1, 2), (2, 0) : 1
			(2, 1), (1, 0), (0, 2) : -1
			otherwise : 0
*/
Triangle.prototype.indexOrder　= function( i, j, k ){

	var ij, jk, ki;

	ij = this.validateIndex( i - j );

	if( k != null ){

		jk = this.validateIndex( j - k );

		ki = this.validateIndex( k - i );

	} else {

		jk = ki = ij;

	}

	var order = 0;

	if ( ij == 1 &&  jk == 1 && ki == 1){

		order = -1;

	} else if ( ij == TRI_NUM - 1 &&  jk == TRI_NUM - 1 && ki == TRI_NUM - 1){

		order = 1;

	}	

	return order;

};	

// get index k (ex: (0,1) => 2, (0,2) => 1)
Triangle.prototype.getRemainIndex　= function( i, j ){

	return this.validateIndex( j + this.indexOrder(i, j) );

};

Triangle.prototype.validateIndex　= function( i ){

	if( i < 0 ){

		i = TRI_NUM - (-i % TRI_NUM);

	} else {

		i = i % TRI_NUM;

	}

	return i;

};

Triangle.prototype.crop　= function( i, min, max ){

	if( i < min){

		i = min;

	} else if( i > max ){

		i = max;

	}

	return i;
};

export default Triangle;
