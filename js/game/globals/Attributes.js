var Olympus = Olympus || {};
Olympus.ActorAttributes = function(){



        //Health Points, the maximum health of the character/enemy, if the health is healed, it may not exceed this points
        this.HP= 100;

        //The character’s current health points, if this goes down to zero the character dies
    this.currentHP= 75;

        //Spirit points, needed to use skills/magics, if SP is restored the value cannot exceed this points
        this.SP= 0;

        //The character’s current SP, cannot be less than zero.
        this.currentSP= 0;

        //Attack power. Determines the power of physical attack
        this.ATK= 0;

        //Defense power. Determines the power of physical defense.
        this.DEF= 0;

        //Accuracy. Determines the accuracy of attacks, whether it’s physical or magical.
        this.ACC= 2;
        //Evasion. Determines whether the character is able to evade enemy’s attacks.
        this.EVA= 5;

        //Intelligence. Determines magical attack power.
        this.INT= 0;

        //Resistance. Determines magical defense power.
        this.RES= 0;

        //Luck. Determines various things, from critical attack to item drop rate , or something elsa.
        this.LUK= 0;



    



};
//Olympus.Tools.prototype = Object.create(Phaser.Sprite.prototype);

Olympus.ActorAttributes.prototype = {

    //setPlayerProperties: function(player, index){
    //
    //
    //},


};


