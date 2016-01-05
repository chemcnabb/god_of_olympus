var Olympus = Olympus || {};
Olympus.PlayerStats = function(){
    this.terrain = "";
   this.enemylocations = {};
    this.playerX = 200;
    this.playerY = 100;

    this.attributes = {
        //Health Points, the maximum health of the character/enemy, if the health is healed, it may not exceed this points
        HP: 100,

        //The character’s current health points, if this goes down to zero the character dies
        currentHP: 0,

        //Spirit points, needed to use skills/magics, if SP is restored the value cannot exceed this points
        SP: 0,

        //The character’s current SP, cannot be less than zero.
        currentSP: 0,

        //Attack power. Determines the power of physical attack
        ATK: 0,

        //Defense power. Determines the power of physical defense.
        DEF: 0,

        //Accuracy. Determines the accuracy of attacks, whether it’s physical or magical.
        ACC: 0,
        //Evasion. Determines whether the character is able to evade enemy’s attacks.
        EVA: 0,

        //Intelligence. Determines magical attack power.
        INT: 0,

        //Resistance. Determines magical defense power.
        RES: 0,

        //Luck. Determines various things, from critical attack to item drop rate , or something elsa.
        LUK: 0
    };

    this.weapon_sttributes =
    {
        "Sword" : {
            minAtk: 2,//Weapon’s lowest attack,
            maxAtk: 5,//Weapon’s highest attack,
            StatsMod:3 ,//Stats of player character that this weapon modifies. Not all weapons have this stat so this may empty.
            Element: 3,//Weapon’s element, this may empty.
        }
    };

    this.armor_attributes = {
        StatsMod:3 ,//Stats of player character that this weapon modifies. Not all weapons have this stat so this may empty.
        Element: 3,//Weapon’s element, this may empty.

    };
        this.rand_range = function(min, max){

            return Math.floor(Math.random() * (max - min + 1)) + min;

        };
    this.weapon_damage = function(attacker, defender){
        return Math.ceil(attacker.attributes.ATK + this.rand_range(attacker.weapon_attributes.minAtk, attacker.weapon_attributes.maxAtk)) - (defender.attributes.DEF + this.rand_range(defender.weapon_attributes.minDef, defender.weapon_attributes.maxDef));
    };
    this.magical_damage = function(attacker, defender){
        return Math.ceil((attacker.attributes.INT + this.rand_range(attacker.weapon_attributes.minMag, attacker.weapon_attributes.maxMag)) - defender.attributes.RES);
    };
    this.hit_success = function(attacker, defender){
        var probability = (attacker.attrbitues.ACC * this.rand_range(0, 6))-(defender.attrbitues.EVA * this.rand_range(0, 6));
        return probability>=0;
    },
    this.currentenemyindex = null;



};
//Olympus.Tools.prototype = Object.create(Phaser.Sprite.prototype);

Olympus.PlayerStats.prototype = {

    getPlayerTerrainType : function(){
        return;
    },
    setPlayerStats: function(player){
        this.terrain = this.getPlayerTerrainType();
        this.currentenemyindex = player.sprite.currentindex;
        this.currentenemy = player.sprite;
    },
    setPlayerProperties: function(player, index){
        player.name = "enemy_" + index;
        player.currentindex = index;
        player.scale.set(.2, .2);
        player.autoCull = true;
        player.enableBody = true;
        player.physicsBodyType = Phaser.Physics.P2JS;
        player.attributes = this.attributes;
        this.enemylocations[index] = player;
        return player;
    },


};

Olympus.PlayerStats = new Olympus.PlayerStats();