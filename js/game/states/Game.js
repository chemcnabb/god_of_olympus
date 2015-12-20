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

        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);
        this.game.physics.p2.restitution = 0.9;
        //this.game.physics.p2.enable(this, true);


        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.P2JS;

        this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.wallsCollisionGroup = this.game.physics.p2.createCollisionGroup();

    },

    addActors: function () {



        if (this.params != undefined) {
            this.player = new Hero(this.game, this.params.playerX, this.params.playerY);
        } else {
            this.player = new Hero(this.game, this.game.world.width / 2 + 100, this.game.world.height / 2);
        }
        //this.game.add.existing(this.player);
        this.enemies.add(this.player);

        for (var i = 0; i < 16; i++)
        {
            //  This creates a new Phaser.Sprite instance within the group
            //  It will be randomly placed within the world and use the 'baddie' image to display


            var enemy = this.enemies.create(this.game.world.randomX, this.game.world.randomY, 'enemy');
            console.log(enemy.width);
            enemy.scale.set(.2,.2);
            enemy.name = "enemy_" + i;
            enemy.body.setRectangle(enemy.width-8, 15, 0, (enemy.height/2)-7.5);
            enemy.body.setCollisionGroup(this.enemyCollisionGroup);
            enemy.body.collides([this.enemyCollisionGroup, this.playerCollisionGroup]);
            console.log(enemy);

        }
        //this.enemies.scale.set(.2,.2 );
        this.game.world.bringToTop(this.enemies);

        //this.player.bringToTop();
        //this.enemy.bringToTop();
    },
    addCollisions: function () {


        collsnObs = this.game.physics.p2.convertTiledCollisionObjects(map, 'collision');
        collsnObs2 = this.game.physics.p2.convertTiledCollisionObjects(map, 'collision2');



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
    },
    update: function () {
        this.player.move();
        this.player.body.collides(this.enemyCollisionGroup, this.hitEnemy, this);

        for(index in this.enemies.children){
            var enemy = this.enemies.children[index];
            if(enemy.body && enemy.key != "hero"){
                enemy.body.setZeroVelocity()
            }

            if (this.player.y > enemy.y){
                this.player.bringToTop();
            }else{
                enemy.bringToTop();
            }
            if(enemy.body){
                enemy.body.collides(this.playerCollisionGroup, this.hitEnemy, this);
            }
        }





        this.enemies.sort('y', Phaser.Group.SORT_ASCENDING);





    },
    hitEnemy : function(one, two){
            console.log("hitEnemy");
            console.log(two);

        this.playerstats.playerstats.terrain = this.getTerrainType();
            this.playerstats.currentenemy = two.sprite;

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