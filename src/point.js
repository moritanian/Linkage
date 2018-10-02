import Vector2 from "./Vector2.js";

function Point( name, position, fixed ){

	if( typeof name == 'string'){
	
		this.name = name;
	
	}else {

		fixed = position;

		position = name;

	}

	if( position === undefined ){
	
		position = new Vector2();
	
	} else if( Array.isArray ( position) ){

		position = new Vector2( position[0], position[1]);

	}

	this.position = position;

	this.fixed = !!fixed;

	this._settled = !!fixed ;

	this.constraints = [];

	this._forceVec = new Vector2();
	
}

// TODO adjust hyper parameter alpha
Point.prototype._applyForceVec = function( alpha = 0.1 ){

	if( this.fixed ){

		return;
	
	}

	this.position.addScaledVector( this._forceVec, alpha );
	
};

Point.prototype.getDof = function(){

	var dof = 2; // x, y

	if( this.fixed ){

		dof = 0;
	
	}

	return dof;

};

export default Point;

