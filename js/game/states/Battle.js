var Olympus = Olympus || {};

Olympus.Battle = function (game) {

    this.player = null;
    this.music = null;
    this.map = null;
    this.layer = null;
    this.background = null;

};

Olympus.Battle.prototype = {
    init:function(params){
      this.params = params;
        console.log(this.params);
    },
    create: function () {
        this.enemy = new Enemy(this.game, this.params.playerstats.currentenemy.battleX, this.params.playerstats.currentenemy.battleY, this.params.playerstats.currentenemy.key );
        this.game.add.existing(this.enemy);
        this.enemies = this.game.add.group();

        for (var i = 0; i < 16; i++)
        {
            //  This creates a new Phaser.Sprite instance within the group
            //  It will be randomly placed within the world and use the 'baddie' image to display
            this.enemies.create(360 + Math.random() * 200, 120 + Math.random() * 200, this.params.playerstats.currentenemy.key);
        }

        this.cursors = this.game.input.keyboard.createCursorKeys();

    },
    update: function () {
        //this.params.playerstats.playerstats.player.HP += 1;
        this.enemy.direction = this.params.playerstats.currentenemy.battleDirection;
        this.enemy.move();
        this.params.playerstats.playerstats.HP+=1;
        if(this.cursors.up.isDown){
            this.game.state.start('Game', true, false, this.params);
        }


    }

};