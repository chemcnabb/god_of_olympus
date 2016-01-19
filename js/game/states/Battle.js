var Olympus = Olympus || {};

Olympus.Battle = function (game) {
    //this.moves_this_turn = [];

    this.active_player = null;

    this.safetyOffset = 100;

};

Olympus.Battle.prototype = {
    init: function (params) {

        this.terrain = this.game.globals.terrain;

        this.params = params;

        this.offsetY = this.game.width * .25;

        this.addBackground();

        this.addEnemies();

        this.addPlayer();

        this.player.scale.setTo(.6);

        this.enemy.scale.setTo(.6);

        this.game.globals.actors = [this.player, this.enemy];

    },

    addEnemies: function () {
        this.enemy = new Enemy(this.game, this.game.width - this.safetyOffset, this.game.height - this.safetyOffset, "enemy");

        this.enemy.y = this.enemy.y - this.enemy.height+60;

        this.enemy.x = this.enemy.x - this.enemy.width;

        this.enemy.currentWeapon = "Sword";

        this.enemy.originX = this.enemy.x;

        this.enemy.originY = this.enemy.y;

        this.enemy.addHealthBar(this, 10 + this.game.width - 128, 10);
        this.enemy.updateHealth();

        var currentenemy = 0;

        if (this.game.globals.currentenemy) {

            currentenemy = this.game.globals.currentenemy.name.replace("enemy_", "");
        }

        this.game.globals.setPlayerProperties(this.enemy, parseInt(currentenemy));

        this.enemy.attributes = this.enemy.attributes || new Olympus.ActorAttributes();

        this.enemy.items = this.enemy.items || new Olympus.Items();

        this.enemy.armor = this.enemy.armor || new Olympus.Armor();

        this.enemy.direction = "left";

        this.game.add.existing(this.enemy);

        this.enemy.bringToTop();

        this.game.globals.actors.push(this.enemy);

    },
    addPlayer: function () {
        this.player = new Hero(this.game, this.safetyOffset, this.game.height - this.safetyOffset);

        this.player.y = this.player.y - this.player.height;

        this.player.x = this.player.x + this.player.width*2;

        this.player.originX = this.player.x;

        this.player.originY = this.player.y;

        this.player.addHealthBar(this, 10, 10);

        this.player.updateHealth();

        this.player.attributes = this.player.attributes || new Olympus.ActorAttributes();

        this.player.items = this.player.items || new Olympus.Items();

        this.player.armor = this.player.armor || new Olympus.Armor();

        this.player.direction = "right";

        this.player.inputEnabled = true;

        this.player.events.onInputDown.add(this.player.showMenu, this.player);

        this.game.add.existing(this.player);

        this.player.bringToTop();

        this.game.globals.actors.push(this.player);
    },
    addBackground: function () {
        width = Math.floor((window.innerWidth / 2) / 100) * 100;

        height = Math.floor((window.innerHeight / 2) / 100) * 100;

        this.bg = this.game.add.sprite(0, 0, "battle-grass");


        this.bg.bringToTop();
    },




    create: function () {




        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    checkRoundReady: function () {

        if (this.game.globals.actors[0].currentWeapon && this.player.menu_open == false) {
            this.game.globals.roundReady = true;
        }
    }, update: function () {



        this.checkRoundReady();

        if(this.game.globals.roundReady == true){

            this.game.globals.roundReady = false;


            var defender = this.game.globals.actors[1];
            var attacker = this.game.globals.actors[0];



            if(attacker.currentWeapon){

                attacker.items.item[attacker.currentWeapon].performAction(this.game, attacker, defender);

            }

        }




        if (this.cursors.up.isDown) {
            //this.game.stateTransition.to('Game', true, false);

            console.log("player_round: " + (this.game.globals.player_round));
            console.log("performing: " + (this.game.globals.performing));

        }

    },
    shutdown: function () {
        this.player.destroy();

        this.enemy.destroy();

        this.bg.destroy();

        delete this.game.globals.actorlocations[this.game.globals.currentenemy.currentindex];


    }

};