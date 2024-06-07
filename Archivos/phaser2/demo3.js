var w=800;
var h=400;
var jugador;
var fondo;

var bala, balaD=false, nave;
var bala2, balaD2=false, nave2;
var bala3, balaD3=false, nave3;

var salto;
var der;
var izq;
var menu;

var izqe;
var dere;
var despBalaHorizontal3;
var despBalaVertical3;
//Definimos la velocidad y desplazamiento en variable
var velocidadBala;
var despBala;
var velocidadBala2;
var despBala2;
var velocidadBala3;
var despBala3;


//Ahora definimos en que posicion X esta el muñeco respecto al ancho de la ventana
var posicion;

var estatusAire;
var estatuSuelo;

var nnNetwork , nnEntrenamiento, nnSalida, datosEntrenamiento=[];
var modoAuto = false, eCompleto=false;


var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render:render});

function preload() {
    juego.load.image('fondo', 'assets/game/fondo.jpg');
    juego.load.spritesheet('mono', 'assets/sprites/altair.png',32 ,48);
    juego.load.image('nave', 'assets/game/ufo.png');
    juego.load.image('bala', 'assets/sprites/purple_ball.png');
    juego.load.image('menu', 'assets/game/menu.png');

}



function create() {

    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.physics.arcade.gravity.y = 800;
    
    juego.time.desiredFps = 30;

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
    nave = juego.add.sprite(w-100, h-70, 'nave');
    bala = juego.add.sprite(w-50, h, 'bala');
    nave2 = juego.add.sprite(10, 10, 'nave');
    bala2 = juego.add.sprite(50, 30, 'bala');
    nave3 = juego.add.sprite(700, 10, 'nave');
    bala3 = juego.add.sprite(790, 330, 'bala');
    
    jugador = juego.add.sprite(50, h, 'mono');


    juego.physics.enable(jugador);
    jugador.body.collideWorldBounds = true;
    var corre = jugador.animations.add('corre',[8,9,10,11]);
    jugador.animations.play('corre', 10, true);

    juego.physics.enable(bala);
    bala.body.collideWorldBounds = true;

    juego.physics.enable(bala2);
    bala2.body.collideWorldBounds = true;

    juego.physics.enable(bala3);
    bala3.body.collideWorldBounds = true;

    pausaL = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.inputEnabled = true;
    pausaL.events.onInputUp.add(pausa, self);
    juego.input.onDown.add(mPausa, self);

    salto = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    der = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    izq = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);

    
    nnNetwork =  new synaptic.Architect.Perceptron(6, 5,5,5, 4);
    nnEntrenamiento = new synaptic.Trainer(nnNetwork);

}

function enRedNeural(){
    nnEntrenamiento.train(datosEntrenamiento, {rate: 0.0003, iterations: 10000, shuffle: true});
}


function datosDeEntrenamiento(param_entrada){
    console.log(aire);
    console.log("Entrada",param_entrada[0]+" "+param_entrada[1]+" "+param_entrada[2]+" "+param_entrada[3]+" "+param_entrada[4]+" "+param_entrada[5]+" ");
    nnSalida = nnNetwork.activate(param_entrada);
    var aire=Math.round( nnSalida[0]*100 );
    var piso=Math.round( nnSalida[1]*100 );
    console.log("Valor ","En el Aire %: "+ aire + " En el suelo %: " + piso );
    return nnSalida[0]>=nnSalida[1];
}

//salto
function datosDeEntrenamiento2(param_entrada){

    console.log("Entrada",param_entrada[0]+" "+param_entrada[1]+" "+param_entrada[2]+" "+param_entrada[3]+" "+param_entrada[4]+" "+param_entrada[5]+" ");
    nnSalida = nnNetwork.activate(param_entrada);
    var dere=Math.round( nnSalida[2]*100 );
    var izqe=Math.round( nnSalida[3]*96 );
    console.log("Valor ","En hacia la derecha "+ dere + " Hacia la izquierda: " + izqe );
    return nnSalida[2]>=nnSalida[3];
}



function pausa(){
    juego.paused = true;
    menu = juego.add.sprite(w/2,h/2, 'menu');
    menu.anchor.setTo(0.5, 0.5);
    
}

function mPausa(event){
    if(juego.paused){
        var menu_x1 = w/2 - 270/2, menu_x2 = w/2 + 270/2,
            menu_y1 = h/2 - 180/2, menu_y2 = h/2 + 180/2;

        var mouse_x = event.x  ,
            mouse_y = event.y  ;

        if(mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2 ){
            if(mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1 && mouse_y <=menu_y1+90){
                eCompleto=false;
                datosEntrenamiento = [];
                modoAuto = false;
            }else if (mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1+90 && mouse_y <=menu_y2) {
                if(!eCompleto) {
                    console.log("","Entrenamiento "+ datosEntrenamiento.length +" valores" );
                    enRedNeural();
                    eCompleto=true;
                }
                modoAuto = true;
            }

            menu.destroy();
            resetVariables2();
            juego.paused = false;

        }
    }
}


function resetVariables(){
    jugador.body.velocity.x=0;
    jugador.body.velocity.y=0;

    bala.body.velocity.x = 0;
    bala.position.x = w-100; 

    bala2.body.velocity.y = 50;
    bala2.position.y = 1; 

    bala3.body.velocity.y = -270;
    bala3.body.velocity.x = 0;
    bala3.position.x = w-100;
    bala3.position.y = h-500;

    balaD=false;
    balaD2=false;
    balaD3=false;
}

function resetVariables2(){
    jugador.body.velocity.x=0;
    jugador.body.velocity.y=0;

    jugador.position.x=50;

    bala.body.velocity.x = 0;
    bala.position.x = w-100; 
    
    bala2.body.velocity.y = 50;
    bala2.position.y = 40; 

    bala3.body.velocity.y = -270;
    bala3.body.velocity.x = 0;
    bala3.position.x = w-100;
    bala3.position.y = h-500;

    balaD=false;
    balaD2=false;
}


function saltar(){
    jugador.body.velocity.y = -270;
}

//Movimiento a la derecha
function moverDerecha(){
    jugador.body.velocity.x = 150;
}

function moverIzquierda(){
    jugador.body.velocity.x = -150;
}


function update() {

    izqe=0;
    dere=0;

    fondo.tilePosition.x -= 1; 

    juego.physics.arcade.collide(bala, jugador, colisionH, null, this);
    juego.physics.arcade.collide(bala2, jugador, colisionH, null, this);
    juego.physics.arcade.collide(bala3, jugador, colisionH, null, this);

    estatuSuelo = 1;
    estatusAire = 0;

    if(!jugador.body.onFloor()) {
        estatuSuelo = 0;
        estatusAire = 1;
    }
	
    despBala = Math.floor( jugador.position.x - bala.position.x );
    despBala2 = Math.floor( jugador.position.y - bala2.position.y );
    despBalaHorizontal3 = Math.floor( jugador.position.x - bala3.position.x );
    despBalaVertical3 = Math.floor( jugador.position.y - bala3.position.y );
    despBala3 = Math.floor(despBalaHorizontal3 + despBalaVertical3);
    
    
    if( modoAuto==false ){
        if(salto.isDown &&  jugador.body.onFloor()){
        saltar();
        }else if (der.isDown){
            moverDerecha();
            dere=1;
            izqe=0;
        }else if(izq.isDown){
            moverIzquierda();
            dere=0;
            izqe=1;
        }else{
            jugador.body.velocity.x = 0; 
        }
    }
    
    if( modoAuto == true ) {
        
        if(bala.position.x>0 && jugador.body.onFloor()){
            if( datosDeEntrenamiento( [despBala , velocidadBala,despBala2 , velocidadBala2,despBala3 , velocidadBala3] )  ){
                saltar();
                log.console("SALTANDO!");
                log.console("SALTANDO!");
                log.console("SALTANDO!");
                log.console("SALTANDO!");
            }else{

            }

            if( datosDeEntrenamiento2( [despBala , velocidadBala,despBala2 , velocidadBala2,despBala3 , velocidadBala3] )  ){
                moverDerecha();
                log.console("DERECHA!");
                log.console("DERECHA!");
                log.console("DERECHA!");
                log.console("DERECHA!");
            }else{
                moverIzquierda();
                log.console("IZQUIERDA");
                log.console("IZQUIERDA");
                log.console("IZQUIERDA");
                log.console("IZQUIERDA");
            }
            
        }

        
    }

    if( balaD==false ){
        disparo();
    }
    if( balaD2==false ){
        disparo2();
    }
    if( balaD3==false ){
        disparo3();
    }

    if( bala.position.x <= 0  ){
        resetVariables();
    }

    
    if( modoAuto ==false  && bala.position.x > 0 ){

        datosEntrenamiento.push({
                'input' :  [despBala , velocidadBala,despBala2 , velocidadBala2,despBala3 , velocidadBala3],
                'output':  [estatusAire , estatuSuelo,dere,izqe]  
        });

        console.log("Desplazamiento Bala1: "+despBala + "\n"+"Velocidad bala: "+velocidadBala+"\n"+
                     "Desplazamiento Bala2: "+despBala2 + "\n"+"Velocidad bala2: "+velocidadBala2+"\n"+
                     "status aire: "+ estatusAire+"\n"+"status suelo"+estatuSuelo+"\n"+
                     "estado derecha"+dere+"\n"+"estado izquierda"+izqe+"\n");
   }

}


function disparo(){
    velocidadBala =  -1 * velocidadRandom(300,500);
    bala.body.velocity.y = 0 ;
    bala.body.velocity.x = velocidadBala ;
    balaD=true;
}

function disparo2(){
    velocidadBala2 =  1 * velocidadRandom(30,50);
    bala2.body.velocity.y = velocidadBala2;
    bala2.body.velocity.x = 0;
    balaD2=true;
}

function disparo3(){
    velocidadBala3 =  -1 * velocidadRandom(380,420);
    bala3.body.velocity.y = 0 ;
    bala3.body.velocity.x = 1.60*velocidadBala3 ;
    balaD3=true;
}

function colisionH(){
    pausa();
}

function velocidadRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function render(){

}