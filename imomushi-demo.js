import Linkage from "./src/linkage.js";

const Unit = Linkage.Unit;

$(function(){	


	// create snew cene
	//var scene = new Linkage.Scene( Linkage.DynamicSolver );
	var scene = new Linkage.Scene( Linkage.SpringSolver );

	scene.setGravity(true);

	var dom = scene.initCanvas();

	document.body.appendChild(dom);

	// create points
	const POINT_NUM = 20 ;
	var points = [];
	for( var i=0; i<POINT_NUM; i++){
		
		points.push( new Linkage.Point("point0", 
			[0 ,(250 - i*30) * Unit.mm], 
			/* fixed = */ i==0 || i==POINT_NUM,
			/* mass = */ 200 * Unit.g / POINT_NUM ));
		scene.addPoint( points[i] );

		if( i > 0){
			// linear
			var linear = new Linkage.Constraints.Linear( points[i-1], points[i]);
			//linear._springK = 100000.0;
			linear._springK = 100.0;
			scene.addConstraint( linear );
			
			// damper
			var damper = new Linkage.Constraints.LinearDamper( points[i-1], points[i], 100000.0);
			scene.addConstraint( damper );
		}

		if(1<i){
			var rotational = 
				new Linkage.Constraints.RotationalSpring(points[i-2], points[i-1], points[i], 10.0);
			scene.addConstraint( rotational);

		}
	}

	var sma = new Linkage.Constraints.Linear( points[5], points[POINT_NUM - 2],
		{min: 0,
		max: 100*Unit.mm
		}
	);

	sma._springK = 1.0;
			
	scene.addConstraint( sma );

	sma = new Linkage.Constraints.Linear( points[1], points[POINT_NUM - 6],
		{min: 0,
		max: 100*Unit.mm
		}
	);

	sma._springK = 1.0;
			
	scene.addConstraint( sma );

	
	console.log( `dof is ${scene.getDof()}`);

	scene.solver.build();


	function animate(){

		requestAnimationFrame( animate );

		scene.update();

		scene.render();

	}

	animate();
});
