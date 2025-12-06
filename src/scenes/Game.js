/* global Phaser */
import ASSETS from '../assets.js';
import HealthBar from '../gameObjects/HealthBar.js';
import Watcher from '../gameObjects/Watcher.js';

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
        this.initTimer();
        this.initInput();
        this.initGroups();
        this.initMap();
        this.initWizards();
        this.initWatchers();
        this.initPhysics();
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

        this.arena = {
            origin: {x: 7, y: 4},
            width: 7,
            height: 7
        };

        this.watcherSideTiles = [];
        this.watcherUpDownTiles = [];

        this.wizard1Start = { x: 0, y: 0 };
        this.wizard2Start = { x: 0, y: 0 };
        this.wizard3Start = { x: 0, y: 0 };
        this.wizard4Start = { x: 0, y: 0 };

        this.tileSize = 32;
        this.halfTileSize = this.tileSize * 0.5;
        this.mapHeight = 15;
        this.mapWidth = 21;
        this.mapX = this.centreX - (this.mapWidth * this.tileSize * 0.5);
        this.mapY = this.centreY - (this.mapHeight * this.tileSize * 0.5);

        this.map;
        this.groundLayer;
        this.levelLayer;
    }

    initGameUi ()
    {
        this.timerText = this.add.text(this.centreX, 25, '', {
            fontFamily: 'Tagesschrift',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
            richText: true
        })
            .setOrigin(0.5)
            .setDepth(1000)
            .setVisible(true);

        this.startGameText = this.add.text(this.centreX, this.centreY - 172, 'AURA BLAZING!', {
            fontFamily: 'Tagesschrift',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
            richText: true
        })
            .setOrigin(0.5)
            .setDepth(1000)
            .setVisible(true);

        this.endGameText = this.add.text(this.centreX, this.centreY - 172, 'AURA FADED!', {
            fontFamily: 'Tagesschrift',
            fontSize: 32,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
            richText: true
        })
            .setOrigin(0.5)
            .setDepth(1000)
            .setVisible(false);

        this.winnerText = this.add.text(this.centreX, this.centreY, 'No Auramaster\nhas Risen', {
            fontFamily: 'Tagesschrift',
            fontSize: 18,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 6,
            align: 'center',
            richText: true
        })
            .setOrigin(0.5)
            .setDepth(1000)
            .setVisible(false);

        this.dieFlashRect = this.add.rectangle(
            this.centreX, this.centreY,
            this.scale.width, this.scale.height,
            0xff0000, 1
        ).setDepth(3000).setAlpha(0);
    }

    initTimer ()
    {
        this.timerValue = 45;
        this.dieTween = null;
        this.timerEvent = this.time.addEvent({
            delay: this.turnInterval,
            loop: true,
            callback: () => {
                if (this.gameState !== 'live') {
                    this.timerText.setText('');
                    if (this.dieTween) {
                        this.dieTween.stop();
                        this.dieTween = null;
                        this.timerText.setScale(1);
                    }
                    return;
                }
                this.timerValue--;

                // show timer value, or "DIE" when timer empty
                if (this.timerValue > 0) {
                    this.timerText.setText(this.timerValue);
                } else {
                    this.timerText.setText('DIE');
                }

                // text pulsing when < 10 (including empty)
                if (this.timerValue <= 10) {
                    if (!this.dieTween) {
                        this.dieTween = this.tweens.add({
                            targets: this.timerText,
                            scale: { from: 1, to: 1.4 },
                            duration: 250,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut'
                        });
                    }
                } else {
                    if (this.dieTween) {
                        this.dieTween.stop();
                        this.dieTween = null;
                        this.timerText.setScale(1);
                    }
                }

                // screen flashes red when empty
                if (this.timerValue <= 0) {
                    this.dieFlashRect.setAlpha(0.8);
                    this.tweens.add({
                        targets: this.dieFlashRect,
                        alpha: 0,
                        duration: 500,
                        ease: 'Quad.easeOut'
                    });
                }

                // damage wizards when empty
                if (this.timerValue <= 0) {
                    this.liveWizards.forEach(wizard => {
                        wizard.takeDamage(1, wizard.energyTint);
                    });
                }
            }
        });
    }

    initGroups ()
    {
        this.wizardGroup = this.add.group();
        this.wizardBarGroup = this.add.group();
        this.watcherGroup = this.add.group();
        this.potionGroup = this.add.group();
    }

    initPhysics ()
    {
        this.physics.add.overlap(this.wizardGroup, this.potionGroup, (wizard, potion) => {
            if (potion.justDropped) return;
            if (potion.explode && !potion.explosionScheduled) {
                this.sound.play('glass');
                potion.explosionScheduled = true;
                potion.flash(0, 5);
                this.time.delayedCall(this.turnInterval * 0.5, () => {
                    potion.explode();
                });
            }
        });
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
                this.sound.play('uhOh');
            }
        });
    }

    initMap ()
    {
        this.map = this.make.tilemap({ key: ASSETS.tilemapTiledJSON.map.key });
        const tileset = this.map.addTilesetImage(ASSETS.spritesheet.tiles.key);

        this.groundLayer = this.map.createLayer('ground', tileset, this.mapX, this.mapY);
        this.levelLayer = this.map.createLayer('level', tileset, this.mapX, this.mapY);
        
        this.levelLayer.forEachTile(tile => {
            if (!tile) return;
            switch (tile.index) {
                case this.tileIds.watcherSide:
                    tile.index = -1;
                    this.watcherSideTiles.push({ x: tile.x, y: tile.y });
                    break;
                case this.tileIds.watcherUpDown:
                    tile.index = -1;
                    this.watcherUpDownTiles.push({ x: tile.x, y: tile.y });
                    break;
                case this.tileIds.wizard1:
                    tile.index = -1;
                    this.wizard1Start = { x: tile.x, y: tile.y };
                    break;
                case this.tileIds.wizard2:
                    tile.index = -1;
                    this.wizard2Start = { x: tile.x, y: tile.y };
                    break;
                case this.tileIds.wizard3:
                    tile.index = -1;
                    this.wizard3Start = { x: tile.x, y: tile.y };
                    break;
                case this.tileIds.wizard4:
                    tile.index = -1;
                    this.wizard4Start = { x: tile.x, y: tile.y };
                    break;
            }
        });
    }

    startGame ()
    {
        this.gameState = 'live';
        this.timerText.setText(this.timerValue);
        this.startGameText.setVisible(false);
        this.endGameText.setVisible(false);
        this.sound.play('riseOfTheManimals', { volume: 0.08, loop: false });
    }

    endGame() {
        if (this.gameState === 'end') return;
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
        for (const wizardInfo of this.selectedWizards) {
            const pair = wizardPairs[wizardIndex];
            if (wizardInfo && wizardInfo.class) {
                const wizard = new wizardInfo.class(this, pair.start.x, pair.start.y);
                this.wizardGroup.add(wizard);
                const wizardBar = new HealthBar(this, pair.bar.x, pair.bar.y, wizard);
                this.wizardBarGroup.add(wizardBar);
                wizardIndex++;
            }
        }

        this.liveWizards = [...this.wizardGroup.getChildren()];
    }

    initWatchers ()
    {
        for (const tile of this.watcherSideTiles) {
            if (Phaser.Math.RND.frac() >= 0.3) {
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
