var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
        
function preload() {

    game.load.image('bullet', 'assets/ball.png');
    game.load.image('ship', 'assets/ship.png');

    game.load.image('diamond', 'assets/explode.png');
    game.load.spritesheet('explosion', 'assets/explode.png', 64, 64, 16);

    //game.load.image('spark1', 'assets/Spark1_I.jpg')
    //game.load.spritesheet('sparks', 'assets/sparks.png', 200, 200, 57);
    game.load.spritesheet('sparks', 'assets/sparks2.png', 200, 200, 57);

    game.load.image('starfield', 'assets/starfield.jpg');

    game.load.image('crate', 'assets/crate.png');

    game.load.spritesheet('shield', 'assets/aura.png', 192, 192, 20);
    game.load.spritesheet('smoke', 'assets/smoke.png', 256, 256, 16);

    game.load.image('enemy-green', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/enemy-green.png');
    game.load.spritesheet('explosion', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/explode.png', 128, 128);

    game.load.spritesheet('woman', 'assets/woman.png', 128, 128, 16);
    game.load.spritesheet('guy', 'assets/BODY_male.png', 64, 64, 36);

    game.load.image('target', 'assets/target.gif');

}   

var sprite;
var bullets;
//var veggies;
var cursors;
var shield;

var p1;
var p2;

var bulletTime = 0;
var bullet;

var target;

var emitter;
var emitterBullet;

var tilesprite;
var count = 0;
var shoot = false;

var boxes;
var box;
var boxWidth = 40;
var boxHeight = 40;
var boxSpacing = 75;

var enemy1;

function create() {
    game.world.setBounds(-1000, -1000, 2000, 2000);
    game.physics.startSystem(Phaser.Physics.ARCADE);
   
    //var field = game.add.sprite(0, 0, 'starfield');

    tilesprite = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    tilesprite.alpha = 0.2;
    tilesprite.fixedToCamera = true;
    
    
    //game.physics.arcade.gravity.y = 300;
    game.physics.arcade.gravity.y = 0;
   


    //sprite = game.add.sprite(400, 300, 'ship');
    sprite = game.add.sprite(0, 0, 'guy');

    var walkUp = sprite.animations.add('walk-up', [0,1,2,3,4,5,6,7,8]);
    var walkLeft = sprite.animations.add('walk-left', [9,10,11,12,13,14,15,16,17]);
    var walkDown = sprite.animations.add('walk-down', [18,19,20,21,22,23,24,25,26]);
    var walkRight = sprite.animations.add('walk-right', [27,28,29,30,31,32,33,34,35]);

    //sprite.animations.play('walk-up', 30, true);


    sprite.width = 100;
    sprite.height = 100;
    sprite.enableBody = true;

    p1 = new Phaser.Point(400, 200);
    p2 = new Phaser.Point(400, 300);
    game.physics.enable(p1, Phaser.Physics.ARCADE);
    p1.enableBody = true;
    target = game.add.sprite(400, 200, 'target');
    target.width = 50;
    target.height = 50;
    //sprite.addChild(target);
    //target.y -= 100;
    //target.x -= 24;
    target.enableBody = true;
    game.physics.enable(target, Phaser.Physics.ARCADE);    
    //shield = game.add.sprite(305, 225, "shield");
    shield = game.add.sprite(0 - sprite.width/2, 0 - sprite.height/2, "shield");
    sprite.addChild(shield)
    shield.animations.add('shields');
    shield.visible = false;

    shield.width = sprite.width;
    shield.height = sprite.height;
    
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.allowGravity = 0;
    sprite.body.collideWorldBounds = true;
    sprite.anchor.setTo(0.5);
    sprite.body.immovable = true;
   

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.CONTROL ]);
    bullets = game.add.group();
    bullets.enableBody = true;
  
    game.physics.enable(bullets, Phaser.Physics.ARCADE);
    
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    boxes = game.add.group();
    boxes.enableBody = true;

    
  
    game.physics.enable(boxes, Phaser.Physics.ARCADE);

    

    createBoxesL(4, 80);
    createBoxesL(2, 175);    
    createBoxesL(6, 500);
    createBoxesL(3, 370);

    createBoxesR(4, 250);
    createBoxesR(3, 350);
    createBoxesR(4, 75);    
    createBoxesR(3, 500)

    for (var i = 0; i < 50; i++)
    {
        var b = bullets.create(0, 0, 'bullet');
        b.name = 'bullet' + i;
        b.width = 30;
        b.height = 30;
        b.exists = false;
        b.visible = false;
       // b.checkWorldBounds = true;
       // b.body.collideWorldBounds = true;
        b.body.bounce.set(0.8)
        //b.events.onOutOfBounds.add(resetBullet, this);
        b.anchor.setTo(0.5);

        b.body.onCollide = new Phaser.Signal();
        b.body.onCollide.add(hitBullet, this);

        //b.addChild(emitterBullet);
       
       
            
        
    }

    emitter = game.add.emitter(0, 0, 300);

    const frames = [1,2, 3,4,5,6,7,8,9, 10,11,12, 13]
    emitter.makeParticles('explosion', frames);
    emitter.gravity = 100;
    
    emitter.setAlpha(0.5, 1, 1000);
    emitter.setScale(0.4, 0, 0.4, 0.4, 500);

    //emitter.scale = .2;

    sprite.addChild(emitter);

    emitterBullet = game.add.emitter(0, 0, 300);
    const framesBullet = [0,1,2, 3,4,5,6,7,8,9, 10,11,12, 13];
    const frames2 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]
    //emitterBullet.makeParticles('explosion', frames);
    emitterBullet.makeParticles('sparks', frames);
    emitterBullet.gravity = 100;
    
    emitterBullet.setAlpha(0.5, 1, 1000);
   // emitterBullet.setScale(0.8, 0, 0.8, 0.8, 1000);
    emitterBullet.setScale(0.4, 0, 0.4, 0.4, 500);

    emitterSmoke = game.add.emitter(0, 0, 300);
    emitterSmoke.makeParticles('smoke', frames2);
    emitterSmoke.setScale(.8, .5, .8, .5, 500);
    
    game.input.keyboard.onUpCallback = function(e) {            
        if(e.keyCode == Phaser.Keyboard.UP){ 
            //console.log("up-up");
           
            sprite.animations.stop('walk-up', true);
            sprite.animations.stop('walk-down', true);
            sprite.animations.stop('walk-right', true);
            sprite.animations.stop('walk-left', true);

            sprite.body.velocity.y = 0;
            sprite.body.velocity.x = 0;
        }
        if(e.keyCode == Phaser.Keyboard.CONTROL){ 
            //console.log("control-up");
            shield.visible = false;
            shield.animations.stop('shields', true);
        }
    }
    //game.input.onDown.add(particleBurst, this);

    enemy1 = game.add.group();
    enemy1.enableBody = true;
    enemy1.physicsBodyType = Phaser.Physics.ARCADE;
    enemy1.createMultiple(5, 'woman');
    enemy1.setAll('anchor.x', 0.5);
    enemy1.setAll('anchor.y', 0.5);
    enemy1.setAll('scale.x', 0.5);
    enemy1.setAll('scale.y', 0.5);
    enemy1.setAll('angle', 180);
    enemy1.setAll('outOfBoundsKill', true);
    enemy1.setAll('checkWorldBounds', true);
    /*enemy1.forEach( function(explosion) {
        explosion.animations.add('woman');
    });*/
    
    
    launchEnemy1();

    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;
    explosions.createMultiple(30, 'explosion');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
    explosions.forEach( function(explosion) {
        explosion.animations.add('explosion');
    });

    game.camera.follow(sprite);
    //game.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    game.camera.deadzone = new Phaser.Rectangle(250, 200, 300, 200);
    game.camera.focusOnXY(50, 50);
}        

function update() {
    count += 0.005;
    //shoot = false;
    if (shoot) {
        tilesprite.tileScale.x = 2 + Math.sin(count);
        tilesprite.tileScale.y = 2 + Math.cos(count);
    }
    //tilesprite.tilePosition.x -= 1;
   // tilesprite.tilePosition.y += 1;

    tilesprite.tilePosition.x = -game.camera.x;
    tilesprite.tilePosition.y = -game.camera.y;

   /* sprite.body.velocity.x = 0;
    sprite.body.velocity.y = 0;
    sprite.x = 400;
    sprite.y = 300;
*/
    //console.log(sprite.angle)
    //console.log(p1.rotation);
    //targetAngle = game.physics.arcade.angleBetween(sprite, p1);
    targetAngle = game.physics.arcade.angleBetween(sprite, target);
    //console.log(targetAngle);
/*
    if (sprite.angle > 135 || sprite.angle < -135) {
        //sprite.animations.play('walk-up', 50, true);
        sprite.animations.play('walk-right', 50, true);
        //console.log('right')
    }

    if (sprite.angle < 135 && sprite.angle > 45) {
        //sprite.animations.play('walk-right', 50, true);
        sprite.animations.play('walk-down', 50, true);
        //console.log('down')
    }
    if (sprite.angle < -45 && sprite.angle > -135) {
        sprite.animations.play('walk-up', 50, true);
        //console.log('up')
    }    
    if (sprite.angle < 45 && sprite.angle > -45) {
        sprite.animations.play('walk-left', 50, true);
        //console.log('left')
    }    */
    if (!cursors.up.isDown) {
    if (targetAngle > 2.5 || targetAngle < -2.5) {
        //sprite.animations.play('walk-up', 50, true);
        //sprite.animations.play('walk-right', 50, true);
        //sprite.animations.play('walk-left', 50, true);
        sprite.frame = 9;
        //console.log('right')
       // sprite.frame = 27;

    }

    if (targetAngle < 2.5 && targetAngle > 0.75) {
        //sprite.animations.play('walk-right', 50, true);
        //sprite.animations.play('walk-down', 50, true);
        //console.log('down')
        sprite.frame = 18;
    }
    if (targetAngle < -0.75 && targetAngle > -2.5) {
        //sprite.animations.play('walk-up', 50, true);
        //console.log('up')
        sprite.frame = 0;
    }    
    if (targetAngle > -0.75 && targetAngle < 0.75) {
        //sprite.animations.play('walk-left', 50, true);
        //sprite.animations.play('walk-right', 50, true);
        //console.log('left')
        sprite.frame = 27;
        //sprite.frame = 9;
    }   
    }
   
    bullets.forEachAlive(function(bullet) {
        let bAV = bullet.body.angularVelocity;
        let bVx = bullet.body.velocity.x;
        if (bullet.body.onFloor() || Math.abs(bullet.body.velocity.y) < 10 ) {
            if (bAV > 0) {
                bullet.body.angularVelocity -= 10;
            }
            if (bAV < 0) {
                bullet.body.angularVelocity += 10;
            }
            if (bVx < 0) {
                bullet.body.velocity.x += 10;
            }
            if (bVx > 0) {
                bullet.body.velocity.x -= 10;
            }
            if (Math.abs(bVx) < 10) {
                bullet.body.velocity.x = 0;
            }
            bullet.body.angularAcceleration = 0;
           
            //console.log("floor")
        }

      /*   if (bullet.y >= 585 || bullet.y <= 15 || bullet.x <= 15 || bullet.x >= 785) {
                bullet.kill();
            }*/
       /* if (bullet.lifespan < 100) {
             
            particleBurstBullet(bullet);
        }*/
        //console.log("xx: "+bullet.x);
    });

    game.physics.arcade.collide(bullets, bullets, change, null, this);
    game.physics.arcade.collide(bullets, sprite, change, null, this);
    game.physics.arcade.collide(bullets, sprite, change, null, this);
    //game.physics.arcade.collide(bullets, boxes, change, null, this);
    game.physics.arcade.overlap(bullets, boxes, breakBox, null, this);
    game.physics.arcade.collide(bullets, boxes, change, null, this);

    game.physics.arcade.overlap(enemy1, bullets, hitEnemy, null, this);
    
    p2.y = sprite.y;           
    p2.x = sprite.x;
    target.body.velocity.y = sprite.body.velocity.y;
    target.body.velocity.x = sprite.body.velocity.x;

    if (cursors.left.isDown)
    {
        //sprite.body.velocity.x = -300;
       // sprite.angle += -3;
        //sprite.angle = sprite.body.x - 100;
        p1.rotate(p2.x, p2.y, -3, true);
        target.position.rotate(p2.x, p2.y, -3, true, 100);
        
    }
    else if (cursors.right.isDown)
    {
        //sprite.body.velocity.x = 300;
        //sprite.angle += 3;
        //sprite.angle = sprite.body.x - 300;
        p1.rotate(p2.x, p2.y, 3, true);
        target.position.rotate(p2.x, p2.y, 3, true, 100);
    }    
    else if (cursors.up.isDown)
    {
        if (targetAngle > 2.5 || targetAngle < -2.5) {
       
        sprite.animations.play('walk-left', 50, true);
        //sprite.animations.play('walk-right', 50, true);
       // console.log('left')
        }

        if (targetAngle < 2.5 && targetAngle > 0.75) {
            
            sprite.animations.play('walk-down', 50, true);
        
        }
        if (targetAngle < -0.75 && targetAngle > -2.5) {
            sprite.animations.play('walk-up', 50, true);
        
        }    
        if (targetAngle > -0.75 && targetAngle < 0.75) {
        
            sprite.animations.play('walk-right', 50, true);
            //sprite.animations.play('walk-left', 50, true);
         //   console.log('right')
        
        }   
        //xBefore = sprite.x
        //yBefore = sprite.y
        sprite.body.velocity.y = (target.y - sprite.y); //* 10;           
        sprite.body.velocity.x = (target.x - sprite.x);
        
        //* 10;
        //xAfter = sprite.x;
        //yAfter = sprite.y;
        //p1.y = p1.y + (yBefore - sprite.body.velocity.y); 
        //p1.x = p1.x + (xBefore - xAfter); 
        
        //sprite.y += (p1.y - sprite.y) * 10;           
        //sprite.x += (p1.x - sprite.x) * 10;
        //sprite.y += (p1.y - 300);           
        //sprite.x += (p1.x - 400);
        //p1.y += sprite.body.velocity.x        //targetAngle *10               //sprite.y - 100;
        //p1.x += sprite.body.velocity.y                 //targetAngle *10           //sprite.x - 100;
      
    }

    //sprite.angle = (sprite.body.x - 350) / 10;
    //console.log(sprite.body.x);
   

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        fireBullet();
        //shoot = true;
    }
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.CONTROL))
    {
        shield.visible = true;
        shield.animations.play('shields', 50, true);
        //console.log("control")
        //shoot = true;
    }
   
    
}

function render() {
/*
    game.context.fillStyle = 'rgb(255,255,0)';
    game.context.fillRect(p1.x, p1.y, 4, 4);

    game.context.fillStyle = 'rgb(255,0,0)';
    game.context.fillRect(p2.x, p2.y, 4, 4);
*/
    var zone = game.camera.deadzone;

    game.context.fillStyle = 'rgba(255,0,0,0.6)';
    game.context.fillRect(zone.x, zone.y, zone.width, zone.height);

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(sprite, 32, 500);
}
        
function fireBullet () {

    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //bullet.reset(sprite.x , sprite.y - 50);
            //bullet.reset(p1.x , p1.y);
            bullet.reset(target.x , target.y);
            //bullet.body.velocity.y = -600;
            //bullet.body.velocity.y = (p1.y - 300) * 10;
            bullet.body.velocity.y = (target.y - sprite.y) * 10;
            //bullet.body.velocity.x = sprite.angle * 10;
           // bullet.body.velocity.x = (p1.x - 400) * 10;
            bullet.body.velocity.x = (target.x - sprite.x) * 10;
            bulletTime = game.time.now + 150;
            bullet.anchor.setTo(0.5);
            bullet.lifespan = 5000;
            //bullet.addChild(emitterBullet);
            
            
            const rnd = Math.floor(Math.random() * 4);

            if (rnd === 0) {
                bullet.body.angularVelocity = -290;
            } else if (rnd === 1) {
                bullet.body.angularVelocity = 290;
            } else if (rnd === 2) {
                bullet.body.angularVelocity = -450;
            } else if (rnd === 3) {
                bullet.body.angularVelocity = 450;
            }
            
            //bullet.body.angularVelocity = -90;
            //bullet.angle = -bullet.y/10;
            for (let i = 0; i < 100; i++) {
                bullet.angle = game.time.now + i;
                bullet.rotation = i/2;
            }
            bullet.damageAmount = 10;
        }
    }

    particleBurst()

}   

function resetBullet (bullet) {

    bullet.kill();

}

//  Called if the bullet hits one of the veg sprites
function collisionHandler (bullet, veg) {

    bullet.kill();
    //veg.kill();

}

function change(a, b) {

    //a.body.velocity.y = (b.body.velocity.y * a.body.velocity.y) /2; 
    //a.body.velocity.x = (b.bodx.velocity.x * a.body.velocity.x) /2; 
    const rnd = Math.floor(Math.random() * 12);
    if (rnd > 10) a.body.velocity.x = 300; 
    if (rnd < 2) a.body.velocity.x = -300;  
    if (rnd > 7) a.body.velocity.y = 200; 
    if (rnd < 2) a.body.velocity.y = -200;  


    emitterBullet.x = a.x;
    emitterBullet.y = a.y;
    emitterBullet.start(true, 4000, null, 2);
    //emitterBullet.makeParticles(a.body.x, a.body.y)
    //console.log(a, b)
    //console.log(a.velocity);
    //a.frame = 3;
    //b.frame = 3;

}


function particleBurst(pointer) {

//emitter.x = pointer.x;
//emitter.y = pointer.y;
emitter.y = -200;

//emitter.x = sprite.x;
//emitter.y = sprite.y - 100;


emitter.angle = sprite.angle/100;

emitter.start(true, 4000, null, 2);

//  And 2 seconds later we'll destroy the emitter
//game.time.events.add(2000, destroyEmitter, this);

}

function particleBurstBullet(bullet) {

//emitter.x = pointer.x;
//emitter.y = pointer.y;
//console.log("x: "+bullet.x)
//emitterBullet.y = bullet.y;
//emitterBullet.x = bullet.x;

//emitter.x = sprite.x;
//emitter.y = sprite.y - 100;




emitterBullet.start(true, 4000, null, 2);



}


function hitBullet(bullet) {
  
   
    if (Math.abs(bullet.body.velocity.y) > 10 && Math.abs(bullet.body.velocity.x) > 10) {
        //console.log("hit")
        const rnd = Math.floor(Math.random() * 12 + 1);
        if(rnd % 2 === 0) {
            
            bullet.body.angularVelocity *= 5;
        //    console.log("ang")
        }
        if(rnd % 3 === 0 || rnd % 6 === 0) bullet.body.angularAcceleration = 600;
        if(rnd % 4 === 0 || rnd & 5 === 0) bullet.body.angularAcceleration = -600;
    } else {
        //const rnd = Math.floor(Math.random() * 2);
        if (bullet.body.velocity.x > 0) {
            bullet.body.velocity.x = 100;
        } else {
            bullet.body.velocity.x = -100;
        } 
        
    }
       //bullet.alpha = 0.2;
}

function createBoxesL(total, y) {
    for (let i = 0; i < total; i++) {
        //box = game.add.sprite(100 * i, 200, 'crate');
        box = boxes.create(boxSpacing * i, y, 'crate');
        box.width = boxWidth;
        box.height = boxHeight;
        //box.enableBody = true;
   
    
        //game.physics.enable(box, Phaser.Physics.ARCADE);
        box.body.allowGravity = 0;
        box.body.immovable = true;
        box.health = 30;
    }
}

function createBoxesR(total, y) {
    for (let i = total - 1; i >= 0; i--) {
        //box = game.add.sprite(100 * i, 200, 'crate');
        box = boxes.create(800 - boxWidth - (boxSpacing * i), y, 'crate');
        box.width = boxWidth;
        box.height = boxHeight;
        //box.enableBody = true;
   
    
        //game.physics.enable(box, Phaser.Physics.ARCADE);
        box.body.allowGravity = 0;
        box.body.immovable = true;
        box.health = 30;
    }
}

function breakBox(a, b) {
   // console.log(a);
   // console.log("hit")
    

    b.tint= 0xff0000;
    setTimeout(()=>{b.tint= 0xffffff}, 100);
    b.damage(bullet.damageAmount);
  /*  if (b.alive = false) {
        emitterSmoke.x = a.x;
        emitterSmoke.y = a.y;
        emitterSmoke.start(true, 4000, null, 2);
    }   */ 
    if (b.health < 10) {
        emitterSmoke.x = a.x;
        emitterSmoke.y = a.y;
        emitterSmoke.start(true, 4000, null, 2);
    }   
}

function launchEnemy1() {
    var MIN_ENEMY_SPACING = 300;
    var MAX_ENEMY_SPACING = 3000;
    var ENEMY_SPEED = 300;

    var enemy = enemy1.getFirstExists(false);
    if (enemy) {
        enemy.reset(game.rnd.integerInRange(0, game.width), -20);
        enemy.body.velocity.x = game.rnd.integerInRange(-300, 300);
        enemy.body.velocity.y = ENEMY_SPEED;
        enemy.body.drag.x = 100;

        //enemy.play('woman', 30, false, true);
        var walk = enemy.animations.add('walk');
        enemy.animations.play('walk', 30, true);


        //  Update function for each enemy ship to update rotation etc
        enemy.update = function(){
          enemy.angle = 180 - game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y));
        }
    }

    //  Send another enemy soon
    game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), launchEnemy1);
}

function hitEnemy(enemy, bullet) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(bullet.body.x + bullet.body.halfWidth, bullet.body.y + bullet.body.halfHeight);
    //explosion.body.velocity.y = enemy.body.velocity.y;
   // explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    enemy.kill();
    //bullet.kill()
}
        