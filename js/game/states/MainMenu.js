var Olympus = Olympus || {};

Olympus.MainMenu = function (game) {
    this.playButton = null;
    this.player = null;
    this.music = null;
    this.map = null;
    this.loaded = false;
    this.layer = null;
    this.background = null;
};

Olympus.MainMenu.prototype = {
    init:function(){

        this.load.onFileComplete.add(this.fileComplete, this);

    },
    fileComplete: function(progress, cacheKey, success, totalLoaded, totalFiles) {
        this.loaded = progress;
    },

    create: function () {

        this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'splash');
        this.splash.anchor.setTo(0.5, 0.5);
        this.splash.height = window.innerHeight;
        this.splash.tint = 0x5a5a5a;

        //this.backGround.autoScroll(-100,0);

        //this.midground = this.game.add.tileSprite(0,470,this.game.width, this.game.height - 460 - 73, 'midground');
        //this.midground.autoScroll(-100,0);
        //
        //this.ground = this.game.add.tileSprite(0,this.game.height - 73, this.game.width, 73, 'ground');
        //this.ground.autoScroll(-400,0);
        //
        //
        //this.player = this.add.sprite(200, this.game.world.height/2, 'player');
        //this.player.anchor.setTo(0.5);
        //this.player.scale.setTo(0.3);
        //this.player.animations.add('fly', [0,1,2,3,2,1]);
        //this.player.animations.play('fly', 8, true);

        //this.game.add.tween(this.player).to({y: this.player.y - 16}, 500, Phaser.Easing.Linear.NONE, true, 0, 100, true);





        this.titleSprite = this.game.add.bitmapText(this.game.width/2,this.game.height/2, 'Diogenes','Gods of Olympus', 90);
        this.titleSprite.anchor.setTo(0.5, 0.5);
        this.titleSprite.tint = 0xfa9734;


        this.titleSprite.fixedToCamera = true;

        this.startText = this.game.add.bitmapText(0,0, 'Diogenes','tap to start', 90);
        this.startText.x = this.game.width / 2  - this.startText.textWidth / 2;
        this.startText.y = this.titleSprite.y + this.titleSprite.height / 2;
        this.startText.tint = 0xfa9734;

    },
    update: function () {

        if(this.game.input.activePointer.justPressed()) {

            this.game.stateTransition.to('Game', false, false);
        }
    },
    shutdown: function(){
        this.titleSprite.destroy();
        this.startText.destroy();
        this.splash.destroy();

    }

};