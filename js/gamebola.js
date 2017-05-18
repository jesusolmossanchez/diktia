var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');
var mainState = {

	preload:function(){

		if (this.game.device.desktop){
			game.load.image('diktia', '/img/logo.png');
			game.load.physics('physicsData', '/json/logo.json');
			game.load.image('car', '/img/car.png');
			game.load.image('car_cpu', '/img/car_cpu.png');
		}  
		else{
			game.load.image('diktia', '/img/logo2.png');
			game.load.image('boton_der', '/img/boton_der.png');
			game.load.image('boton_izq', '/img/boton_izq.png');
			game.load.image('boton_arr', '/img/boton_arr.png');
			game.load.physics('physicsData', '/json/logo2.json');
			game.load.image('car', '/img/car_mobile.png');
			game.load.image('car_cpu', '/img/car_cpu_mobile.png');

		}

		//Cargo fisica exportada de PhysicsEditor
		game.load.physics('physicsData', '/json/logo.json');



	},
 	create: function() {

 		game.stage.backgroundColor = '#ffffff';

		game.physics.startSystem(Phaser.Physics.P2JS);

	    //Más rebote
	    //game.physics.p2.defaultRestitution = 0.8;

		diktia = game.add.sprite(window.innerWidth/2, window.innerHeight/2, 'diktia');
		diktia.anchor.setTo(0.5, 0.5);


		//var car = game.add.sprite(window.innerWidth/2, window.innerHeight/2, 'car');
		car = game.add.sprite(100, 100, 'car');


		//MOVIL
		if (!this.game.device.desktop){

			$("#menu_slide_block").css("width","100%");
			
       		}


		//establezco las fisicas de los cuerpos (el ultimo parametro es para debug -> false=no debug)
		game.physics.p2.enable([ diktia, car], false);
		diktia.body.static =true;
		car.anchor.setTo(0.5, 0.5);

		//Cargo el poligono
		diktia.body.clearShapes();
		diktia.body.loadPolygon('physicsData', 'logo');

		

		gyro.frequency = 10;
		gyro.startTracking(function(o) {
			car.body.velocity.x = o.gamma * 5;
		    	car.body.velocity.y = o.beta * 5;
		});
	},	
	
	update: function() {


		//Frenado y quitando rotación
		car.body.damping = 0.5;

		//var angle = this.car.body.rotation + (Math.PI / 2);

	    //console.log(this.car.body.angularVelocity);
	    //this.car.body.setZeroRotation();
	    	
		
		    
	}


};
game.state.add('main', mainState);  
game.state.start('main');


