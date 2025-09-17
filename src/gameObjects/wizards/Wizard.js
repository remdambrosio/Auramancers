/* global Phaser */
import ASSETS from '../../assets.js';
import WizardBook from './WizardBook.js';

export default class Wizard extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, name, voicelines, energyTint, spriteKey)
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

        this.book = new WizardBook();

        this.name = name
        this.voicelines = voicelines;
        this.energyTint = energyTint;
        this.lifeState = 'alive';       // 'alive', 'dead'
        this.maxHealth = 3;
        this.health = this.maxHealth;
        this.tile = { x: x, y: y };

        this.turnInterval = this.scene.turnInterval;

        this.moveTimer = 0;
        this.targetMoveTile = null;

        this.attackTimer = this.turnInterval / 2;
        this.targetAttackTiles = null;

        this.ashEmitter = scene.add.particles(0, 0, 'orb', {
            tint: 0x3b3b3b,
            lifespan: 1000,
            speed: { min: 10, max: 50 },
            scale: { start: 1, end: 0 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.ashEmitter.setDepth(100);

        this.attackEmitter = scene.add.particles(0, 0, 'spark', {
            tint: this.energyTint,
            lifespan: 250,
            speed: { min: 5, max: 50 },
            scale: { start: 1.5, end: 0 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.attackEmitter.setDepth(200);
    }

    preUpdate (time, delta)
    {
        super.preUpdate(time, delta);
        if (this.scene.gameState != 'live' || this.lifeState === 'dead') return;

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
        const dir = this.book.moveDirection(this);

        if (!dir) {
            this.targetMoveTile = null;
            return;
        }

        this.targetMoveTile = {
            x: this.tile.x + dir.x,
            y: this.tile.y + dir.y
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

    attack()
    {
        // target tiles
        const dir = this.book.attackDirection(this);
        this.targetAttackTiles = [];
        let curTile = this.tile;
        for (let i = 0; i < 5; i++) {
            curTile = {
                x: curTile.x + dir.x,
                y: curTile.y + dir.y
            };
            this.targetAttackTiles.push({ ...curTile });
        }

        // aura indicates current health
        this.auraPulse();

        // attack tiles
        this.targetAttackTiles.forEach((tile, i) => {
            const pixelX = this.mapOffset.x + (tile.x * this.tileSize);
            const pixelY = this.mapOffset.y + (tile.y * this.tileSize);
            this.scene.time.delayedCall(50 * i, () => {
                this.hitTile(tile.x, tile.y, 1);
                this.attackEmitter.emitParticleAt(pixelX, pixelY, 10);
            });
        });
    }

    auraPulse() {
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
    }

    hitTile(tileX, tileY, damage) {
        let wizardHit = this.wasWizardHit(tileX, tileY);
        if (wizardHit) {
            wizardHit.takeDamage(damage, this.energyTint);
        }
        let watcherHit = this.wasWatcherHit(tileX, tileY);
        if (watcherHit) {
            watcherHit.die(this.energyTint);
        }
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
        if (this.lifeState === 'dead') return;
        this.health -= amount;
        if (this.health <= 0 && this.lifeState !== 'dead') {
            this.die(attackTint);
        } else {
            this.scene.sound.play(this.voicelines.hit);
            this.flash(0, 5, 150, attackTint);
        }
    }

    heal(amount, healTint)
    {
        if (this.lifeState === 'dead') return;
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.flash(0, 5, 150, healTint);
    }

    die(attackTint) {
        this.lifeState = 'dead';
        this.scene.sound.play(this.voicelines.die);
        this.setTint(attackTint);
        this.scene.deadWizards.push(this);
        this.scene.liveWizards = this.scene.liveWizards.filter(wiz => wiz !== this);
        if (this.scene.liveWizards.length <= 1) {
            this.scene.endGame();
        }
        this.ashEmitter.emitParticleAt(this.x, this.y, 10);
        const ash = this.scene.add.image(this.x, this.y, ASSETS.spritesheet.ash.key, Phaser.Math.RND.between(0, 15));
        ash.tint = attackTint;
        this.scene.tweens.add({
            targets: [this, ash],
            alpha: {
                getStart: (target) => target === this ? 1 : 0,
                getEnd: (target) => target === this ? 0 : 1
            },
            duration: 500,
            ease: 'Linear',
            onComplete: () => {
                this.setVisible(false);
            }
        });
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
