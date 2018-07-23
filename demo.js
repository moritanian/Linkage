import Linkage from "./src/linkage.js";

$(function(){	


	// create snew cene
	var scene = new Linkage.Scene();

	var dom = scene.initCanvas();

	document.body.appendChild(dom);

	// create points
	var point0 = new Linkage.Point( [-2,0], /* fixed =  */ true);
	var point1 = new Linkage.Point( [0,0], /* fixed =  */ true);
	var point2 = new Linkage.Point( [2,0] );
	var point3 = new Linkage.Point( [0,2] );

	scene.addPoint( point0 );
	scene.addPoint( point1 );
	scene.addPoint( point2 );
	scene.addPoint( point3 );

	// create constraint
	var linear1 = new Linkage.Constraints.Linear( point2, point3 );
	var linear2 = new Linkage.Constraints.Linear( point3, point1 );
	var linear3 = new Linkage.Constraints.Linear( point1, point2 );

	scene.addConstraint( linear1 );
	scene.addConstraint( linear2 );
	scene.addConstraint( linear3 );

	// constrol constraint
	var control = new Linkage.Constraints.Rotational(point0, point1, point2);
	//var control = new Linkage.Constraints.Linear(point1, point2);

	scene.addConstraint( control );

	console.log( `dof is ${scene.getDof()}`);

	//scene.build();
	scene.triangleSolver.build( scene );
	

	var $button = $("#start-stop");
	var state = "start";

	$button.click(()=>{
		state = state === "start" ? "stop" : "start";
		$button.text( state );
	});	

	function animate(){

		requestAnimationFrame( animate );

		if( state === "stop"){

			return;

		}

		control.setTarget(  control.target + Math.PI/500.0 ) ;

		//console.log( control.target / Math.PI * 180);

		scene.solve();

		scene.render();

	}

	animate();
});
