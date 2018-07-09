import Vector2 from "./Vector2.js";

function Canvas( scene, width, height){
		
	this.scene = scene;

	this.width = width;

	this.height = height;

	this.app = new PIXI.Application(width, height, { antialias: true });
	
	this.domElement = this.app.view;

//	this.app.stage.interactive = true;

	this.scale = 50.0;
		
	this.offset = new Vector2( this.width/2, this.height/2 );
		

}

Canvas.prototype.drawLine = function( p1, p2, color = 0xFFFFFF){
		
	
	this.g.lineStyle( 2, color )
		.moveTo( this.offset.x + p1.x * this.scale, this.offset.y - p1.y * this.scale )
		.lineTo( this.offset.x + p2.x * this.scale, this.offset.y - p2.y * this.scale );

};

Canvas.prototype.drawCircle = function( p1, color = 0xFF0000){

	this.c.lineStyle(0)
		.beginFill(color)
		.drawCircle( this.offset.x + p1.x * this.scale, this.offset.y - p1.y * this.scale, 5)
		.endFill();

};

Canvas.prototype.render = function(){

	var instance = this;

	this.scene.constraints.forEach( ( constraint ) => {

		switch (constraint.type){

			case "linear":

				if ( !constraint.graphics ){

					constraint.graphics = new PIXI.Graphics();

		 			this.app.stage.addChild( constraint.graphics );

				}

				var p1 = constraint.point1.position;

				var p2 = constraint.point2.position;

				constraint.graphics.clear()
					.lineStyle( 2, 0xFFFFFF )
					.moveTo( this.offset.x + p1.x * this.scale, this.offset.y - p1.y * this.scale )
					.lineTo( this.offset.x + p2.x * this.scale, this.offset.y - p2.y * this.scale );

				break;
		} 

	});

	this.scene.points.forEach( ( point ) => {

		var color = 0x66aa00;

		if( point.fixed ){

			color = 0xaa0000;

		}

		if( !point.graphics ){

			var p1 = point.position;

			point.graphics = new PIXI.Graphics()
				.lineStyle(0)
				.beginFill(color)
				//.drawCircle( this.offset.x + p1.x * this.scale, this.offset.y - p1.y * this.scale, 5)
				.drawCircle( 0, 0, 8)
				.endFill();

			point.graphics.interactive = true;

			function onDragStart(event) {
			    // store a reference to the data
			    // the reason for this is because of multitouch
			    // we want to track the movement of this particular touch
			    this.data = event.data;
			    this.alpha = 0.5;
			    this.dragging = true;
			}

			function onDragEnd() {
			    this.alpha = 1;
			    this.dragging = false;
			    // set the interaction data to null
			    this.data = null;
			}

			function onDragMove() {

			    if (this.dragging) {
			        var newPosition = this.data.getLocalPosition(this.parent);
			        this.x = newPosition.x;
			        this.y = newPosition.y;

			        point.position.x = (this.x - instance.offset.x) / instance.scale;
			        point.position.y = - (this.y - instance.offset.y) / instance.scale;
			    }
			}

			point.graphics
		        .on('pointerdown', onDragStart)
		        .on('pointerup', onDragEnd)
		        .on('pointerupoutside', onDragEnd)
		        .on('pointermove', onDragMove);


		 	this.app.stage.addChild( point.graphics );

		}

		var p1 = point.position;

		point.graphics.x = this.offset.x + p1.x * this.scale;

		point.graphics.y = this.offset.y - p1.y * this.scale;

	});
	

};

export default Canvas;
