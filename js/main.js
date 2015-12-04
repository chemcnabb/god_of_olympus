var Olympus = Olympus || {};

Olympus.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '');

Olympus.game.state.add('Boot', Olympus.Boot);
Olympus.game.state.add('Preload', Olympus.Preload);
Olympus.game.state.add('MainMenu', Olympus.MainMenu);
Olympus.game.state.add('Game', Olympus.Game);
Olympus.game.state.add('Battle', Olympus.Battle);

Olympus.game.state.start('Boot');