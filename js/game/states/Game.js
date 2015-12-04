var Olympus = Olympus || {};

var stateCounter = 0;
Olympus.Game = function (game) {
    console.log('init');
    // score
    this.score = 0;

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
    },
    create: function () {


        // set up the game world bounds
        this.game.world.bounds = new Phaser.Rectangle(0,0, this.game.width, this.game.height);

        // start the physics system
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        //this.game.physics.arcade.gravity.y = 400;

        // initialize settings
        this.playerMaxY = this.game.height - 176;
        this.spawnX = this.game.width + 64;

        this.background = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'background');
        this.background.anchor.setTo(0.5, 0.5);
        this.background.height = window.innerHeight;
        //this.background.autoScroll(-100,0);

        //this.midground = this.game.add.tileSprite(0,470,this.game.width, this.game.height - 460 - 73, 'midground');
        //this.midground.autoScroll(-100,0);

        //this.ground = this.game.add.tileSprite(0,this.game.height - 73, this.game.width, 73, 'ground');
        //this.ground.autoScroll(-400,0);

        //this.game.physics.arcade.enableBody(this.ground);
        //this.ground.body.allowGravity = false;
        //this.ground.body.immovable = true;



        // create groups
        //this.enemies = this.game.add.group();
        //this.coins = this.game.add.group();

        // create score text
        this.scoreText = this.game.add.bitmapText(10,10, 'Diogenes', 'Score: ' + this.score, 24);

        if(this.params != undefined){
            this.player = new Hero(this.game, this.params.playerX, this.params.playerY);
        }else{
            this.player = new Hero(this.game, this.game.world.width/2+100, this.game.world.height/2);
            this.enemy = new Enemy(this.game, this.game.world.width/2-100, this.game.world.height/2+190);
            this.game.add.existing(this.enemy);
        }
        //this.player = new Hero(this.game, this.game.world.width/2+100, this.game.world.height/2);
        //this.enemy = new Enemy(this.game, this.game.world.width/2-100, this.game.world.height/2+190);

        this.game.add.existing(this.player);

        //this.player = this.add.sprite(this.game.world.width/2+100, this.game.world.height/2, 'hero');
        //this.player.frame = 0;
        //this.player.anchor.setTo(0.5);
        //this.player.scale.setTo(this.player.y*0.0012);
        //this.player.animations.add('left', [2], 1, true);
        //this.player.animations.add('right', [1], 1, true);
        //this.player.animations.add('up', [3], 1, true);
        //this.player.animations.add('down', [0], 1, true);
        //this.player.alive = true;

        this.game.time.advancedTiming = true;

        //move player with cursor keys

        // add physics to player
        //this.game.physics.arcade.enableBody(this.player);
        this.game.physics.arcade.gravity.y = 0;
        //this.player.body.collideWorldBounds = true;
        //this.player.body.bounce.setTo(0.25, 0.25);

        // create shadow
        //this.shadow = this.game.add.sprite(this.player.x, this.game.world.height - 73, 'shadow');
        //this.shadow.anchor.setTo(0.5, 0.5);

        //create scoreboard
        //this.scoreboard = new Scoreboard(this.game);
        //this.add.existing(this.scoreboard);

        // create an enemy spawn loop
        //this.enemyGenerator = this.game.time.events.loop(Phaser.Timer.SECOND, this.generateEnemy, this);
        //this.enemyGenerator.timer.start();
        // create a coin spawn loop
        //this.coinGenerator = this.game.time.events.loop(Phaser.Timer.SECOND, this.generateCoins, this);
        //this.coinGenerator.timer.start();


        // instantiate music
        //this.music = this.game.add.audio('gameMusic');
        //this.music.play('',0,true);

        // instantiate sounds
        //this.bounceSound = this.game.add.audio('bounce');
        //this.flapSound = this.game.add.audio('flap');
        //this.coinSound = this.game.add.audio('coin');
        //this.deathSound = this.game.add.audio('death');


    },
    update: function () {
        this.player.move();
        if(this.game.physics.arcade.collide(this.player, this.enemy)){
            //TODO: create globals for player position,
            // pass parameters to Battle state (StateManager)
            // pass parameters back to this state, passed to teh state init function
            this.state.start('Battle', true, false, {playerX:this.player.x, playerY:this.player.y});
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
    generateEnemy: function() {
        var enemy = this.enemies.getFirstExists(false);
        var x = this.spawnX;
        var y = this.game.rnd.integerInRange(50, this.game.world.height - 192);

        if(!enemy) {
            enemy = new Enemy(this.game, 0, 0, 'missile');
            this.enemies.add(enemy);
        }

        enemy.reset(x, y);
        enemy.revive();
    },
    generateCoins: function() {
        if(!this.previousCoinType || this.previousCoinType < 3) {
            var coinType = this.game.rnd.integer() % 5;
            switch(coinType) {
                case 0:
                    //do nothing. No coins generated
                    break;
                case 1:
                case 2:
                    // if the cointype is 1 or 2, create a single coin
                    //this.createCoin();
                    this.createCoin();

                    break;
                case 3:
                    // create a small group of coins
                    this.createCoinGroup(2, 2);
                    break;
                case 4:
                    //create a large coin group
                    this.createCoinGroup(6, 2);
                    break;
                default:
                    // if somehow we error on the cointype, set the previouscointype to zero and do nothing
                    this.previousCoinType = 0;
                    break;
            }

            this.previousCoinType = coinType;
        } else {
            if(this.previousCoinType === 4) {
                // the previous coin generated was a large group,
                // skip the next generation as well
                this.previousCoinType = 3;
            } else {
                this.previousCoinType = 0;
            }

        }
    },
    createCoin: function(x, y) {
        x = x ||  this.spawnX;
        y = y || this.game.rnd.integerInRange(50, this.game.world.height - 192);
        // recycle our coins
        //
        var coin = this.coins.getFirstExists(false);
        if(!coin) {
            coin = new Coin(this.game, 0, 0, 'coin');
            this.coins.add(coin);
        }
        coin.reset(x, y);
        coin.revive();
        return coin;
    },
    createCoinGroup: function(columns, rows) {
        //create 4 coins in a group
        var coinSpawnY = this.game.rnd.integerInRange(50, this.game.world.height - 192);
        var coinRowCounter = 0;
        var coinColumnCounter = 0;
        var coin;
        for(var i = 0; i < columns * rows; i++) {
            coin = this.createCoin(this.spawnX, coinSpawnY);
            coin.x = coin.x + (coinColumnCounter * coin.width) + (coinColumnCounter * this.coinSpacingX);
            coin.y = coin.y + (coinRowCounter * coin.height) + (coinRowCounter * this.coinSpacingY);
            coinColumnCounter++;
            if(i+1 >= columns && (i+1) % columns === 0) {
                coinRowCounter++;
                coinColumnCounter = 0;
            }
        }
    },
    groundHit: function() {
        this.player.angle = 0;
        this.player.body.velocity.y = -200;
        this.bounceSound.play();
    },

    coinHit: function(player, coin) {
        this.score++;

        coin.kill();
        this.coinSound.play('',0,0.25);

        var scoreCoin = new Coin(this.game, coin.x, coin.y);
        this.game.add.existing(scoreCoin);
        scoreCoin.animations.play('spin', 40, true);
        var scoreTween = this.game.add.tween(scoreCoin).to({x: 50, y: 50}, 300, Phaser.Easing.Linear.None, true);
        scoreTween.onComplete.add(function() {
            scoreCoin.destroy();
            this.scoreText.text = 'Score: ' + this.score;
        }, this);

    },
    enemyHit: function(player, enemy) {
        this.player.alive = false;
        this.player.animations.stop();

        this.music.stop();
        this.deathSound.play();
        this.ground.stopScroll();
        this.enemies.setAll('body.velocity.x', 0);
        this.coins.setAll('body.velocity.x', 0);
        this.shadow.destroy();
        this.enemyGenerator.timer.stop();
        this.coinGenerator.timer.stop();

        var deathTween = this.game.add.tween(this.player).to({angle:180}, 2000, Phaser.Easing.Bounce.Out, true);
        deathTween.onComplete.add(this.showScoreboard, this);

    },
    showScoreboard: function() {

        this.scoreboard.show(this.score);

    },
    render: function() {
    }
};