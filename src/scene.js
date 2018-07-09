import Canvas from "./canvas.js";

function Scene (){

	this.points = [];

	this.constraints = [];

	this.solveProcedure = [];

	this.motors = [];

	this.lastTime = (new Date).getTime();

}

Scene.prototype.initCanvas = function( width = 800, height = 600){
	
	this.canvas = new Canvas( this, width, height );

	return this.canvas.domElement;

};

Scene.prototype.render = function( ){

	this.canvas.render();

};


Scene.prototype.getDof = function(){

	var dof = 0;

	this.points.forEach( (point )=>{

		dof += point.getDof();

	});

	this.constraints.forEach( ( constraint )=>{
		
		dof -= constraint.getDof(); 

	} );

	return dof;

};

Scene.prototype.addPoint = function( point ){

	this.points.push( point );

};

Scene.prototype.addConstraint = function( constraint ){

	this.constraints.push( constraint );
	
};

Scene.prototype.addMotor = function( motor ){

	this.motors.push( motor );
	
};

// calculate solveProcedure
Scene.prototype.build = function(){

	// clear
	this.solveProcedure = []

	this._clearSettled();

	var dof = this.dof();

	if( dof > 0){

		console.warn( `Dof in this scene is ${dof} > 0. Cannot solve!!` );
		
		return;

	}

	// TODO : compute procedure

	// clear
	this._clearSettled();

};

Scene.prototype._clearSettled = function(){

	for( var i in this.points){

		if( !this.points[i].fixed )
			this.points[i]._settled = false;

	}

};

Scene.prototype._clearForce = function(){

	for( var i in this.points){

		this.points[i]._forceVec.x = 0;
		this.points[i]._forceVec.y = 0;

	}

};

Scene.prototype._updateMotors = function( deltaTime ){

	this.motors.forEach( (motor) => {

		motor.update( deltaTime );

	});

};

Scene.prototype.solve = function( deltaTime = 0.01 ){

	var minError = 0.01;
	var maxIttr = 200;

	var error = 0;

	var currentTime = (new Date).getTime() / 1000.0;

	var deltaTime = currentTime - this.lastTime;

	this._updateMotors( deltaTime );

	this.lastTime = currentTime;

	this._clearSettled();

	var count = 0;

	for( var i=0; i<maxIttr; i++){

		error = 0;

		this._clearForce();

		this.constraints.forEach(( constraint )=>{

			constraint._addForceVec();

			error += constraint.error ;

			count ++;

		});


		this.points.forEach( ( point ) => {

			//if( !point.fixed )
			//	error += point.diff;
				//error += point._forceVec.lengthSq();

			point._applyForceVec();
			
			count ++;

		});

		if( error < minError ){

			break;

		}

		if( i == maxIttr - 1) {

			console.warn( `Linkage.Scene.solve: cannot solved. Error = ${error} `);
		
		}

	}

};

Scene.prototype.serialize = function(){

};

Scene.prototype.deserialize = function(){


};

export default Scene ;

