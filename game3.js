EnemySkeleton = function (index, game, player, bullets) {
    //console.log('..')
    var x = game.world.randomX;
    var y = game.world.randomY;
    this.speed = 50;
    this.dir = null;
    
    this.game = game;
   
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;
    
    this.walking = true;

   // this.shadow = game.add.sprite(x, y, 'enemy', 'shadow');
    this.skeleton = game.add.sprite(x, y, 'skeleton', 0);
    this.skeleton.enableBody = true;
   // this.skeleton.body.allowGravity = 0;
    //this.skeleton.body.collideWorldBounds = true;
    this.skeleton.anchor.setTo(0.5);
   // this.target = game.add.sprite(this.skeleton.x, this.skeleton.y, 'target');
   // this.target = game.add.sprite(x, y, 'target');
    
    this.skeleton.width = sprite.width;
    this.skeleton.height = sprite.height;
    // this.target.width = 50;
    // this.target.height = 50;
   // this.skeleton.addChild(this.target);
    //this.target.enableBody = true;
    //game.physics.enable(this.target, Phaser.Physics.ARCADE);  
    //this.target.visible = false;

   // this.shadow.anchor.set(0.5);
    this.skeleton.anchor.set(0.5);
   // this.target.anchor.set(0.3, 0.5);

    this.skeleton.name = index.toString();
    game.physics.enable(this.skeleton, Phaser.Physics.ARCADE);
    this.skeleton.body.immovable = false;
    this.skeleton.body.collideWorldBounds = true;
    //this.skeleton.body.bounce.setTo(1, 1);
    this.skeleton.body.allowGravity = 0;

    this.skeleton.health = 30;
    this.skeleton.body.bounce.set(0.8);

    this.changeDir();
    console.log(this.dir);

   this.skeleton.animations.add('walk-up', [0,1,2,3,4,5,6,7,8]);
   this.skeleton.animations.add('walk-left', [9,10,11,12,13,14,15,16,17]);
   this.skeleton.animations.add('walk-down', [18,19,20,21,22,23,24,25,26]);
   this.skeleton.animations.add('walk-right', [27,28,29,30,31,32,33,34,35]);


    //this.skeleton.angle = game.rnd.angle();

   // game.physics.arcade.velocityFromRotation(this.skeleton.rotation, 100, this.skeleton.body.velocity);

};

EnemySkeleton.prototype.changeDir = function() {
    var initDir = Math.floor(Math.random() * 4 + 1);
        
    switch(initDir) {
        case 1: this.dir = 'up';
        break;
        case 2: this.dir = 'right';
        break;
        case 3: this.dir = 'down';
        break;
        case 4: this.dir = 'left';
        break;
    }
    //console.log(initDir);
    if (this.skeleton.alive && this.walking) {
        setTimeout(this.changeDir.bind(this), 5000);
    }
}

EnemySkeleton.prototype.update = function() {
   // console.log('skel')
   // this.shadow.x = this.skeleton.x;
   // this.shadow.y = this.skeleton.y;
   // this.shadow.rotation = this.skeleton.rotation;

    // this.target.x = this.skeleton.x //- this.skeleton.width;
    // this.target.y = this.skeleton.y  //- this.skeleton.height;
   // this.target.rotation = this.game.physics.arcade.angleBetween(this.skeleton, this.player);


    // this.skeleton.body.velocity.x = (this.target.x - this.skeleton.x) * 2;
    // this.skeleton.body.velocity.y = (this.target.y - this.skeleton.y) * 2; //* 10;  
    // this.target.body.velocity.y = this.skeleton.body.velocity.y;
    // this.target.body.velocity.x = this.skeleton.body.velocity.x;
    
//    this.skeleton.body.velocity.x = 20;
//    this.skeleton.body.velocity.y = 20; 
    if (this.walking) {
    switch(this.dir) {
        case 'up': this.skeleton.body.velocity.y = this.speed * (-1);
        this.skeleton.animations.play('walk-up', 50, true);
        break;
        case 'right': this.skeleton.body.velocity.x = this.speed;
        this.skeleton.animations.play('walk-right', 50, true);
        break;
        case 'down': this.skeleton.body.velocity.y = this.speed;
        this.skeleton.animations.play('walk-down', 50, true);
        break;
        case 'left': this.skeleton.body.velocity.x = this.speed * (-1);
        this.skeleton.animations.play('walk-left', 50, true); 
        break;
    }
    }
    if (this.game.physics.arcade.distanceBetween(this.skeleton, this.player) < 300)
    {
        if (this.game.time.now > this.nextFire)  // && this.bullets.countDead() > 0
        {
            this.nextFire = this.game.time.now + this.fireRate;

            //var bullet = this.bullets.getFirstDead();
            var bullet = this.bullets.getFirstExists(false);
            if (bullet && this.skeleton.alive) {
          //  bullet.reset(this.target.x, this.target.y);
            bullet.reset(this.skeleton.x, this.skeleton.y);

            bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
            bullet.lifespan = 5000;
            }
        }
    }

};

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });
        
function preload() {

   // game.load.image('bullet', 'assets/ball.png');
    game.load.image('bullet', 'assets/Crossbow_Bolt.png');
    game.load.image('ship', 'assets/ship.png');

    game.load.image('diamond', 'assets/explode.png');
    game.load.spritesheet('explosion', 'assets/explode.png', 64, 64, 16);

    //game.load.image('spark1', 'assets/Spark1_I.jpg')
    //game.load.spritesheet('dw', 'assets/sparks.png', 200, 200, 57);
    game.load.spritesheet('sparks', 'assets/sparks2.png', 200, 200, 57);

    //game.load.image('starfield', 'assets/starfield.jpg');
    game.load.image('starfield', 'assets/dungeon.jpg');

    game.load.image('crate', 'assets/crate.png');

    game.load.spritesheet('shield', 'assets/aura.png', 192, 192, 20);
    game.load.spritesheet('smoke', 'assets/smoke.png', 256, 256, 16);

    game.load.image('enemy-green', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/enemy-green.png');
    game.load.spritesheet('explosion', 'https://raw.githubusercontent.com/jschomay/phaser-demo-game/master/assets/explode.png', 128, 128);

    game.load.spritesheet('woman', 'assets/woman.png', 128, 128, 16);
    game.load.spritesheet('guy', 'assets/BODY_male.png', 64, 64, 36);
    game.load.spritesheet('guy-fire', 'assets/BODY_animation.png', 64, 64, 52);
    game.load.spritesheet('bow', 'assets/WEAPON_bow.png', 64, 64, 52);

    game.load.spritesheet('skeleton', 'assets/BODY_skeleton.png', 64, 64, 36);
    game.load.spritesheet('skeleton-fire', 'assets/BODY_skeleton-fire.png', 64, 64, 52);

    game.load.image('target', 'assets/target.gif');

}   

var sprite;
var bullets;
//var veggies;
var cursors;
var shield;
var shieldUp = false;

var bow;

var p1;
var p2;

var bulletTime = 0;
var bullet;

var target;
var dir;

var emitter;
var emitterBullet;

var tilesprite;
var count = 0;
var shoot = false;
var shootDir;

var boxes;
var box;
var boxWidth = 40;
var boxHeight = 40;
var boxSpacing = 75;

var enemy1;

function create() {
    game.world.setBounds(0, 0, 2048, 1325);
    game.physics.startSystem(Phaser.Physics.ARCADE);
   
    //var field = game.add.sprite(0, 0, 'starfield');

    tilesprite = game.add.tileSprite(0, 0, 800, 600, 'starfield');
  //  tilesprite.alpha = 0.2;
    tilesprite.fixedToCamera = true;

    // tilesprite.tilePosition.x = -300
    // tilesprite.tilePosition.y = 1500;
    
    
    //game.physics.arcade.gravity.y = 300;
    game.physics.arcade.gravity.y = 0;
    game.physics.arcade.gravity.x = 0;
   


    //sprite = game.add.sprite(400, 300, 'ship');
    sprite = game.add.sprite(0, 0, 'guy');

    bow = game.add.sprite(0, 0, 'bow');
    sprite.addChild(bow);
    bow.x -= sprite.width/2;
    bow.y -= sprite.height/2
    bow.visible = false;

    sprite.animations.add('walk-up', [0,1,2,3,4,5,6,7,8]);
    sprite.animations.add('walk-left', [9,10,11,12,13,14,15,16,17]);
    sprite.animations.add('walk-down', [18,19,20,21,22,23,24,25,26]);
    sprite.animations.add('walk-right', [27,28,29,30,31,32,33,34,35]);

    //sprite.animations.play('walk-up', 30, true);


    sprite.width = 100;
    sprite.height = 100;
    sprite.enableBody = true;

    p1 = new Phaser.Point(400, 200);
    p2 = new Phaser.Point(400, 300);
    game.physics.enable(p1, Phaser.Physics.ARCADE);
    p1.enableBody = true;
   // target = game.add.sprite(400, 200, 'target');
    target = game.add.sprite(sprite.x + 100, sprite.y, 'target');
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
   // sprite.body.immovable = true;
   

    cursors = game.input.keyboard.createCursorKeys();
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
    game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SHIFT ]);
    bullets = game.add.group();
    bullets.enableBody = true;
  
    game.physics.enable(bullets, Phaser.Physics.ARCADE);
    
    bullets.setAll('checkWorldBounds', true);
    bullets.setAll('outOfBoundsKill', true);

    enemyBullets = game.add.group();
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
   // enemyBullets.width = 30;
   // enemyBullets.height = 30;
   // enemyBullets.createMultiple(100, 'bullet');
    
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    for (var j = 0; j < 100; j++) {
        var b = enemyBullets.create(0, 0, 'bullet');
        b.width = 30;
        b.height = 30;
        b.name = 'bulletE' + i;
        b.exists = false;
       // b.alive = false;
        b.visible = false;
       // b.lifespan = 5000;
    }
    

    enemies = [];

    enemiesTotal = 20;
    enemiesAlive = 20;

    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new EnemySkeleton(i, game, sprite, enemyBullets));
        // enemies[i].body.allowGravity = 0;
    }


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
        b.width = 50;
        b.height = 50;
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

   // sprite.addChild(emitter);

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
        if(e.keyCode == Phaser.Keyboard.W){   //Phaser.Keyboard.UP
            //console.log("up-up");
           
           /* sprite.animations.stop('walk-up', true);
            sprite.animations.stop('walk-down', true);
            sprite.animations.stop('walk-right', true);
            sprite.animations.stop('walk-left', true);
            */
            sprite.body.velocity.y = 0;
            sprite.body.velocity.x = 0;
        }
        if(e.keyCode == Phaser.Keyboard.SHIFT){ 
            //console.log("SHIFT-up");
            shield.visible = false;
            shieldUp = false;
            shield.animations.stop('shields', true);
        }
        if(e.keyCode == Phaser.Keyboard.SPACEBAR){   //Phaser.Keyboard.W
           // console.log('w')
            sprite.loadTexture('guy', 0);
            shoot = false;
            bow.visible = false;
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
   /* if (shoot) {
        tilesprite.tileScale.x = 2 + Math.sin(count);
        tilesprite.tileScale.y = 2 + Math.cos(count);
    }*/
 
    tilesprite.tilePosition.x = -game.camera.x;
    tilesprite.tilePosition.y = -game.camera.y;

    targetAngle = game.physics.arcade.angleBetween(sprite, target);

    if (targetAngle > 2.5 || targetAngle < -2.5) {      
        
        dir = 'left'
    }
    if (targetAngle < 2.5 && targetAngle > 0.75) {       
      
        dir = 'down'
    }
    if (targetAngle < -0.75 && targetAngle > -2.5) {
       
        dir = 'up'
    }    
    if (targetAngle > -0.75 && targetAngle < 0.75) {
        
        dir = 'right' 
    }   
 
    if (!game.input.keyboard.isDown(Phaser.Keyboard.W)  && !game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) { //!cursors.up.isDown
        if (targetAngle > 2.5 || targetAngle < -2.5) {      
            sprite.frame = 9;
        
        }
        if (targetAngle < 2.5 && targetAngle > 0.75) {       
            sprite.frame = 18;
        
        }
        if (targetAngle < -0.75 && targetAngle > -2.5) {
            sprite.frame = 0;
        
        }    
        if (targetAngle > -0.75 && targetAngle < 0.75) {
            sprite.frame = 27;  
            
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
           
        }

    });

    enemiesAlive = 0;

    for (var i = 0; i < enemies.length; i++)
    {
        if (enemies[i].alive)
        {
            enemiesAlive++;
            game.physics.arcade.collide(sprite, enemies[i].skeleton, change, null, this);
            game.physics.arcade.overlap(bullets, enemies[i].skeleton, hitEnemy, null, this);
            game.physics.arcade.collide(bullets, enemies[i].skeleton, change, null, this);
            enemies[i].update();
        }
    }

    game.physics.arcade.collide(bullets, bullets, change, null, this);
    game.physics.arcade.collide(bullets, sprite, change, null, this);
    game.physics.arcade.collide(bullets, sprite, change, null, this);
   
    game.physics.arcade.overlap(bullets, boxes, breakBox, null, this);
    game.physics.arcade.collide(bullets, boxes, change, null, this);
    game.physics.arcade.collide(sprite, boxes);

    game.physics.arcade.overlap(enemy1, bullets, hitEnemy, null, this);
    
    p2.y = sprite.y;           
    p2.x = sprite.x;
    target.body.velocity.y = sprite.body.velocity.y;
    target.body.velocity.x = sprite.body.velocity.x;
   // console.log(shoot)
    if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
        //target.position.rotate(p2.x, p2.y, -6, true, 100);
    }

    // if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
    //     target.position.rotate(p2.x, p2.y, -6, true, 100);
    // }

   
    else if ( game.input.keyboard.isDown(Phaser.Keyboard.D))  //cursors.right.isDown ||
    {
        //p1.rotate(p2.x, p2.y, 3, true);
        target.position.rotate(p2.x, p2.y, 6, true, 100);
    }    
    else if (game.input.keyboard.isDown(Phaser.Keyboard.A))   //cursors.left.isDown || 
    {
       // p1.rotate(p2.x, p2.y, -3, true);
      // console.log('l');
        target.position.rotate(p2.x, p2.y, -6, true, 100);
        
    }
     if (game.input.keyboard.isDown(Phaser.Keyboard.W) && !shoot  && !shield.visible)                                   //(cursors.up.isDown && !shoot)
    {
        if (!shieldUp) {
        if (dir === "left") {
       
        sprite.animations.play('walk-left', 50, true);
     
        }

        if (dir === "down") {
            
            sprite.animations.play('walk-down', 50, true);
        
        }
        if (dir === "up") {
            sprite.animations.play('walk-up', 50, true);
        
        }    
        if (dir === "right") {
        
            sprite.animations.play('walk-right', 50, true);       
        
        }
        sprite.body.velocity.y = (target.y - sprite.y) * 2; //* 10;           
        sprite.body.velocity.x = (target.x - sprite.x) * 2;
        
    }
    }   

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        if (!shield.visible) {
        fireBullet();
        //cursors.up.enabled = false;
            bow.visible = true;
        if (shootDir != dir) shoot = false;

        sprite.body.velocity.x = 0;
        sprite.body.velocity.y = 0;
        
        if (!shoot) {
            shootDir = dir;
           
        sprite.loadTexture('guy-fire', 0);
        sprite.animations.add('fire-up',[1,2,3,4,5,6,7,8,9,10,11,12]);
        bow.animations.add('fire-up',[1,2,3,4,5,6,7,8,9,10,11,12]);
      //  sprite.animations.add('fire-up',[0,1,2,3,4,5,6,7,8]);
       // sprite.animations.add('fire-left', [13,14,15,16,17,18,19,20,21,22,23,24,25]);
       // sprite.animations.add('fire-left', [9,10,11,12,13,14,15,16,17]);
        sprite.animations.add('fire-left', [14,15,16,17,18,19,20,21,22,23,24,25]);
        bow.animations.add('fire-left', [14,15,16,17,18,19,20,21,22,23,24,25]);
      //  sprite.animations.add('fire-down', [18,19,20,21,22,23,24,25,26]);
        sprite.animations.add('fire-down', [27,28,29,30,31,32,33,34,35,36,37,38]);
        bow.animations.add('fire-down', [27,28,29,30,31,32,33,34,35,36,37,38]);
        //sprite.animations.add('fire-right', [27,28,29,30,31,32,33,34,35]);
        sprite.animations.add('fire-right', [40,41,42,43,44,45,46,47,48,49,50,51]);
        bow.animations.add('fire-right', [40,41,42,43,44,45,46,47,48,49,50,51]);
        console.log(dir);
    
        switch(dir) {
            case 'up': sprite.animations.play('fire-up', 50, true);
            bow.animations.play('fire-up', 50, true);
            break;
            case 'left': sprite.animations.play('fire-left', 50, true);
            bow.animations.play('fire-left', 50, true);
            break;
            case 'down': sprite.animations.play('fire-down', 50, true);
            bow.animations.play('fire-down', 50, true);
            break;
            case 'right': sprite.animations.play('fire-right', 50, true);
            bow.animations.play('fire-right', 50, true);
            break;        
    
        }
        /*
        if (dir === "up") {
            sprite.animations.play('fire-up', 50, true);
        }
        /*if (targetAngle < -0.75 && targetAngle > -2.5) {
            sprite.animations.play('fire-up', 50, true);
        }    
        if (dir === "left") {
            sprite.animations.play('fire-left', 50, true);
        }
        if (dir === "down") {
            sprite.animations.play('fire-down', 50, true);
           // sprite.animations.play('fire-right', 50, true);
        }
        if (dir === "right") {
           // sprite.animations.play('fire-right', 50, true);
            sprite.animations.play('fire-right', 50, true); 
        }
        */
        shoot = true;
    }
    }
    }
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
    {
        if (!shield.visible) {
            sprite.animations.stop("walk-up");
            sprite.animations.stop("fire-left");
            sprite.body.velocity.x = 0;
            sprite.body.velocity.y = 0;
        }
        shield.visible = true;
        shield.animations.play('shields', 50, true);
        shieldUp = true;
        //console.log("SHIFT")
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
   /* var zone = game.camera.deadzone;

    game.context.fillStyle = 'rgba(255,0,0,0.6)';
    game.context.fillRect(zone.x, zone.y, zone.width, zone.height);

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(sprite, 32, 500);*/
}
        
function fireBullet () {
   


    if (game.time.now > bulletTime)
    {
        bullet = bullets.getFirstExists(false);

        if (bullet)
        {
            //bullet.reset(sprite.x , sprite.y - 50);
            //bullet.reset(p1.x , p1.y);
           // bullet.reset(target.x + target.width/2 , target.y + target.height/2);
            bullet.reset(sprite.x , sprite.y);
            //bullet.body.velocity.y = -600;
            //bullet.body.velocity.y = (p1.y - 300) * 10;
            bullet.body.velocity.y = (target.y - sprite.y) * 10;
            //bullet.body.velocity.x = sprite.angle * 10;
           // bullet.body.velocity.x = (p1.x - 400) * 10;
            bullet.body.velocity.x = (target.x - sprite.x) * 10;
            bulletTime = game.time.now + 150;
           // bullet.anchor.setTo(0.5);
            bullet.lifespan = 5000;
            //bullet.addChild(emitterBullet);
            
            
           // const rnd = Math.floor(Math.random() * 4);
/*
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
            }*/
            targetAngle = game.physics.arcade.angleBetween(sprite, target);
            console.log('targ: '+targetAngle)
            //bullet.rotate = targetAngle;
            bullet.rotation = targetAngle;
            bullet.angle += 140;
            console.log(bullet.angle)

            bullet.damageAmount = 10;
        }
    }

    

}   

function resetBullet (bullet) {

    bullet.kill();

}

//  Called if the bullet hits one of the veg sprites
function collisionHandler (bullet, veg) {

    bullet.kill();
    

}

function change(a, b) {
    //console.log(a)

    const rnd = Math.floor(Math.random() * 12);
    if (rnd > 10) a.body.velocity.x = 100; 
    if (rnd < 2) a.body.velocity.x = -100;  
    if (rnd > 7) a.body.velocity.y = 200; 
    if (rnd < 2) a.body.velocity.y = -200;  
    setTimeout(() => {
        a.body.velocity.setTo(0);
    }, 1000);


    emitterBullet.x = a.x;
    emitterBullet.y = a.y;
    emitterBullet.start(true, 4000, null, 2);
    

}


function particleBurst() {
    emitter.y = -200;
    emitter.angle = sprite.angle/100;
    emitter.start(true, 4000, null, 2);
}

function hitBullet(bullet) {
  
   
    if (Math.abs(bullet.body.velocity.y) > 10 && Math.abs(bullet.body.velocity.x) > 10) {
        //console.log("hit")
        const rnd = Math.floor(Math.random() * 12 + 1);
        if(rnd % 2 === 0) {            
            bullet.body.angularVelocity *= 5; 
        }
        if(rnd % 3 === 0 || rnd % 6 === 0) bullet.body.angularAcceleration = 600;
        if(rnd % 4 === 0 || rnd & 5 === 0) bullet.body.angularAcceleration = -600;
    } else {
      
        if (bullet.body.velocity.x > 0) {
            bullet.body.velocity.x = 100;
        } else {
            bullet.body.velocity.x = -100;
        } 
        
    }     
}

function createBoxesL(total, y) {
    for (let i = 0; i < total; i++) {
      
        box = boxes.create(boxSpacing * i, y, 'crate');
        box.width = boxWidth;
        box.height = boxHeight;
    
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
        
        box.body.allowGravity = 0;
        box.body.immovable = true;
        box.health = 30;
    }
}

function breakBox(a, b) {
 

    b.tint= 0xff0000;
    setTimeout(()=>{b.tint= 0xffffff}, 100);
    b.damage(bullet.damageAmount);

    if (b.health < 10) {
        emitterSmoke.x = a.x;
        emitterSmoke.y = a.y;
        emitterSmoke.start(true, 4000, null, 2);
    }  
    
    emitter.y = a.y;
    emitter.x = a.x;
   // emitter.angle = sprite.angle/100;
    emitter.start(true, 4000, null, 2)
    //particleBurst()
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

function hitEnemy(b, a) {
  //  console.log(b)
   // a.kill()
    b.tint= 0xff0000;
    setTimeout(()=>{b.tint= 0xffffff}, 100);
    b.damage(bullet.damageAmount);
    //b.damage(1);

    if (b.health < 10) {       

        var explosion = explosions.getFirstExists(false);
        explosion.reset(b.x, b.y);
    
        explosion.play('explosion', 30, false, true);
        a.kill();
    }
}
        