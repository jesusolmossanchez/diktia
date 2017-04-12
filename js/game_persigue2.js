    var game = new Phaser.Game(800, 800, Phaser.AUTO, 'game');
    var mainState = { 
        preload:function(){
            game.load.image('diktia', 'img/logo.png');
            game.load.image('car', 'img/car.png');
            game.load.image('car_cpu', 'img/car_cpu.png');

            //  Load our physics data exported from PhysicsEditor
            game.load.physics('physicsData', 'json/logo.json');

            this.pre_points = {
                "x": [24, 279, 260, 407, 371, 477, 490, 345, 281, 281, 153, 163, 242, 325, 410, 313, 181, 145, 42, 24],
                "y": [466, 516, 425, 416, 317, 284, 128, 162, 141, 53, 71, 211, 259, 199, 283, 362, 299, 415, 395, 466]
            };

            this.points={"x":[],"y":[]};
            for (var i = this.pre_points.x.length - 1; i >= 0; i--) {
                this.points.x[i] = this.pre_points.x[i] + 120;
            }
            for (var i = this.pre_points.y.length - 1; i >= 0; i--) {
                this.points.y[i] = this.pre_points.y[i] + 110;
            }

/*
            [null,{"type":2,"closed":false,"x":[24,279,260,407,371,477,490,345,281,281,153,163,242,325,410,313,181,145,42],"y":[466,516,425,416,317,284,128,162,141,53,71,211,259,199,283,362,299,415,395]},{"type":0,"closed":false,"x":[0,128,256,384,512,640],"y":[108,287,124,415,45,414]},{"type":0,"closed":false,"x":[0,128,256,384,512,640],"y":[334,271,310,105,344,276]},{"type":0,"closed":false,"x":[0,128,256,384,512,640],"y":[293,143,80,199,154,303]},{"type":0,"closed":false,"x":[0,128,256,384,512,640],"y":[393,213,368,298,133,152]},{"type":0,"closed":false,"x":[0,128,256,384,512,640],"y":[98,64,282,100,401,133]},{"type":0,"closed":false,"x":[0,128,256,384,512,640],"y":[124,288,32,431,364,40]},{"type":0,"closed":false,"x":[0,128,256,384,512,640],"y":[223,364,133,141,416,387]}]
            [null,{"type":2,"closed":true,"x":[24,279,260,407,371,477,490,345,281,281,153,163,242,325,410,313,181,145,42,24],"y":[466,516,425,416,317,284,128,162,141,53,71,211,259,199,283,362,299,415,395,466]},{"type":0,"closed":false,"x":[0,128,256,384,512,640],"y":[108,287,124,415,45,414]},{"type":0,"closed":false,"x":[0,128,256,384,512,640],"y":[334,271,310,105,344,276]},{"type":0,"closed":false,"x":[0,128,256,384,512,640],"y":[293,143,80,199,154,303]},{"type":0,"closed":false,"x":[0,128,256,384,512,640],"y":[393,213,368,298,133,152]},{"type":0,"closed":false,"x":[0,128,256,384,512,640],"y":[98,64,282,100,401,133]},{"type":0,"closed":false,"x":[0,128,256,384,512,640],"y":[124,288,32,431,364,40]},{"type":0,"closed":false,"x":[0,128,256,384,512,640],"y":[223,364,133,141,416,387]}]
*/

        },
        create: function() {
            game.stage.backgroundColor = '#ffffff'
            //  Enable p2 physics
            game.physics.startSystem(Phaser.Physics.P2JS);

            //  Make things a bit more bouncey
            //game.physics.p2.defaultRestitution = 0.8;

            diktia = game.add.sprite(275, 275, 'diktia');
            car = game.add.sprite(100, 5, 'car');
            car_cpu = game.add.sprite(23, 466, 'car_cpu');
            car_cpu.anchor.setTo(0.5, 0.5);

            //  Enable the physics bodies on all the sprites and turn on the visual debugger
            game.physics.p2.enable([ diktia, car, car_cpu ], false);
            diktia.body.static =true;

            diktia.body.clearShapes();
            diktia.body.loadPolygon('physicsData', 'logo');

            //  Just starts it rotating
            //game.input.onDown.add(this.boom);

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

            this.derecha = true;
            this.abajo = true;
            this.checkpoint1, this.checkpoint2, this.checkpoint3,this.checkpoint4, this.checkpoint5, 
            this.checkpoint6, this.checkpoint7, this.checkpoint8, this.checkpoint9, this.checkpoint10 = false;

            this.bi = 0;

            this.muevete_al_click = false;

            /*
            for(var i=diktia.body.data.shapes.length-1; i>=0; --i){
                var poly = new Phaser.Polygon();
                for (var j = diktia.body.data.shapes[i].vertices.length - 1; j >= 0; j--) {
                    console.log(diktia.body.data.shapes[i].vertices[j]);
                    poly.addPoint(diktia.body.data.shapes[i].vertices[j])

                }
                console.log(poly)
            }
            */

            this.poly = new Phaser.Polygon(315, 121  ,  296, 108  ,  342, 60  ,  360, 78 );

            this.polys = [];

            this.draw();
            graphics = game.add.graphics(0, 0);

            graphics.beginFill(0xFF33ff);
            graphics.drawPolygon(this.poly.points);
            graphics.endFill();



        },

        mueve: function  (x,y) { 
            var dx = x - car_cpu.body.x;
            var dy = y - car_cpu.body.y;
            bulletRotation= Math.atan2(dy, dx);
            car_cpu.body.rotation = bulletRotation + game.math.degToRad(-90);
            var angle = car_cpu.body.rotation + (Math.PI / 2);
            car_cpu.body.velocity.x = 100 * Math.cos(angle);
            car_cpu.body.velocity.y = 100 * Math.sin(angle);


        },

        getNextPoint: function(){
            var min_x = false;
            var min_y = false;
            min_pos = 0;
            for (var i = this.points.x.length - 1; i >= 0; i--) {
                if((this.points.x[i]>car_cpu.body.x || this.points.y[i]>car_cpu.body.y) && (this.points.x[i] < min_x || min_x ===false)){
                    min_x = this.points.x[i];
                    min_pos = i;
                }
            }
            return min_pos;
        },

        getNextPointInterpol: function(){
            var min_x = false;
            var min_y = false;
            min_pos = 0;
            for (var i = this.interpolatados_x.length - 1; i >= 0; i--) {
                if(this.derecha){
                    if(this.abajo){
                        if((this.interpolatados_x[i]>car_cpu.body.x && this.interpolatados_y[i]>car_cpu.body.y) && (Math.abs(this.interpolatados_x[i]-car_cpu.body.x) < min_x || min_x ===false)){
                            min_x = this.interpolatados_x[i];
                            min_pos = i;
                        }
                    }
                    else{
                        if((this.interpolatados_x[i]>car_cpu.body.x && this.interpolatados_y[i]<car_cpu.body.y) && (Math.abs(this.interpolatados_x[i]-car_cpu.body.x) < min_x || min_x ===false)){
                            min_x = this.interpolatados_x[i];
                            min_pos = i;
                        }
                    }
                    
                }
                else{
                    if(this.abajo){
                        if((this.interpolatados_x[i]<car_cpu.body.x && this.interpolatados_y[i]>car_cpu.body.y) && (Math.abs(this.interpolatados_x[i]-car_cpu.body.x) < min_x || min_x ===false)){
                            min_x = this.interpolatados_x[i];
                            min_pos = i;
                        }
                    }
                    else{
                        if((this.interpolatados_x[i]<car_cpu.body.x && this.interpolatados_y[i]<car_cpu.body.y) && (Math.abs(this.interpolatados_x[i]-car_cpu.body.x) < min_x || min_x ===false)){
                            min_x = Math.abs(this.interpolatados_x[i]-car_cpu.body.x);
                            min_pos = i;
                        }
                    }
                    
                }
            }
            //console.log(min_pos);
            return min_pos;
        },

        checkCheckPoint: function(x, y, objeto) {
            
            var dist = Math.sqrt( Math.pow((x-objeto.body.x), 2) + Math.pow((y-objeto.body.y), 2) );  
            //console.log(dist)    
            if (dist < 10){
                return true;
            }
            else{
                return false;
            }
        },
        

        cerca_del_click: function(x,y) {
            var dx = x - car.body.x;
            var dy = y - car.body.y;
            var dist = Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2) );      
            if (dist < 50){
                return true;
            }
            else{
                return false;
            }
        },
        mueveclick: function(x,y) {

            //game.physics.arcade.moveToPointer(car, 200);
            var dx = x - car.body.x;
            var dy = y - car.body.y;
            bulletRotation= Math.atan2(dy, dx);
            car.body.rotation = bulletRotation + game.math.degToRad(90);
            var angle = car.body.rotation + (Math.PI / 2);
            car.body.velocity.x = 100 * Math.cos(angle) * (-1);
            car.body.velocity.y = 100 * Math.sin(angle) * (-1);

            if(this.cerca_del_click(x,y)){
                this.muevete_al_click = false;
            }


        },
        find_path: function(x,y) {
            var new_x = x;
            var new_y = y;



            var angle = car.body.rotation;
            for (var i = 0; i < 1500; i += 50) {
                new_x = x + i*Math.cos(angle);
                new_y = y + i*Math.sin(angle);
                
                
                var toca = false;
                for (var j = 0; j < 1; j += 0.01) {
                    
                    var posx = this.math.catmullRomInterpolation([car.body.x+Math.cos(this.math.degToRad(car.body.angle))*15, new_x+Math.cos(this.math.degToRad(car.body.angle))*15], j);
                    var posy = this.math.catmullRomInterpolation([car.body.y+Math.sin(this.math.degToRad(car.body.angle))*15, new_y+Math.sin(this.math.degToRad(car.body.angle))*15], j);
                    //this.bmd.rect(posx, posy, 3, 3, 'rgba(0, 250, 0, 0.1)');
                    
                        //Aquí seria un 'for' todos los poligonos
                    //console.log("contiene find1",this.poly.contains(posx, posy));
                    for (var k = this.polys.length - 1; k >= 0; k--) {
                        if(this.polys[k].contains(posx, posy)){
                            toca = true;
                        }
                    }
                    
                }
                if(!toca){
                    //console.log("arrrrr")
                    this.mueveclick(new_x+Math.cos(this.math.degToRad(car.body.angle))*15, new_y+Math.sin(this.math.degToRad(car.body.angle))*15);
                    //console.log(this.click_x,this.click_y);
                    //this.bmd.rect(new_x, new_y, 3, 3, 'rgba(0, 250, 0, 1)');
                    return;
                }

                new_x = x + (-i)*Math.cos(angle);
                new_y = y + (-i)*Math.sin(angle);
                
                var toca = false;
                for (var j = 0; j < 1; j += 0.01) {
                    var posx = this.math.catmullRomInterpolation([car.body.x-Math.cos(this.math.degToRad(car.body.angle))*15, new_x-Math.cos(this.math.degToRad(car.body.angle))*15], j);
                    var posy = this.math.catmullRomInterpolation([car.body.y-Math.sin(this.math.degToRad(car.body.angle))*15, new_y-Math.sin(this.math.degToRad(car.body.angle))*15], j);
                    //this.bmd.rect(posx, posy, 3, 3, 'rgba(0, 0, 250, 0.1)');
                    
                        //Aquí seria un 'for' todos los poligonos
                    //console.log("contiene find1",this.poly.contains(posx, posy));
                    for (var k = this.polys.length - 1; k >= 0; k--) {
                        if(this.polys[k].contains(posx, posy)){
                            toca = true;
                        }
                    }
                }
                if(!toca){
                    //console.log("arrrrr")
                    this.mueveclick(new_x-Math.cos(this.math.degToRad(car.body.angle))*15, new_y-Math.sin(this.math.degToRad(car.body.angle))*15);
                    //console.log(this.click_x,this.click_y);
                    //this.bmd.rect(new_x, new_y, 3, 3, 'rgba(0, 250, 0, 1)');
                    return;
                }
            }


        },


        mueve_con_cuidao: function(x,y){
            var final_x = x;
            var final_y = y;
            for (var j = 0; j < 1; j += 0.1) {
                var posx = this.math.catmullRomInterpolation([car.body.x+(Math.cos(this.math.degToRad(car.body.angle))*8), final_x+(Math.cos(this.math.degToRad(car.body.angle))*8)], j);
                var posy = this.math.catmullRomInterpolation([car.body.y+(Math.sin(this.math.degToRad(car.body.angle))*8), final_y+(Math.sin(this.math.degToRad(car.body.angle))*8)], j);
                //this.bmd.rect(posx, posy, 3, 3, 'rgba(245, 0, 110, 0.1)');
                //Aquí seria un 'for' todos los poligonos
                //console.log("contiene",this.poly.contains(posx, posy));
                for (var k = this.polys.length - 1; k >= 0; k--) {
                    if(this.polys[k].contains(posx, posy)){
                        
                        this.find_path(final_x,final_y);
                        return;
                    }
                }
                //this.bmd.rect(posx, posy, 1, 1, 'rgba(245, 0, 0, 1)');
            }
            for (var j = 0; j < 1; j += 0.1) {
                var posx = this.math.catmullRomInterpolation([car.body.x+(Math.cos(this.math.degToRad(car.body.angle))*(-8)), final_x+(Math.cos(this.math.degToRad(car.body.angle))*(-8))], j);
                var posy = this.math.catmullRomInterpolation([car.body.y+(Math.sin(this.math.degToRad(car.body.angle))*(-8)), final_y+(Math.sin(this.math.degToRad(car.body.angle))*(-8))], j);
                //this.bmd.rect(posx, posy, 3, 3, 'rgba(245, 110, 0, 0.1)');
                //Aquí seria un 'for' todos los poligonos
                //console.log("contiene",this.poly.contains(posx, posy));
                for (var k = this.polys.length - 1; k >= 0; k--) {
                    if(this.polys[k].contains(posx, posy)){
                        
                        this.find_path(final_x,final_y);
                        return;
                    }
                }
                //this.bmd.rect(posx, posy, 1, 1, 'rgba(245, 0, 0, 1)');
            }

                
                //this.click_x = final_x;
                //this.click_y = final_y;
                //this.muevete_al_click = true;
                //console.log("voy por aqui")
                this.mueveclick(this.click_x,this.click_y);
        },


        update: function() {

            
            if (game.input.activePointer.isDown) {
                //Sigue el puntero!!!!!

                //interpolo entre el punto en el que estoy y donde quiero ir
                //this.mueve_con_cuidao();
                //this.mueveclick(x,y);


                this.click_x = game.input.x;
                this.click_y = game.input.y;
                this.muevete_al_click = true;

            }

            /* Sigue al otro coche!!!!!!*/
            this.click_x = car_cpu.body.x;
            this.click_y = car_cpu.body.y;
            this.muevete_al_click = true;
            
            

            if(this.muevete_al_click){
                this.mueve_con_cuidao(this.click_x,this.click_y);
                //this.mueveclick(this.click_x,this.click_y);
            }

            car_cpu.body.setZeroRotation();
            this.bi += 1;

            if (this.bi >= this.interpolatados_x.length)
            {
                this.bi = 0;
                //console.log("cero again")
            }

            car_cpu.body.x = this.interpolatados_x[this.bi];
            car_cpu.body.y = this.interpolatados_y[this.bi];
            if(this.bi>0){
                var punto_act = new Phaser.Point(this.interpolatados_x[this.bi], this.interpolatados_y[this.bi]);
                var punto_ant = new Phaser.Point(this.interpolatados_x[this.bi-1], this.interpolatados_y[this.bi-1]);
                car_cpu.body.rotation = this.math.angleBetweenPoints(punto_ant, punto_act);
            }
            
        


            //Frenado y quitando rotación
            car.body.damping = 0.9;
            car.body.setZeroRotation();
            

            //Acelerar
            if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
                //giro
                if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    car.body.rotateLeft(100);
                }   //car movement
                else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                    car.body.rotateRight(100);
                }
                car.body.thrust(400);
                //var angle = car.body.rotation + (Math.PI / 2);
                //car.body.velocity.x = 100 * Math.cos(angle);
                //car.body.velocity.y = 100 * Math.sin(angle);
            }
            //giro sin aceleración
            else if(Math.abs(car.body.velocity.x) > 6 || Math.abs(car.body.velocity.y) > 6){
                if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
                    car.body.rotateLeft(10);
                } 
                else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
                    car.body.rotateRight(10);
                }
            }
            //Freno
            if (game.input.keyboard.isDown(Phaser.Keyboard.C)){
                //car.body.reverse(200);
                if(car.body.velocity.x > 6){
                    car.body.velocity.x = car.body.velocity.x - 5;
                }
                else if(car.body.velocity.x < -6){
                    car.body.velocity.x = car.body.velocity.x + 5;

                }
                if(car.body.velocity.y > 6){
                    car.body.velocity.y = car.body.velocity.y - 5;
                }
                else if(car.body.velocity.y < -6){
                    car.body.velocity.y = car.body.velocity.y + 5;

                }
                
            }

            //CHECKPOINTS
            //'x': [280, 318, 320, 275, 335, 400, 430, 540, 605, 575],
            //'y': [270, 383, 437, 555, 630, 600, 530, 570, 515, 415]
            

            //"x": [24, 279, 260, 407, 371, 477, 490, 345, 281, 281, 153, 163, 242, 325, 410, 313, 181, 145, 42],
            //"y": [466, 516, 425, 416, 317, 284, 128, 162, 141, 53, 71, 211, 259, 199, 283, 362, 299, 415, 395]
            if(this.checkCheckPoint(this.points.x[1],this.points.y[1],car_cpu)){
                this.checkpoint1 = true;
            }
            
            if(this.checkCheckPoint(this.points.x[2],this.points.y[2],car_cpu)){
                this.checkpoint2 = true;
            }
            
            if(this.checkCheckPoint(this.points.x[3],this.points.y[3],car_cpu)){
                this.checkpoint3 = true;
            }
            
            if(this.checkCheckPoint(this.points.x[4],this.points.y[4],car_cpu)){
                this.checkpoint4 = true;
            }
            
            if(this.checkCheckPoint(this.points.x[5],this.points.y[5],car_cpu)){
                this.checkpoint5 = true;
            }
            
            if(this.checkCheckPoint(this.points.x[6],this.points.y[6],car_cpu)){
                this.checkpoint6 = true;
            }
            
            if(this.checkCheckPoint(this.points.x[7],this.points.y[7],car_cpu)){
                this.checkpoint7 = true;
            }
            
            if(this.checkCheckPoint(this.points.x[8],this.points.y[8],car_cpu)){
                this.checkpoint8 = true;
            }
            
            if(this.checkCheckPoint(this.points.x[9],this.points.y[9],car_cpu)){
                this.checkpoint9 = true;
            }
            

            if(this.checkpoint1){
                this.abajo = true;
                this.derecha = true;
            }
            if(this.checkpoint2){
                this.abajo = true;
                this.derecha = false;
            }
            if(this.checkpoint3){
                this.abajo = true;
                this.derecha = true;
            }
            if(this.checkpoint4){
                this.abajo = false;
                this.derecha = true;
            }
            if(this.checkpoint6){
                this.abajo = true;
                this.derecha = true;
            }
            if(this.checkpoint7){
                this.abajo = false;
                this.derecha = true;
            }
            if(this.checkpoint8){
                this.abajo = false;
                this.derecha = false;
            }


            //Pilla el siguiente punto cPU y se mueve allí
            var next_point = this.getNextPointInterpol();
            //this.mueve(this.interpolatados_x[next_point], this.interpolatados_y[next_point]);
            //game.physics.arcade.moveToXY(car_cpu, this.interpolatados_x[next_point], this.interpolatados_y[next_point], 100);
                
        },

        draw: function() {


            var obj = diktia.body.data;
            var l = diktia.body.data.shapes.length;

            this.ppu = -1 * game.physics.p2.mpx(1);
            var color = 0xffff00;
            var lineColor = 0xff0000;
            var lw = 1;
            var i = 0;





            while (i !== l){
                child = obj.shapes[i];
                //console.log(obj.position[0]);
                offset = child.position || 0;
                angle = child.angle || 0;

                verts = [];
                verts_points = [];
                vrot = p2.vec2.create();

                for (j = _j = 0, _ref1 = child.vertices.length; 0 <= _ref1 ? _j < _ref1 : _j > _ref1; j = 0 <= _ref1 ? ++_j : --_j){
                    v = child.vertices[j];
                    p2.vec2.rotate(vrot, v, angle);
                    verts.push([(vrot[0] + offset[0]) * this.ppu, -(vrot[1] + offset[1]) * this.ppu]);
                    var point1 = (vrot[0] + offset[0]+obj.position[0]) * this.ppu;
                    var point2 = (vrot[1] + offset[1]+obj.position[1]) * this.ppu;
                    verts_points.push(new Phaser.Point(point1,point2));
                }

                this.polys[i] = new Phaser.Polygon(verts_points);
                var new_graphics = game.add.graphics(0, 0);

                //console.log(this.polys[i]);
                //console.log(polyg)
                new_graphics.beginFill(0xFF33ff);
                new_graphics.drawPolygon(this.polys[i].points);
                new_graphics.endFill();


                i++;
            }

     

    },


    };
    game.state.add('main', mainState);  
    game.state.start('main');

