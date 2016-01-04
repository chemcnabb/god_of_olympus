var Olympus = Olympus || {};

Olympus.Boot = function(){};
Olympus.State = {};
Olympus.Map = {};
Olympus.Map.Object = {};
Olympus.Map.MAPS = [
    // Overworld maps
    'game-world',

    // Modules used in maps
    //'area_1'
];

/**
 * Created by knash on 15-03-12.
 */

//setting game configuration and loading the assets for the loading screen
Olympus.Boot.prototype = {
    init: function(){
        this.game.add.plugin(Phaser.Plugin.Debug);
        //this.game.add.plugin(Phaser.Plugin.Tiled);
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

    },
    preload: function() {


        //assets we'll use in the loading screen
        this.game.load.image('preloadbar', 'assets/images/preloader-bar.png');
        this.game.load.image('splash', 'assets/images/menu_bg.jpg');
        this.game.load.image('battle-sand', 'assets/images/battle/sand.png');
        this.game.load.image('battle-grass', 'assets/images/battle/grass.png');

        this.game.load.image('button', 'assets/images/hero_menu/button.png');

        this.game.load.spritesheet('hero', 'assets/images/hero_spritesheet.png', 199, 285);
        this.game.load.spritesheet('enemy', 'assets/images/villain_spritesheet.png', 199, 285);


        //this.game.load.tilemap('game-world', 'assets/map/world_map.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('menu', 'assets/images/buttons/number-buttons-90x90.png', 270, 180);


        this.game.load.image('buildings', 'assets/images/world_map_tiles/buildings.png');
        this.game.load.image('cliffs', 'assets/images/world_map_tiles/Cliff_tileset.png');
        this.game.load.image('treesv6_0', 'assets/images/world_map_tiles/treesv6_0.png');
        this.game.load.image('tree1', 'assets/images/world_map_tiles/tree1.png');
        this.game.load.image('tree3', 'assets/images/world_map_tiles/tree3.png');
        this.game.load.image('tree4', 'assets/images/world_map_tiles/tree4.png');
        this.game.load.image('ground_tiles', 'assets/images/world_map_tiles/ground_tiles.png');

        var map;
        for (var i = 0; i < Olympus.Map.MAPS.length; i++) {
            map = Olympus.Map.MAPS[i];
            this.game.load.tilemap(map, 'assets/map/' + map + '.json', null, Phaser.Tilemap.TILED_JSON);
        }
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