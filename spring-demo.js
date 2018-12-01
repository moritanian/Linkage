import Linkage from "./src/linkage.js";

$(function(){	


	// create snew cene
	var scene = new Linkage.Scene();

	var dom = scene.initCanvas();

	document.body.appendChild(dom);

	// create points
	var point0 = new Linkage.Point("point0", [-5 ,0], /* fixed =  */ true);
	var point1 = new Linkage.Point("point1", [-5,2], /* fixed =  */ true);

	var point2 = new Linkage.Point("point2", [-4,0] );
	var point3 = new Linkage.Point("point3", [-4,2] ); // 交差
/*
	var point4 = new Linkage.Point("point4", [0,5] ); // 上
	var point5 = new Linkage.Point( [0,1] ); // 下

	var point6 = new Linkage.Point( [3,3] ); // 交差
	var point7 = new Linkage.Point( [4,1] ); // 

	var point8 = new Linkage.Point( [5,0] ); // 
	var point9 = new Linkage.Point( [6,2] ); // 
*/	　

	scene.addPoint( point0 );
	scene.addPoint( point1 );
	scene.addPoint( point2 );
	scene.addPoint( point3 );
	/*
	scene.addPoint( point4 );
	scene.addPoint( point5 );
	scene.addPoint( point6 );
	scene.addPoint( point7 );
	scene.addPoint( point8 );
	scene.addPoint( point9 );
*/
	// create constraint
	var linear1 = new Linkage.Constraints.Linear( point0, point2 );
	var linear2 = new Linkage.Constraints.Linear( point2, point3 );
	var linear3 = new Linkage.Constraints.Linear( point1, point3 );

	

	scene.addConstraint( linear1 );
	scene.addConstraint( linear2 );
	scene.addConstraint( linear3 );
	
	// rotational constraint
	var rotational1 = new Linkage.Constraints.RotationalSpring(point0, point2, point3, 0.05);
	var rotational2 = new Linkage.Constraints.RotationalSpring(point2, point3, point1, 0.05);

	

	scene.addConstraint( rotational1 );
	scene.addConstraint( rotational2 );


	// constrol constraint
	//var control = new Linkage.Constraints.Rotational(point2, point0, point1);
	
	//var motor = new Linkage.Motor( control );
	
	//var control = new Linkage.Constraints.Linear(point1, point2);

	//scene.addConstraint( control );
	//scene.addMotor( motor );

	console.log( `dof is ${scene.getDof()}`);

	scene.solver.build();

	var $button = $("#start-stop");
	var state = "start";

	$button.click(()=>{
		state = state === "start" ? "stop" : "start";
		$button.text( state );
		scene.running = state === "stop";
	});	

	$button.click();

	//motor.move( Math.PI / 5, {min: Math.PI * 6 / 5, max: Math.PI * 8 / 5});
	//motor.move( Math.PI / 5, {min: 0, max: Math.PI/200});

	function animate(){

		requestAnimationFrame( animate );

		scene.solve();

		scene.render();

	}

	animate();
});
