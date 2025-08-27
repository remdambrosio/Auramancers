import ASSETS from '../assets.js';

export default class Wizard extends Phaser.Physics.Arcade.Sprite
{
    moveTimer = 0;
    moveLength = 1000;
    targetMoveTile = null;

    attackTimer = 500;
    attackLength = 1000;
    targetAttackTile = null;

    constructor(scene, x, y, spriteKey)
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

        this.directions = [
            { x: -this.tileSize, y: 0 },
            { x: this.tileSize, y: 0 },
            { x: 0, y: -this.tileSize },
            { x: 0, y: this.tileSize }
        ];

        this.setCollideWorldBounds(true);
        this.setDepth(100);
        this.scene = scene;

        this.emitter = scene.add.particles(0, 0, 'spark', {
            // tint: 0x9D00FF,
            lifespan: 200,
            speed: { min: 100, max: 200 },
            scale: { start: 1, end: 0 },
            blendMode: 'ADD',
            emitting: false
        });
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);

        if (this.scene.gameState != 'live') return;

        this.moveTimer += delta;
        if (this.moveTimer > this.moveLength)
        {
            this.moveTimer = 0;
            this.move();
        }

        this.attackTimer += delta;
        if (this.attackTimer > this.attackLength)
        {
            this.attackTimer = 0;
            this.attack();
        }
    }

    move ()
    {
        const validDirections = this.validDirections();

        if (validDirections.length === 0) {
            targetMoveTile = null;
            return;
        }

        this.targetMoveTile = this.targetFromDirections(validDirections);

        this.scene.tweens.add({
            targets: this,
            x: this.mapOffset.x + (this.targetMoveTile.x * this.tileSize),
            y: this.mapOffset.y + (this.targetMoveTile.y * this.tileSize),
            duration: 200,
            ease: 'Power2'
        });
    }

    validDirections() {
        return this.directions.filter(dir => {
            const newX = this.x + dir.x;
            const newY = this.y + dir.y;
            const tileX = Math.round((newX - this.mapOffset.x) / this.tileSize);
            const tileY = Math.round((newY - this.mapOffset.y) / this.tileSize);
            return this.scene.getTileAt(newX, newY) === -1 && !this.isTileOccupied(tileX, tileY);
        });
    }

    isTileOccupied(tileX, tileY) {
        return this.scene.wizardGroup.getChildren().some(wizard => {
            // don't check self
            if (wizard === this) return false;
            // check if wizard at target
            const wx = Math.round((wizard.x - this.mapOffset.x) / this.tileSize);
            const wy = Math.round((wizard.y - this.mapOffset.y) / this.tileSize);
            // check if wizard intends to move to target
            if (wizard.targetMoveTile) {
                if (wizard.targetMoveTile.x === tileX && wizard.targetMoveTile.y === tileY) return true;
            }
            return wx === tileX && wy === tileY;
        });
    }

    attack () {
        // this.setTint(0x008000);
        // setTimeout(() => {this.clearTint();}, 100);

        this.targetAttackTile = this.targetFromDirections(this.directions);

        const pixelX = this.mapOffset.x + (this.targetAttackTile.x * this.tileSize);
        const pixelY = this.mapOffset.y + (this.targetAttackTile.y * this.tileSize);
        this.emitter.setPosition(pixelX, pixelY);
        this.emitter.explode(20);
    }

    targetFromDirections(directions) {
        const chosen = Phaser.Math.RND.pick(directions);
        const targetX = this.x + chosen.x;
        const targetY = this.y + chosen.y;
        const targetTileX = Math.round((targetX - this.mapOffset.x) / this.tileSize);
        const targetTileY = Math.round((targetY - this.mapOffset.y) / this.tileSize);
        return { x: targetTileX, y: targetTileY };
    }
}
