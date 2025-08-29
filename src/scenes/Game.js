import ASSETS from '../assets.js';
import Wizard from '../gameObjects/Wizard.js';
import HealthBar from '../gameObjects/HealthBar.js';
import Watcher from '../gameObjects/Watcher.js';

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
        this.initInput();
        this.initGroups();
        this.initMap();
        this.initWizard1();
        this.initWizard2();
        this.initWatchers();
        this.sound.play('auraBlazing');
    }

    update ()
    {
        this.wizardBarGroup.getChildren().forEach(bar => bar.update());
    }

    initVariables ()
    {
        this.gameState = 'start';                   // 'start', 'live', 'end'
        this.turnInterval = 500;
        this.deadWizards = [];

        this.centreX = this.scale.width * 0.5;
        this.centreY = this.scale.height * 0.5;

        this.tileIds = {
            wizard1: 96,
            wizard2: 95,
            walls: [ 45, 46, 47, 48, 53, 54, 55, 56, 57, 58, 59, 60, 65, 66, 67, 68, 69, 70, 71, 72, 77, 78, 79, 80, 81, 82, 83, 84, 96, 97, 98, 99, 100, 101, 102, 108, 109, 110, 111, 112, 113, 114, 120, 121, 122, 123, 124, 125, ],
        }

        this.wizard1Start = { x: 0, y: 0 };
        this.wizard2Start = { x: 0, y: 0 };

        // used to generate random background image
        this.tiles = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 44 ];
        this.tileSize = 32;     // width and height of a tile in pixels
        this.halfTileSize = this.tileSize * 0.5; // width and height of a tile in pixels

        this.mapHeight = 15;    // height of the tile map (in tiles)
        this.mapWidth = 21;     // width of the tile map (in tiles)
        this.mapX = this.centreX - (this.mapWidth * this.tileSize * 0.5); // x position of the top-left corner of the tile map
        this.mapY = this.centreY - (this.mapHeight * this.tileSize * 0.5); // y position of the top-left corner of the tile map

        this.map;               // reference to tile map
        this.groundLayer;       // used to create background layer of tile map
        this.levelLayer;        // reference to level layer of tile map
    }

    initGameUi ()
    {
        this.startGameText = this.add.text(this.centreX, this.centreY, 'AURA BLAZING!', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center',
            richText: true
        })
            .setOrigin(0.5)
            .setDepth(1000)
            .setVisible(true);

        this.endGameText = this.add.text(this.scale.width * 0.5, this.scale.height * 0.5, 'AURA FADED!', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center',
            richText: true
        })
            .setOrigin(0.5)
            .setDepth(1000)
            .setVisible(false);
    }

    initGroups ()
    {
        this.wizardGroup = this.add.group();
        this.wizardBarGroup = this.add.group();
        this.watcherGroup = this.add.group();
    }

    initInput ()
    {
        this.input.on('pointerdown', () => {
            if (this.gameState === 'start') {
                this.startGame();
            } else if (this.gameState === 'end') {
                this.scene.restart();
            }
        });

        this.input.keyboard.on('keydown-X', () => {
            if (this.gameState === 'live') {
                this.endGame('Nobody');
            }
        });
    }

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

                if (tile.index === this.tileIds.wizard1)
                {
                    tile.index = -1;
                    this.wizard1Start.x = x;
                    this.wizard1Start.y = y;
                }
                else if (tile.index === this.tileIds.wizard2)
                {
                    tile.index = -1;
                    this.wizard2Start.x = x;
                    this.wizard2Start.y = y;
                }
            }
        }
    }

    startGame ()
    {
        this.gameState = 'live';
        this.startGameText.setVisible(false);
        this.endGameText.setVisible(false);
        this.sound.play('riseOfTheManimals', { volume: 0.1, loop: true });

        // // tie testing
        // this.wizardGroup.getChildren().forEach(wizard => wizard.health = 1);
        // this.time.delayedCall(500, () => {
        //     this.wizardGroup.getChildren().forEach(wizard => wizard.takeDamage(1, 0xff00ff));
        // });
    }

    endGame() {
        this.gameState = 'end';
        this.sound.stopByKey('riseOfTheManimals');

        let deadWizardNames = 'No Wizards';
        let deadWizardVerb = 'are';
        this.time.delayedCall(500, () => {
            if (this.deadWizards.length === 0) {
                this.sound.play('whatATie');
            } else if (this.deadWizards.length === 1) {
                deadWizardNames = `[color=#${this.deadWizards[0].energyTint.toString(16).padStart(6, '0').toUpperCase()}]${this.deadWizards[0].name}[/color]`
                deadWizardVerb = 'is';
                this.sound.play('ahMyAura');
            } else {
                deadWizardNames =
                    this.deadWizards
                    .map(wiz => `[color=#${wiz.energyTint.toString(16).padStart(6, '0').toUpperCase()}]${wiz.name}[/color]`)
                    .join(' & ');
                this.sound.play('whatATie');
            }
        });
        this.time.delayedCall(2000, () => {
            this.endGameText.setText(
                `AURA FADED!\n${deadWizardNames}\n${deadWizardVerb} Auraless\n`
            );
            this.endGameText.setVisible(true);
            this.sound.play('auraFaded');
        });
    }

    initWizard1 ()
    {
        const wizard1 = new Wizard(this, this.wizard1Start.x, this.wizard1Start.y, 'Blue Wizard', 0x0000FF, 0);
        this.wizardGroup.add(wizard1);
        const wizard1bar = new HealthBar(this, this.centreX - 105, this.centreY + 120, wizard1);
        this.wizardBarGroup.add(wizard1bar);
    }

    initWizard2 ()
    {
        const wizard2 = new Wizard(this, this.wizard2Start.x, this.wizard2Start.y, 'Red Wizard', 0xFF0000, 2);
        this.wizardGroup.add(wizard2);
        const wizard2bar = new HealthBar(this, this.centreX + 5, this.centreY + 120, wizard2);
        this.wizardBarGroup.add(wizard2bar);
    }

    initWatchers ()
    {
        const watcher1 = new Watcher(this, this.wizard1Start.x-2, this.wizard1Start.y-1, 27);
        this.watcherGroup.add(watcher1);

        const watcher2 = new Watcher(this, this.wizard1Start.x+3, this.wizard1Start.y-4, 13);
        this.watcherGroup.add(watcher2);

        const watcher3 = new Watcher(this, this.wizard2Start.x+2, this.wizard1Start.y+1, 60);
        this.watcherGroup.add(watcher3);
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
}
