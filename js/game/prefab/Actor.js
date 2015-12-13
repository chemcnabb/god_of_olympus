var Actor = function(game, x, y, sprite) {
    // The super call to Phaser.Sprite
    this.direction = "down";
    this.is_moving = false;
    Phaser.Sprite.call(this, game, x, y, sprite);
    this.game.physics.p2.enable(this, true);
    this.body.fixedRotation = true; // no rotation

    this.frame = 0;
    this.anchor.setTo(0.5);
    this.scale.setTo((this.height/2)*0.0012);
    this.animations.add('left', [2], 1, true);
    this.animations.add('right', [1], 1, true);
    this.animations.add('up', [3], 1, true);
    this.animations.add('down', [0], 1, true);
    this.alive = true;


    this.battleX = 200;
    this.battleY = 200;
    this.battleDirection = "left";



    //this.body.setSize(this.width, 15, 0, 0);
    this.body.setRectangle(this.width, 15, 0, 0);



};

Actor.prototype = Object.create(Phaser.Sprite.prototype);

Actor.prototype.update = function(){
    //this.body.velocity.y = 0;
    //this.body.velocity.x = 0;
    this.animations.play(this.direction);
//    if(this.alive && this.is_moving == true) {
//        //player movement
//
//
//        if(this.direction == "up") {
//            this.body.velocity.y -= 75;
//            //this.scale.setTo(this.y*0.0012)
//        }
//        if(this.direction == "down") {
//            this.body.velocity.y += 75;
//            //this.scale.setTo(this.y*0.0012);
//        }
//        if(this.direction == "left") {
//            this.body.velocity.x -= 125;
//        }
//        if(this.direction == "right") {
//            this.body.velocity.x += 125;
//        }
//
//}
};

