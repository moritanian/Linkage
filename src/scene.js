import Vector2 from "./Vector2.js";

function Scene (){

	this.points = [];

	this.constraints = [];

	this.solveProcedure = [];

}

Scene.prototype.initCanvas = function( width = 800, height = 600){
	
	var app = new PIXI.Application(width, height, { antialias: true });
	
	this.domElement = app.view;

	app.stage.interactive = true;

	var g = new PIXI.Graphics();
	
	app.stage.addChild(g);

	function drawLine( p1, p2, color = 0xFFFFFF){
		
		var scale = 80.0;

		
		var offset = new Vector2( width/2, height/2 );
		
		g.lineStyle( 2, color )
			.moveTo( offset.x + p1.x * scale, offset.y - p1.y * scale )
			.lineTo( offset.x + p2.x * scale, offset.y - p2.y * scale );

	}

	this.render = function(){

		g.clear();	

		this.constraints.forEach( ( constraint ) => {

			switch (constraint.type){

				case "linear":

					drawLine( constraint.point1.position, constraint.point2.position );

					break;
			} 

		});

	};

	return this.domElement;

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
}

Scene.prototype.solve = function(){

	var minError = 0.01;
	var maxIttr = 10;

	var error = 0;

	this._clearSettled();

	var count = 0;

	for( var i=0; i<maxIttr; i++){

		error = 0;

		this._clearForce();

		this.constraints.forEach(( constraint )=>{

			constraint._addForceVec();

			count ++;

		});


		this.points.forEach( ( point ) => {

			if( !point.fixed )
				error += point._forceVec.lengthSq();

			point._applyForceVec();
			
			count ++;

		});

		if( error < minError ){

			break;

		}

		if( i == maxIttr - 1) {

			console.warn( "Linkage.Scene.solve: cannot solved ");
		
		}

	}

};

export default Scene ;

