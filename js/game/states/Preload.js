var Olympus = Olympus || {};

//loading the game assets
Olympus.Preload = function(){
    this.ready = false;
};

Olympus.Preload.prototype = {
    preload: function() {
        //show loading screen

        this.game.add.plugin(Phaser.Plugin.Tiled);


        this.splash = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'splash');
        this.splash.anchor.setTo(0.5, 0.5);
        this.splash.height = window.innerHeight;





        // By using the built-in cache key creator, the plugin can
// automagically find all the necessary items in the cache
        var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;

// load the tiled map, notice it is "tiledmap" and not "tilemap"
        this.game.load.tiledmap(cacheKey('game-world', 'tiledmap'), 'assets/map/world_map.json', null, Phaser.Tilemap.TILED_JSON);
        console.log(this.game.cache.getTilemapData(cacheKey('game-world', 'tiledmap')));
// load the images for your tilesets, make sure the last param to "cacheKey" is
// the name of the tileset in your map so the plugin can find it later
        this.game.load.image(cacheKey('game-world', 'tileset', 'water-tileset'), 'assets/images/world_map_tiles/water.png');
        this.game.load.image(cacheKey('game-world', 'tileset', 'ground-tileset'), 'assets/images/world_map_tiles/ground.png');

        console.log(cacheKey('game-world', 'tiledmap'));
// if you have image layers, be sure to load those too! Again,
// make sure the last param is the name of your layer in the map.
       // game.load.image(cacheKey('my-tiledmap', 'layer', 'layer-name'), 'assets/levels/layer.png');

        //this.game.load.tilemap('world', 'assets/map/world_map.json', null, Phaser.Tilemap.TILED_JSON);
        //this.game.load.image('water', 'assets/images/world_map_tiles/water.png');
        //this.game.load.image('ground', 'assets/images/world_map_tiles/ground.png');










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