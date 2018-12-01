import Vector2 from "./Vector2.js";
import Scene from "./scene.js";
import Point from "./point.js";
import Constraints from "./constraints.js";
import Motor from "./motor.js";
import SpringSolver from "./spring-solver.js";
import TriangleSolver from "./triangle-solver.js";
import DynamicSolver from "./dynamic-solver.js";

import Unit from "./unit.js";

var Linkage = {
	Scene: Scene,
	Point: Point,
	Constraints: Constraints,
	Motor: Motor,
	SpringSolver: SpringSolver,
	TriangleSolver, TriangleSolver,
	DynamicSolver, DynamicSolver,
	Unit: Unit
};

export default Linkage;

