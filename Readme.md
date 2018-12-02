# Linkage
crank link simulator

<p align="center">
  <a href="https://moritanian.github.io/Linkage.js#demo1"><img src="https://moritanian.github.io/Linkage.js/images/demo1.png"/></a>
  <a href="https://moritanian.github.io/Linkage.js#demo3"><img src="https://moritanian.github.io/Linkage.js/images/demo2.png"/></a>
</p>


<p align="center"><a href="https://moritanian.github.io/Linkage.js/">DEMO</a></p>

## Solver
### Linkage.SpringSolver
build a spring model and compute equilibrium condition

### Linkage.TriangleSolver
solve geometrically 

### Linkage.DynamicSolver
simulate mechanically with verlet method

## Usage
```demo.js
import Linkage from "./src/linkage.js";


var scene = new Linkage.Scene( Linkage.SpringSolver );
//var scene = new Linkage.Scene( Linkage.TriangleSolver );
//var scene = new Linkage.Scene( Linkage.DynamicSolver );

// enable gravity
scene.setGravity(true);

var dom = scene.initCanvas(innerWidth, innerHeight, /* scale = */ 100.0);

document.body.appendChild(dom);

/*
 * create point
 */
var point0 = new Linkage.Point( [-2,0], /* fixed =  */ true);
var point1 = new Linkage.Point( [0,0], /* fixed =  */ true);
var point2 = new Linkage.Point( [2,0] );
var point3 = new Linkage.Point( [0,2] );

scene.addPoint( point0 );
scene.addPoint( point1 );
scene.addPoint( point2 );
scene.addPoint( point3 );


/*
 * create constraint
 */
var linear1 = new Linkage.Constraints.Linear( point2, point3 );
var linear2 = new Linkage.Constraints.Linear( point3, point1 );
var linear3 = new Linkage.Constraints.Linear( point1, point2 );

scene.addConstraint( linear1 );
scene.addConstraint( linear2 );
scene.addConstraint( linear3 );

/*
 * constrol constraint
 */
var control = new Linkage.Constraints.Rotational(point0, point1, point2);

scene.addConstraint( control );

console.log( `dof is ${scene.getDof()}`);

scene.solver.build();

var $button = $("#start-stop");
var state = "start";

function animate(){

  requestAnimationFrame( animate );

	control.setTarget(  control.target + Math.PI/500.0 ) ;

	scene.solve();

	scene.render();

}

animate();
  
```
