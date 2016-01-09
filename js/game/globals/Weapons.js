var Olympus = Olympus || {};
Olympus.Weapons = function(){



    this.weapons =
    {
        "Sword" : {
            minAtk: 2,//Weapon’s lowest attack,
            maxAtk: 7,//Weapon’s highest attack,
            minDef:0,
            maxDef: 6,
            StatsMod:3 ,//Stats of player character that this weapon modifies. Not all weapons have this stat so this may empty.
            Element: 3,//Weapon’s element, this may empty.
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


