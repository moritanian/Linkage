function SpringSolver(scene){

	var count;

	this.solve = function(deltaTime = 0.01){

		var minError = 0.0001; //0.01;
		var warnItr = 200;
		var maxItr = 400; 

		var error = 0;

		count = 0;

		for( var i=0; i<maxItr; i++){

			error = this.simulate();


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
	}

	this.simulate = function(){
		
		let error = 0;

		scene.clearForce();

		scene.constraints.forEach(( constraint )=>{

			constraint.addForceVec();

			let addError = constraint.error 

			/* TODO 収束したかの判定は、forceの和で、収束結果が正しいかは errorの和 */
			//error += addError;

			count ++;

		});


		scene.points.forEach( ( point ) => {

			if( !point.fixed )
				//error += point.diff;
				error += point._forceVec.lengthSq();

			point._applyForceVec( );
			
			count ++;

		});

		return error;

	};

	this.build = function(){
		// nothing to do
	};

}

export default SpringSolver;