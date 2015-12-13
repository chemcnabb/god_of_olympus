var Olympus = Olympus || {};

var stateCounter = 0;
Olympus.Game = function (game) {
    console.log('init');
    // score
    this.score = 0;
    if(this.playerstats == undefined){
        this.playerstats = ActorStats;
    }

    // settings
    this.playerMaxY = null;
    this.playerMaxAngle = 20;
    this.playerMinAngle = -20;
    this.previousCoinType = null;
    this.coinSpacingX = 10;
    this.coinSpacingY = 10;
    this.spawnX = null;


};

Olympus.Game.prototype = {
    init: function(params){
        console.log("game state initted");
        this.params = params;
        if (this.params != undefined){
            this.playerstats = this.params.playerstats;
        }


    },
    create: function () {



//  The 'mario' key here is the Loader key given in game.load.tilemap
        map = this.game.add.tilemap('world');

        //  The first parameter is the tileset name, as specified in the Tiled map editor (and in the tilemap json file)
        //  The second parameter maps this name to the Phaser.Cache key 'tiles'
        map.addTilesetImage('water-tileset', 'water');


        map.addTilesetImage('ground-tileset', 'ground');


        //  Creates a layer from the World1 layer in the map data.
        //  A Layer is effectively like a Phaser.Sprite, so is added to the display list.
        layer = map.createLayer('world');


        //  This resizes the game world to match the layer dimensions
        layer.resizeWorld();























        this.game.time.advancedTiming = true;




        this.game.world.setBounds(0,0, 4096,4096);





        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        if(this.params != undefined){
            this.player = new Hero(this.game, this.params.playerX, this.params.playerY);
        }else{
            this.player = new Hero(this.game, this.game.world.width/2+100, this.game.world.height/2);
            this.enemy = new Enemy(this.game, this.game.world.width/2-100, this.game.world.height/2+190, 'enemy');
            this.game.add.existing(this.enemy);
        }
        this.game.add.existing(this.player);
        this.enemy.bringToTop();

        this.scoreText = this.game.add.bitmapText(10,10, 'Diogenes', 'Score: ' + this.score, 24);

        this.game.camera.follow(this.player);

    },
    update: function () {

        this.player.move();

        if (this.player.y > this.enemy.y){
            this.player.bringToTop();
        }else{
            this.enemy.bringToTop();
        }

        if(this.game.physics.arcade.collide(this.player, this.enemy)){
            console.log(this.playerstats);
            this.playerstats.currentenemy = this.enemy;

            this.state.start('Battle', true, false, {playerX:this.player.x, playerY:this.player.y, playerstats:this.playerstats});
        }
    },
    shutdown: function() {
        console.log('shutting down');
        //this.coins.destroy();
        //this.enemies.destroy();
        //this.scoreboard.destroy();
        //this.score = 0;
        //this.coinGenerator.timer.destroy();
        //this.enemyGenerator.timer.destroy();
    },
    render:function(){
        this.game.debug.cameraInfo(this.camera, 32, 32);
        this.game.debug.spriteCoords(this.player, 32, 500);
    }
};