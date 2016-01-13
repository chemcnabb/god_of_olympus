var Olympus = Olympus || {};
Olympus.Globals = function(){
    this.terrain = "";
    this.actorlocations = {};
    this.playerX = 200;
    this.playerY = 100;

    this.attributes = {
        //Health Points, the maximum health of the character/enemy, if the health is healed, it may not exceed this points
        HP: 100,

        //The character’s current health points, if this goes down to zero the character dies
        currentHP: 75,

        //Spirit points, needed to use skills/magics, if SP is restored the value cannot exceed this points
        SP: 0,

        //The character’s current SP, cannot be less than zero.
        currentSP: 0,

        //Attack power. Determines the power of physical attack
        ATK: 0,

        //Defense power. Determines the power of physical defense.
        DEF: 0,

        //Accuracy. Determines the accuracy of attacks, whether it’s physical or magical.
        ACC: 2,
        //Evasion. Determines whether the character is able to evade enemy’s attacks.
        EVA: 5,

        //Intelligence. Determines magical attack power.
        INT: 0,

        //Resistance. Determines magical defense power.
        RES: 0,

        //Luck. Determines various things, from critical attack to item drop rate , or something elsa.
        LUK: 0
    };

    this.weapon_attributes =
    {
        "Sword" : {
            minAtk: 2,//Weapon’s lowest attack,
            maxAtk: 7,//Weapon’s highest attack,
            minDef:0,
            maxDef: 6,
            StatsMod:3 ,//Stats of player character that this weapon modifies. Not all weapons have this stat so this may empty.
            Element: 3,//Weapon’s element, this may empty.
        }
    }

    this.armor_attributes = {
        StatsMod:3 ,//Stats of player character that this weapon modifies. Not all weapons have this stat so this may empty.
        Element: 3,//Weapon’s element, this may empty.

    };

    this.currentenemyindex = null;



};
//Olympus.Tools.prototype = Object.create(Phaser.Sprite.prototype);

Olympus.Globals.prototype = {
    randRange : function(min, max){
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    calculateWeaponDamage: function(attacker, defender, weapon){
        console.log("calculate weapon damage");
        attack = attacker.attributes.ATK + this.randRange(attacker.weapons.weapons[weapon].minAtk,
                attacker.weapons.weapons[weapon].maxAtk);
        defend = defender.attributes.DEF + this.randRange(defender.weapons.weapons[weapon].minDef,
                defender.weapons.weapons[weapon].maxDef);

        var damage = parseInt(Math.ceil(attack - defend));
        if (damage<=0){
            damage = 0;
        }
        console.log("DAMAGE: " + damage);
        return damage;
    },
    magicalDamage: function(attacker, defender){
        return Math.ceil((attacker.attributes.INT + this.randRange(attacker.weapons.weapons.minMag,
                attacker.weapons.weapons.maxMag)) - defender.attributes.RES);
    },
    calculateHitProbability : function(attacker, defender){
        //console.log(attacker);
        var probability = (attacker.attributes.ACC * this.randRange(0, 6))-(defender.attributes.EVA * this.randRange(0, 6));
        return probability + 10;
    },
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
        //player.enableBody = true;
        //player.physicsBodyType = Phaser.Physics.P2JS;



        this.actorlocations[index] = player;

        return player;
    },


};

