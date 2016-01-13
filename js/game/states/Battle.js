var Olympus = Olympus || {};

Olympus.Battle = function (game) {
    this.moves_this_turn = [];
    this.round_ready = false;
    this.active_player = null;
    this.menu_items = ['Power', 'Examine', 'Bow', 'Abilities', 'Magic', 'Sword'];
    this.safetyOffset = 100;
    this.menu_open = false;
    this.performing = false;
    this.actors = [];

};

Olympus.Battle.prototype = {
    init: function (params) {

        this.terrain = this.game.globals.terrain;

        this.params = params;
        this.offsetY = this.game.width * .25;

        this.addBackground();
        this.addEnemies();
        this.addPlayer();







    },
    addHealthBar: function (barX, barY) {
        // the bar itself
        bar = this.add.bitmapData(128, 8);

        this.game.add.sprite(barX, barY, bar);

        bar.barProgress = 128;

        return bar;
    },
    addEnemies: function () {
        this.enemy = new Enemy(this.game, this.game.width - this.safetyOffset, this.game.height - this.safetyOffset, "enemy");
        this.enemy.y = this.enemy.y - this.enemy.height+60;
        this.enemy.x = this.enemy.x - this.enemy.width;

        this.enemy.health = this.addHealthBar(this.game.width - 128, 0);

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
        this.actors.push(this.enemy);

    },
    addPlayer: function () {
        this.player = new Hero(this.game, this.safetyOffset, this.game.height - this.safetyOffset);
        this.player.y = this.player.y - this.player.height;
        this.player.x = this.player.x + this.player.width*2;

        this.player.health = this.addHealthBar(0, 0);

        this.player.attributes = this.player.attributes || new Olympus.ActorAttributes();
        this.player.weapons = this.player.weapons || new Olympus.Weapons();
        this.player.armor = this.player.armor || new Olympus.Armor();

        this.player.direction = "right";

        this.game.add.existing(this.player);
        this.player.bringToTop();

        this.actors.push(this.player);
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

        //this.playerMenu.destroy();
    },
    enemyMoveChoice: function(enemy){
        this.game.time.events.add(Phaser.Timer.SECOND, (function() {
            this.round_ready = true;
            this.moves_this_turn.push("Sword");
        }), this).autoDestroy = true;

    },
    buttonClick: function () {

        this.game.state.states.Battle.round_ready = true;
        this.game.state.states.Battle.menu_open = false;
        this.game.state.states.Battle.moves_this_turn.push(this.action);
        this.game.state.states.Battle.playerMenu.destroy();
        //this.destroy();

    },
    showMenu: function (hero) {
        if(this.menu_open == false) {

            this.menu_open = true;

            this.playerMenu = this.game.add.group();
            this.game.world.bringToTop(this.playerMenu);

            var originX = hero.x;
            var originY = hero.y - (height / 3);
            var innerCircleRadius = 140;


            for (var i = 0; i < this.menu_items.length; i++) {

                var chairOriginX = this.getCircularX(originX, innerCircleRadius, i, this.menu_items);
                var chairOriginY = this.getCircularY(originY, innerCircleRadius, i, this.menu_items);

                var chairWidth = 69;

                var button = new LabelButton("menu_" + this.menu_items[i].toLowerCase(), this.game, originX, originY, "button", this.menu_items[i], this.menuClick, this);
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
        }

    },
    showActorMessage: function (defender, message) {

        var style = {
            font: "32px Diogenes",
            fill: "#ff0044",
            wordWrap: true,
            wordWrapWidth: this.enemy.width,
            align: "center"
        };
        var text = this.game.add.text(defender.x, defender.y - (defender.height/2), message, style);
        text.anchor.set(0.5);
        text.bringToTop();

        this.game.add.tween(text).to({
            y: text.y - 70,
            alpha: 0
        }, 2000, Phaser.Easing.Linear.None, true).onComplete.add(text.destroy, text);
    },
    performAction: function (actors) {

            var defender = actors[1];
            var defenderOriginX = defender.x;

            var attacker = actors[0];
            var attackerOriginX = attacker.x;



            if(this.performing == false) {

                this.performing = true;
                for (var action in this.moves_this_turn) {

                    var attacker_anim = this.game.add.tween(attacker);
                    var defender_anim = this.game.add.tween(defender);

                    if (this.moves_this_turn[action] == "Sword") {


                        attacker_anim.to({x: defender.x - defender.width/2}, 1000, Phaser.Easing.Linear.None, false);


                        var probability_to_hit = parseInt(this.game.globals.calculateHitProbability(attacker, defender));
                        var message = '';

                        var damage = this.game.globals.calculateWeaponDamage(attacker, defender, this.moves_this_turn[action]);

                        if (probability_to_hit < 0) {
                            //means the defender has higher stats for luck
                            message = "DODGE!";
                            defender_anim.to({x: defender.x + defender.width/2}, 500, "Quart.easeOut", false);
                            defender_anim.to({x: defenderOriginX}, 500, "Quart.easeOut", false);
                        }
                        else if (probability_to_hit == 0) {
                            message = "MISS!";
                        }
                        else if (probability_to_hit > 0) {
                            message = "HIT! " + damage;
                            defender.attributes.currentHP -= damage;
                            defender_anim.to({alpha: 1, delay:1000}, 1, Phaser.Easing.Cubic.In);
                            defender_anim.to({alpha: 0, delay:1000}, 100, Phaser.Easing.Cubic.In);
                            defender_anim.to({alpha: 1, delay:1000}, 1, Phaser.Easing.Cubic.In);
                            defender_anim.to({alpha: 0, delay:1000}, 100, Phaser.Easing.Cubic.In);
                            defender_anim.to({alpha: 1, delay:1000}, 1, Phaser.Easing.Cubic.In);

                            this.game.add.tween(defender.health).to({barProgress: defender.health.barProgress -= damage}, 2000, null, true);
                        }

                        attacker_anim.to({x: attackerOriginX}, 100, "Quart.easeOut", false).onComplete.add(this.tweenComplete, this);

                        attacker_anim.start();
                        try{
                            attacker.animations.play('sword_swing', 12, false);
                        }catch(e){
                            console.log("attacker has no animation '" + 'sword_swing' + "'");
                        }


                        this.game.time.events.add(Phaser.Timer.SECOND, (function() {
                            defender_anim.start();
                            this.showActorMessage(defender, message);
                        }), this).autoDestroy = true;



                    }
                }


            }




        console.log("Player HP: " + this.player.attributes.currentHP);
        console.log("Enemy HP: " + this.enemy.attributes.currentHP);


    },
    tweenComplete: function (attacker, originX, actors) {
        this.performing = false;
        this.player.animations.play("right");
        this.round_ready = false;
        this.moves_this_turn = [];

        var shifted = this.actors.shift();
        this.actors.push(shifted);
        console.log(this.actors);

    },
    create: function () {
        this.player.scale.setTo(.6);
        this.enemy.scale.setTo(.6);

        this.player.inputEnabled = true;
        this.player.events.onInputUp.add(this.showMenu, this);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },
    updateHealth: function (health) {
        health.context.clearRect(0, 0, health.width, health.height);

        // some simple colour changing to make it look like a health bar
        if (health.barProgress < 32) {
            health.context.fillStyle = '#f00';
        }
        else if (health.barProgress < 64) {
            health.context.fillStyle = '#ff0';
        }
        else {
            health.context.fillStyle = '#0f0';
        }

        // draw the bar
        health.context.fillRect(0, 0, health.barProgress, 8);

        // important - without this line, the context will never be updated on the GPU when using webGL
        health.dirty = true;

        return health;
    },
    update: function () {


        this.enemy.health = this.updateHealth(this.enemy.health);
        this.player.health = this.updateHealth(this.player.health);

        if(this.actors[0] != this.player && this.round_ready == false){
            console.log("setting enemy choice);");
            this.enemyMoveChoice(this.enemy);
        }

        if (this.round_ready == true) {
                this.performAction(this.actors);

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