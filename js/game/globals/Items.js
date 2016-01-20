var Olympus = Olympus || {};

Olympus.Items = function(game){



    this.item =
    {
        "Melee":{
            "Sword" : {
                "Swing":{
                    minAtk: 2,//Weapon’s lowest attack,
                    maxAtk: 7,//Weapon’s highest attack,
                    minDef:0,
                    maxDef: 6,
                    StatsMod:3 ,//Stats of player character that this item modifies. Not all items have this stat so this may empty.
                    Element: 3,//Weapon’s element, this may empty.

                    performAction:function(game, attacker, target){

                        game.globals.performing = true;
                        target.message = "";

                        attacker.resetAnim();
                        target.resetAnim();

                        attacker.performAttack(target);

                        var probability_to_hit = parseInt(game.globals.calculateHitProbability(attacker, target));

                        var damage = game.globals.calculateWeaponDamage(attacker, target, attacker.currentWeapon);

                        if (probability_to_hit < 0) {
                            //means the target has higher stats for luck
                            target.message = "DODGE!";
                            target.performDodge();
                        }
                        else if (probability_to_hit == 0 || damage == 0) {
                            target.message = "MISS!";
                        }
                        else if (probability_to_hit > 0) {
                            target.message = "HIT! " + damage;
                            target.attributes.currentHP -= damage;
                            target.performFlash();
                            target.performHit(damage);

                        }

                        //var totalDuration = attacker.anim.totalDuration;

                        attacker.endAttack();

                        attacker.runOffensiveAnimation();

                        attacker.currentWeapon = null;

                        target.runDefensiveAnimation();


                    }
                }

            }
        }

    };

};
//Olympus.Tools.prototype = Object.create(Phaser.Sprite.prototype);

Olympus.Items.prototype = {

    //setPlayerProperties: function(player, index){
    //
    //
    //},


};


