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

    this.enemyCollisionGroup = null;
    this.playerCollisionGroup = null;
    this.wallsCollisionGroup = null;


};

Olympus.Game.prototype = {
    init: function(params){
        console.log("game state initted");
        this.params = params;
        if (this.params != undefined){
            this.playerstats = this.params.playerstats;
        }


    },

    addActors: function () {
        if (this.params != undefined) {
            this.player = new Hero(this.game, this.params.playerX, this.params.playerY);
        } else {
            this.player = new Hero(this.game, this.game.world.width / 2 + 100, this.game.world.height / 2);
            this.enemy = new Enemy(this.game, this.game.world.width / 2 - 100, this.game.world.height / 2 + 190, 'enemy');
            this.game.add.existing(this.enemy);
        }
        this.game.add.existing(this.player);
        this.player.bringToTop();
        this.enemy.bringToTop();
    },
    addCollisions: function () {


        collsnObs = this.game.physics.p2.convertTiledCollisionObjects(map, 'collision');
        collsnObs2 = this.game.physics.p2.convertTiledCollisionObjects(map, 'collision2');

        this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.wallsCollisionGroup = this.game.physics.p2.createCollisionGroup();

        for (var ob in collsnObs) {


            collsnObs[ob].setCollisionGroup(this.wallsCollisionGroup);
            collsnObs[ob].collides(this.playerCollisionGroup);

        }


        for (var ob2 in collsnObs2) {

            console.log(ob2);
            collsnObs2[ob2].setCollisionGroup(this.wallsCollisionGroup);
            collsnObs2[ob2].collides(this.playerCollisionGroup);

        }

        this.player.body.collides(this.wallsCollisionGroup);

        this.game.physics.p2.updateBoundsCollisionGroup();
        this.enemy.body.setCollisionGroup(this.enemyCollisionGroup);

        this.player.body.setCollisionGroup(this.playerCollisionGroup);
    },
    addHud: function () {
        this.scoreText = this.game.add.bitmapText(10, 10, 'Diogenes', 'Score: ' + this.score, 24);
        this.scoreText.fixedToCamera = true;
    },
    addMap: function () {
        map = this.game.add.tiledmap('game-world');
        this.game.world.setBounds(0, 0, 4096, 4096);
    },
    create: function () {

        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);
        this.game.physics.p2.restitution = 0.9;

        this.addMap();
        this.addActors();
        this.addCollisions();
        this.addHud();

        this.game.camera.follow(this.player);

    },
    getTerrainType: function () {
        terrain = map.getTileWorldXY(this.player.x, this.player.y, 32, 32, map.currentLayer).properties["terrain-type"];
        if(terrain === undefined){
            terrain = "none";
        }
        return terrain;
    }, update: function () {
        this.enemy.body.velocity.y = 0;
        this.enemy.body.velocity.x = 0;
        this.player.move();
        //console.log(this.getTerrainType());

        if (this.player.y > this.enemy.y){
            this.player.bringToTop();
        }else{
            this.enemy.bringToTop();
        }

        this.player.body.collides(this.enemyCollisionGroup, this.hitEnemy, this);

        this.enemy.body.collides(this.playerCollisionGroup, this.hitEnemy, this);

    },
    hitEnemy : function(one, two){
            console.log("hitEnemy");
        this.playerstats.playerstats.terrain = this.getTerrainType();
            this.playerstats.currentenemy = this.enemy;

            this.state.start('Battle', true, false, {playerX:this.player.x, playerY:this.player.y, playerstats:this.playerstats});
    },
    hitWall:function(){
        console.log("wall hit");
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