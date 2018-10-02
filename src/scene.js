import Canvas from "./canvas.js";
import SpringSolver from "./spring-solver.js";
import TriangleSolver from "./triangle-solver.js";

let defauleSolver = SpringSolver;

function Scene (solver){

	this.points = [];

	this.constraints = [];

	this.solveProcedure = [];

	this.motors = [];

	this.lastTime = (new Date).getTime();

	this.running = false;

	if( !solver ){

		solver = defauleSolver;
	
	} 

	console.log(`Scene: use ${solver.name}` );
	
	this.solver = new solver( this );

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

	var currentTime = (new Date).getTime() / 1000.0;

	var deltaTime = currentTime - this.lastTime;

	if( this.running ){
	
		this._updateMotors( deltaTime );

	}

	this.lastTime = currentTime;

	this._clearSettled();

	this.solver.solve();

};

// TODO
Scene.prototype.serialize = function(){

};

// TODO
Scene.prototype.deserialize = function(){


};

export default Scene ;

