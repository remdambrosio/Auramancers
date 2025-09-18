/* global Phaser */
import ASSETS from '../assets.js';

export default class Potion extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, tileX, tileY, master, potionIndex) {
        super(scene, tileX, tileY, ASSETS.spritesheet.potions.key);
        scene.add.existing(this);
        scene.physics.add.existing(this);
        scene.potionGroup.add(this);
        this.scene = scene;
        this.mapOffset = scene.getMapOffset();
        this.tileSize = this.mapOffset.tileSize;
        this.tileX = tileX;
        this.tileY = tileY;
        this.setPosition(
            this.mapOffset.x + (tileX * this.tileSize),
            this.mapOffset.y + (tileY * this.tileSize)
        );
        this.setDepth(150);

        this.master = master;
        this.setFrame(potionIndex);

        this.justDropped = true;
        scene.time.delayedCall(scene.turnInterval * 0.75, () => { this.justDropped = false; });

        if (potionIndex < 4) {
            this.potionType = 'poison';
            this.power = 4 - potionIndex;
            this.typeTint = 0xBED300;
        } else {
            this.potionType = 'health';
            this.power = potionIndex - 4;
            this.typeTint = 0xFF7D7A;
        }

        this.emitter = scene.add.particles(0, 0, 'orb', {
            tint: this.typeTint,
            lifespan: 1000,
            speed: { min: 10, max: 50 },
            scale: { start: 1, end: 0 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.emitter.setDepth(200);
    }

    explode() {
        if (this.potionType === 'poison') {
            this.scene.sound.play('hiss');
        } else {
            this.scene.sound.play('heal');
        }
        const tiles = this.targetTiles();
        tiles.forEach(tile => {
            if (this.potionType === 'poison') {
                this.damageTile(tile.x, tile.y);
            } else {
                this.healTile(tile.x, tile.y);
            }
            const pixelX = this.mapOffset.x + (tile.x * this.tileSize);
            const pixelY = this.mapOffset.y + (tile.y * this.tileSize);
            this.emitter.emitParticleAt(pixelX, pixelY, 10);
        });
        this.destroy();
    }

    targetTiles() {
        const tiles = [];
        const x = this.tileX;
        const y = this.tileY;
        if (this.power === 1) {
            tiles.push({ x, y });
        } else if (this.power === 2) {
            tiles.push({ x, y });
            tiles.push({ x: x + 1, y });
            tiles.push({ x: x - 1, y });
            tiles.push({ x, y: y + 1 });
            tiles.push({ x, y: y - 1 });
        } else if (this.power === 3) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    tiles.push({ x: x + dx, y: y + dy });
                }
            }
        } else if (this.power === 4) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    tiles.push({ x: x + dx, y: y + dy });
                }
            }
            tiles.push({ x: x, y: y + 2 });
            tiles.push({ x: x, y: y - 2 });
            tiles.push({ x: x + 2, y: y });
            tiles.push({ x: x - 2, y: y });
        }
        return tiles;
    }

    damageTile(tileX, tileY) {
        let wizardHit = this.wasWizardHit(tileX, tileY);
        if (wizardHit) {
            wizardHit.takeDamage(1, this.typeTint);
        }
        let watcherHit = this.wasWatcherHit(tileX, tileY);
        if (watcherHit) {
            watcherHit.die(this.typeTint);
        }
    }

    healTile(tileX, tileY) {
        let wizardHit = this.wasWizardHit(tileX, tileY);
        if (wizardHit) {
            wizardHit.heal(1, this.typeTint);
        }
    }

    wasWizardHit(tileX, tileY)
    {
        return this.scene.wizardGroup.getChildren().find(wizard => {
            if (this.potionType === 'poison' && wizard === this.master) {
                return false;
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

    flash(i, flashes) {
        if (!this.scene || !this.active) return;
        if (i >= flashes) {
            if (this.active) this.clearTint();
            return;
        }
        if (i % 2 === 0) {
            if (this.active) this.setTint(this.typeTint);
        } else {
            if (this.active) this.clearTint();
        }
        this.scene.time.delayedCall(150, () => { this.flash(i + 1, flashes); }, [], this);
    }
}
