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

                this.game = game;
                this.attacker = attacker;
                this.target = target;
                this.game.globals.performing = true;


                this.attacker.resetAnim();
                this.target.resetAnim();

                this.attacker.performAttack(this.target);

                var probability_to_hit = parseInt(this.game.globals.calculateHitProbability(this.attacker, this.target));
                var message = '';

                var damage = this.game.globals.calculateWeaponDamage(this.attacker, this.target, this.attacker.currentWeapon);

                if (probability_to_hit < 0) {
                    //means the this.target has higher stats for luck
                    message = "DODGE!";

                    this.target.performDodge();
                }
                else if (probability_to_hit == 0 || damage == 0) {
                    message = "MISS!";
                }
                else if (probability_to_hit > 0) {
                    message = "HIT! " + damage;
                    this.target.attributes.currentHP -= damage;

                    this.target.performFlash();
                    this.target.performHit(damage);

                }

                var totalDuration = this.attacker.anim.totalDuration;

                this.attacker.endAttack();

                this.attacker.anim.start();

                try{
                    this.attacker.animations.play('sword_swing', 12, false);
                }catch(e){
                    console.log("this.attacker has no animation '" + 'sword_swing' + "'");
                }

                this.attacker.currentWeapon = null;


                game.time.events.add(Phaser.Timer.SECOND, (function() {


                    target.anim.start();
                    target.showMessage(message);
                }), this).autoDestroy = true;


            }

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


