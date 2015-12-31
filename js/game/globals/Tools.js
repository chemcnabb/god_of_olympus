var Olympus = Olympus || {};
Olympus.Tools = function(){
    this.mapWidth=this.game.width;
    this.mapHeight=this.game.height;

};
//Olympus.Tools.prototype = Object.create(Phaser.Sprite.prototype);

Olympus.Tools.zoom = function(delta, x, y, that) {

    that.game.camera.focusOnXY(x,y);
    var oldScale = that.game.world.scale.x;  // We always scale both co-ordinates equally.
    var scale = oldScale + delta;
    // Don't zoom out if the whole world is visible (clip it right on the edge).
    scale = Math.max(scale, that.game.camera.view.width / this.mapWidth);
    scale = Math.max(scale, that.game.camera.view.height / this.mapHeight);
    var scaleCoef = scale / oldScale;
    var scaledMouseX = that.game.input.mousePointer.worldX * scaleCoef;
    var scaledMouseY = that.game.input.mousePointer.worldY * scaleCoef;
    var deltaMouseX = scaledMouseX - that.game.input.mousePointer.worldX;
    var deltaMouseY = scaledMouseY - that.game.input.mousePointer.worldY;
    that.game.world.scale.set(scale);
    that.game.world.width = scale * this.mapWidth;
    that.game.world.height = scale * this.mapHeight;
    that.game.camera.setBoundsToWorld();
    that.game.camera.focusOnXY(
        that.game.camera.view.centerX + deltaMouseX,
        that.game.camera.view.centerY + deltaMouseY
    );
};