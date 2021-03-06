EnemySkeleton = function (index, game, player, bullets) {   

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
    this.shoot = false;
    this.targetAngle = null;
    this.shootDir = null;

    this.skeleton = game.add.sprite(x, y, 'skeleton', 0);
    this.skeleton.enableBody = true;  
    this.skeleton.anchor.setTo(0.5);

    this.skeleton.width = sprite.width;
    this.skeleton.height = sprite.height;
   
    this.skeleton.anchor.set(0.5);
   
    this.skeleton.name = index.toString();
    game.physics.enable(this.skeleton, Phaser.Physics.ARCADE);
    this.skeleton.body.immovable = false;
    this.skeleton.body.collideWorldBounds = true;
    
    this.skeleton.body.allowGravity = false;

    this.skeleton.health = 30;
    this.skeleton.body.bounce.set(0.8);

    this.changeDir();   

    this.skeleton.animations.add('walk-up', [0,1,2,3,4,5,6,7,8]);
    this.skeleton.animations.add('walk-left', [9,10,11,12,13,14,15,16,17]);
    this.skeleton.animations.add('walk-down', [18,19,20,21,22,23,24,25,26]);
    this.skeleton.animations.add('walk-right', [27,28,29,30,31,32,33,34,35]);

    this.skeleton.animations.add('skel-fire-up',[0,1,2,3,4,5,6]);    
    this.skeleton.animations.add('skel-fire-left', [7,8,9,10,11,12,13]);    
    this.skeleton.animations.add('skel-fire-down', [14,15,16,17,18,19,20]);    
    this.skeleton.animations.add('skel-fire-right', [21,22,23,24,25,26,27]); 
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

    if (this.skeleton.alive && this.walking) {
        setTimeout(this.changeDir.bind(this), 5000);
    }
}

EnemySkeleton.prototype.update = function() {
  
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
        this.targetAngle = game.physics.arcade.angleBetween(this.skeleton, sprite);              
         
        if (this.targetAngle > 2.5 || this.targetAngle < -2.5) {                   
            this.dir = 'left'
        }
        if (this.targetAngle < 2.5 && this.targetAngle > 0.75) {                 
            this.dir = 'down'
        }
        if (this.targetAngle < -0.75 && this.targetAngle > -2.5) {            
            this.dir = 'up'
        }    
        if (this.targetAngle > -0.75 && this.targetAngle < 0.75) {             
            this.dir = 'right' 
        }  

        if (this.dir !== this.shootDir) {
            this.shoot = false;
        }

        if(!this.shoot) {
         
            this.skeleton.loadTexture('skeleton-fire', 0);  
            this.skeleton.body.velocity.setTo(0);

            this.shootDir = this.dir;
            
            switch(this.dir) {
                case 'up': 
                this.skeleton.animations.play('skel-fire-up', 20, true);              
                break;
                case 'right': 
                this.skeleton.animations.play('skel-fire-right', 20, true);
                break;
                case 'down':
                this.skeleton.animations.play('skel-fire-down', 20, true);
                break;
                case 'left': 
                this.skeleton.animations.play('skel-fire-left', 20, true); 
                break;
            }
        }
        this.walking = false;
        this.shoot =  true;
       
        if (this.game.time.now > this.nextFire) 
        {
            this.nextFire = this.game.time.now + this.fireRate;
            var bullet = this.bullets.getFirstExists(false);
            if (bullet && this.skeleton.alive) {
         
                bullet.reset(this.skeleton.x, this.skeleton.y);                
                bullet.play('explosion', 30, true, true);  
                bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);               
                bullet.lifespan = 5000;
                disableBullet(bullet); 
                bullet.damageAmount = 10;
                bullet.anchor.setTo(0.5);                             
            }
        }
    }

    else if (this.game.physics.arcade.distanceBetween(this.skeleton, this.player) > 300) {
        if (!this.walking) {
            this.skeleton.loadTexture('skeleton', 0);
        }

        this.walking = true;
        this.shoot = false;        
    }
};

var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

WebFontConfig = {

    active: function() { game.time.events.add(Phaser.Timer.SECOND, createText, this); },

    google: {
      families: ['Fontdiner Swanky']
    }
};


function preload() {

    game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
   // game.load.image('bullet', 'assets/ball.png');
    game.load.image('bullet', 'assets/Crossbow_Bolt.png');
    game.load.image('ship', 'assets/ship.png');

    game.load.image('diamond', 'assets/explode.png');
   // game.load.spritesheet('explosion', 'assets/explode.png', 64, 64, 16);

    game.load.spritesheet('fireball', 'assets/fire-ball-sheet.png', 341, 341, 7);

    //game.load.image('spark1', 'assets/Spark1_I.jpg')
    game.load.spritesheet('sparks2', 'assets/sparks.png', 200, 200, 57);
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
    game.load.spritesheet('skeleton-fire', 'assets/BODY_skeleton-fire.png', 64, 64, 28);

    game.load.image('target', 'assets/target.gif');

}   

var sprite;
var bullets;

var cursors;
var shield;

var bow;

var bulletTime = 0;
var bullet;

var target;
var dir;

var emitter;
var emitterBullet;
var emitterShield;

var tilesprite;
var count = 0;
var shoot = false;
var shootDir;

var boxes;
var box;
var boxWidth = 40;
var boxHeight = 40;
var boxSpacing = 75;

var text = null;
var grd;

var timer;
var charge = false;
function create() {

    game.world.setBounds(0, 0, 2048, 1325);
    game.physics.startSystem(Phaser.Physics.ARCADE);
   
    tilesprite = game.add.tileSprite(0, 0, 800, 600, 'starfield');
 
    tilesprite.fixedToCamera = true;

    game.physics.arcade.gravity.y = 0;
    game.physics.arcade.gravity.x = 0;
   
    sprite = game.add.sprite(1500, 650, 'guy');

    bow = game.add.sprite(0, 0, 'bow');
    sprite.addChild(bow);
    bow.x -= sprite.width/2;
    bow.y -= sprite.height/2
    bow.visible = false;

    sprite.animations.add('walk-up', [0,1,2,3,4,5,6,7,8]);
    sprite.animations.add('walk-left', [9,10,11,12,13,14,15,16,17]);
    sprite.animations.add('walk-down', [18,19,20,21,22,23,24,25,26]);
    sprite.animations.add('walk-right', [27,28,29,30,31,32,33,34,35]);

    sprite.width = 100;
    sprite.height = 100;
    sprite.enableBody = true;
    
    target = game.add.sprite(sprite.x + 100, sprite.y, 'target');
    target.width = 50;
    target.height = 50;
   
    target.enableBody = true;
    game.physics.enable(target, Phaser.Physics.ARCADE);    
  
    shield = game.add.sprite(0 - sprite.width/2, 0 - sprite.height/2, "shield");
    sprite.addChild(shield)
    shield.animations.add('shields');
    shield.visible = false;
    shield.enableBody = true;

    shield.width = sprite.width;
    shield.height = sprite.height;

    game.physics.enable(shield, Phaser.Physics.ARCADE);
    shield.health = 70;
    shield.maxHealth = 70
    shield.body.immovable = true;
    
    game.physics.enable(sprite, Phaser.Physics.ARCADE);
    sprite.body.allowGravity = false;
    sprite.body.collideWorldBounds = true;
    sprite.anchor.setTo(0.5);
    sprite.health = 500;
  
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
    
    enemyBullets.setAll('anchor.x', 0.5);
    enemyBullets.setAll('anchor.y', 0.5);
    enemyBullets.setAll('outOfBoundsKill', true);
    enemyBullets.setAll('checkWorldBounds', true);

    for (var j = 0; j < 100; j++) {
        var b = enemyBullets.create(0, 0, 'explosion');
        b.width = 30;
        b.height = 30;
        b.name = 'bulletE' + j;
        b.exists = false;       
        b.visible = false;  
        b.animations.add('explosion', [0,1,2,3,4,5,6]);       
    }    

    enemies = [];
    enemiesTotal = 20;
    enemiesAlive = 20;

    for (var i = 0; i < enemiesTotal; i++)
    {
        enemies.push(new EnemySkeleton(i, game, sprite, enemyBullets));        
    }

    boxes = game.add.group();
    boxes.enableBody = true;    
  
    game.physics.enable(boxes, Phaser.Physics.ARCADE);    

    createBoxesL(4, 100, 80);
    createBoxesL(2, 400, 175);    
    createBoxesL(6, 500, 500);
    createBoxesL(3, 1000, 370);

    createBoxesR(4, 2000, 250);
    createBoxesR(3, 1500, 350);
    createBoxesR(4, 800, 75);    
    createBoxesR(3, 600, 500);

    for (var i = 0; i < 50; i++)
    {
        var b = bullets.create(0, 0, 'bullet');
        b.name = 'bullet' + i;
        b.width = 50;
        b.height = 50;
        b.exists = false;
        b.visible = false;      
        b.body.bounce.set(0.8);       
        b.anchor.setTo(0.5);              
    }

    emitter = game.add.emitter(0, 0, 300);

    //const frames = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]
    const frames = [];
    for (var k = 0; k < 57; k++) {
        frames.push(k);
    }
    emitter.makeParticles('explosion', frames);
    emitter.gravity = 100;
    
    emitter.setAlpha(0.5, 1, 1000);
    emitter.setScale(0.4, 0, 0.4, 0.4, 500);    
    
    const framesBullet = [0,1,2, 3,4,5,6,7,8,9, 10,11,12, 13];
    const frames2 = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];

    emitterBullet = game.add.emitter(0, 0, 300);
    emitterBullet.makeParticles('sparks2', frames);
    emitterBullet.gravity = 100;    
    emitterBullet.setAlpha(0.5, 1, 1000);  
    emitterBullet.setScale(0.4, 0, 0.4, 0, 500);

    emitterShield = game.add.emitter(0, 0, 300);
    emitterShield.makeParticles('sparks', frames);
    emitterShield.setAlpha(0.5, 1, 1000);

    emitterSmoke = game.add.emitter(0, 0, 300);
    emitterSmoke.makeParticles('smoke', frames2);
    emitterSmoke.setScale(.8, .5, .8, .5, 500);
    
    game.input.keyboard.onUpCallback = function(e) {            
        if(e.keyCode == Phaser.Keyboard.W){   
            sprite.body.velocity.y = 0;
            sprite.body.velocity.x = 0;
        }
        if(e.keyCode == Phaser.Keyboard.SHIFT){ 
            if (shield.visible) {           
                shield.visible = false;               
                shield.animations.stop('shields', true);
            }
        }
        if(e.keyCode == Phaser.Keyboard.SPACEBAR){  
            sprite.loadTexture('guy', 0);
            shoot = false;
            bow.visible = false;
        }
    }
  
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
    game.camera.deadzone = new Phaser.Rectangle(250, 200, 300, 200);
    game.camera.focusOnXY(sprite.x, sprite.y);
}        

function update() {  
 
    tilesprite.tilePosition.x = -game.camera.x;
    tilesprite.tilePosition.y = -game.camera.y;
    
    if (shield.health < shield.maxHealth && !charge && shield.alive) {        
        timer = setInterval(function() {shield.health++}, 200);
        charge = true;
    } else if (!shield.alive || shield.health === shield.maxHealth || !sprite.alive) {
        clearInterval(timer);
        charge = false;
    }

    targetAngle = game.physics.arcade.angleBetween(sprite, target);
   // dirAngle(targetAngle, dir);
    
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
    
    if (!game.input.keyboard.isDown(Phaser.Keyboard.W)  && !game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) { 
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
            game.physics.arcade.overlap(bullets, enemies[i].skeleton, hitEnemy, checkDis, this);
            game.physics.arcade.collide(bullets, enemies[i].skeleton, change, null, this);
            game.physics.arcade.overlap(enemyBullets, enemies[i].skeleton, hitEnemy, checkDis, this);
            enemies[i].update();
        }
    }

   // game.physics.arcade.collide(bullets, bullets, change, null, this);
  //  game.physics.arcade.collide(bullets, sprite, change, null, this);
    //game.physics.arcade.collide(bullets, sprite, change, null, this);
   
    game.physics.arcade.overlap(bullets, boxes, breakBox, checkDis, this);
    game.physics.arcade.collide(bullets, boxes, change, null, this);
    game.physics.arcade.collide(sprite, boxes);

    game.physics.arcade.overlap(enemyBullets, shield, hitShield, checkDis, this);
    game.physics.arcade.overlap(enemyBullets, sprite, hitPlayer, checkDis, this);
       
    target.body.velocity.y = sprite.body.velocity.y;
    target.body.velocity.x = sprite.body.velocity.x;
   
    if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
        
    }   
    else if ( game.input.keyboard.isDown(Phaser.Keyboard.D)) 
    {        
        target.position.rotate(sprite.x - sprite.width/4, sprite.y, 6, true, 100);
    }    
    else if (game.input.keyboard.isDown(Phaser.Keyboard.A))   
    {        
        target.position.rotate(sprite.x - sprite.width/4, sprite.y, -6, true, 100);        
    }
     if (game.input.keyboard.isDown(Phaser.Keyboard.W) && !shoot)     
    {       
        if (!shield.visible) {
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

            sprite.body.velocity.y = (target.y - sprite.y) * 2;         
            sprite.body.velocity.x = (target.x - sprite.x) * 2;        
        }
    }   

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
    {
        if (!shield.visible) {
            fireBullet();           
            bow.visible = true;

            if (shootDir != dir) shoot = false;

            sprite.body.velocity.x = 0;
            sprite.body.velocity.y = 0;
            
            if (!shoot) {
                shootDir = dir;
            
                sprite.loadTexture('guy-fire', 0);
                sprite.animations.add('fire-up',[0,1,2,3,4,5,6,7,8,9,10,11,12]);
                bow.animations.add('fire-up',[0,1,2,3,4,5,6,7,8,9,10,11,12]);
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
               // console.log(dir);
            
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

                shoot = true;
            }
        }
    }
    
    if (game.input.keyboard.isDown(Phaser.Keyboard.SHIFT))
    {
        if (shield.alive) {
            if (!shield.visible) {
                sprite.animations.stop("walk-up");
                sprite.animations.stop("fire-left");
                sprite.body.velocity.x = 0;
                sprite.body.velocity.y = 0;
            }
            shield.visible = true;
            shield.animations.play('shields', 50, true);           
        }
    }
   
    updateText();    
}

function render() {

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
            bullet.reset(sprite.x , sprite.y);
 
            bullet.body.velocity.y = (target.y - sprite.y) * 10;
       
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
            bullet.rotation = targetAngle;            
            bullet.angle -= 40;      
            bullet.damageAmount = 10;
        }
    }
}   

function change(a, b) {    

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
        const rnd = Math.floor(Math.random() * 12 + 1);
        if(rnd % 2 === 0) {            
            bullet.body.angularVelocity *= 5; 
        }
        if(rnd % 3 === 0 || rnd % 6 === 0) bullet.body.angularAcceleration = 300; //600;
        if(rnd % 4 === 0 || rnd % 5 === 0) bullet.body.angularAcceleration = -300; //-600;
    } else {
      
        if (bullet.body.velocity.x > 0) {
            bullet.body.velocity.x = 100;
        } else {
            bullet.body.velocity.x = -100;
        } 
        if (bullet.body.velocity.y > 0) {
            bullet.body.velocity.y = 100;
        } else {
            bullet.body.velocity.y = -100;
        } 
        
    }     
}

function createBoxesL(total, x, y) {

    for (let i = 0; i < total; i++) {
      
        box = boxes.create(x + boxSpacing * i, y, 'crate');
        box.width = boxWidth;
        box.height = boxHeight;
    
        box.body.allowGravity = false;
        box.body.immovable = true;
        box.health = 30;
    }
}

function createBoxesR(total, x, y) {

    for (let i = total - 1; i >= 0; i--) {       
        box = boxes.create(x - boxWidth - (boxSpacing * i), y, 'crate');
        box.width = boxWidth;
        box.height = boxHeight;
        
        box.body.allowGravity = false;
        box.body.immovable = true;
        box.health = 30;
    }
}

function breakBox(a, b) {

    flash(b);
    b.damage(bullet.damageAmount);
    disableBullet(a);

    if (b.health < 10) {
        emitterSmoke.x = a.x;
        emitterSmoke.y = a.y;
        emitterSmoke.start(true, 4000, null, 2);
    }  
}

function hitEnemy(b, a) {

    flash(b);
    
    applyVel(a);

    b.damage(a.damageAmount);
 
    if (b.health < 1) {   
        var explosion = explosions.getFirstExists(false);
        explosion.reset(b.x, b.y);    
        explosion.play('explosion', 30, false, true);
        a.kill();
    }

    disableBullet(a);
}

function dirAngle(angle, angleDir) {

    if (angle > 2.5 || angle < -2.5) {      
        
        angleDir = 'left'
    }
    if (angle < 2.5 && angle > 0.75) {       
      
        angleDir = 'down'
    }
    if (angle < -0.75 && angle > -2.5) {
       
        angleDir = 'up'
    }    
    if (angle > -0.75 && angle < 0.75) {
        
        angleDir = 'right' 
    }   
}

function hitShield(a, b) {  

    if (shield.visible && shield.alive) { 
       // hitBullet(b);
        shield.damage(b.damageAmount);
        emitterShield.x = sprite.x;
        emitterShield.y = sprite.y;
        emitterShield.start(true, 4000, null, 2);
        //change(b, shield);
        if (shield.health < 1) {
            shield.health = 0;
            shield.visible = false;
            emitterShield.x = sprite.x;
            emitterShield.y = sprite.y;
            emitterShield.start(false, 4000, 2);
            setTimeout(() => {
                emitterShield.on = false;                
                shield.reset(0 - sprite.width/2, 0 - sprite.height/2, 1);               
                shield.visible = false;
                shield.animations.stop('shields', true);               
            }, 3000);
        }        
        
        applyVel(b);
      
        disableBullet(b);      
    } 
}

function disableBullet(b) {
 
    if (!b.dis) {
        b.dis = true;       
        setTimeout(() => {
            b.dis = false;           
        }, 200);
    }  
}

function checkDis(a, b) {

    if (!b.dis) {
        return true;
    }
    return false;
}

function hitPlayer(a, b) {

    if (!shield.visible || !shield.alive) {
        sprite.damage(b.damageAmount);
        flash(sprite);
        b.kill();
        change(a, b);
    }
}

function flash(a) {

    a.tint= 0xff0000;
    setTimeout(()=>{a.tint= 0xffffff}, 100);
}

function applyVel(obj) {

    obj.body.velocity.x *= (-1);
    obj.body.velocity.y *= (-1);
    const rnd = Math.floor(Math.random() * 4);
    let posX = false;
    let posY = false;

    if (obj.body.velocity.x > 0) {
        posX = true;
    }
    if (obj.body.velocity.y > 0) {
        posY = true;
    }
    var output;
    //var angle = obj.angle;
    var rnd2 = Math.floor(Math.random () * 2);
    var angle = 0;
    if (rnd2 === 1) angle = 1;
    if (rnd2 === 0) angle = -1;
   
    if (rnd === 0) {
         output = 200;
        // angle += 60;
    }     
    if (rnd === 1) {
        output = 400; 
       // angle += -60;
    }     
    if (rnd === 2) {
        output = 500;
       // angle += 90;
    }    
    if (rnd === 3) {
        output = 300;
      //  angle += -90;
    }    
    velX = output * angle;
    velY = output //* angle;
 
    if (!posX) velX *= (-1); 
    if (!posY) velY *= (-1); 
    obj.body.velocity.x = velX;
    obj.body.velocity.y = velY;   
}

function createText() {

    text = game.add.text(670, 450, "Shields: "+shield.health); 
    text.anchor.setTo(0.5);

    text.font = 'Fontdiner Swanky';
    text.fontSize = 36;

    text.padding.set(8, 12);

    grd = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
    grd.addColorStop(0, '#8ED6FF');   
    grd.addColorStop(1, '#004CB3');
    text.fill = grd;
   
    text.align = 'center';
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);
    text.fixedToCamera = true;
}

function updateText() {

    if (text) {
        text.setText("Shields: "+shield.health+"\nHealth: "+sprite.health);
    }
}
