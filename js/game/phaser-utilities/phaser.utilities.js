
Phaser.Tilemap.prototype.setCollisionBetween = function (start, stop, collides, layer, recalculate) {

    if (collides === undefined) { collides = true; }
    if (layer === undefined) { layer = this.currentLayer; }
    if (recalculate === undefined) { recalculate = true; }

    layer = this.getLayer(layer);

    for (var index = start; index <= stop; index++)
    {
        if (collides)
        {
            this.collideIndexes.push(index);
        }
        else
        {
            var i = this.collideIndexes.indexOf(index);

            if (i > -1)
            {
                this.collideIndexes.splice(i, 1);
            }
        }
    }

    for (var y = 0; y < this.layers[layer].height; y++)
    {
        for (var x = 0; x < this.layers[layer].width; x++)
        {
            var tile = this.layers[layer].data[y][x];

            if (tile && tile.index >= start && tile.index <= stop)
            {
                if (collides)
                {
                    tile.setCollision(true, true, true, true);
                }
                else
                {
                    tile.resetCollision();
                }

                tile.faceTop = collides;
                tile.faceBottom = collides;
                tile.faceLeft = collides;
                tile.faceRight = collides;
            }
        }
    }

    if (recalculate)
    {
        //  Now re-calculate interesting faces
        this.calculateFaces(layer);
    }

    return layer;

};

var LabelButton = function(menu_key, game, x, y, key, label, callback,
                           callbackContext, overFrame, outFrame, downFrame, upFrame)
{
    this.game = game;
    Phaser.Button.call(this, game, x, y, key, callback,
        callbackContext, overFrame, outFrame, downFrame, upFrame);

    //Style how you wish...
    this.style = {
        'font': '12px Arial',
        'fill': 'black'
    };
    this.anchor.setTo( 0.5, 0.5 );
    this.label = new Phaser.Text(game, 0, 0, label, this.style);
    //this.label = this.game.add.sprite(0, 0, menu_key);

    //puts the label in the center of the button
    this.label.anchor.setTo( 0.5, 0.5 );

    this.addChild(this.label);
    this.setLabel( label );

    //adds button to game
    game.add.existing( this );
};

LabelButton.prototype = Object.create(Phaser.Button.prototype);
LabelButton.prototype.constructor = LabelButton;

LabelButton.prototype.setLabel = function( label ) {

    this.label.setText(label);

};