function Motor( constraint ){

	this.constraint = constraint;

	constraint.isMotor = true;

	constraint.motor = this;

	this.speed = 0;

	this.range = {};

}

Motor.prototype.move = function( speed, range ){

	this.speed = speed;

	if( !range ){

		range = {

			max: Infinity,

			min: - Infinity

		};
	
	}

	this.range = range;

};


Motor.prototype.update = function( deltaTime ){

	if( this.speed == 0){

		return;
	
	}

	var target = this.constraint.target;

	target += this.speed * deltaTime;

	if( this.range.max < target){

		target = this.range.max;

		this.speed = - Math.abs( this.speed);

	} else if ( this.range.min > target ){

		target = this.range.min;
		
		this.speed = Math.abs(this.speed);

	}

	this.constraint.setTarget( target );

};

export default Motor;
