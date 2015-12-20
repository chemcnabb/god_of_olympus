var Olympus = Olympus || {};

Olympus.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
Olympus.Boot.prototype = {
    preload: function() {
        //assets we'll use in the loading screen
        this.load.image('preloadbar', 'assets/images/preloader-bar.png');
        this.load.image('splash', 'assets/images/menu_bg.jpg');
        this.load.image('sand', 'assets/images/battle/sand.jpg');
        this.load.image('grass', 'assets/images/battle/grass.jpg');
    },
    create: function() {
        //loading screen will have a white background
        this.game.backgroundColor = '#000';

        //scaling options
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

        //have the game centered horizontally
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;

        //screen size will be set automatically
        this.scale.updateLayout(true);

        //physics system
        //this.game.physics.startSystem(Phaser.Physics.ARCADE);

        this.state.start('Preload');
    }
};