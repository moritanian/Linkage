/*
	unit
	mm, g,
	
	k(N/m)　＝（pa * m）

	N = kg m/s/s
	N*10^6	g mm/s/s
	MA = KX = MG
	m/1000 * a/1000 = Kx/1000 = m/1000 G = mg/10^6
	m/1000 * a = Kx = m G = mg/1000
*/
import Linkage from "./src/linkage.js";

const Unit = Linkage.Unit;

$(function(){	


	// create snew cene
	var scene = new Linkage.Scene( Linkage.DynamicSolver );

	scene.setGravity(true);

	var dom = scene.initCanvas();

	document.body.appendChild(dom);

	// create points
	const POINT_NUM = 2;
	var points = [];
	for( var i=0; i<POINT_NUM; i++){
		
		points.push( new Linkage.Point("point0", 
			[0 , (50 - i*100) * Unit.mm],
			 /* fixed = */ i==0 || i==POINT_NUM,
			 /* mass = */ 100 * Unit.g));
		scene.addPoint( points[i] );

		if( i > 0){
			// linear
			var linear = new Linkage.Constraints.Linear( points[i-1], points[i]);
			linear._springK = 1000.0;
			scene.addConstraint( linear );
			
			// damper
			var damper = new Linkage.Constraints.LinearDamper( points[i-1], points[i], 1);
			scene.addConstraint( damper );
		}

		if(1<i){
			var rotational = 
				new Linkage.Constraints.RotationalSpring(points[i-2], points[i-1], points[i], 10.0);
			scene.addConstraint( rotational);

		}
	}
	
	console.log( `dof is ${scene.getDof()}`);

	scene.solver.build();


	function animate(){

		requestAnimationFrame( animate );

		scene.update();

		scene.render();

	}

	animate();
});
