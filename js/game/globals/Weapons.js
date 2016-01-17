var Olympus = Olympus || {};

Olympus.Weapons = function(game){

    var attacker = null;
    var target = null;

    this.weapon =
    {
        "Sword" : {
            minAtk: 2,//Weapon’s lowest attack,
            maxAtk: 7,//Weapon’s highest attack,
            minDef:0,
            maxDef: 6,
            StatsMod:3 ,//Stats of player character that this weapon modifies. Not all weapons have this stat so this may empty.
            Element: 3,//Weapon’s element, this may empty.

            performAction:function(game, attacker, target){
                console.log("performing Sword weapon action");
                this.game = game;
                this.attacker = attacker;
                this.target = target;

                //this.attacker.anim.timeline = [];
                //this.target.anim.timeline = [];

                this.attacker.resetAnim();
                this.target.resetAnim();

                console.log("attacker move to target position");
                this.attacker.anim.to({x: this.target.x - this.target.width/2}, 1000, Phaser.Easing.Linear.None, false).autoDestroy = true;

                var probability_to_hit = parseInt(this.game.globals.calculateHitProbability(this.attacker, this.target));
                var message = '';

                var damage = this.game.globals.calculateWeaponDamage(this.attacker, this.target, this.attacker.currentWeapon);

                if (probability_to_hit < 0) {
                    //means the this.target has higher stats for luck
                    message = "DODGE!";
                    console.log("target performing dodge");
                    this.target.anim.to({x: this.target.x + this.target.width/2}, 500, "Quart.easeOut", false).autoDestroy = true;
                    this.target.anim.to({x: this.target.originX}, 500, "Quart.easeOut", false).autoDestroy = true;
                }
                else if (probability_to_hit == 0) {
                    console.log("attacker misses");
                    message = "MISS!";
                }
                else if (probability_to_hit > 0) {
                    message = "HIT! " + damage;
                    this.target.attributes.currentHP -= damage;

                    console.log("attacker hits, target flashes");
                    this.target.anim.to({alpha: 1, delay:1000}, 1, Phaser.Easing.Cubic.In).autoDestroy = true;
                    this.target.anim.to({alpha: 0, delay:1000}, 100, Phaser.Easing.Cubic.In).autoDestroy = true;
                    this.target.anim.to({alpha: 1, delay:1000}, 1, Phaser.Easing.Cubic.In).autoDestroy = true;
                    this.target.anim.to({alpha: 0, delay:1000}, 100, Phaser.Easing.Cubic.In).autoDestroy = true;
                    this.target.anim.to({alpha: 1, delay:1000}, 1, Phaser.Easing.Cubic.In).autoDestroy = true;

                    console.log("animate health bar on target");
                    this.game.add.tween(this.target.health).to({
                        barProgress: this.target.health.barProgress -= (damage+20)},
                        2000,
                        null,
                        true).autoDestroy = true;
                }

                console.log("attacker move to original position");
                this.attacker.anim.to({
                    x: this.attacker.originX},
                    100,
                    "Quart.easeOut",
                    false).onComplete.add(this.actionComplete, this);


                this.attacker.anim.start();

                //as tween starts, also run animaton to swing sword
                try{
                    this.attacker.animations.play('sword_swing', 12, false);
                }catch(e){
                    console.log("this.attacker has no animation '" + 'sword_swing' + "'");
                }

                attacker.currentWeapon = null;


                game.time.events.add(Phaser.Timer.SECOND, (function() {
                    console.log("target to perform " + message);
                    console.log(target.anim);
                    target.anim.start();
                    target.showMessage(message);
                }), this).autoDestroy = true;


            },
            actionComplete : function (actor) {
                console.log("completing action for " + this.attacker.key);
                this.attacker.resetAnim();

                this.game.globals.performing = false;


                this.attacker.animations.play(this.attacker.battleRest);




                this.game.globals.actors.push(this.game.globals.actors.shift());

                if(this.game.globals.actors[0].key == "hero"){
                    this.game.globals.player_round = true;
                }else{
                    this.game.state.states.Battle.enemy.currentWeapon = "Sword";
                    this.game.globals.player_round = false;
                }

                console.log("tween complete");



            },
        }
    };







};
//Olympus.Tools.prototype = Object.create(Phaser.Sprite.prototype);

Olympus.Weapons.prototype = {

    //setPlayerProperties: function(player, index){
    //
    //
    //},


};


