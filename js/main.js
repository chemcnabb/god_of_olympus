var Olympus = Olympus || {};

Olympus.game = new Phaser.Game(800, 600, Phaser.CANVAS, 'game');

Olympus.game.state.add('Boot', Olympus.Boot);
Olympus.game.state.add('Preload', Olympus.Preload);
Olympus.game.state.add('MainMenu', Olympus.MainMenu);
Olympus.game.state.add('Game', Olympus.Game);
Olympus.game.state.add('Battle', Olympus.Battle);

Olympus.game.state.start('Boot');