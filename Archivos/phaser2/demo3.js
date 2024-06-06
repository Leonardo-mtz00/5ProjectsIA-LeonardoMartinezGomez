var w = 800;
var h = 400;
var jugador;
var fondo;
var bala;

var cursors;
var menu;

var zonaSegura = {
    xMin: w / 2 - 200,
    xMax: w / 2 + 200,
    yMin: h / 2 - 200,
    yMax: h / 2 + 200
};

var estatusIzquierda;
var estatusDerecha;
var estatusArriba;
var estatusAbajo;
var nnNetwork, nnEntrenamiento, nnSalida, datosEntrenamiento = [];
var modoAuto = false, eCompleto = false;

var autoMode = false;
var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

function preload() {
    juego.load.image('fondo', 'assets/game/fondo.jpg');
    juego.load.spritesheet('mono', 'assets/sprites/altair.png', 32, 48);
    juego.load.image('menu', 'assets/game/menu.png');
    juego.load.image('bala', 'assets/sprites/purple_ball.png');
}

function create() {
    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.physics.arcade.gravity.y = 0; 
    juego.time.desiredFps = 20;

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
    jugador = juego.add.sprite(w / 2, h / 2, 'mono');

    juego.physics.enable(jugador);
    jugador.body.collideWorldBounds = true;
    var corre = jugador.animations.add('corre', [8, 9, 10, 11]); 
    jugador.animations.play('corre', 10, true); 

    bala = juego.add.sprite(0, 0, 'bala');
    juego.physics.enable(bala);
    bala.body.collideWorldBounds = true;
    bala.body.bounce.set(1);
    setRandomBalaVelocity();

    pausaL = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.inputEnabled = true;
    pausaL.events.onInputUp.add(pausa, self);
    juego.input.onDown.add(mPausa, self);

    cursors = juego.input.keyboard.createCursorKeys();
    
    nnNetwork = new synaptic.Architect.Perceptron(3, 6, 6, 3); // Actualizado para tener 4 salidas
    nnEntrenamiento = new synaptic.Trainer(nnNetwork);
}

function enRedNeural() {
    nnEntrenamiento.train(datosEntrenamiento, {rate: 0.0003, iterations: 12000, shuffle: true});
}

function pausa() {
    juego.paused = true;
    menu = juego.add.sprite(w / 2, h / 2, 'menu');
    menu.anchor.setTo(0.5, 0.5);
}

function mPausa(event) {
    if (juego.paused) {
        var menu_x1 = w / 2 - 270 / 2, menu_x2 = w / 2 + 270 / 2,
            menu_y1 = h / 2 - 180 / 2, menu_y2 = h / 2 + 180 / 2;

        var mouse_x = event.x,
            mouse_y = event.y;

        if (mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2) {
            if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 && mouse_y <= menu_y1 + 90) {
                eCompleto = false;
                datosEntrenamiento = [];
                modoAuto = false;
            } else if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 + 90 && mouse_y <= menu_y2) {
                if (!eCompleto) {
                    console.log("", "Entrenamiento " + datosEntrenamiento.length + " valores");
                    enRedNeural();
                    eCompleto = true;
                }
                modoAuto = true;
            }
            menu.destroy();
            resetGame();
            juego.paused = false;
        }
    }
}

function resetGame() {
    jugador.x = w / 2;
    jugador.y = h / 2;
    jugador.body.velocity.x = 0;
    jugador.body.velocity.y = 0;

    bala.x = 560;
    bala.y = 0;
    setRandomBalaVelocity();
}

function setRandomBalaVelocity() {
    var speed = 550;
    var angle = juego.rnd.angle();
    bala.body.velocity.set(Math.cos(angle) * speed, Math.sin(angle) * speed);
}

function update() {
    
    estatusIzquierda = 0;
    estatusDerecha = 0;
    estatusArriba = 0;
    estatusAbajo = 0;
    estatusQuieto = 0;

    fondo.tilePosition.x -= 1;

    if (!autoMode) {
        jugador.body.velocity.x = 0;
        jugador.body.velocity.y = 0;

        if (cursors.left.isDown) {
            jugador.body.velocity.x = -300;
            estatusIzquierda = 1;
            console.log("Izquierda VALOR"+estatusIzquierda);
        } else if (cursors.right.isDown) {
            jugador.body.velocity.x = 300;
            estatusDerecha = 1;
            console.log("Derecha VALOR"+estatusDerecha);
        }else{
            console.log("QUIETO");
        }
        /*else if (cursors.up.isDown && jugador.y > zonaSegura.yMin) {
            jugador.body.velocity.y = -300;
            estatusArriba = 1;
            console.log("Arriba");
        } else if (cursors.down.isDown && jugador.y < zonaSegura.yMax) {
            jugador.body.velocity.y = 300;
            console.log("Abajo");
            estatusAbajo = 1;
        }else{
            estatusQuieto = 1;
            console.log("Quieto");
        }*/
        console.log("VALORES PERRONES ------------"+""+"\nDerecha VALOR"+estatusDerecha+"\nIzquierda VALOR"+estatusIzquierda+"\nValor VALOR"+estatusArriba+"\nAbajo VALOR"+estatusAbajo+"\nQuieto VALOR"+estatusQuieto+"\n\n");
        
    

    juego.physics.arcade.collide(bala, jugador, colisionH, null, this);

    var dx = bala.x - jugador.x;
    var dy =  jugador.y - bala.y;
    var distancia = Math.sqrt(dx * dx + dy * dy);

    
    


    

        //console.log(distancia);

        //console.log("Valor de dx: " + dx);
        //console.log("Valor de dy: " + dy);
    }

    if (modoAuto == false) {
        datosEntrenamiento.push({
            'input': [dx, dy, distancia],
            'output': [estatusIzquierda, estatusDerecha, estatusQuieto]
        });
    }

    if (autoMode) {
        if (distancia > 1300) {
            jugador.body.velocity.x = 0;
            jugador.body.velocity.y = 0;
        } else {
            if (datosHorizontal([dx, dy, distancia]) && jugador.position.x < 600) {
                jugador.body.velocity.x = 300;
              
            }
            else if (datosHorizontal1([dx, dy, distancia]) && jugador.position.x > 300) {
                jugador.body.velocity.x = -300;
             
            } else  {
                jugador.body.velocity.x = 0;
                
            }

            if (datosvertical([dx, dy, distancia] && jugador.position.y < 200) ) {
                jugador.body.velocity.y = 300;
                
            }
            else if (datosvertical1([dx, dy, distancia]) && jugador.position.y > 50) {
                jugador.body.velocity.y = -300;
              
            } else  {
                jugador.body.velocity.x = 0;
            
            }
                console.log("EJE X Muñéquito:"+jugador.x);
            
        }
    }
}

function datosHorizontal(param_entrada) {
    nnSalida = nnNetwork.activate(param_entrada);
    var Izq = Math.round(nnSalida[0] * 100);
    var Der = Math.round(nnSalida[2] * 100); // Asume la primera salida para el movimiento horizontal
    console.log("Valor nn2"+nnSalida[2]);
    return nnSalida[2]>=nnSalida[0];
}

function datosHorizontal1(param_entrada) {
    nnSalida = nnNetwork.activate(param_entrada);
    var Izq1 = Math.round(nnSalida[1] * 100);
    var Der1 = Math.round(nnSalida[2] * 100); // Asume la primera salida para el movimiento horizontal
    return nnSalida[1]>=nnSalida[2];
}

function datosvertical(param_entrada) {
    nnSalida = nnNetwork.activate(param_entrada);
    var Izq3 = Math.round(nnSalida[2] * 100);
    var Der3 = Math.round(nnSalida[4] * 100); // Asume la primera salida para el movimiento horizontal
    return nnSalida[2]>=nnSalida[4];
}

function datosvertical1(param_entrada) {
    nnSalida = nnNetwork.activate(param_entrada);
    var Izq4 = Math.round(nnSalida[3] * 100);
    var Der4 = Math.round(nnSalida[4] * 100); // Asume la primera salida para el movimiento horizontal
    return nnSalida[3]>=nnSalida[4];
}



function colisionH() {
    autoMode = true;
    pausa();
}

function render() {
    // Opcionalmente, renderizar el estado del juego o información adicional
}
