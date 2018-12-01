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

	for (let i=0; i<demos.length; i++) {

		let demo = demos[i];

		let demoButton = $("<div>").addClass("demo-button").text(demo.name);

		demo.button = demoButton;

		let targetDemo = demo;

		$("#demo-list").append(demoButton);

		demoButton.click(function(e){
		
			location.hash = `demo${i+1}`

			if(currentDemo)
				currentDemo.clear();

			$(".demo-button").removeClass(activeClass);

			$(this).addClass(activeClass);
			
			currentDemo = targetDemo;
		
			currentDemo.init();

			currentDemo.animate();

		});
	
	}

	var locationHash = location.hash.match(/\#demo[1-3]/);

	var demoNum = 1;
	
	if(locationHash){
		var s = locationHash.toString();
		demoNum = s[s.length-1];
	}
	
	demos[demoNum -1].button.click();

});
