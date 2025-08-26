import ASSETS from '../assets.js';

export default class Wizard extends Phaser.Physics.Arcade.Sprite
{
    moveTimer = 0;
    moveLength = 1000;
    attackTimer = 500;
    attackLength = 1000;
    targetTile = null;

    constructor(scene, x, y, spriteKey)
    {
        super(scene, x, y, ASSETS.spritesheet.characters.key, spriteKey);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.mapOffset = scene.getMapOffset();
        this.setPosition(
            this.mapOffset.x + (x * this.mapOffset.tileSize),
            this.mapOffset.y + (y * this.mapOffset.tileSize)
        );
        this.setCollideWorldBounds(true);
        this.setDepth(100);
        this.scene = scene;
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
            targetTile = null;
            return;
        }

        const chosen = Phaser.Math.RND.pick(validDirections);
        const tileSize = this.mapOffset.tileSize;
        const targetX = this.x + chosen.x;
        const targetY = this.y + chosen.y;
        const targetTileX = Math.round((targetX - this.mapOffset.x) / tileSize);
        const targetTileY = Math.round((targetY - this.mapOffset.y) / tileSize);
        this.targetTile = { x: targetTileX, y: targetTileY };

        this.scene.tweens.add({
            targets: this,
            x: targetX,
            y: targetY,
            duration: 200,
            ease: 'Power2'
        });
    }

    validDirections() {
        const tileSize = this.mapOffset.tileSize;
        const directions = [
            { x: -tileSize, y: 0 },
            { x: tileSize, y: 0 },
            { x: 0, y: -tileSize },
            { x: 0, y: tileSize }
        ];

        return directions.filter(dir => {
            const newX = this.x + dir.x;
            const newY = this.y + dir.y;
            const tileX = Math.round((newX - this.mapOffset.x) / tileSize);
            const tileY = Math.round((newY - this.mapOffset.y) / tileSize);

            return this.scene.getTileAt(newX, newY) === -1 && !this.isTileOccupied(tileX, tileY);
        });
    }

    isTileOccupied(tileX, tileY) {
        return this.scene.wizardGroup.getChildren().some(wizard => {
            // don't check self
            if (wizard === this) return false;
            // check if wizard at target
            const wx = Math.round((wizard.x - this.mapOffset.x) / this.mapOffset.tileSize);
            const wy = Math.round((wizard.y - this.mapOffset.y) / this.mapOffset.tileSize);
            // check if wizard intends to move to target
            if (wizard.targetTile) {
                if (wizard.targetTile.x === tileX && wizard.targetTile.y === tileY) return true;
            }
            return wx === tileX && wy === tileY;
        });
    }

    attack () {
        this.setTint(0xFF0000);
        setTimeout(() => {this.clearTint();}, 100); 
    }
}
