import ASSETS from '../assets.js';
import HealthBar from '../gameObjects/HealthBar.js';
import Watcher from '../gameObjects/Watcher.js';
import Andrew from '../gameObjects/wizards/Andrew.js';
import Mia from '../gameObjects/wizards/Mia.js';
import Tariq from '../gameObjects/wizards/Tariq.js';

export class Game extends Phaser.Scene
{
    constructor()
    {
        super('Game');
    }

    create (data = {})
    {
        this.selectedWizards = data.selectedWizards
        this.initVariables();
        this.initGameUi();
        this.initInput();
        this.initGroups();
        this.initMap();
        this.initWizards();
        this.initWatchers();
        this.sound.play('auraBlazing');
    }

    update ()
    {
        this.wizardBarGroup.getChildren().forEach(bar => bar.update());
    }

    initVariables ()
    {
        this.gameState = 'start';   // 'start', 'live', 'end'
        this.turnInterval = 1000;
        this.liveWizards = [];
        this.deadWizards = [];

        this.centreX = this.scale.width * 0.5;
        this.centreY = this.scale.height * 0.5;

        this.tileIds = {
            watcherSide: 117,
            watcherUpDown: 129,
            wizard1: 95,
            wizard2: 96,
            wizard3: 107,
            wizard4: 108,
            walls: [ 45, 46, 47, 48, 57, 58, 59, 60, 69, 70, 71, 72, 81, 82, 83, 84 ],
        }

        this.watcherSideTiles = [];
        this.watcherUpDownTiles = [];
        this.wizard1Start = { x: 0, y: 0 };
        this.wizard2Start = { x: 0, y: 0 };
        this.wizard3Start = { x: 0, y: 0 };
        this.wizard4Start = { x: 0, y: 0 };

        // generate random background image
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
        this.startGameText = this.add.text(this.centreX, this.centreY - 172, 'AURA BLAZING!', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
            resolution: 2,
            richText: true
        })
            .setOrigin(0.5)
            .setDepth(1000)
            .setVisible(true);

        this.endGameText = this.add.text(this.centreX, this.centreY - 172, 'AURA FADED!', {
            fontFamily: 'Arial Black',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
            resolution: 2,
            richText: true
        })
            .setOrigin(0.5)
            .setDepth(1000)
            .setVisible(false);

        this.winnerText = this.add.text(this.centreX, this.centreY, 'No Auramaster\nhas Risen', {
            fontFamily: 'Arial Black',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4,
            align: 'center',
            resolution: 2,
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

                if (tile.index === this.tileIds.watcherSide) {
                    tile.index = -1;
                    this.watcherSideTiles.push({ x: x, y: y });
                } else if (tile.index === this.tileIds.watcherUpDown) {
                    tile.index = -1;
                    this.watcherUpDownTiles.push({ x: x, y: y });
                } else if (tile.index === this.tileIds.wizard1) {
                    tile.index = -1;
                    this.wizard1Start.x = x;
                    this.wizard1Start.y = y;
                } else if (tile.index === this.tileIds.wizard2){
                    tile.index = -1;
                    this.wizard2Start.x = x;
                    this.wizard2Start.y = y;
                } else if (tile.index === this.tileIds.wizard3){
                    tile.index = -1;
                    this.wizard3Start.x = x;
                    this.wizard3Start.y = y;
                } else if (tile.index === this.tileIds.wizard4){
                    tile.index = -1;
                    this.wizard4Start.x = x;
                    this.wizard4Start.y = y;
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
        let winSound = 'tie';

        this.time.delayedCall(1500, () => {
            if (this.liveWizards.length === 1) {
                this.winnerText.setText(`The Auramaster is\n${this.liveWizards[0].name}`);
                this.winnerText.setColor(`#${this.liveWizards[0].energyTint.toString(16).padStart(6, '0')}`);
                winSound = this.liveWizards[0].voicelines.win;
            }
            this.endGameText.setVisible(true);
            this.sound.play('auraFaded');
        });

        this.time.delayedCall(3000, () => {
            this.winnerText.setVisible(true);
            this.sound.play(winSound);
        });
    }

    initWizards ()
    {
        let wizardPairs = [
            {
                start: { x: this.wizard1Start.x, y: this.wizard1Start.y },
                bar:   { x: this.centreX - 135, y: this.centreY + 175 }
            },
            {
                start: { x: this.wizard2Start.x, y: this.wizard2Start.y },
                bar:   { x: this.centreX + 15, y: this.centreY + 175 }
            },
            {
                start: { x: this.wizard3Start.x, y: this.wizard3Start.y },
                bar:   { x: this.centreX + 15, y: this.centreY + 208 }
            },
            {
                start: { x: this.wizard4Start.x, y: this.wizard4Start.y },
                bar:   { x: this.centreX - 135, y: this.centreY + 208 }
            },
        ];

        Phaser.Utils.Array.Shuffle(wizardPairs);

        let wizardIndex = 0;
        for (const name of this.selectedWizards) {
            const pair = wizardPairs[wizardIndex];
            if (name === 'Andrew') {
                const andrew = new Andrew(this, pair.start.x, pair.start.y);
                this.wizardGroup.add(andrew);
                const andrewBar = new HealthBar(this, pair.bar.x, pair.bar.y, andrew);
                this.wizardBarGroup.add(andrewBar);
                wizardIndex++;
            } else if (name === 'Mia'){
                const mia = new Mia(this, pair.start.x, pair.start.y);
                this.wizardGroup.add(mia);
                const miaBar = new HealthBar(this, pair.bar.x, pair.bar.y, mia);
                this.wizardBarGroup.add(miaBar);
                wizardIndex++;
            } else if (name === 'Tariq'){
                const tariq = new Tariq(this, pair.start.x, pair.start.y);
                this.wizardGroup.add(tariq);
                const tariqBar = new HealthBar(this, pair.bar.x, pair.bar.y, tariq);
                this.wizardBarGroup.add(tariqBar);
                wizardIndex++;
            }
        }

        this.liveWizards = this.wizardGroup.getChildren();
    }

    initWatchers ()
    {
        for (const tile of this.watcherSideTiles) {
            if (Phaser.Math.RND.frac() >= 0.4) {
                const watcherSprite = Phaser.Math.RND.between(0, 7);
                const watcher = new Watcher(this, tile.x, tile.y, watcherSprite);
                this.watcherGroup.add(watcher);
            }
        }
        for (const tile of this.watcherUpDownTiles) {
            if (Phaser.Math.RND.frac() >= 0.4) {
                const watcherSprite = Phaser.Math.RND.between(8, 15);
                const watcher = new Watcher(this, tile.x, tile.y, watcherSprite);
                this.watcherGroup.add(watcher);
            }
        }
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
