var Actor = function(game, x, y, sprite) {
    // The super call to Phaser.Sprite
    this.direction = "down";
    this.is_moving = false;
    Phaser.Sprite.call(this, game, x, y, sprite);

    this.frame = 0;
    this.anchor.setTo(0.5);
    this.scale.setTo(this.y*0.0012);
    this.animations.add('left', [2], 1, true);
    this.animations.add('right', [1], 1, true);
    this.animations.add('up', [3], 1, true);
    this.animations.add('down', [0], 1, true);
    this.alive = true;



    this.game.physics.arcade.enableBody(this);
};

Actor.prototype = Object.create(Phaser.Sprite.prototype);

Actor.prototype.update = function(){
    this.body.velocity.y = 0;
    this.body.velocity.x = 0;

    if(this.alive && this.is_moving == true) {
        //player movement
        this.animations.play(this.direction);

        if(this.direction == "up") {
            this.body.velocity.y -= 75;
            this.scale.setTo(this.y*0.0012)
        }
        if(this.direction == "down") {
            this.body.velocity.y += 75;
            this.scale.setTo(this.y*0.0012);
        }
        if(this.direction == "left") {
            this.body.velocity.x -= 125;
        }
        if(this.direction == "right") {
            this.body.velocity.x += 125;
        }

}
};

