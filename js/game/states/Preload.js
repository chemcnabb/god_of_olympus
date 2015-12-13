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





        //  The final one tells Phaser the foramt of the map data, in this case it's a JSON file exported from the Tiled map editor.
        //  This could be Phaser.Tilemap.CSV too.

        this.game.load.tilemap('world', 'assets/map/world_map.json', null, Phaser.Tilemap.TILED_JSON);

        //  Next we load the tileset. This is just an image, loaded in via the normal way we load images:

        this.game.load.image('water', 'assets/images/world_map_tiles/water.png');


        this.game.load.image('ground', 'assets/images/world_map_tiles/ground.png');









        //this.load.image('background', 'assets/images/test_level.jpg');


        this.load.spritesheet('hero', 'assets/images/hero_spritesheet.png', 199, 285);
        this.load.spritesheet('enemy', 'assets/images/villain_spritesheet.png', 199, 285);



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