var Olympus = Olympus || {};

//loading the game assets
Olympus.Preload = function(){
    this.ready = false;
};

Olympus.Preload.prototype = {
    preload: function() {

        this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
        this.preloadBar.anchor.setTo(0.5);
        //this.world.bringToTop(this.preloadBar);
        this.load.setPreloadSprite(this.preloadBar);

        //this.load.audio('gameMusic', ['assets/audio/Pamgaea.mp3', 'assets/audio/Pamgaea.ogg']);
        this.load.bitmapFont('Diogenes', 'assets/fonts/font_0.png', 'assets/fonts/font.xml');


        // Load all of our maps and their components.
        //this.loadTileMaps();

        this.load.onLoadComplete.add(this.onLoadComplete, this);



    },
    create: function() {
        this.preloadBar.cropEnabled = false;
        this.state.start('MainMenu');
//        this.state.start('Game');
    },
    // Many of the maps use the same tile images. We create a map of all these images
    // so that we only load them once.
    loadTileMaps: function() {
        var tileSetMap = {};
        for (var i = 0; i < Olympus.Map.MAPS.length; i++) {
            this.addTileSets(Olympus.Map.MAPS[i], tileSetMap);
        }

        for (var key in tileSetMap) {
            if (tileSetMap.hasOwnProperty(key)) {
                this.load.image(key, tileSetMap[key]);
            }
        }
    },

    addTileSets: function(mapKey, tileSetMap) {
        var tileSets = this.cache.getTilemapData(mapKey).data.tilesets;
        var key, value;
        for (var i = 0; i < tileSets.length; i++) {
            key = tileSets[i].name;
            value = tileSets[i].image;
            if (key in tileSetMap) continue;
            tileSetMap[key] = value;
        }
    },
    update: function() {
        //if(this.cache.isSoundDecoded('gameMusic') && this.ready === true) {

        //}
    },
    onLoadComplete: function() {
        this.ready = true;
    }

};