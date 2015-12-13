var ActorStats = {
    player:null,
    playerstats : {
        //Health Points, the maximum health of the character/enemy, if the health is healed, it may not exceed this points
        HP : 0,

        //The character’s current health points, if this goes down to zero the character dies
        currentHP : 0,

        //Spirit points, needed to use skills/magics, if SP is restored the value cannot exceed this points
        SP : 0,

        //The character’s current SP, cannot be less than zero.
        currentSP : 0,

        //Attack power. Determines the power of physical attack
        ATK : 0,

        //Defense power. Determines the power of physical defense.
        DEF : 0,

        //Accuracy. Determines the accuracy of attacks, whether it’s physical or magical.
        ACC : 0,
        //Evasion. Determines whether the character is able to evade enemy’s attacks.
        EVA : 0,

        //Intelligence. Determines magical attack power.
        INT : 0,

        //Resistance. Determines magical defense power.
        RES : 0,

        //Luck. Determines various things, from critical attack to item drop rate , or something elsa.
        LUK : 0
    },
    currentenemy:null






};



//ActorStats.prototype.update = function(){
//
//};