import Vector2 from "./Vector2.js";

function ConstraintBase ( ){

	this.type = "ConstraintBase";

	this._target = 0;

	this._actual = this.target;

	this._springK = 1.0;

	this.range = {};

	this.rangeLimit = false;

	Object.defineProperties( this, {

		target: {

			get: ()=> {

				return this._target;
			
			}

		},

		actual: {

			get: ()=> {

				this._updateActual();

				return this._actual;

			}

		},

		diff : {

			get: () => {

				return this._computeDiff()
			
			}
		},

		error: {
			
			get: ()=> {

				return this._computeError();
			
			}

		}

	} );

};

ConstraintBase.prototype.setTarget = function( value ){

	this._target = value;

};

ConstraintBase.prototype._updateActual = function(  ){

	// Do nothing
	return this._actual;

};

ConstraintBase.prototype._computeDiff = function(  ){

	var actual = this.actual;

	if( this.rangeLimit ){

		if ( this.range.max < actual ){

			return this.range.max - actual;

		} else if( actual < this.range.min ){

			return this.range.min - actual;

		}

		return 0;

	}

	return this._target - actual;

};

ConstraintBase.prototype._computeError = function( ){

	var diff = this.diff;

	return diff * diff;

};

ConstraintBase.prototype.adjust = function(){

	// Do nothing

};

ConstraintBase.prototype.getDof = function(){

	var dof = 1;

	if ( this.rangeLimit ){

		dof = 0;

	}

	return dof;

};

ConstraintBase.prototype.getPointList  = function( ){

	return [];

};

ConstraintBase.prototype._isOtherPointsSettled = function( point ){

	var pointList = this.getPointList();

	var result = true;

	for ( var i = 0; i < pointList.length; i++){

		if (pointList[i] === point){

			continue;

		}

		if ( !pointList[i]._settled ){

			result = false;

			break;
		
		}

	}

	return result;

};

ConstraintBase.prototype.addForceVec = function(){

	console.error("addForceVec shold be defined in overloaded class");

};

function Linear ( point1, point2, range ){

	ConstraintBase.call( this );

	this.type = "linear";

	this.point1 = point1;
	
	this.point2 = point2;

	this._updateActual();

	if ( !!range ){
		
		this.rangeLimit = true;

		this.range = range;

		this.range.positiveLimit = ( this.range.min + this.range.max ) / 2.0;


	} else {

		this.setTarget( this._actual );

	}


	this.point1.constraints.push( this );

	this.point2.constraints.push( this );

};

Linear.prototype = Object.assign( 

	Object.create( ConstraintBase.prototype ), {

		constructor : Linear

	}
);

Linear.prototype.setTarget = function( target ){

	this._target = target;

	this.range.min = target;

	this.range.max = target;

	this.range.positiveLimit = ( this.range.min + this.range.max ) / 2.0;

};

Linear.prototype._updateActual = function(  ){
	
	this._actual = this.point1.position.distanceTo( this.point2.position );

	return this._actual;

};

// p2 force
Linear.prototype._computeForce = function( forceVec1, forceVec2 ){

	forceVec1.subVectors( this.point1.position, this.point2.position ) .setLength( this.diff * this._springK);

	forceVec2.copy( forceVec1 ).negate();

	//console.log( "liner : " + forceVec1.lengthSq() )

	return [forceVec1, forceVec2];

};

Linear.prototype.addForceVec = (function (){

	var forceVec1 = new Vector2();
	var forceVec2 = new Vector2();
	
	function addForceVec(){

		this._computeForce( forceVec1, forceVec2 );

		this.point1._forceVec.add( forceVec1 );
		this.point2._forceVec.add( forceVec2 );

	}

	return addForceVec;

})();

Linear.prototype.getPointList  = function( ){

	return [
		this.point1,
		this.point2
	];

};


/*
	range{
		min : 0 ~ 2pi
		max : 0 ~ 4pi
	}
*/
 function Rotational( point1, point2, point3, range ){

	ConstraintBase.call( this );

	this.type = "rotational";

	this.point1 = point1;
	
	this.point2 = point2;
	
	this.point3 = point3;

	this._updateActual();

	if( !!range ){

		this.rangeLimit = true;

		this.range = range;

		this._updateRange();

	} else {

		this.setTarget( this._actual );

	}

	this._springK = 1.0;

	this.point1.constraints.push( this );

	this.point2.constraints.push( this );
	
	this.point3.constraints.push( this );

}

Rotational.prototype = Object.assign( 

	Object.create( ConstraintBase.prototype ), {

		constructor : Rotational
		
	}

);

Rotational.prototype.setTarget = function( target ){

	target = this._clampAngle( target , 0);

	this._target = target;

	this.range.min = target;

	this.range.max = target;

	this._updateRange( );

};

Rotational.prototype._updateRange = function( ){

	this.range.positiveLimit = ( this.range.min + this.range.max) / 2.0

	this.range.negativeLowLimit = this.range.positiveLimit - Math.PI;
		
	this.range.negativeHighLimit = this.range.positiveLimit + Math.PI;

};

Rotational.prototype._clampAngle = function( angle, min ){

	if( angle < min){

		angle += (Math.floor( (min - angle) / ( Math.PI * 2.0 ) ) + 1.0) * ( Math.PI * 2.0 );

	} else {

		angle -= Math.floor( ( angle - min ) / ( Math.PI * 2.0 ) ) * ( Math.PI * 2.0 );
	
	}

	return angle;

};

Rotational.prototype._updateActual = (function(){
	
	var tempVec = new Vector2();

	function _updateActual(){

		var angle1 = tempVec.subVectors( this.point3.position, this.point2.position ).angle();
		
		var angle2 = tempVec.subVectors( this.point2.position, this.point1.position ).angle();

		var angle = angle1 - angle2;

		// validation
		//angle = this._clampAngle( angle, this.rangeLimit ? this.range.negativeLowLimit : 0);

		this._actual = angle;
		
		return angle;
	
	}

	return _updateActual;

})();

Rotational.prototype._computeDiff= function( ){

	var angle = this.actual; 

	var diff;

	angle = this._clampAngle( angle, this.range.negativeLowLimit );

	if( angle < this.range.min ){

		diff = this.range.min - angle;

	} else if( angle <= this.range.max ){

		diff = 0;
	
	} else {

		diff = this.range.max - angle;

	}

	return diff;

};

Rotational.prototype._computeError = (function( ){

	var tempVec = new Vector2();

	function _computeError(){

		var error = 0;

		var diff = this.diff;

		error +=  tempVec
			.subVectors( this.point1.position, this.point2.position)
			.lengthSq() * (diff * diff / 4.0)

		error +=  tempVec
			.subVectors( this.point3.position, this.point2.position)
			.lengthSq() * (diff * diff / 4.0)
		
		return error;
	}

	return _computeError;

})();

// p2 force
Rotational.prototype._computeForce = (function (){
	
	var tempVec1 = new Vector2();
	var tempVec2 = new Vector2();

	function _computeForce( forceVec1, forceVec2, forceVec3 ){

		var torque = this.diff * this._springK;

		// point1
		tempVec1.subVectors( this.point2.position, this.point1.position );
		tempVec2.subVectors( this.point3.position, this.point2.position );

		forceVec1.x = - tempVec1.y;
		forceVec1.y = tempVec1.x;

		//forceVec1.multiplyScalar( torque / tempVec.lengthSq() );
		//forceVec1.multiplyScalar( torque  );
		forceVec1.multiplyScalar( torque * tempVec2.length() / tempVec1.length() );

		// point3
		//tempVec.subVectors( this.point3.position, this.point2.position );

		forceVec3.x = - tempVec2.y;
		forceVec3.y = tempVec2.x;

		//forceVec3.multiplyScalar( torque / tempVec.lengthSq() );
		//forceVec3.multiplyScalar( torque  );
		forceVec3.multiplyScalar( torque * tempVec1.length() / tempVec2.length() );

		// point2
		forceVec2.addVectors( forceVec1, forceVec3 ).negate();

		//console.log( "rotational : " + forceVec3.lengthSq() )

		return [forceVec1, forceVec2, forceVec3];

	}

	return _computeForce;

})();

Rotational.prototype.addForceVec = (function (){

	var forceVec1 = new Vector2();
	var forceVec2 = new Vector2();
	var forceVec3 = new Vector2();
	
	function addForceVec(){

		this._computeForce( forceVec1, forceVec2, forceVec3 );

		this.point1._forceVec.add( forceVec1 );
		this.point2._forceVec.add( forceVec2 );
		this.point3._forceVec.add( forceVec3 );

	}

	return addForceVec;

})();

Rotational.prototype.getPointList  = function( ){

	return [
		this.point1,
		this.point2,
		this.point3
	];

};

function RotationalSpring( point1, point2, point3, springK = 2 ,range = null ){

	ConstraintBase.call( this );

	this.type = "rotational-spring";

	this.point1 = point1;
	
	this.point2 = point2;
	
	this.point3 = point3;

	this._updateActual();

	if( !!range ){

		this.rangeLimit = true;

		this.range = range;

		this._updateRange();

	} else {

		this.setTarget( this._actual );

	}

	this._springK = springK;

	this.point1.constraints.push( this );

	this.point2.constraints.push( this );
	
	this.point3.constraints.push( this );

}

RotationalSpring.prototype = Object.assign( 

	Object.create( Rotational.prototype ), {

		constructor : RotationalSpring
		
	}

);

// spring has no error 
RotationalSpring.prototype._computeError = function(){

	return 0;

};

function LinearDamper(point1, point2, dampFactor = 0.1){

	ConstraintBase.call( this );

	Object.defineProperty

	this.type = "linear-damper";

	this.point1 = point1;
	
	this.point2 = point2;

	this.point1.constraints.push( this );

	this.point2.constraints.push( this );

	this.dampFactor = dampFactor;

};

LinearDamper.prototype = Object.assign( 

	Object.create( Linear.prototype ), {

		constructor : LinearDamper

	}
);

let tempVec = new Vector2();

LinearDamper.prototype._computeForce = function( forceVec1, forceVec2){

	forceVec1.copy( this.point1.position )

		.sub( this.point2.position );

	let dot = tempVec.copy( this.point1.velocity )

		.sub( this.point2.velocity )

		.dot( forceVec1 );

	forceVec1.multiplyScalar( - dot / forceVec1.lengthSq() * this.dampFactor )

	forceVec2.copy( forceVec1 ).negate();
/*
	forceVec1.x = 0;
	forceVec2.x = 0;
	forceVec1.y = 0;
	forceVec2.y = 0;
*/
	return [forceVec1, forceVec2];

};
 

export default {Linear, Rotational, RotationalSpring, LinearDamper}
