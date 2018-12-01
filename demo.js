import SpringSolverDemo from "./spring-solver-demo.js"
import GeometricSolverDemo from "./geometric-solver-demo.js"
import DynamicSolverDemo from "./dynamic-solver-demo.js"

$(function(){	

	var demos = [
		new SpringSolverDemo(),
		new GeometricSolverDemo(),
		new DynamicSolverDemo()
	];

	const activeClass = "active";

	var currentDemo = null;

	demos.forEach( (demo)=> {

		let demoButton = $("<div>").addClass("demo-button").text(demo.name);

		demo.button = demoButton;

		let targetDemo = demo;

		$("#demo-list").append(demoButton);

		demoButton.click(function(e){

			if(currentDemo)
				currentDemo.clear();

			$(".demo-button").removeClass(activeClass);

			$(this).addClass(activeClass);
			
			currentDemo = targetDemo;
		
			currentDemo.init();

			currentDemo.animate();

		});
	
	});

	demos[0].button.click();

});
