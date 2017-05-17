var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');
var mainState = { 

	preload:function(){

		if (this.game.device.desktop){
			game.load.image('diktia', 'img/logo.png');
			game.load.physics('physicsData', 'json/logo.json');
			game.load.image('car', 'img/car.png');
			game.load.image('car_cpu', 'img/car_cpu.png');
		}  
		else{
			game.load.image('diktia', 'img/logo2.png');
			game.load.image('boton_der', 'img/boton_der.png');
			game.load.image('boton_izq', 'img/boton_izq.png');
			game.load.image('boton_arr', 'img/boton_arr.png');
			game.load.physics('physicsData', 'json/logo2.json');
			game.load.image('car', 'img/car_mobile.png');
			game.load.image('car_cpu', 'img/car_cpu_mobile.png');

		}

		//Cargo fisica exportada de PhysicsEditor
		game.load.physics('physicsData', 'json/logo.json');
		//game.load.physics('physicsData', 'logo2.json');



		//Puntos de giro?
		this.pre_points = {
		    "x": [24, 279, 260, 407, 371, 477, 490, 345, 281, 281, 153, 163, 242, 325, 410, 313, 181, 145, 42, 24],
			"y": [466, 516, 425, 416, 317, 284, 128, 162, 141, 53, 71, 211, 259, 199, 283, 362, 299, 415, 395, 466]
		};

		this.points={"x":[],"y":[]};
		

		if (!this.game.device.desktop){
			for (var i = this.pre_points.x.length - 1; i >= 0; i--) {
				this.points.x[i] = (this.pre_points.x[i]*0.45) + (window.innerWidth/2)-(280*0.45);
			}
			for (var j = this.pre_points.y.length - 1; j >= 0; j--) {
				this.points.y[j] = (this.pre_points.y[j]*0.45) + (window.innerHeight/2)-(285*0.45);
			}
		}
		else{
			for (var k = this.pre_points.x.length - 1; k >= 0; k--) {
				this.points.x[k] = this.pre_points.x[k] + (window.innerWidth/2)-275;
			}
			for (var l = this.pre_points.y.length - 1; l >= 0; l--) {
				this.points.y[l] = this.pre_points.y[l] + (window.innerHeight/2)-285;
			}
		}


	},
 	create: function() {

 		game.stage.backgroundColor = '#ffffff';

		game.physics.startSystem(Phaser.Physics.P2JS);

		this.neumatico = game.add.graphics(0,0);
		this.neumatico2 = game.add.graphics(0,0);

	    //Más rebote
	    //game.physics.p2.defaultRestitution = 0.8;

		diktia = game.add.sprite(window.innerWidth/2, window.innerHeight/2, 'diktia');
		diktia.anchor.setTo(0.5, 0.5);

		this.car = game.add.sprite(window.innerWidth/2, window.innerHeight/2, 'car');

		this.car_cpu = game.add.sprite(23, 466, 'car_cpu');



		//MOVIL
		if (!this.game.device.desktop){

			var html_mobile = "Hola, esta es la web de <span style='color: #00C0C8;''>DIKTIA</span>, hacemos cars chulas para la web...";
			html_mobile += "<br><br>";
		 	html_mobile += "Mientras acabamos esta página, ¿Por qué no das una vuelta en el coche?<br><br>¿Puedes pillar al coche rojo?, usa las botones de abajo para moverte.";
			html_mobile += "<br><br>";
			html_mobile += "Para lo que nos necesites, nos puedes escribir a <a href='mailto:hola@diktia.com' style='color: #00C0C8; text-decoration:none;''>hola@diktia.com </a>";
			html_mobile += "<br>";
			html_mobile += "<br>";
			html_mobile += "Cosas...";
			html_mobile += "<br>";
			html_mobile += "<a href='/particulas'>Partículas</a>";
			html_mobile += "<br>";
			html_mobile += "<a href='/kaleidoscopio'>Kaleidoscopio</a>";
			html_mobile += "<br>";
			html_mobile += "<a href='/pinta'>Pinta</a>";
			html_mobile += "<br>";
			$("#menu_slide_content").html(html_mobile);
			$("#menu_slide_block").css("width","100%");
			
			//botones
            this.acc = this.add.sprite(this.world.width - 80, this.world.height - 80, 'boton_arr');
            this.acc.alpha = 0.5;
            this.acc.inputEnabled = true;
            this.acc.input.sprite.events.onInputDown.add(this.acelera, this);
            this.acc.input.sprite.events.onInputUp.add(this.acelera_out, this);

            this.izq = this.add.sprite(20, this.world.height - 80, 'boton_izq');
			this.izq.alpha = 0.5;
            this.izq.inputEnabled = true;
            this.izq.input.sprite.events.onInputDown.add(this.izquierda, this);
            this.izq.input.sprite.events.onInputUp.add(this.izquierda_out, this);
            
            this.der = this.add.sprite(100, this.world.height - 80, 'boton_der');
			this.der.alpha = 0.5;
            this.der.inputEnabled = true;
            this.der.input.sprite.events.onInputDown.add(this.derecha, this);
            this.der.input.sprite.events.onInputUp.add(this.derecha_out, this);


            //inicializo variables
            this.acelera_press, this.izq_press, this.der_press;
        }


		//establezco las fisicas de los cuerpos (el ultimo parametro es para debug -> false=no debug)
		game.physics.p2.enable([ diktia, this.car, this.car_cpu ], false);
		diktia.body.static =true;
		this.car.anchor.setTo(0.5, 0.5);

		//Cargo el poligono
		diktia.body.clearShapes();
		diktia.body.loadPolygon('physicsData', 'logo');

		
	    var angle = this.car.body.rotation + (Math.PI / 2);

	    this.bmd = this.add.bitmapData(this.game.width, this.game.height);
		this.bmd.addToWorld();
		this.increment = 0.0008;

		this.interpolatados_x=[];
		this.interpolatados_y=[];

	    for (var j = 0; j < 1; j += this.increment) {
	      var posx = this.math.catmullRomInterpolation(this.points.x, j);
	      this.interpolatados_x.push(posx);
	      var posy = this.math.catmullRomInterpolation(this.points.y, j);
	      this.interpolatados_y.push(posy);

	      //this.bmd.rect(posx, posy, 3, 3, 'rgba(245, 0, 0, 1)');
	    }
		this.bi = 0;


	    this.cuanto_acelera;
	},	
	borralinea: function (linea) {
		linea.alpha = 0.1;
	},
	borra_clear: function(a){
      	a.destroy();
    },
	izquierda: function () {
		this.izq_press = true;
		this.izq.alpha = 1;
	},
	derecha: function () {
		this.der_press = true;
		this.der.alpha = 1;
	},
	acelera: function () {
		this.acelera_press = true;
		this.acc.alpha = 1;
	},
	izquierda_out: function () {
		this.izq_press = false;
		this.izq.alpha = 0.5;
	},
	derecha_out: function () {
		this.der_press = false;
		this.der.alpha = 0.5;
	},
	acelera_out: function () {
		this.acelera_press = false;
		this.acc.alpha = 0.5;
	},
	update: function() {

		this.car_cpu.body.setZeroRotation();
        this.bi += 1;

        if (this.bi >= this.interpolatados_x.length){
            this.bi = 0;
            //console.log("cero again")
        }

        this.car_cpu.body.x = this.interpolatados_x[this.bi];
        this.car_cpu.body.y = this.interpolatados_y[this.bi];

        if(this.bi>0){
        	var punto_act = new Phaser.Point(this.interpolatados_x[this.bi], this.interpolatados_y[this.bi]);
        	var punto_ant = new Phaser.Point(this.interpolatados_x[this.bi-1], this.interpolatados_y[this.bi-1]);
        	this.car_cpu.body.rotation = this.math.angleBetweenPoints(punto_ant, punto_act);
        }

		//Frenado y quitando rotación
		this.car.body.damping = 0.6;

		var angle = this.car.body.rotation + (Math.PI / 2);

		if(Math.abs(this.car.body.velocity.x)>Math.abs(this.car.body.velocity.y)){
	    	this.cuanto_acelera = Math.pow(Math.abs(this.car.body.velocity.x),1.8)/10000;
		}
		else{
			this.cuanto_acelera = Math.pow(Math.abs(this.car.body.velocity.y),1.8)/10000;
		}

	    //console.log(this.car.body.angularVelocity);
	    this.car.body.setZeroRotation();
	    //this.neumatico2.drawCircle(this.car.body.x,this.car.body.y, 3);

	    

	    this.old1_x = this.car.body.x+Math.cos(this.math.degToRad(this.car.body.angle))*4+Math.cos(angle)*5;
		this.old1_y = this.car.body.y+Math.sin(this.math.degToRad(this.car.body.angle))*4+Math.sin(angle)*5;
		this.old2_x = this.car.body.x+Math.cos(this.math.degToRad(this.car.body.angle))*(-4)+Math.cos(angle)*5;
		this.old2_y = this.car.body.y+Math.sin(this.math.degToRad(this.car.body.angle))*(-4)+Math.sin(angle)*5;

	    if (this.cuanto_acelera > 0.02 && this.cuanto_acelera < 1.1){

	    	this.neumatico.lineStyle(2, 0x111111, this.cuanto_acelera/2);
	    	this.neumatico2.lineStyle(2, 0x111111, this.cuanto_acelera/2);
      		
	    	this.neumatico.lineTo(this.old1_x,this.old1_y);
	    	this.neumatico2.lineTo(this.old2_x,this.old2_y);

	    }
	    else{
	    	this.neumatico.moveTo(this.old1_x,this.old1_y);
	    	this.neumatico2.moveTo(this.old2_x,this.old2_y);
	    }
	    
	

	    var angle = this.car.body.rotation + (Math.PI / 2);
	    	
		//this.neumatico3.lineTo(this.car.body.x+(Math.cos(angle)*15),this.car.body.y+(Math.sin(angle)*15));
	    //this.neumatico4.lineTo(this.car.body.x+(Math.cos(angle)*(-15)),this.car.body.y+(Math.sin(angle)*(-15)));

	    //Acelerar
	    if (game.input.keyboard.isDown(Phaser.Keyboard.UP) || this.acelera_press){

	    	//giro
	    	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) || this.izq_press) {
				this.car.body.angularVelocity = -5;
			}   //this.car movement
		    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) || this.der_press){
		    	this.car.body.angularVelocity = 5;
		    }
	    	this.car.body.thrust(300);
	    	//var angle = this.car.body.rotation + (Math.PI / 2);
		    //this.car.body.velocity.x = 100 * Math.cos(angle);
		    //this.car.body.velocity.y = 100 * Math.sin(angle);
	    }
	  	//giro sin aceleración
	    else{
	    	//this.cuanto_acelera = 0;
	    	//this.neumatico.moveTo(this.car.body.x+(Math.cos(this.math.degToRad(this.car.body.angle))*5),this.car.body.y+(Math.sin(this.math.degToRad(this.car.body.angle))*5));
	    	//this.neumatico2.moveTo(this.car.body.x+(Math.cos(this.math.degToRad(this.car.body.angle))*(-5)),this.car.body.y+(Math.sin(this.math.degToRad(this.car.body.angle))*(-5)));
	    	if(Math.abs(this.car.body.velocity.x) > 6 || Math.abs(this.car.body.velocity.y) > 6){
		    	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
					this.car.body.rotateLeft(10);
				} 
			    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
			    	this.car.body.rotateRight(10);
			    }
		    }
	    } 
	    //Freno
	    if (game.input.keyboard.isDown(Phaser.Keyboard.C)){
	    	//this.car.body.reverse(200);
	    	if(this.car.body.velocity.x > 6){
	    		this.car.body.velocity.x = this.car.body.velocity.x - 5;
	    	}
	    	else if(this.car.body.velocity.x < -6){
	    		this.car.body.velocity.x = this.car.body.velocity.x + 5;

	    	}
	    	if(this.car.body.velocity.y > 6){
	    		this.car.body.velocity.y = this.car.body.velocity.y - 5;
	    	}
	    	else if(this.car.body.velocity.y < -6){
	    		this.car.body.velocity.y = this.car.body.velocity.y + 5;

	    	}
	    	
	    }
		    
	}


};
game.state.add('main', mainState);  
game.state.start('main');
