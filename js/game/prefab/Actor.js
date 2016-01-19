var Actor = function(game, x, y, sprite) {
    // The super call to Phaser.Sprite
    this.game = game;
    this.direction = "down";
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
    this.message = "";
    this.battleRest = "";
    this.menu_open = false;
    this.selectedAction = "";
    this.menu_items = ['Power', 'Examine', 'Bow', 'Abilities', 'Magic', 'Sword'];

};

Actor.prototype = Object.create(Phaser.Sprite.prototype);

Actor.prototype.getCircularX = function (x, radius, index, menu_items) {
    return x + radius * Math.cos(2 * Math.PI * index / menu_items.length);
};
Actor.prototype.getCircularY = function (y, radius, index, menu_items) {
    return y + radius * Math.sin(2 * Math.PI * index / menu_items.length);
};


Actor.prototype.buttonClick = function () {
    console.log(this.items.item[this.selectedAction]);
    this.menu_open = false;
    this.currentWeapon = this.selectedAction;
    this.selectedAction = "";
    this.playerMenu.destroy();

};

Actor.prototype.showMenu = function () {

    if(this.menu_open == false && this.game.globals.performing == false) {

        this.menu_open = true;

        this.playerMenu = this.game.add.group();

        this.game.world.bringToTop(this.playerMenu);

        var innerCircleRadius = 140;

        for (var i = 0; i < this.menu_items.length; i++) {

            var chairOriginX = this.getCircularX(this.originX+this.width/2, innerCircleRadius, i, this.menu_items);

            var chairOriginY = this.getCircularY(this.originY-this.height/2, innerCircleRadius, i, this.menu_items);

            var chairWidth = 69;

            var button = new LabelButton("menu_" + this.menu_items[i].toLowerCase(), this.game, this.originX, this.originY, "button", this.menu_items[i]);

            button.alpha = 0;

            this.selectedAction = this.menu_items[i];


            button.onInputOver.add(function(){
                this.scale.setTo(1.25);
            }, button);

            button.onInputOut.add(function(){
                this.scale.setTo(1);
            }, button);

            button.onInputDown.add(this.buttonClick, this);



            this.game.add.tween(button).to({
                x: chairOriginX,
                y: chairOriginY,
                alpha: 1
            }, 500, Phaser.Easing.Circular.InOut, true).autoDestroy = true;

            this.playerMenu.add(button);

        }

    }

};


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

Actor.prototype.runDefensiveAnimation = function(){
    this.game.time.events.add(Phaser.Timer.SECOND, (function() {
        this.anim.start();
        this.showMessage(this.message);
    }), this).autoDestroy = true;
}

Actor.prototype.runOffensiveAnimation = function(){
    this.anim.start();
    try{
        this.animations.play('sword_swing', 12, false);
    }catch(e){
        console.log("this.attacker has no animation '" + 'sword_swing' + "'");
    }
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

