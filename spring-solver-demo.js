import Linkage from "./src/linkage.js";

function SpringSolverDemo(){

	var scene;

	this.name = "spring solver demo ";

	this.init = function(){

		if(scene !== undefined){
		
			return this.restart();
		
		}

		scene = new Linkage.Scene( ) ;
		var dom = scene.initCanvas();

		document.body.appendChild(dom);

		// create points
		var point0 = new Linkage.Point( [-5 ,0], /* fixed =  */ true);
		var point1 = new Linkage.Point( [-6,2], /* fixed =  */ true);

		var point2 = new Linkage.Point( [-4,1] );
		var point3 = new Linkage.Point( [-3,3] ); // 交差

		var point4 = new Linkage.Point( [0,5] ); // 上
		var point5 = new Linkage.Point( [0,1] ); // 下

		var point6 = new Linkage.Point( [3,3] ); // 交差
		var point7 = new Linkage.Point( [4,1] ); // 

		var point8 = new Linkage.Point( [5,0] ); // 
		var point9 = new Linkage.Point( [6,2] ); // 
		　

		scene.addPoint( point0 );
		scene.addPoint( point1 );
		scene.addPoint( point2 );
		scene.addPoint( point3 );
		scene.addPoint( point4 );
		scene.addPoint( point5 );
		scene.addPoint( point6 );
		scene.addPoint( point7 );
		scene.addPoint( point8 );
		scene.addPoint( point9 );

		// create constraint
		var linear1 = new Linkage.Constraints.Linear( point1, point3 );
		var linear2 = new Linkage.Constraints.Linear( point2, point3 );
		var linear3 = new Linkage.Constraints.Linear( point0, point2 );

		var linear4 = new Linkage.Constraints.Linear( point3, point4 );
		var linear5 = new Linkage.Constraints.Linear( point3, point5 );

		var linear6 = new Linkage.Constraints.Linear( point4, point6 );
		var linear7 = new Linkage.Constraints.Linear( point5, point6 );

		var linear8 = new Linkage.Constraints.Linear( point6, point7 );
		var linear9 = new Linkage.Constraints.Linear( point7, point8 );
		var linear10 = new Linkage.Constraints.Linear( point6, point9 );

		var linear11 = new Linkage.Constraints.Linear( point8, point9 );

		scene.addConstraint( linear1 );
		scene.addConstraint( linear2 );
		scene.addConstraint( linear3 );
		scene.addConstraint( linear4 );
		scene.addConstraint( linear5 );
		scene.addConstraint( linear6 );
		scene.addConstraint( linear7 );
		scene.addConstraint( linear8 );
		scene.addConstraint( linear9 );
		scene.addConstraint( linear10 );
		scene.addConstraint( linear11 );

		// rotational constraint
		var rotational1 = new Linkage.Constraints.Rotational(point1, point3, point5);
		var rotational2 = new Linkage.Constraints.Rotational(point2, point3, point4);

		var rotational3 = new Linkage.Constraints.Rotational(point4, point6, point7);
		var rotational4 = new Linkage.Constraints.Rotational(point5, point6, point9);

		scene.addConstraint( rotational1 );
		scene.addConstraint( rotational2 );
		scene.addConstraint( rotational3 );
		scene.addConstraint( rotational4 );


		// constrol constraint
		var control = new Linkage.Constraints.Rotational(point2, point0, point1);
		
		var motor = new Linkage.Motor( control );
		
		//var control = new Linkage.Constraints.Linear(point1, point2);

		scene.addConstraint( control );
		scene.addMotor( motor );

		console.log( `dof is ${scene.getDof()}`);

		scene.solver.build( scene );

		var $button = $("#start-stop");
		var state = "start";

		$button.click(()=>{
			state = state === "start" ? "stop" : "start";
			$button.text( state );
			scene.running = state === "stop";
		});	

		$button.click();
	
		motor.move( Math.PI / 5, {min: Math.PI * 6 / 5, max: Math.PI * 8 / 5});

	}

	this.animate = function(){

		this.handler = requestAnimationFrame( this.animate.bind(this) );

		scene.solve();

		scene.render();

	};

	this.clear = function(){

		cancelAnimationFrame( this.handler ); 

		scene.canvas.domElement.style.display = "none";
	
	};

	this.restart = function(){

		scene.canvas.domElement.style.display = "block";

	};

}

export default SpringSolverDemo;
