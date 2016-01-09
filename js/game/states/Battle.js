var Olympus = Olympus || {};

Olympus.Battle = function (game) {
    this.moves_this_turn = [];
    this.round_ready = false;
    this.active_player = null;
    this.menu_items = ['Power', 'Examine', 'Bow', 'Abilities', 'Magic', 'Sword'];


};

Olympus.Battle.prototype = {
    init: function (params) {

        this.terrain = this.game.globals.terrain;

        this.params = params;
        this.offsetY = this.game.width * .25;

        this.addBackground();
        this.addEnemies();
        this.addPlayer();

        this.player_health = this.addHealthBar(0, 0);
        this.enemy_health = this.addHealthBar(this.game.width - 300, 0);

        console.log(this.enemy_health);


    },
    addHealthBar: function (barX, barY) {
        console.log("bar xy: " + barX + ", " + barY);

        var bar = this.game.add.sprite(barX, barY, 'healthbar');
        bar.cropEnabled = true;

        var barCropRect = new Phaser.Rectangle(barX, barY, bar.width, bar.height);
        bar.crop(barCropRect, false);
        bar.barCropRect = barCropRect;

        return bar;
    },
    addEnemies: function () {
        this.enemy = new Enemy(this.game, this.game.width - this.offsetY, 350, "enemy");

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

    },
    addPlayer: function () {
        this.player = new Hero(this.game, this.offsetY, 350);

        this.player.attributes = this.player.attributes || new Olympus.ActorAttributes();
        this.player.weapons = this.player.weapons || new Olympus.Weapons();
        this.player.armor = this.player.armor || new Olympus.Armor();

        this.player.direction = "right";

        this.game.add.existing(this.player);
        this.player.bringToTop();
    },
    addBackground: function () {
        width = Math.floor((window.innerWidth / 2) / 100) * 100;
        height = Math.floor((window.innerHeight / 2) / 100) * 100;

        this.bg = this.add.sprite(width, height, "battle-grass");
        this.bg.anchor.setTo(0.5, 0.5);

        this.bg.scale.x = 6;
        this.bg.scale.y = 6;

        this.bg.bringToTop();
    },
    getCircularX: function (x, radius, index, menu_items) {
        return x + radius * Math.cos(2 * Math.PI * index / menu_items.length);
    },
    getCircularY: function (y, radius, index, menu_items) {
        return y + radius * Math.sin(2 * Math.PI * index / menu_items.length);
    },
    menuClick: function () {

        //this.playerMenu.destroy();
    },
    buttonClick: function () {

        this.game.state.states.Battle.round_ready = true;
        this.game.state.states.Battle.moves_this_turn.push(this.action);

        this.game.state.states.Battle.playerMenu.destroy();
        this.destroy();

    },
    showMenu: function (hero) {
        this.playerMenu = this.game.add.group();
        this.game.world.bringToTop(this.playerMenu);

        var originX = hero.x;
        var originY = hero.y - (height / 3);
        var innerCircleRadius = 140;


        for (var i = 0; i < this.menu_items.length; i++) {

            var chairOriginX = this.getCircularX(originX, innerCircleRadius, i, this.menu_items);
            var chairOriginY = this.getCircularY(originY, innerCircleRadius, i, this.menu_items);

            var chairWidth = 60;

            var button = new LabelButton(this.game, originX, originY, "button", this.menu_items[i], this.menuClick, this);
            button.alpha = 0;
            button.onInputUp.add(this.buttonClick, button);
            button.action = this.menu_items[i];

            this.game.add.tween(button).to({
                x: chairOriginX,
                y: chairOriginY,
                alpha: 1
            }, 500, Phaser.Easing.Circular.InOut, true);
            this.playerMenu.add(button);
        }

    },
    showActorMessage: function (defender, message) {
        var style = {
            font: "32px Arial",
            fill: "#ff0044",
            wordWrap: true,
            wordWrapWidth: this.enemy.width,
            align: "center"
        };
        var text = this.game.add.text(defender.x, defender.y - (defender.height - 50), message, style);
        text.anchor.set(0.5);
        text.bringToTop();

        this.game.add.tween(text).to({
            y: text.y - 70,
            alpha: 0
        }, 2000, Phaser.Easing.Linear.None, true).onComplete.add(text.destroy, text);
    },

    performAction: function (actors) {





            this.flash = this.game.add.graphics(0, 0);
            this.flash.beginFill(0xffffff, 1);
            this.flash.drawRect(0, 0, this.game.width, this.game.height);
            this.flash.endFill();
            this.flash.alpha = 0;



            var defender = actors[1];
            var defenderOriginX = defender.x;

            var attacker = actors[0];
            var attackerOriginX = attacker.x;





            for (action in this.moves_this_turn) {
                var actions_array = [];
                var attacker_anim = this.game.add.tween(attacker);
                var defender_anim = this.game.add.tween(defender);
                if (this.moves_this_turn[action] == "Sword") {


                    attacker_anim.to({x: defender.x - defender.width}, 500, "Quart.easeOut", false);


                    var probability_to_hit = parseInt(this.game.globals.calculateHitProbability(attacker, defender));
                    var message = '';

                    var damage = this.game.globals.calculateWeaponDamage(attacker, defender, this.moves_this_turn[action]);
                    if(probability_to_hit < 0){
                        //means the defender has higher stats for luck
                        message = "DODGE!";
                        defender_anim.to({x: defender.x + defender.width}, 500, "Quart.easeOut", false);
                        defender_anim.to({x: defenderOriginX}, 500, "Quart.easeOut", false);


                    }
                    if(probability_to_hit == 0){
                        message = "MISS!";
                    }
                    if(probability_to_hit > 0){
                        message = "HIT! " + damage;
                        defender.attributes.currentHP -= damage;
                        defender_anim.to({ alpha: 1 }, 1, Phaser.Easing.Cubic.In);
                        defender_anim.to({ alpha: 0 }, 100, Phaser.Easing.Cubic.In);
                        defender_anim.to({ alpha: 1 }, 1, Phaser.Easing.Cubic.In);
                        defender_anim.to({ alpha: 0 }, 100, Phaser.Easing.Cubic.In);
                        defender_anim.to({ alpha: 1 }, 1, Phaser.Easing.Cubic.In);
                    }

                    attacker_anim.to({x: attackerOriginX}, 100, "Quart.easeOut", false);

                    attacker_anim.start();
                    defender_anim.start();
                    this.showActorMessage(defender, message);



                }
            }






        this.round_ready = false;
        this.moves_this_turn = [];

        //console.log("Player HP: " + this.player.attributes.currentHP);
        //console.log("Enemy HP: " + this.enemy.attributes.currentHP);

        //
        //this.player_health.crop.width = (this.player.attributes.currentHP / this.player.attributes.HP) * this.player_health.width;
        //this.player_health.updateCrop();
        //this.enemy_health.crop.width = (this.enemy.attributes.currentHP / this.enemy.attributes.HP) * this.enemy_health.width;
        //this.enemy_health.updateCrop();
    },
    tweenComplete: function (attacker, originX, actors) {
        var that = this;
        console.log("running second attack");

    },
    create: function () {
        this.player.scale.setTo(.6);
        this.enemy.scale.setTo(.6);

        this.player.inputEnabled = true;
        this.player.events.onInputUp.add(this.showMenu, this);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },

    update: function () {

        var actors = [this.player, this.enemy];



        if (this.round_ready == true) {
                this.performAction(actors);
        }
        if (this.cursors.up.isDown) {
            this.game.stateTransition.to('Game', true, false);
        }


    },
    shutdown: function () {
        this.player.destroy();
        this.enemy.destroy();
        this.bg.destroy();

        delete this.game.globals.actorlocations[this.game.globals.currentenemy.currentindex];


    }

};