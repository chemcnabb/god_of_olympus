var Olympus = Olympus || {};

Olympus.Boot = function(){};

//setting game configuration and loading the assets for the loading screen
Olympus.Boot.prototype = {
    preload: function() {
        this.game.add.plugin(Phaser.Plugin.Tiled);
        this.game.stateTransition = this.game.plugins.add(Phaser.Plugin.StateTransition);

        this.game.stateTransition.configure({
            duration: Phaser.Timer.SECOND * 0.8,
            ease: Phaser.Easing.Exponential.InOut,
            properties: {
                alpha: 0,
                scale: {
                    x: 1.4,
                    y: 1.4
                }
            }
        });

        //assets we'll use in the loading screen
        this.load.image('preloadbar', 'assets/images/preloader-bar.png');
        this.load.image('splash', 'assets/images/menu_bg.jpg');
        this.load.image('sand', 'assets/images/battle/sand.png');
        this.load.image('grass', 'assets/images/battle/grass.png');
        this.load.spritesheet('hero', 'assets/images/hero_spritesheet.png', 199, 285);
        this.load.spritesheet('enemy', 'assets/images/villain_spritesheet.png', 199, 285);



        // By using the built-in cache key creator, the plugin can
        // automagically find all the necessary items in the cache
        var cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;

        // load the tiled map, notice it is "tiledmap" and not "tilemap"
        this.game.load.tiledmap(cacheKey('game-world', 'tiledmap'), 'assets/map/world_map.json', null, Phaser.Tilemap.TILED_JSON);

        // load the images for your tilesets, make sure the last param to "cacheKey" is
        // the name of the tileset in your map so the plugin can find it later
        this.game.load.image(cacheKey('game-world', 'tileset', 'water-tileset'), 'assets/images/world_map_tiles/water.png');
        this.game.load.image(cacheKey('game-world', 'tileset', 'ground-tileset'), 'assets/images/world_map_tiles/ground.png');
    },
    create: function() {
        //loading screen will have a white background
        this.game.backgroundColor = '#fff';

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