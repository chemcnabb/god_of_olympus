var Actor = function(game, x, y, sprite) {
    // The super call to Phaser.Sprite
    this.game = game;
    this.direction = "down";
    this.is_moving = false;
    Phaser.Sprite.call(this, game, x, y, sprite);
    this.originX = null;
    this.originY = null;
    this.healthbar = false;
    this.currentWeapon = null;
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
    this.battleDirection = "right";








};

Actor.prototype = Object.create(Phaser.Sprite.prototype);
Actor.prototype.resetAnim = function(){
    this.game.tweens.remove(this.anim);
    this.anim = this.game.add.tween(this);
};
Actor.prototype.addHealthBar = function (that, barX, barY) {
    // the bar itself
    this.healthbar = that.add.bitmapData(128, 8);

    that.game.add.sprite(barX, barY, this.healthbar);

    this.healthbar.barProgress = 128;


};

Actor.prototype.showMessage = function (message) {

    var style = {
        font: "32px Diogenes",
        fill: "#ff0044",
        wordWrap: true,
        wordWrapWidth: this.width,
        align: "center"
    };
    var text = this.game.add.text(this.x, this.y - (this.height/2), message, style);
    text.anchor.set(0.5);
    text.bringToTop();

    this.game.add.tween(text).to({
        y: text.y - 70,
        alpha: 0
    }, 2000, Phaser.Easing.Linear.None, true).onComplete.add(text.destroy, text);
};

Actor.prototype.updateHealth = function () {
    this.healthbar.context.clearRect(0, 0, this.healthbar.width, this.healthbar.height);

    // some simple colour changing to make it look like a health bar
    if (this.healthbar.barProgress < 32) {
        this.healthbar.context.fillStyle = '#f00';
    }
    else if (this.healthbar.barProgress < 64) {
        this.healthbar.context.fillStyle = '#ff0';
    }
    else {
        this.healthbar.context.fillStyle = '#0f0';
    }

    // draw the bar
    this.healthbar.context.fillRect(0, 0, this.healthbar.barProgress, 8);

    // important - without this line, the context will never be updated on the GPU when using webGL
    this.healthbar.dirty = true;


};

Actor.prototype.update = function(){
    //this.body.velocity.y = 0;
    //this.body.velocity.x = 0;
    //this.animations.play(this.direction);
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

