var Olympus = Olympus || {};

var stateCounter = 0;
Olympus.Game = function (game) {
    console.log('init');

    // score
    this.score = 0;
    this.map = {};
    this.enemies = {};
    this.world_objects = {};
    this.utility_group = {};



};

Olympus.Game.prototype = {
    init: function(params){
        console.log("game state initted");



        this.actorlocations = {};
        this.currentenemyindex = null;


        this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.game.physics.p2.setImpactEvents(true);
        this.game.physics.p2.restitution = 0.9;
        //this.game.physics.p2.enable(this, true);

        this.utlity_group = this.game.add.group();

        this.enemies = this.game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.P2JS;

        this.world_objects = this.game.add.group();
        this.world_objects.enableBody = true;
        this.world_objects.physicsBodyType = Phaser.Physics.P2JS;

        this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.enemyCollisionGroup = this.game.physics.p2.createCollisionGroup();
        this.wallsCollisionGroup = this.game.physics.p2.createCollisionGroup();

    },
    preload: function(){

        this.addMap();

        this.addPlayer();
        this.addTrees();

        this.addActors();
        this.addMapCollisionBounds();

        this.addHud();
    },
    setEnemyProperties: function (enemy, index) {


        enemy = this.game.globals.setPlayerProperties(enemy, index);

        enemy.attributes = enemy.attributes || new Olympus.ActorAttributes();
        enemy.items =  enemy.items || new Olympus.Items();
        enemy.armor = enemy.armor || new Olympus.Armor();

        enemy.body.fixedRotation = true; // no rotation
        enemy.body.setRectangle(enemy.width - 8, 15, 0, (enemy.height / 2) - 7.5);


        enemy.body.setCollisionGroup(this.enemyCollisionGroup);
        enemy.body.collides([this.enemyCollisionGroup, this.playerCollisionGroup]);
        return enemy;
    },
    addPlayer: function () {



        this.player = new Hero(this.game, this.game.globals.playerX, this.game.globals.playerY);
        this.player.enablePhysics();
        //this.game.physics.p2.enable(this, true);
        this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_TOPDOWN);
        this.world_objects.add(this.player);
    },
    addActors: function () {
        //console.log(this.game.globals);

        // TODO: add array to globals to re init after battle
        if(Object.keys(this.game.globals.actorlocations).length == 0) {

            for (var i = 0; i < 100; i++) {

                do {
                    xy = [Math.ceil(this.game.world.randomX), Math.ceil(this.game.world.randomY)];
                } while (this.isTileWalkable(xy[0], xy[1]) !== "true");




                   // console.log("ENEMY ADDED:" + i);
                    var enemyObj = this.enemies.create(xy[0], xy[1], 'enemy');
                    //this.game.physics.p2.enable(enemyObj, true);
                    enemyObj = this.setEnemyProperties(enemyObj, i);


                    this.world_objects.add(enemyObj);



            }

        }else{
            //console.log(this.params.playerstats.actorlocations);
            //console.log(this.params.playerstats.currentenemyindex);
            // todo: CHECK IF ENEMY IS DEAD

            for(enemylocationindex in this.game.globals.actorlocations){







                        enemylocation = this.game.globals.actorlocations[enemylocationindex];

                       var enemyObj = this.enemies.create(enemylocation.x, enemylocation.y, 'enemy');
                       enemyObj = this.setEnemyProperties(enemyObj, enemylocationindex);


                       this.world_objects.add(enemyObj);








            }
        }

    },
    addTrees:function(){

        for (var ob in this.map.tilemap.objects.stumps) {
            var stump = this.map.tilemap.objects.stumps[ob];
            treeObj = this.world_objects.create(stump.x, stump.y, stump.properties.tiletype);
            treeObj.anchor.setTo(0.5,0.7);
            treeObj.body.setRectangle(32, 32,0,(treeObj.height/2)-64);

            treeObj.body.fixedRotation = true; // no rotation
            treeObj.body.static = true;

            treeObj.body.setCollisionGroup(this.wallsCollisionGroup);
            treeObj.body.collides([this.wallsCollisionGroup, this.playerCollisionGroup]);

        }
        this.game.world.bringToTop(this.world_objects);

    },
    addMapCollisionBounds: function () {



        collsnObs = this.game.physics.p2.convertCollisionObjects(this.map.tilemap, 'collision');

        for (var ob in collsnObs) {
            //console.log(collsnObs[ob]);
            collsnObs[ob].setCollisionGroup(this.wallsCollisionGroup);
            collsnObs[ob].collides(this.playerCollisionGroup);
        }

        this.player.body.collides(this.wallsCollisionGroup);

        this.game.physics.p2.updateBoundsCollisionGroup();

        this.player.body.setCollisionGroup(this.playerCollisionGroup);
    },
    addHud: function () {
        this.scoreText = this.game.add.bitmapText(10, 10, 'Diogenes', 'Score: ' + this.score, 24);
        this.scoreText.fixedToCamera = true;

        //var player_health = this.game.add.sprite(0,0,'player_health');
        //player_health.cropEnabled = true;
        //player_health.crop.width = (character.health / character.maxHealth) * player_health.width


    },
    addMap: function () {
        this.map = new Olympus.Map.Module(this.game, 'game-world');

        this.modules = {};
        this.modules['ground_tiles'] = new Olympus.Map.Module(this.game, 'game-world');

        this.map.createLayer('water');
        this.map.createLayer('ground');
        this.map.createLayer('cliffs');
        this.map.createLayer('collision');
        this.map.createLayer('buildings');
        this.map.tilemap.currentLayer = 1;;
        //
        this.game.world.setBounds(0, 0, 4096, 4096);
    },
    create: function () {
        this.game.world.bringToTop(this.world_objects);
        this.game.world.bringToTop(this.enemies);
    },
    getPlayerTerrainType: function () {
        return this.getTerrainType(this.player.x, this.player.y);
    },
    getTerrainType: function (x, y) {
        tile = this.map.tilemap.getTileWorldXY(x, y, 32, 32, this.map.tilemap.currentLayer);
        if(tile != null){
            terrain = tile.properties["terrain-type"];
            if(terrain === undefined){
                terrain = "none";
            }
            return terrain;
        }else{
            return "none"
        }

    },
    isTileWalkable: function (x, y) {

        tile = this.map.tilemap.getTileWorldXY(x, y, 32, 32, this.map.tilemap.currentLayer);

        if(tile != null){
            //console.log(tile.properties["walkable"]);
            walkable = tile.properties["walkable"];

            return walkable;
        }else{
            return undefined;
        }

    },
    checkPlayerEnemyCollision: function () {
        for (index in this.enemies.children) {
            var enemy = this.enemies.children[index];
            if (enemy.body && enemy.key != "hero") {
                enemy.body.setZeroVelocity();
                enemy.body.collides(this.playerCollisionGroup, this.hitEnemy, this);
            }
        }
        this.enemies.sort('y', Phaser.Group.SORT_ASCENDING);
    },
    checkPlayerWorldCollision: function () {
        for (index in this.world_objects.children) {
            var world_object = this.world_objects.children[index];
            if (world_object.body && world_object.key != "hero") {
                world_object.body.setZeroVelocity();
                world_object.body.collides(this.playerCollisionGroup, this.hitWorldObject, this);
            }
        }

        this.world_objects.sort('y', Phaser.Group.SORT_ASCENDING);
    },
    update: function () {
        if(this.player){
            this.player.move();
            this.game.globals.playerX = this.player.x;
            this.game.globals.playerY = this.player.y;

            this.player.body.collides(this.enemyCollisionGroup, this.hitEnemy, this);

            this.checkPlayerEnemyCollision();
            this.checkPlayerWorldCollision();
        }

    },

    hitEnemy : function(hero, enemy){
        console.log("hitEnemy");


        this.game.globals.currentenemy = enemy.sprite;
        this.game.stateTransition.to('Battle', true, false);
    },
    hitWall:function(){
        console.log("wall hit");
    },
    shutdown: function() {
        console.log('shutting down');

        this.world_objects.destroy();
        this.enemies.destroy();
        this.map.tilemap.destroy();
        this.scoreText.destroy();
        this.player.destroy();

        //this.utility_group.destroy();
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