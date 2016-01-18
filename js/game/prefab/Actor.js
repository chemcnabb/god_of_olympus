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

    this.battleRest = "";

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

Actor.prototype.performHit = function(damage){
    this.game.add.tween(this.healthbar.barProgress).to({
            barProgress: this.healthbar.barProgress -= damage},
        1000,
        null,
        true).onComplete.add(function(){this.updateHealth()}, this).autoDestroy = true;

};

Actor.prototype.performFlash = function(){
    this.anim.to({alpha: 1}, 1, Phaser.Easing.Cubic.In).autoDestroy = true;
    this.anim.to({alpha: 0}, 100, Phaser.Easing.Cubic.In).autoDestroy = true;
    this.anim.to({alpha: 1}, 1, Phaser.Easing.Cubic.In).autoDestroy = true;
    this.anim.to({alpha: 0}, 100, Phaser.Easing.Cubic.In).autoDestroy = true;
    this.anim.to({alpha: 1}, 1, Phaser.Easing.Cubic.In).autoDestroy = true;
    console.log(this.alpha);
};

Actor.prototype.performDodge = function(){
    var dodgeX = 0;
    if(this.game.globals.actors[0].key == "hero"){
        dodgeX = this.x + this.width/2
    }else{
        dodgeX = this.x - this.width/2;
    }
    this.anim.to({x: dodgeX}, 500, "Quart.easeOut", false).autoDestroy = true;
    this.anim.to({x: this.originX}, 500, "Quart.easeOut", false).autoDestroy = true;
};

Actor.prototype.performAttack = function(target){
    var targetX = 0;
    if(this.game.globals.actors[0].key == "hero"){
        targetX = target.x - this.width/2;
    }else{
        targetX = target.x + this.width/2

    }
    this.anim.to({x: targetX}, 1000, Phaser.Easing.Linear.None, false).autoDestroy = true;
};

Actor.prototype.endAttack = function(){
    this.anim.to({
            x: this.originX},
        120,
        "Quart.easeOut",
        false).onComplete.add(this.attackComplete, this);
};

Actor.prototype.attackComplete = function(){


        this.resetAnim();

        this.game.globals.performing = false;

        this.animations.play(this.battleRest);




        this.game.globals.actors.push(this.game.globals.actors.shift());

        if(this.game.globals.actors[0].key == "hero"){
            this.game.globals.player_round = true;
        }else{
            this.game.state.states.Battle.enemy.currentWeapon = "Sword";
            this.game.globals.player_round = false;
        }

        console.log("tween complete");




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
    this.updateHealth();

};

