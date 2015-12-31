var Olympus = Olympus || {};

Olympus.Battle = function (game) {

    this.player = null;
    this.music = null;
    this.map = null;
    this.layer = null;
    this.background = null;
    this.terrain = null;

};

Olympus.Battle.prototype = {
    init:function(params){



        this.params = params;
        this.offsetY = this.game.width * .25;
        //console.log(this.offsetY);
        this.terrain = this.params.playerstats.playerstats.terrain;
        this.addBackground();
        this.addEnemies();
        this.addPlayer();



    },
    addEnemies: function () {
        this.enemy = new Enemy(this.game, this.game.width - this.offsetY, 350, this.params.playerstats.currentenemy.key);
        this.enemy.direction = "left";
        this.enemy.body.fixedRotation = true;
        this.game.add.existing(this.enemy);
        this.enemy.bringToTop();
        //this.enemies = this.game.add.group();
        //
        //for (var i = 0; i < 16; i++)
        //{
        //    //  This creates a new Phaser.Sprite instance within the group
        //    //  It will be randomly placed within the world and use the 'baddie' image to display
        //this.enemies.create(360 + Math.random() * 200, 120 + Math.random() * 200, this.params.playerstats.currentenemy.key);
        //}
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
        this.bg = this.add.sprite(width, height, "battle-"+this.terrain);
        this.bg.anchor.setTo(0.5, 0.5);
        this.bg.scale.x = 6;
        this.bg.scale.y = 6;
        this.bg.bringToTop();
    },
    // And finally the method that handels the pause menu
    menuSelect:function (event){

        // Only act if paused

            // Calculate the corners of the menu
            var x1 = this.game.width/2 - 270/2, x2 = this.game.width/2 + 270/2,
                y1 = this.game.height/2 - 180/2, y2 = this.game.height/2 + 180/2;

            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                // The choicemap is an array that will help us see which item was clicked
                var choisemap = ['Abilities', 'Sword', 'Bow', 'Power', 'Magic', 'Examine'];

                // Get menu local coordinates for the click
                var x = event.x - x1,
                    y = event.y - y1;

                // Calculate the choice
                var choise = Math.floor(x / 90) + 3*Math.floor(y / 90);

                // Display the choice
                choiseLabel.text = 'You chose menu item: ' + choisemap[choise];
            }
            else{
                // Remove the menu and the label
                try{
                    menu.destroy();
                    choiseLabel.destroy();
                }catch(e){
                    console.log("menu doesnt exist")
                }





            }

    },
    showMenu:function (hero) {

        // When the paus button is pressed, we pause the game
        // Then add the menu
        menu = that.game.add.sprite(that.game.width/2, that.game.height/2, 'menu');
        menu.anchor.setTo(0.5, 0.5);

        // And a label to illustrate which menu item was chosen. (This is not necessary)
        choiseLabel = that.game.add.text(that.game.width/2, that.game.height-150, 'Click outside menu to continue', { font: '30px Arial', fill: '#fff' });
        choiseLabel.anchor.setTo(0.5, 0.5);


    },
    create: function () {
        that = this;
        this.player.scale.setTo(.6);
        this.enemy.scale.setTo(.6);



        this.player.inputEnabled = true;
        this.player.events.onInputUp.add(this.showMenu);

        // Create a label to use as a button
        pause_label = this.game.add.text(this.game.width - 100, 20, 'Pause', { font: '24px Arial', fill: '#fff' });
        pause_label.inputEnabled = true;
        pause_label.events.onInputUp.add(function () {
                // When the paus button is pressed, we pause the game
            that.game.paused = true;
                console.log(that.game);
                // Then add the menu
                menu = that.game.add.sprite(that.game.width/2, that.game.height/2, 'menu');
                menu.anchor.setTo(0.5, 0.5);

                // And a label to illustrate which menu item was chosen. (This is not necessary)
                choiseLabel = that.game.add.text(that.game.width/2, that.game.height-150, 'Click outside menu to continue', { font: '30px Arial', fill: '#fff' });
                choiseLabel.anchor.setTo(0.5, 0.5);


        });
        // Add a input listener that can help us return from being paused
        this.game.input.onDown.add(this.menuSelect, this);
        this.cursors = this.game.input.keyboard.createCursorKeys();
    },
    update: function () {
        //this.params.playerstats.playerstats.player.HP += 1;

        //this.enemy.direction = this.params.playerstats.currentenemy.battleDirection;
        //this.enemy.move();
        //this.player.move();
        //console.log(this.player.x);
        this.params.playerstats.playerstats.HP+=1;
        if(this.cursors.up.isDown){
            //this.game.state.start('Game', true, false, this.params);
            this.game.stateTransition.to('Game', true, false, this.params);
        }


    },
    shutdown: function(){
        this.player.destroy();
        this.enemy.destroy();
        this.bg.destroy();

    }

};