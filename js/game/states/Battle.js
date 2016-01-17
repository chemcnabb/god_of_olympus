var Olympus = Olympus || {};

Olympus.Battle = function (game) {
    //this.moves_this_turn = [];

    this.active_player = null;
    this.menu_items = ['Power', 'Examine', 'Bow', 'Abilities', 'Magic', 'Sword'];
    this.safetyOffset = 100;
    this.menu_open = false;
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

        var currentenemy = 0;

        if (this.game.globals.currentenemy) {

            currentenemy = this.game.globals.currentenemy.name.replace("enemy_", "");
        }

        this.game.globals.setPlayerProperties(this.enemy, parseInt(currentenemy));

        this.enemy.attributes = this.enemy.attributes || new Olympus.ActorAttributes();

        this.enemy.weapons = this.enemy.weapons || new Olympus.Weapons();

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

        this.player.attributes = this.player.attributes || new Olympus.ActorAttributes();

        this.player.weapons = this.player.weapons || new Olympus.Weapons();

        this.player.armor = this.player.armor || new Olympus.Armor();

        this.player.direction = "right";

        this.player.inputEnabled = true;

        this.player.events.onInputDown.add(this.showMenu, this);

        this.game.add.existing(this.player);

        this.player.bringToTop();

        this.game.globals.actors.push(this.player);
    },
    addBackground: function () {
        width = Math.floor((window.innerWidth / 2) / 100) * 100;

        height = Math.floor((window.innerHeight / 2) / 100) * 100;

        this.bg = this.game.add.sprite(0, 0, "battle-grass");
        //this.bg.anchor.setTo(0.5, 0.5);

        //this.bg.scale.x = 6;
        //this.bg.scale.y = 6;

        this.bg.bringToTop();
    },
    getCircularX: function (x, radius, index, menu_items) {
        return x + radius * Math.cos(2 * Math.PI * index / menu_items.length);
    },
    getCircularY: function (y, radius, index, menu_items) {
        return y + radius * Math.sin(2 * Math.PI * index / menu_items.length);
    },
    menuClick: function () {
        console.log("MENU CLICK");

        console.log(this);
        //this.playerMenu.destroy();
    },

    buttonClick: function () {



        this.game.state.states.Battle.menu_open = false;



        this.game.state.states.Battle.playerMenu.destroy();


        //this.destroy();

    },
    showMenu: function (hero) {



        if(this.menu_open == false) {

            this.menu_open = true;

            this.playerMenu = this.game.add.group();

            this.game.world.bringToTop(this.playerMenu);

            var innerCircleRadius = 140;

            for (var i = 0; i < this.menu_items.length; i++) {

                var chairOriginX = this.getCircularX(hero.originX, innerCircleRadius, i, this.menu_items);

                var chairOriginY = this.getCircularY(hero.originY, innerCircleRadius, i, this.menu_items);

                var chairWidth = 69;

                var button = new LabelButton("menu_" + this.menu_items[i].toLowerCase(), this.game, hero.originX, hero.originY, "button", this.menu_items[i]);

                button.alpha = 0;

                button.selectedAction = this.menu_items[i];

                button.onInputDown.add(this.buttonClick, button);

                hero.currentWeapon = this.menu_items[i];

                this.game.add.tween(button).to({
                    x: chairOriginX,
                    y: chairOriginY,
                    alpha: 1
                }, 500, Phaser.Easing.Circular.InOut, true).autoDestroy = true;

                this.playerMenu.add(button);
            }
        }

    },

    performAction: function () {

        var defender = this.game.globals.actors[1];
        var attacker = this.game.globals.actors[0];
        //console.log(attacker.anim);


        if(attacker.currentWeapon){

            attacker.weapons.weapon[attacker.currentWeapon].performAction(this.game, attacker, defender);

        }


    },

    create: function () {




        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function () {

        this.enemy.updateHealth();

        this.player.updateHealth();

        if(this.game.globals.actors[0].currentWeapon && this.menu_open == false){
            this.game.globals.roundReady = true;
        }

        if(this.game.globals.roundReady == true){

            this.game.globals.roundReady = false;


            this.performAction();

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