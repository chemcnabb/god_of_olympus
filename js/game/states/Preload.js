var Olympus = Olympus || {};

//loading the game assets
Olympus.Preload = function(){
    this.ready = false;
};

Olympus.Preload.prototype = {
    preload: function() {
        //show loading screen
        this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'splash');
        this.splash.anchor.setTo(0.5, 0.5);
        this.splash.height = window.innerHeight;

        this.load.image('background', 'assets/images/test_level.jpg');

        this.load.spritesheet('hero', 'assets/images/hero_spritesheet.png', 199, 285);


        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        //this.world.bringToTop(this.preloadBar);
        this.load.setPreloadSprite(this.preloadBar);

        //this.load.audio('gameMusic', ['assets/audio/Pamgaea.mp3', 'assets/audio/Pamgaea.ogg']);
        this.load.bitmapFont('Diogenes', 'assets/fonts/font_0.png', 'assets/fonts/font.xml');

        this.load.onLoadComplete.add(this.onLoadComplete, this);




    },
    create: function() {
        this.preloadBar.cropEnabled = false;

//        this.state.start('Game');
    },
    update: function() {
        //if(this.cache.isSoundDecoded('gameMusic') && this.ready === true) {
            this.state.start('MainMenu');
        //}
    },
    onLoadComplete: function() {
        this.ready = true;
    }

};