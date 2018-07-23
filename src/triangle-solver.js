import Triangle from './triangle.js';

function TriangleSolver( scene ){

	var procedures = [
		{
			procedureId: 0,

			procedure: function( triangle ){

				triangle.calculateLengthFromPositions(2)
					.calculateAngleFromThreeLengths(1); 
			
			}

		},
		{
			procedureId: 1,

			procedure: function( triangle ){

				triangle.calculateLineAngleFromPositions( 2 )
					.calculateLineAngleFromAngle( 0, 2)
					.calculatePositionFromLineAngle( 2, 0);

			},

		}
	];

	var solutions = [

		{
			solutionId: 0,

			procedureList: [0, 1],

			getTriangle: function(point, constraint1, constraint2){
				
				if( !( constraint1.type === "linear" && constraint2.type === "linear") ){

					return ;
				
				}

				var pointX, pointY;

				if( constraint1.point1 === point ) {

					pointX = constraint1.point2;
				
				} else {

					pointX = constraint1.point1;

				} 

				if( constraint2.point1 === point ) {

					pointY = constraint2.point2;
				
				} else {

					pointY = constraint2.point1;

				} 

				var triangle = new Triangle();

				triangle.setPoint(0, pointX);

				triangle.setPoint(1, pointY);

				triangle.setPoint(2, point, /* fixed = */false );
				
				triangle.setLength(0, constraint2.target );

				triangle.setLength(1, constraint1.target );
				
				triangle.solutionId = this.solutionId;

				return triangle;

			}
		},
		{
			solutionId: 1,

			procedureList: [1],
			
			getTriangle: function(point, constraint1, constraint2){
				
				var linear, rotational, angle, point1, point2;

				if( constraint1.type === "linear" && constraint2.type === 'rotational'){

					linear = constraint1;

					rotational = constraint2;	
				
				} else if( constraint2.type === "linear" && constraint1.type === 'rotational'){

					linear = constraint2;
					
					rotational = constraint1;	
				
				} else {

					return ;

				}

				if( linear.point1 === point ){

					point2 = linear.point2;
				
				} else {

					point2 = linear.point1;

				}

				if( rotational.point1 === point && rotational.point2 === point2 ){

					angle = - rotational.target;

					point1 = rotational.point3;

				} else if( rotational.point3 === point && rotational.point2 === point2 ){

					angle = rotational.target;

					point1 = rotational.point1;

				} else {

					return;

				}

				var triangle = new Triangle();

				triangle.setPoint(0, point1 );

				triangle.setPoint(1, point2 );

				triangle.setPoint(2, point, /* fixed= */ false );

				triangle.setLength( 0, linear.target );
			
				triangle.setAngle(1, angle );

				triangle.solutionId = this.solutionId;

				return triangle;

			}	
		}
	];

	var triangleList = [];

	var lastChanged = false;

	function findTriangleInPoint( point ){

		if ( point._settled ){

			return;

		}

		var settledConstraints = [];

		point.constraints.forEach( (constraint) => {

			if( constraint.rangeLimit && !constraint.motor ){

				return;

			}

			if (constraint._isOtherPointsSettled( point ) ){

				settledConstraints.push( constraint );

			}

		} );

		var triangle = findTriangleInSettledConstraints ( point, settledConstraints );

		if( triangle ){

			triangle.points[2]._settled = true;

			triangleList.push( triangle );

			lastChanged = true;
		}
	
	}

	function findTriangleInSettledConstraints( point, settledConstraints ){
	
		var settledLength = settledConstraints.length;

		if( settledLength < 2){

			return;

		} 

		// choose constraints for triangle
		for ( var i = 0; i < settledLength; i++ ){

			var constraint1 = settledConstraints[ i ];

			for( var j = i + 1; j < settledLength; j++ ){

				var constraint2 = settledConstraints[ j ];

				var triangle = getTriagnle( point, constraint1, constraint2 );

				if( triangle ){

					return triangle;

				} 

			}

		} 

	}

	function getTriagnle( point, constraint1, constraint2){

		for(var i in solutions){

			var triangle = solutions[i].getTriangle( point, constraint1, constraint2 );

			if( triangle ){

				return triangle;

			}
		
		}

	}

	this.build = function(  ){

		// clear
		scene._clearSettled();

		var dof = scene.getDof();

		if( dof > 0){

			console.log( `Dof in this scene is ${dof} > 0. Cannot solve uniquely!!` );
			
			//return;

		}

		lastChanged = true;

		while( lastChanged ){
			
			lastChanged = false;

			scene.points.forEach( findTriangleInPoint );

		}

		// clear
		scene._clearSettled();


	};

	this.solve = function(){

		for( var i in triangleList ){

			var triangle = triangleList[i];

			var solutionId = triangle.solutionId;

			var procedureList = solutions[ solutionId ].procedureList;

			for (var j in procedureList ){

				var procedureId = procedureList[j];
				
				var procedure = procedures[ procedureId ];

				procedure.procedure( triangle );

			}
		}
	}
}

export default TriangleSolver;
