
Enemy = function (game, x, y, key) {
    Actor.call(this, game, x, y, key);
    this.attributes = Olympus.Globals.attributes;
    this.anim = this.game.add.tween(this);
    this.hitArea = new Phaser.Rectangle(0, 0, 20, 20);
    this.battleRest = "left";

};

Enemy.prototype = Object.create(Actor.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.enablePhysics = function(){
    this.game.physics.p2.enable(this, true);
    this.body.fixedRotation = true; // no rotation
    this.body.setRectangle(this.width-8, 15, 0, (this.height/2)-7.5);
}



Enemy.prototype.move = function () {

    //this.is_moving = false;

    //if(this.cursors.up.isDown && (this.y > 300)) {
    //    this.direction = "up";
    //    this.is_moving = true;
    //}
    //else if(this.cursors.down.isDown && (this.y  < 630)) {
    //    this.direction = "down";
    //    this.is_moving = true;
    //}
    //else if(this.cursors.left.isDown) {
    //    this.direction = "left";
    //    this.is_moving = true;
    //}
    //else if(this.cursors.right.isDown) {
    //   this.direction = "right";
    //    this.is_moving = true;
    //}

};