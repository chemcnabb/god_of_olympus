var Olympus = Olympus || {};

Olympus.Battle = function (game) {
    this.player_moves = [];
    this.player_ready = false;
    this.active_player = null;
};

Olympus.Battle.prototype = {
    init:function(params){


        this.menu_items = ['Power', 'Examine', 'Bow', 'Abilities', 'Magic', 'Sword'];
        this.params = params;
        this.offsetY = this.game.width * .25;
        //this.game.physics.startSystem(Phaser.Physics.P2JS);
        this.terrain = Olympus.PlayerStats.terrain;
        this.addBackground();
        this.addEnemies();
        this.addPlayer();



    },
    addEnemies: function () {
        this.enemy = new Enemy(this.game, this.game.width - this.offsetY, 350, "enemy");
        Olympus.PlayerStats.setPlayerProperties(this.enemy, parseInt(Olympus.PlayerStats.currentenemy.name.replace("enemy_", "")));

        this.enemy.direction = "left";
        //this.enemy.body.fixedRotation = true;
        //this.enemy.body.setZeroVelocity();
        this.game.add.existing(this.enemy);
        this.enemy.bringToTop();

    },
    addPlayer: function () {
        this.player = new Hero(this.game, this.offsetY, 350);
        this.player.direction = "right";
        this.game.add.existing(this.player);
        this.player.bringToTop();
    },
    addBackground: function () {
        width = Math.floor((window.innerWidth/2)/100)*100;
        height = Math.floor((window.innerHeight/2)/100)*100;
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
    menuClick: function(){

        //this.playerMenu.destroy();
    },
    buttonClick: function(){

        this.game.state.states.Battle.player_ready = true;
        this.game.state.states.Battle.player_moves.push(this.action);

        this.game.state.states.Battle.playerMenu.destroy();
        this.destroy();

    },
    showMenu:function (hero) {
        this.playerMenu = this.game.add.group();
        this.game.world.bringToTop(this.playerMenu);

        var originX =hero.x;
        var originY = hero.y-(height/3);
        var innerCircleRadius = 140;


        for(var i = 0; i < this.menu_items.length; i++) {
            var chairOriginX = this.getCircularX(originX, innerCircleRadius, i, this.menu_items);
            var chairOriginY = this.getCircularY(originY, innerCircleRadius, i, this.menu_items);
            var chairWidth = 60;

            var button = new LabelButton(this.game, originX, originY, "button", this.menu_items[i], this.menuClick, this);
            button.alpha = 0;
            button.onInputUp.add(this.buttonClick, button);
            button.action = this.menu_items[i];


            this.game.add.tween(button).to({x:chairOriginX, y:chairOriginY, alpha:1}, 500, Phaser.Easing.Circular.InOut, true);
            this.playerMenu.add(button);
        }

    },
    performAction: function(){
        console.log(this.player.x);
        originX = this.player.x;
        originY = this.player.y;
        for (action in this.player_moves){

            if(this.player_moves[action] == "Sword"){
                console.log(this.player_moves[action]);
                this.game.add.tween(this.player).to( { x: this.enemy.x - this.enemy.width }, 500, "Quart.easeOut", true).onComplete.add(this.tweenComplete, this);;

            }
        }



        this.player_ready = false;
        this.player_moves = [];
    },
    tweenComplete:function(){
        console.log("tween complete");
        this.game.add.tween(this.player).to( { x: originX }, 100, "Quart.easeOut", true);
    },
    create: function () {
        this.player.scale.setTo(.6);
        this.enemy.scale.setTo(.6);

        this.player.inputEnabled = true;
        this.player.events.onInputUp.add(this.showMenu, this);

        this.cursors = this.game.input.keyboard.createCursorKeys();
    },
    update: function () {

        this.active_player = this.player;
        if(this.player_ready == true){
            this.performAction();
        }
        if(this.cursors.up.isDown){
            //this.game.state.start('Game', true, false, this.params);
            this.game.stateTransition.to('Game', true, false);
        }


    },
    shutdown: function(){
        this.player.destroy();
        this.enemy.destroy();
        this.bg.destroy();
        console.log(Olympus.PlayerStats.enemylocations);
        console.log(Olympus.PlayerStats.currentenemy.currentindex);
        delete Olympus.PlayerStats.enemylocations[Olympus.PlayerStats.currentenemy.currentindex];
        console.log(Olympus.PlayerStats.enemylocations);


    }

};