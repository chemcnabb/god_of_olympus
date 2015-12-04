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
    },
    create: function () {

        this.cursors = this.game.input.keyboard.createCursorKeys();

    },
    update: function () {
        if(this.cursors.up.isDown){
            this.game.state.start('Game', true, false, this.params);
        }


    }

};