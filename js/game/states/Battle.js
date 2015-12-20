var Olympus = Olympus || {};

Olympus.Battle = function (game) {

    this.player = null;
    this.music = null;
    this.map = null;
    this.layer = null;
    this.background = null;
    this.terrain = null;

};

Olympus.Battle.prototype = {
    init:function(params){
        this.game.scale.setGameSize(window.innerWidth, window.innerHeight); // et voila!
        this.params = params;
        this.offsetY = this.game.width * .25;
        console.log(this.offsetY);
        this.terrain = this.params.playerstats.playerstats.terrain;
    },
    create: function () {

        console.log(this.game.width);
        this.bg = this.add.sprite(this.game.width/2, this.game.height/2,this.terrain);
        this.bg.anchor.setTo(0.5, 0.5);
       // this.bg.width = window.innerWidth;
        this.bg.bringToTop();

        //console.log(this.bg);
        //
        this.enemy = new Enemy(this.game, this.game.width-this.offsetY, 350, this.params.playerstats.currentenemy.key );
        this.enemy.direction = "left";
        this.game.add.existing(this.enemy);
        this.enemy.bringToTop();
        //
        this.player = new Hero(this.game, this.offsetY, 350);
        this.player.direction = "right";
        this.game.add.existing(this.player);
        this.player.bringToTop();

        this.player.scale.setTo(.6);
        this.enemy.scale.setTo(.6);
        //
        //
        //console.log(this.params.playerstats.currentenemy.battleX);
        //console.log(this.game);
        //console.log(this.player.x);
        //this.enemies = this.game.add.group();
        //
        //for (var i = 0; i < 16; i++)
        //{
        //    //  This creates a new Phaser.Sprite instance within the group
        //    //  It will be randomly placed within the world and use the 'baddie' image to display
            //this.enemies.create(360 + Math.random() * 200, 120 + Math.random() * 200, this.params.playerstats.currentenemy.key);
        //}

        this.cursors = this.game.input.keyboard.createCursorKeys();

    },
    update: function () {
        //this.params.playerstats.playerstats.player.HP += 1;

        //this.enemy.direction = this.params.playerstats.currentenemy.battleDirection;
        //this.enemy.move();
        //this.player.move();
        //console.log(this.player.x);
        this.params.playerstats.playerstats.HP+=1;
        if(this.cursors.up.isDown){
            this.game.state.start('Game', true, false, this.params);
        }


    }

};