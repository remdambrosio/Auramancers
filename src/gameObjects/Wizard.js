import ASSETS from '../assets.js';

export default class Wizard extends Phaser.Physics.Arcade.Sprite
{
    moveTimer = 0;
    moveInterval = 1000;
    targetMoveTile = null;

    attackTimer = 500;
    attackInterval = 1000;
    targetAttackTiles = null;

    constructor(scene, x, y, name, energyTint, spriteKey)
    {
        super(scene, x, y, ASSETS.spritesheet.characters.key, spriteKey);
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
        this.health = 3;
        this.tile = { x: x, y: y };

        this.directions = [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 }
        ];

        this.emitter = scene.add.particles(0, 0, 'spark', {
            tint: this.energyTint,
            lifespan: 250,
            speed: { min: 25, max: 75 },
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
        if (this.moveTimer > this.moveInterval)
        {
            this.moveTimer = 0;
            this.move();
        }

        this.attackTimer += delta;
        if (this.attackTimer > this.attackInterval)
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
        for (let i = 0; i < 3; i++) {
            curTile = {
                x: curTile.x + chosenDir.x,
                y: curTile.y + chosenDir.y
            };
            this.targetAttackTiles.push({ ...curTile });
        }

        this.targetAttackTiles.forEach((tile, i) => {
            let wizardHit = this.wasWizardHit(tile.x, tile.y);
            if (wizardHit) wizardHit.takeDamage(1, this.energyTint);
            const pixelX = this.mapOffset.x + (tile.x * this.tileSize);
            const pixelY = this.mapOffset.y + (tile.y * this.tileSize);
            this.scene.time.delayedCall(25 * i, () => { this.emitter.emitParticleAt(pixelX, pixelY, 5); });
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

    takeDamage(amount, attackTint)
    {
        this.health -= amount;
        this.setTint(attackTint);
        this.scene.time.delayedCall(500, () => { this.clearTint(); });

        if (this.health <= 0) {
            this.scene.endGame(this.name);
        }
        let i = 0;
        let flashes = 5;
        let flashInterval = 200;
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
