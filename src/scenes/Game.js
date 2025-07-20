/*
* Asset from: https://kenney.nl/assets/pixel-platformer
*/
import ASSETS from '../assets.js';
import Enemy from '../gameObjects/Enemy.js';

export class Game extends Phaser.Scene
{
    constructor()
    {
        super('Game');
    }

    create ()
    {
        this.initVariables();
        this.initGameUi();
        // this.initAnimations();
        this.initInput();
        this.initGroups();
        this.initMap();
        // this.initPhysics();
        this.initEnemy1();
        this.initEnemy2();
    }

    // update (time, delta)
    // {
    //     if (!this.gameStarted) return;

    //     this.player.update(delta);
    // }

    initVariables ()
    {
        this.gameStarted = false;
        this.score = 0;
        this.centreX = this.scale.width * 0.5;
        this.centreY = this.scale.height * 0.5;

        this.tileIds = {
            player: 96,
            enemy: 95,
            walls: [ 45, 46, 47, 48, 53, 54, 55, 56, 57, 58, 59, 60, 65, 66, 67, 68, 69, 70, 71, 72, 77, 78, 79, 80, 81, 82, 83, 84, 96, 97, 98, 99, 100, 101, 102, 108, 109, 110, 111, 112, 113, 114, 120, 121, 122, 123, 124, 125, ],
        }

        this.playerStart = { x: 0, y: 0 };
        this.enemyStart = { x: 0, y: 0 };

        // used to generate random background image
        this.tiles = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 44 ];
        this.tileSize = 32; // width and height of a tile in pixels
        this.halfTileSize = this.tileSize * 0.5; // width and height of a tile in pixels

        this.mapHeight = 15; // height of the tile map (in tiles)
        this.mapWidth = 21; // width of the tile map (in tiles)
        this.mapX = this.centreX - (this.mapWidth * this.tileSize * 0.5); // x position of the top-left corner of the tile map
        this.mapY = this.centreY - (this.mapHeight * this.tileSize * 0.5); // y position of the top-left corner of the tile map

        this.map; // reference to tile map
        this.groundLayer; // used to create background layer of tile map
        this.levelLayer; // reference to level layer of tile map
    }

    initGameUi ()
    {
        // Create tutorial text
        this.tutorialText = this.add.text(this.centreX, this.centreY, 'AURA BLAZING!\nPress Spacebar', {
            fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(100);

        // Create score text
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
        })
            .setDepth(100);

        // Create game over text
        this.gameOverText = this.add.text(this.scale.width * 0.5, this.scale.height * 0.5, 'AURA FADED', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(100)
            .setVisible(false);
    }

    // initAnimations ()
    // {
    //     const playerAnimations = ANIMATION.player;
    //     for (const key in playerAnimations)
    //     {
    //         const animation = playerAnimations[ key ];

    //         this.anims.create({
    //             key: animation.key,
    //             frames: this.anims.generateFrameNumbers(animation.texture, animation.config),
    //             frameRate: animation.frameRate,
    //             repeat: animation.repeat
    //         });
    //     };

    //     const enemyAnimations = ANIMATION.enemy;
    //     for (const key in enemyAnimations)
    //     {
    //         const animation = enemyAnimations[ key ];

    //         this.anims.create({
    //             key: animation.key,
    //             frames: this.anims.generateFrameNumbers(animation.texture, animation.config),
    //             frameRate: animation.frameRate,
    //             repeat: animation.repeat
    //         });
    //     };
    // }

    initGroups ()
    {
        this.enemyGroup = this.add.group();
        this.itemGroup = this.add.group();
    }

    // initPhysics ()
    // {
    //     this.physics.add.overlap(this.player, this.enemyGroup, this.hitPlayer, null, this);
    //     this.physics.add.overlap(this.player, this.itemGroup, this.collectItem, null, this);
    // }

    initInput ()
    {
        this.cursors = this.input.keyboard.createCursorKeys();

        // check for spacebar press only once
        this.cursors.space.once('down', (key, event) =>
        {
            this.startGame();
        });
    }

    // create tile map data
    initMap ()
    {
        const mapData = [];

        for (let y = 0; y < this.mapHeight; y++)
        {
            const row = [];

            for (let x = 0; x < this.mapWidth; x++)
            {
                // randomly choose a tile id from this.tiles
                // weightedPick favours items earlier in the array
                const tileIndex = Phaser.Math.RND.weightedPick(this.tiles);

                row.push(tileIndex);
            }

            mapData.push(row);
        }
        this.map = this.make.tilemap({ key: ASSETS.tilemapTiledJSON.map.key });
        this.map.setCollision(this.tileIds.walls);
        const tileset = this.map.addTilesetImage(ASSETS.spritesheet.tiles.key);

        this.groundLayer = this.map.createLayer('ground', tileset, this.mapX, this.mapY);

        this.levelLayer = this.map.createLayer('level', tileset, this.mapX, this.mapY);
        
        // loop through map from bottom to top row
        for (let y = 0; y < this.mapHeight; y++)
        {
            // loop through map from left to right column
            for (let x = 0; x < this.mapWidth; x++)
            {
                const tile = this.levelLayer.getTileAt(x, y);
                if (!tile) continue

                if (tile.index === this.tileIds.player)
                {
                    tile.index = -1;
                    this.playerStart.x = x;
                    this.playerStart.y = y;
                }
                else if (tile.index === this.tileIds.enemy)
                {
                    tile.index = -1;
                    this.enemyStart.x = x;
                    this.enemyStart.y = y;
                }
            }
        }
    }

    startGame ()
    {
        this.gameStarted = true;
        this.tutorialText.setVisible(false);
    }

    initEnemy1 ()
    {
        const enemy = new Enemy(this, this.playerStart.x, this.playerStart.y, 1);
        this.enemyGroup.add(enemy);
    }

    initEnemy2 ()
    {
        const enemy = new Enemy(this, this.enemyStart.x, this.enemyStart.y, 49);
        this.enemyGroup.add(enemy);
    }

    removeItem (item)
    {
        this.itemGroup.remove(item, true, true);

        // check if all items have been collected
        if (this.itemGroup.getChildren().length === 0)
        {
            this.GameOver();
        }
    }

    hitPlayer (player, obstacle)
    {
        player.hit();

        this.GameOver();
    }

    collectItem (player, item)
    {
        item.collect();
    }

    updateScore (points)
    {
        this.score += points;
        this.scoreText.setText(`Score: ${this.score}`);
    }

    getMapOffset ()
    {
        return {
            x: this.mapX + this.halfTileSize,
            y: this.mapY + this.halfTileSize,
            width: this.mapWidth,
            height: this.mapHeight,
            tileSize: this.tileSize
        }
    }

    getTileAt (x, y)
    {
        const tile = this.levelLayer.getTileAtWorldXY(x, y, true);
        return tile ? this.tileIds.walls.indexOf(tile.index) : -1;
    }

    GameOver ()
    {
        this.gameStarted = false;
        this.gameOverText.setVisible(true);
    }
}
