function SpringSolver(scene){

	this.solve = function(deltaTime = 0.01){

		var minError = 0.01;
		var warnItr = 200;
		var maxItr = 400; 

		var error = 0;

		var count = 0;

		for( var i=0; i<maxItr; i++){

			error = 0;

			scene._clearForce();

			scene.constraints.forEach(( constraint )=>{

				constraint._addForceVec();

				error += constraint.error ;

				count ++;

			});


			scene.points.forEach( ( point ) => {

				//if( !point.fixed )
				//	error += point.diff;
					//error += point._forceVec.lengthSq();

				point._applyForceVec();
				
				count ++;

			});

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

	this.build = function(){
		// nothing to do
	};

}

export default SpringSolver;