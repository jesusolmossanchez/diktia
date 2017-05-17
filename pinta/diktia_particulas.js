


/****** Particulas *****/
var pJS = function(tag_id, params){

  var contiene_canvas_el = document.querySelector('#'+tag_id);
  var canvas_el = document.querySelector('#'+tag_id+' > .diktia-particles-canvas-el');
  contiene_canvas_el.style.width = "1600px";
  contiene_canvas_el.style.height = "1200px";
  canvas_el.style.width = "1600px";
  canvas_el.style.height = "1200px";


  /* particles.js variables with default values */
  this.pJS = {
    canvas: {
      el: canvas_el,
      w: 1600,
      h: 1200
    },
    particles: {

      id: canvas_el,
      contador: 0,
      array_puntos: [],
      palabra_color: '#000000',
      fuente: '20px "HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue-Light", "Helvetica Neue", Tahoma, Arial, sans-serif',
      number: {
        value: 90,
        density: {
          enable: true,
          value_area: 800
        }
      },
      color: {
        value: '#000'
      },
      shape: {
        type: 'circle',
        stroke: {
          width: 0,
          color: '#000'
        },
        polygon: {
          nb_sides: 5
        }
      },
      opacity: {
        value: 1,
        random: false,
        anim: {
          enable: false,
          speed: 2,
          opacity_min: 0,
          sync: false
        }
      },
      size: {
        value: 8,
        random: true,
        anim: {
          enable: false,
          speed: 20,
          size_min: 0,
          sync: false
        }
      },
      line_linked: {
        enable: true,
        distance: 190,
        color: '#000',
        opacity: 0.5,
        width: 2
      },
      move: {
        enable: true,
        speed: 0.8,
        direction: 'none',
        random: false,
        straight: false,
        out_mode: 'bounce',
        bounce: true,
        bounce_distance: 10,
        attract: {
          enable: false,
          rotateX: 3000,
          rotateY: 3000
        }
      },
      array: []
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: {
          enable: true,
          mode: 'grab'
        },
        onclick: {
          enable: false,
          mode: 'remove'
        },
        resize: false
      },
      modes: {
        grab:{
          distance: 200,
          line_linked:{
            opacity: 1
          }
        }
      },
      mouse:{}
    },
    retina_detect: false,
    fn: {
      interact: {},
      modes: {},
      vendors:{}
    },
    tmp: {}
  };

  var pJS = this.pJS;

  /* params settings */
  if(params){
    Object.deepExtend(pJS, params);
  }

  pJS.tmp.obj = {
    size_value: pJS.particles.size.value,
    size_anim_speed: pJS.particles.size.anim.speed,
    move_speed: pJS.particles.move.speed,
    line_linked_distance: pJS.particles.line_linked.distance,
    line_linked_width: pJS.particles.line_linked.width,
    mode_grab_distance: pJS.interactivity.modes.grab.distance,
  };

  console.log(this.pJS.particles);

  //TODO: ver si me quedo con esto
  pJS.fn.retinaInit = function(){

    if(pJS.retina_detect && window.devicePixelRatio > 1){
      pJS.canvas.pxratio = window.devicePixelRatio; 
      pJS.tmp.retina = true;
    } 
    else{
      pJS.canvas.pxratio = 1;
      pJS.tmp.retina = false;
    }

    pJS.canvas.w = pJS.canvas.el.offsetWidth * pJS.canvas.pxratio;
    pJS.canvas.h = pJS.canvas.el.offsetHeight * pJS.canvas.pxratio;

    pJS.particles.size.value = pJS.tmp.obj.size_value * pJS.canvas.pxratio;
    pJS.particles.size.anim.speed = pJS.tmp.obj.size_anim_speed * pJS.canvas.pxratio;
    pJS.particles.move.speed = pJS.tmp.obj.move_speed * pJS.canvas.pxratio;
    pJS.particles.line_linked.distance = pJS.tmp.obj.line_linked_distance * pJS.canvas.pxratio;
    pJS.interactivity.modes.grab.distance = pJS.tmp.obj.mode_grab_distance * pJS.canvas.pxratio;
    pJS.particles.line_linked.width = pJS.tmp.obj.line_linked_width * pJS.canvas.pxratio;

  };



  /* ---------- pJS functions - canvas ------------ */

  pJS.fn.canvasInit = function(){
    pJS.canvas.ctx = pJS.canvas.el.getContext('2d');
  };

  pJS.fn.canvasSize = function(){

    pJS.canvas.el.width = pJS.canvas.w;
    pJS.canvas.el.height = pJS.canvas.h;

    //pJS.canvas.el.width = 1600;
    //pJS.canvas.el.height = 1200;

    /* Quito las cosas del resize
    //TODO: revisar
    if(pJS && pJS.interactivity.events.resize){

      window.addEventListener('resize', function(){

          pJS.canvas.w = pJS.canvas.el.offsetWidth;
          pJS.canvas.h = pJS.canvas.el.offsetHeight;

          // resize canvas 
          if(pJS.tmp.retina){
            pJS.canvas.w *= pJS.canvas.pxratio;
            pJS.canvas.h *= pJS.canvas.pxratio;
          }

          pJS.canvas.el.width = pJS.canvas.w;
          pJS.canvas.el.height = pJS.canvas.h;

          // repaint canvas on anim disabled
          if(!pJS.particles.move.enable){
            pJS.fn.particlesEmpty();
            pJS.fn.particlesCreate();
            pJS.fn.particlesDraw();
            pJS.fn.vendors.densityAutoParticles();
          }

        // density particles enabled 
        pJS.fn.vendors.densityAutoParticles();

      });

    }
    */

  };


  pJS.fn.canvasPaint = function(){
    pJS.canvas.ctx.fillRect(0, 0, pJS.canvas.w, pJS.canvas.h);
  };

  pJS.fn.canvasClear = function(){
    pJS.canvas.ctx.clearRect(0, 0, pJS.canvas.w, pJS.canvas.h);
  };


  /* --------- pJS functions - particles ----------- */

  pJS.fn.particle = function(color, opacity, position){

    /* size */
    this.radius = (pJS.particles.size.random ? Math.random() : 1) * pJS.particles.size.value;
    if(pJS.particles.size.anim.enable){
      this.size_status = false;
      this.vs = pJS.particles.size.anim.speed / 100;
      if(!pJS.particles.size.anim.sync){
        this.vs = this.vs * Math.random();
      }
    }


    this.x = position ? position.x : Math.random() * pJS.canvas.w;
    this.y = position ? position.y : Math.random() * pJS.canvas.h;


    /* check position  - into the canvas */
    if(this.x > pJS.canvas.w - this.radius*2) this.x = this.x - this.radius;
    else if(this.x < this.radius*2) this.x = this.x + this.radius;
    if(this.y > pJS.canvas.h - this.radius*2) this.y = this.y - this.radius;
    else if(this.y < this.radius*2) this.y = this.y + this.radius;

    

    //Meto los puntos custom
    if(typeof pJS.particles.array_puntos != "undefined"){
      //Mientras queden puntos
      if(pJS.particles.contador < pJS.particles.array_puntos.length){
      

        this.x = pJS.particles.array_puntos[pJS.particles.contador].x*pJS.canvas.w/800;
        this.y = pJS.particles.array_puntos[pJS.particles.contador].y*pJS.canvas.h/600;

        this.palabra = pJS.particles.array_puntos[pJS.particles.contador].palabra;
        this.palabra_x_offset = pJS.particles.array_puntos[pJS.particles.contador].palabra_x_offset;
        this.palabra_y_offset = pJS.particles.array_puntos[pJS.particles.contador].palabra_y_offset;
        this.is_palabra = true;

        var rand = Math.random();
        if(rand < 0.3){
          rand = rand + 0.5;
        }

        //TODO: Meter el peso de la particula
        this.radius = (pJS.particles.size.random ? rand : 1) * pJS.particles.size.value + 1.5;

        pJS.particles.contador++;
      }
      else if(pJS.particles.move.bounce){
        /* check position - avoid overlap */
        pJS.fn.vendors.checkOverlap(this, position);
      }
    }
    else{
      /* check position - avoid overlap */
      if(pJS.particles.move.bounce){
        pJS.fn.vendors.checkOverlap(this, position);
      }

    }

    /* color */
    //TODO: Color custom
    this.color = {};
    this.color = color;
    this.color.rgb = hexToRgb(this.color.value);
    

    /* opacity */
    //TODO: Opacidad custom
    this.opacity = (pJS.particles.opacity.random ? Math.random() : 1) * pJS.particles.opacity.value;
    if(pJS.particles.opacity.anim.enable){
      this.opacity_status = false;
      this.vo = pJS.particles.opacity.anim.speed / 100;
      if(!pJS.particles.opacity.anim.sync){
        this.vo = this.vo * Math.random();
      }
    }

    //Velocidad aleatoria
    this.vx = Math.random()-0.5;
    this.vy = Math.random()-0.5;

    this.vx_i = this.vx;
    this.vy_i = this.vy;

    
    //TODO: dejar solo el circulo
    this.shape = pJS.particles.shape.type; 

  };


  pJS.fn.particle.prototype.draw = function() {

    var p = this;

    var radius = p.radius;
    
    var opacity = p.opacity;
    

    if(p.color.rgb){
      var color_value = 'rgba('+p.color.rgb.r+','+p.color.rgb.g+','+p.color.rgb.b+','+opacity+')';
    }else{
      var color_value = 'hsla('+p.color.hsl.h+','+p.color.hsl.s+'%,'+p.color.hsl.l+'%,'+opacity+')';
    }

    pJS.canvas.ctx.fillStyle = color_value;
    pJS.canvas.ctx.beginPath();

    
    pJS.canvas.ctx.arc(p.x, p.y, radius, 0, Math.PI * 2, false);
    if(typeof p.palabra != "undefined"){
      pJS.canvas.ctx.fillStyle = pJS.particles.palabra_color; 
      pJS.canvas.ctx.font= pJS.particles.fuente;
      var new_x = p.x + p.palabra_x_offset;
      var new_y = p.y + p.palabra_y_offset;

      pJS.canvas.ctx.fillText(p.palabra, new_x, new_y);
      pJS.canvas.ctx.fillStyle = color_value;
    }

    pJS.canvas.ctx.closePath();

    if(pJS.particles.shape.stroke.width > 0){
      pJS.canvas.ctx.strokeStyle = pJS.particles.shape.stroke.color;
      pJS.canvas.ctx.lineWidth = pJS.particles.shape.stroke.width;
      pJS.canvas.ctx.stroke();
    }
    
    pJS.canvas.ctx.fill();
    
  };


  pJS.fn.particlesCreate = function(){
    window.lala = 0;
    for(var i = 0; i < pJS.particles.number.value; i++) {
        //console.log(window.lala++);
        //console.log(pJS.particles.array);
        pJS.particles.array.push(new pJS.fn.particle(pJS.particles.color, pJS.particles.opacity.value));
        /*
        if(typeof pJS.particles.array_puntos != "undefined"){
          var p = pJS.particles.array[i];
        if(pJS.particles.contador < 10){
          p.x = pJS.particles.array_puntos[pJS.particles.contador].x;
          p.y = pJS.particles.array_puntos[pJS.particles.contador].y;
          p.palabra = pJS.particles.array_puntos[pJS.particles.contador].palabra;
        }
        console.log(p.palabra);
        pJS.particles.contador++;
      }
      */
    }
  };

  pJS.fn.particlesUpdate = function(){

    for(var i = 0; i < pJS.particles.array.length; i++){

      /* the particle */
      var p = pJS.particles.array[i];

      /* move the particle */
      if(pJS.particles.move.enable){

        //Si tiene palabra, no se mueve
        if(!p.is_palabra){

          var ms = pJS.particles.move.speed/2;
          p.x += p.vx * ms;
          p.y += p.vy * ms;

        }
      }
      

      /* change opacity status */
      //TODO: quitar animación de opacidad?
      if(pJS.particles.opacity.anim.enable) {
        if(p.opacity_status == true) {
          if(p.opacity >= pJS.particles.opacity.value) p.opacity_status = false;
          p.opacity += p.vo;
        }else {
          if(p.opacity <= pJS.particles.opacity.anim.opacity_min) p.opacity_status = true;
          p.opacity -= p.vo;
        }
        if(p.opacity < 0) p.opacity = 0;
      }

      /* change size */
      //TODO: quitar animacion de tamaño?
      if(pJS.particles.size.anim.enable){
        if(p.size_status == true){
          if(p.radius >= pJS.particles.size.value) p.size_status = false;
          p.radius += p.vs;
        }else{
          if(p.radius <= pJS.particles.size.anim.size_min) p.size_status = true;
          p.radius -= p.vs;
        }
        if(p.radius < 0) p.radius = 0;
      }

      /* change particle position if it is out of canvas */
      
      //Comprueba si está fuera del canvas
      //TODO: revisarlo ... creo que no entra nunca
      var new_pos = {
        x_left: p.radius,
        x_right:  pJS.canvas.w,
        y_top: p.radius,
        y_bottom: pJS.canvas.h
      }
      

      if(p.x - p.radius > pJS.canvas.w){
        p.x = new_pos.x_left;
        p.y = Math.random() * pJS.canvas.h;
      }
      else if(p.x + p.radius < 0){
        p.x = new_pos.x_right;
        p.y = Math.random() * pJS.canvas.h;
      }
      if(p.y - p.radius > pJS.canvas.h){
        p.y = new_pos.y_top;
        p.x = Math.random() * pJS.canvas.w;
      }
      else if(p.y + p.radius < 0){
        p.y = new_pos.y_bottom;
        p.x = Math.random() * pJS.canvas.w;
      }

      
      if (p.x + p.radius + pJS.particles.move.bounce_distance > pJS.canvas.w) p.vx = -p.vx;
      else if (p.x - p.radius - pJS.particles.move.bounce_distance < 0) p.vx = -p.vx;
      if (p.y + p.radius + pJS.particles.move.bounce_distance > pJS.canvas.h) p.vy = -p.vy;
      else if (p.y - p.radius -pJS.particles.move.bounce_distance < 0) p.vy = -p.vy;
       

      /* events */
      // El efecto del hover
      pJS.fn.modes.grabParticle(p);
     

      /* interaction auto between particles */
      for(var j = i + 1; j < pJS.particles.array.length; j++){
        var p2 = pJS.particles.array[j];

        /* link particles */
        pJS.fn.interact.linkParticles(p,p2);

        /* bounce particles */
        pJS.fn.interact.bounceParticles(p,p2);
        
      }
      
    }

  };

  pJS.fn.particlesDraw = function(){

    /* clear canvas */
    pJS.canvas.ctx.clearRect(0, 0, pJS.canvas.w, pJS.canvas.h);

    /* update each particles param */
    pJS.fn.particlesUpdate();

    /* draw each particle */
    for(var i = 0; i < pJS.particles.array.length; i++){
      var p = pJS.particles.array[i];
      p.draw();
    }

  };


  /* TODO: quitar esto?
  pJS.fn.particlesEmpty = function(){
    pJS.particles.array = [];
  };

  pJS.fn.particlesRefresh = function(){

    //init all
    cancelRequestAnimFrame(pJS.fn.checkAnimFrame);
    cancelRequestAnimFrame(pJS.fn.drawAnimFrame);
    pJS.tmp.source_svg = undefined;
    pJS.tmp.img_obj = undefined;
    pJS.tmp.count_svg = 0;
    pJS.fn.particlesEmpty();
    pJS.fn.canvasClear();
    
    // restart
    pJS.fn.vendors.start();

  };
  */


  /* ---------- pJS functions - particles interaction ------------ */
  //TODO: revisar
  pJS.fn.interact.linkParticles = function(p1, p2){

    var dx = p1.x - p2.x,
        dy = p1.y - p2.y,
        dist = Math.sqrt(dx*dx + dy*dy);

    /* draw a line between p1 and p2 if the distance between them is under the config distance */
    if(dist <= pJS.particles.line_linked.distance){

      var opacity_line = pJS.particles.line_linked.opacity - (dist / (1/pJS.particles.line_linked.opacity)) / pJS.particles.line_linked.distance;
      //var opacity_line = 1;

      if(opacity_line > 0){        
        
        /* style */
        var color_line = pJS.particles.line_linked.color_rgb_line;
        pJS.canvas.ctx.strokeStyle = 'rgba('+color_line.r+','+color_line.g+','+color_line.b+','+opacity_line+')';
        pJS.canvas.ctx.lineWidth = pJS.particles.line_linked.width;
        //pJS.canvas.ctx.lineCap = 'round'; /* performance issue */
        
        /* path */
        pJS.canvas.ctx.beginPath();
        pJS.canvas.ctx.moveTo(p1.x, p1.y);
        pJS.canvas.ctx.lineTo(p2.x, p2.y);
        pJS.canvas.ctx.stroke();
        pJS.canvas.ctx.closePath();

      }

    }

  };



  pJS.fn.interact.bounceParticles = function(p1, p2){

    var dx = p1.x - p2.x,
        dy = p1.y - p2.y,
        dist = Math.sqrt(dx*dx + dy*dy),
        dist_p = p1.radius+p2.radius+(pJS.particles.move.bounce_distance * pJS.canvas.w/1600);

    if(dist <= dist_p){
      p1.vx = -p1.vx;
      p1.vy = -p1.vy;

      p2.vx = -p2.vx;
      p2.vy = -p2.vy;
    }
  };


  /* ---------- pJS functions - modes events ------------ 
  //TODO: quitar?
  */
  pJS.fn.modes.pushParticles = function(nb, pos){

    pJS.tmp.pushing = true;

    for(var i = 0; i < nb; i++){
      pJS.particles.array.push(
        new pJS.fn.particle(
          pJS.particles.color,
          pJS.particles.opacity.value,
          {
            'x': pos ? pos.pos_x : Math.random() * pJS.canvas.w,
            'y': pos ? pos.pos_y : Math.random() * pJS.canvas.h
          }
        )
      )
      if(i == nb-1){
        if(!pJS.particles.move.enable){
          pJS.fn.particlesDraw();
        }
        pJS.tmp.pushing = false;
      }
    }

  };


  pJS.fn.modes.removeParticles = function(nb){

    pJS.particles.array.splice(nb, pJS.particles.array.length);
    if(!pJS.particles.move.enable){
      pJS.fn.particlesDraw();
    }

  };




  pJS.fn.modes.grabParticle = function(p){

    if(pJS.interactivity.events.onhover.enable && pJS.interactivity.status == 'mousemove'){

      var particulas_header_w = document.getElementById(pJS.particles.id).offsetWidth;
      var particulas_header_h = document.getElementById(pJS.particles.id).offsetWidth;

      //TODO: revisar este 1400...
      var mouse_fake_x = pJS.interactivity.mouse.pos_x * 1600 / particulas_header_w;
      var mouse_fake_y = pJS.interactivity.mouse.pos_y * 1600 / particulas_header_h;

      var dx_mouse = p.x - mouse_fake_x,
          dy_mouse = p.y - mouse_fake_y,
          dist_mouse = Math.sqrt(dx_mouse*dx_mouse + dy_mouse*dy_mouse);

      /* draw a line between the cursor and the particle if the distance between them is under the config distance */
      if(dist_mouse <= pJS.interactivity.modes.grab.distance){

        var opacity_line = pJS.interactivity.modes.grab.line_linked.opacity - (dist_mouse / (1/pJS.interactivity.modes.grab.line_linked.opacity)) / pJS.interactivity.modes.grab.distance;

        if(opacity_line > 0){

          /* style */
          var color_line = pJS.particles.line_linked.color_rgb_line;
          pJS.canvas.ctx.strokeStyle = 'rgba('+color_line.r+','+color_line.g+','+color_line.b+','+opacity_line+')';
          pJS.canvas.ctx.lineWidth = pJS.particles.line_linked.width;
          //pJS.canvas.ctx.lineCap = 'round'; /* performance issue */
          
          /* path */
          pJS.canvas.ctx.beginPath();
          pJS.canvas.ctx.moveTo(p.x, p.y);
          pJS.canvas.ctx.lineTo(mouse_fake_x, mouse_fake_y);
          pJS.canvas.ctx.stroke();
          pJS.canvas.ctx.closePath();

        }

      }

    }

  };



  /* ---------- pJS functions - vendors ------------ */

  pJS.fn.vendors.eventsListeners = function(){

    /* events target element */
    pJS.interactivity.el = pJS.canvas.el;


    /* detect mouse pos - on hover / click event */
    if(pJS.interactivity.events.onhover.enable || pJS.interactivity.events.onclick.enable){

      /* el on mousemove */
      pJS.interactivity.el.addEventListener('mousemove', function(e){

          var pos_x = e.offsetX || e.clientX,
              pos_y = e.offsetY || e.clientY;
        

        pJS.interactivity.mouse.pos_x = pos_x;
        pJS.interactivity.mouse.pos_y = pos_y;

        //TODO: quito retina?
        if(pJS.tmp.retina){
          pJS.interactivity.mouse.pos_x *= pJS.canvas.pxratio;
          pJS.interactivity.mouse.pos_y *= pJS.canvas.pxratio;
        }

        pJS.interactivity.status = 'mousemove';

      });

      /* el on onmouseleave */
      pJS.interactivity.el.addEventListener('mouseleave', function(e){

        pJS.interactivity.mouse.pos_x = null;
        pJS.interactivity.mouse.pos_y = null;
        pJS.interactivity.status = 'mouseleave';

      });

    }


  };

  //TODO: revisar numero de particulas
  pJS.fn.vendors.densityAutoParticles = function(){

    if(pJS.particles.number.density.enable){

      /* calc area */
      var area = pJS.canvas.el.width * pJS.canvas.el.height / 1000;
      if(pJS.tmp.retina){
        area = area/(pJS.canvas.pxratio*2);
      }

      /* calc number of particles based on density area */
      var nb_particles = area * pJS.particles.number.value / pJS.particles.number.density.value_area;

      /* add or remove X particles */
      var missing_particles = pJS.particles.array.length - nb_particles;
      if(missing_particles < 0) pJS.fn.modes.pushParticles(Math.abs(missing_particles));
      else pJS.fn.modes.removeParticles(missing_particles);

    }

  };


  pJS.fn.vendors.checkOverlap = function(p1, position){

    if(p1.x < 100 || p1.x > (pJS.canvas.w - 100)){
        p1.x = position ? position.x : Math.random() * pJS.canvas.w;
        p1.y = position ? position.y : Math.random() * pJS.canvas.h;
      pJS.fn.vendors.checkOverlap(p1);
    }

    if(p1.y < 100 || p1.y > (pJS.canvas.h - 100)){
        p1.x = position ? position.x : Math.random() * pJS.canvas.w;
        p1.y = position ? position.y : Math.random() * pJS.canvas.h;
      pJS.fn.vendors.checkOverlap(p1);
    }

    for(var i = 0; i < pJS.particles.array.length; i++){
      var p2 = pJS.particles.array[i];

      var dx = p1.x - p2.x,
          dy = p1.y - p2.y,
          dist = Math.sqrt(dx*dx + dy*dy);



      if(dist <= p1.radius + p2.radius + pJS.particles.move.bounce_distance * pJS.canvas.w/1600){
        p1.x = position ? position.x : Math.random() * pJS.canvas.w;
        p1.y = position ? position.y : Math.random() * pJS.canvas.h;
        pJS.fn.vendors.checkOverlap(p1);
      }
    }
  };





  pJS.fn.vendors.draw = function(){

    
    pJS.fn.particlesDraw();
    //TODO: siempre se mueven dejar solo el else?
    if(!pJS.particles.move.enable) cancelRequestAnimFrame(pJS.fn.drawAnimFrame);
    else pJS.fn.drawAnimFrame = requestAnimFrame(pJS.fn.vendors.draw);
    

  };




  pJS.fn.vendors.init = function(){

    /* init canvas + particles */
    pJS.fn.retinaInit();
    pJS.fn.canvasInit();
    pJS.fn.canvasSize();
    pJS.fn.canvasPaint();
    pJS.fn.particlesCreate();
    pJS.fn.vendors.densityAutoParticles();

    /* particles.line_linked - convert hex colors to rgb */
    pJS.particles.line_linked.color_rgb_line = hexToRgb(pJS.particles.line_linked.color);

  };


  pJS.fn.vendors.start = function(){

  
      pJS.fn.vendors.init();
      pJS.fn.vendors.draw();
    

  };




  /* ---------- pJS - start ------------ */


  pJS.fn.vendors.eventsListeners();

  pJS.fn.vendors.start();
  


};

/* ---------- global functions - vendors ------------ */

Object.deepExtend = function(destination, source) {
  for (var property in source) {
    if (source[property] && source[property].constructor &&
     source[property].constructor === Object) {
      destination[property] = destination[property] || {};
      arguments.callee(destination[property], source[property]);
    } else {
      destination[property] = source[property];
    }
  }
  return destination;
};

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(callback){
      window.setTimeout(callback, 1000 / 60);
    };
})();

window.cancelRequestAnimFrame = ( function() {
  return window.cancelAnimationFrame         ||
    window.webkitCancelRequestAnimationFrame ||
    window.mozCancelRequestAnimationFrame    ||
    window.oCancelRequestAnimationFrame      ||
    window.msCancelRequestAnimationFrame     ||
    clearTimeout
} )();

function hexToRgb(hex){
  // By Tim Down - http://stackoverflow.com/a/5624139/3493650
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(m, r, g, b) {
     return r + r + g + g + b + b;
  });
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
  } : null;
};

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
};

function isInArray(value, array) {
  return array.indexOf(value) > -1;
}


/* ---------- particles.js functions - start ------------ */

window.pJSDom = [];

window.particlesJS = function(tag_id, params){
  window.tag_id = tag_id;
  //console.log(params);

  //TODO: quitar esto?
  /* no string id? so it's object params, and set the id with default id 
  if(typeof(tag_id) != 'string'){
    params = tag_id;
    tag_id = 'diktia-particles';
  }

  //no id? set the id to default id 
  if(!tag_id){
    tag_id = 'diktia-particles';
  }
  */

  /* pJS elements */
  var pJS_tag = document.getElementById(tag_id),
      pJS_canvas_class = 'diktia-particles-canvas-el',
      exist_canvas = pJS_tag.getElementsByClassName(pJS_canvas_class);

  /* remove canvas if exists into the pJS target tag */
  if(exist_canvas.length){
    while(exist_canvas.length > 0){
      pJS_tag.removeChild(exist_canvas[0]);
    }
  }

  /* create canvas element */
  var canvas_el = document.createElement('canvas');
  canvas_el.className = pJS_canvas_class;

  /* set size canvas */
  // TODO: revisar esto del tamaño
  canvas_el.style.width = "100%";
  canvas_el.style.height = "100%";

  /* append canvas */
  var canvas = document.getElementById(tag_id).appendChild(canvas_el);

  /* launch particle.js */
  if(canvas != null){
    pJSDom.push(new pJS(tag_id, params));
  }

  var contiene_canvas_el = document.querySelector('#'+tag_id);
  contiene_canvas_el.style.width = "100%";
  contiene_canvas_el.style.height = "auto";
  var canvas_el = document.querySelector('#'+tag_id+' > .diktia-particles-canvas-el');
  canvas_el.style.width = "100%";
  canvas_el.style.height = "100%";
  

      var contiene_canvas_el = document.querySelector('#'+window.tag_id);
      //var contiene_canvas_el = document.querySelector('#contiene_canvas');
      var c_h = contiene_canvas_el.innerHeight;
      var c_w = contiene_canvas_el.innerWidth;
      var w_h = window.innerHeight;
      var w_w = window.innerWidth;

      var aspet_ratio = 800/600;
      if((w_w/w_h) > aspet_ratio){
        contiene_canvas_el.style.width = window.innerHeight * aspet_ratio + "px";
        contiene_canvas_el.style.height = window.innerHeight + "px";
      }
      else{
        contiene_canvas_el.style.width = window.innerWidth + "px";
        contiene_canvas_el.style.height = window.innerWidth / aspet_ratio + "px";

        contiene_canvas_el.style.top = (w_h/2) - ((window.innerWidth / aspet_ratio)/2) + "px";
      }

};


  window.onresize = function(event) {
      var contiene_canvas_el = document.querySelector('#'+window.tag_id);
      //var contiene_canvas_el = document.querySelector('#contiene_canvas');
      var c_h = contiene_canvas_el.innerHeight;
      var c_w = contiene_canvas_el.innerWidth;
      var w_h = window.innerHeight;
      var w_w = window.innerWidth;

      var aspet_ratio = 800/600;
      if((w_w/w_h) > aspet_ratio){
        contiene_canvas_el.style.width = window.innerHeight * aspet_ratio + "px";
        contiene_canvas_el.style.height = window.innerHeight + "px";
      }
      else{
        contiene_canvas_el.style.width = window.innerWidth + "px";
        contiene_canvas_el.style.height = window.innerWidth / aspet_ratio + "px";
	
        contiene_canvas_el.style.top = (w_h/2) - ((window.innerWidth / aspet_ratio)/2) + "px";
      }

  };
