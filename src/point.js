import Vector2 from "./Vector2.js";

function Point( name, position, fixed, mass = 1.0 ){

	if( typeof name == 'string'){
	
		this.name = name;
	
	}else {

		fixed = position;

		position = name;

		mass = fixed;

	}

	if( position === undefined ){
	
		position = new Vector2();
	
	} else if( Array.isArray ( position) ){

		position = new Vector2( position[0], position[1]);

	}

	this.position = position;

	this.oldPosition = this.position.clone();

	this.fixed = !!fixed;

	this._settled = !!fixed ;

	this.constraints = [];

	this._forceVec = new Vector2();

	this.mass = mass;

	this.velocity = new Vector2();
	
}

// TODO adjust hyper parameter alpha
Point.prototype._applyForceVec = function( alpha = 0.001 ){

	if( this.fixed ){

		return;

	}

	this.position.addScaledVector( this._forceVec, alpha );

};

let deltaVec = new Vector2();

let c = 0;
Point.prototype.updateWithVerletAlgorithm = function( deltaTime = 0.01 ){

	if( this.fixed ){

		return ;
	
	}

	deltaVec.copy( this._forceVec )

		.multiplyScalar( deltaTime * deltaTime / this.mass  )

		//.clampLength( 0, .001);

	let newPosition = this.position.clone()

		.multiplyScalar( 2.0 )

		.sub( this.oldPosition )

		.add( deltaVec );

	this.oldPosition = this.position.clone();

	this.position = newPosition;

	this.velocity.copy( this.position )

		.sub( this.oldPosition )

		.multiplyScalar( 1.0 / deltaTime );

		c = 1;
};

Point.prototype.getDof = function(){

	var dof = 2; // x, y

	if( this.fixed ){

		dof = 0;
	
	}

	return dof;

};

Point.prototype.addGravityForce = function(scene){

	if( !scene.useGravity ){

		return;

	}

	this._forceVec.addScaledVector( scene.gravityVec, this.mass);

};

export default Point;

