import Vector2 from "./Vector2.js";

function DynamicSolver(scene){

	// loop simulate until convergence
	this.solve = function(deltaTime = 0.01){

		this.simulate( deltaTime);

		return;
		
		let minError = 0.0001;

		let warnItr = 200;

		let maxItr = 400;

		for( let i = 0; i < maxItr; i++ ){

			this.simulate( deltaTime );

			let error = this._computeError();

			if( error < minError ){

				break;

			}

			if( i == warnItr - 1) {

				console.log( `Linkage.Scene.solve: Iterate countb is more than ${i+1} . Error = ${error} `);

			}

			if( i == maxItr - 1) {

				console.warn( `Linkage.Scene.solve: cannot solved. Error = ${error} `);

			}

		}


	};

	this.simulate = function(deltaTime = 0.01){

		scene.clearForce();

		scene.constraints.forEach(( constraint )=>{

			constraint.addForceVec( );

		});

		scene.points.forEach( ( point ) => {

			point.addGravityForce( scene );

			point.updateWithVerletAlgorithm( deltaTime );

		});

	};

	this._computeError = function(){

		let error = 0;

		scene.points.forEach( (point) => {

			if( point.fixed ){

				return;

			}

			error += point.position
				
				.distanceToSquared( point.oldPosition );
		});

		return error;

	};

	this.build = function(){

		// nothing to do

	}

}

export default DynamicSolver;
