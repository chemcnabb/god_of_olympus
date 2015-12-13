
Hero = function (game, x, y) {
    Actor.call(this, game, x, y, 'hero');
    this.cursors = this.game.input.keyboard.createCursorKeys();

};

Hero.prototype = Object.create(Actor.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function () {

    this.is_moving = false;

    if(this.cursors.up.isDown) {
        this.direction = "up";
        this.is_moving = true;
    }
    else if(this.cursors.down.isDown) {
        this.direction = "down";
        this.is_moving = true;
    }
    else if(this.cursors.left.isDown) {
        this.direction = "left";
        this.is_moving = true;
    }
    else if(this.cursors.right.isDown) {
       this.direction = "right";
        this.is_moving = true;
    }

};