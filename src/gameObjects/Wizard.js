import ASSETS from '../assets.js';

export default class Wizard extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, name, energyTint, spriteKey)
    {
        super(scene, x, y, ASSETS.spritesheet.wizards.key, spriteKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.mapOffset = scene.getMapOffset();
        this.tileSize = this.mapOffset.tileSize;
        this.setPosition(
            this.mapOffset.x + (x * this.tileSize),
            this.mapOffset.y + (y * this.tileSize)
        );

        this.setCollideWorldBounds(true);
        this.setDepth(100);
        this.scene = scene;

        this.name = name
        this.energyTint = energyTint;
        this.maxHealth = 3;
        this.health = this.maxHealth;
        this.tile = { x: x, y: y };

        this.turnInterval = this.scene.turnInterval;

        this.moveTimer = 0;
        this.targetMoveTile = null;

        this.attackTimer = this.turnInterval / 2;
        this.targetAttackTiles = null;

        this.directions = [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 }
        ];

        this.emitter = scene.add.particles(0, 0, 'spark', {
            tint: this.energyTint,
            lifespan: 250,
            speed: { min: 5, max: 50 },
            scale: { start: 0.8, end: 0 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.emitter.setDepth(200);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.scene.gameState != 'live') return;

        this.moveTimer += delta;
        if (this.moveTimer > this.turnInterval)
        {
            this.moveTimer = 0;
            this.move();
        }

        this.attackTimer += delta;
        if (this.attackTimer > this.turnInterval)
        {
            this.attackTimer = 0;
            this.attack();
        }
    }

    move ()
    {
        const validMoveDirections = this.validMoveDirections();

        if (validMoveDirections.length === 0) {
            targetMoveTile = null;
            return;
        }

        const chosenDir = Phaser.Math.RND.pick(validMoveDirections);
        this.targetMoveTile = {
            x: this.tile.x + chosenDir.x,
            y: this.tile.y + chosenDir.y
        };

        this.scene.tweens.add({
            targets: this,
            x: this.mapOffset.x + (this.targetMoveTile.x * this.tileSize),
            y: this.mapOffset.y + (this.targetMoveTile.y * this.tileSize),
            duration: 200,
            ease: 'Power2',
            onComplete: () => {
                this.tile.x = this.targetMoveTile.x;
                this.tile.y = this.targetMoveTile.y;
            }
        });
    }

    validMoveDirections()
    {
        return this.directions.filter(dir => {
            const tileX = this.tile.x + dir.x;
            const tileY = this.tile.y + dir.y;
            const pixelX = this.mapOffset.x + (tileX * this.tileSize);
            const pixelY = this.mapOffset.y + (tileY * this.tileSize);
            return this.scene.getTileAt(pixelX, pixelY) === -1 && !this.isTileOccupied(tileX, tileY);
        });
    }

    isTileOccupied(tileX, tileY)
    {
        return this.scene.wizardGroup.getChildren().some(wizard => {
            if (wizard === this) return false;
            if (wizard.targetMoveTile) {
                if (wizard.targetMoveTile.x === tileX && wizard.targetMoveTile.y === tileY) return true;
            }
            return wizard.tile.x === tileX && wizard.tile.y === tileY;
        });
    }

    attack ()
    {
        const chosenDir = Phaser.Math.RND.pick(this.directions);
        this.targetAttackTiles = [];

        let curTile = this.tile;
        for (let i = 0; i < 5; i++) {
            curTile = {
                x: curTile.x + chosenDir.x,
                y: curTile.y + chosenDir.y
            };
            this.targetAttackTiles.push({ ...curTile });
        }

        let healthRatio = this.health / this.maxHealth;
        let healthFrame;
        if (healthRatio === 1) {
            healthFrame = 1;
        } else if (healthRatio > 0.5) {
            healthFrame = 2;
        } else {
            healthFrame = 3;
        }

        this.setFrame(this.frame.name + healthFrame);
        this.scene.time.delayedCall(250, () => { this.setFrame(this.frame.name - healthFrame); });

        this.targetAttackTiles.forEach((tile, i) => {
            const pixelX = this.mapOffset.x + (tile.x * this.tileSize);
            const pixelY = this.mapOffset.y + (tile.y * this.tileSize);
            this.scene.time.delayedCall(50 * i, () => {
                let wizardHit = this.wasWizardHit(tile.x, tile.y);
                if (wizardHit) {
                    wizardHit.takeDamage(1, this.energyTint);
                } 
                
                let watcherHit = this.wasWatcherHit(tile.x, tile.y);
                if (watcherHit) {
                    watcherHit.die();
                }

                this.emitter.emitParticleAt(pixelX, pixelY, 5);
            });
        });
    }

    wasWizardHit(tileX, tileY)
    {
        return this.scene.wizardGroup.getChildren().find(wizard => {
            if (wizard === this) {
                return false;      // friendly fire will not be tolerated
            }
            return wizard.tile.x === tileX && wizard.tile.y === tileY;
        });
    }

    wasWatcherHit(tileX, tileY)
    {
        return this.scene.watcherGroup.getChildren().find(watcher => {
            return watcher.tile.x === tileX && watcher.tile.y === tileY;
        });
    }

    takeDamage(amount, attackTint)
    {
        this.health -= amount;
        this.setTint(attackTint);
        this.scene.time.delayedCall(500, () => { this.clearTint(); });

        let i = 0;
        let flashInterval = 150;
        let flashes = 5;

        if (this.health <= 0) {
            this.scene.sound.play('mia_die');
            this.scene.deadWizards.push(this);
            this.scene.endGame();
            flashes = 10;
        }

        this.scene.sound.play('mia_hit');
        this.flash(i, flashes, flashInterval, attackTint);
    }

    flash(i, flashes, flashInterval, attackTint) {
        if (i >= flashes) {
            this.clearTint();
            return;
        }
        if (i % 2 === 0) {
            this.setTint(attackTint);
        } else {
            this.clearTint();
        }
        this.scene.time.delayedCall(flashInterval, () => { this.flash(i + 1, flashes, flashInterval, attackTint); }, [], this);
    }
}
