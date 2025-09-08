import ASSETS from '../assets.js';

export default class Watcher extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, spriteKey)
    {
        super(scene, x, y, ASSETS.spritesheet.watchers.key, spriteKey);
        scene.add.existing(this);
        this.mapOffset = scene.getMapOffset();
        this.tileSize = this.mapOffset.tileSize;
        this.setPosition(
            this.mapOffset.x + (x * this.tileSize),
            this.mapOffset.y + (y * this.tileSize)
        );
        this.setDepth(100);
        this.scene = scene;
        this.tile = { x: x, y: y };

        if (this.x < scene.cameras.main.width / 2) {
            this.flipX = true;
        }

        this.lifeState = 'alive';   // 'alive', 'dead', 'charmed'
        this.energyTint = 0x000000;
        this.master = null;

        this.turnInterval = this.scene.turnInterval;
        this.attackTimer = this.turnInterval / 2;
        this.targetAttackTiles = null;

        this.directions = [
            { x: -1, y: 0 },
            { x: 1, y: 0 },
            { x: 0, y: -1 },
            { x: 0, y: 1 }
        ];

        this.ashEmitter = scene.add.particles(0, 0, 'orb', {
            tint: 0x000000,
            lifespan: 1000,
            speed: { min: 10, max: 50 },
            scale: { start: 1, end: 0 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.ashEmitter.setDepth(100);

        this.attackEmitter = scene.add.particles(0, 0, 'spark', {
            tint: 0x000000,
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

        this.attackTimer += delta;
        if (this.attackTimer > this.turnInterval)
        {
            this.attackTimer = 0;
            this.scene.tweens.add({
                targets: this,
                y: this.y - 4,
                duration: 100,
                yoyo: true,
                ease: 'Quad.easeOut',
            });

            if (this.lifeState === 'charmed') {
                this.charmedAttack();
            } else if (this.lifeState === 'ghost') {
                this.ghostAttack();
            }
        }
    }

    die(attackTint)
    {
        if (this.lifeState !== 'dead' && this.lifeState !== 'ghost') {
            this.lifeState = 'dead';
            this.setTint(0x000000);
            this.ashEmitter.emitParticleAt(this.x, this.y, 10);
            const ash = this.scene.add.image(this.x, this.y, ASSETS.spritesheet.ash.key, Phaser.Math.RND.between(0, 15));
            ash.tint = attackTint;
            this.scene.tweens.add({
                targets: [this, ash],
                alpha: {
                    getStart: (target) => target === this ? 1 : 0,
                    getEnd: (target) => target === this ? 0 : Phaser.Math.FloatBetween(0.6, 0.9)
                },
                duration: 500,
                ease: 'Linear',
            });
        }
    }

    charm(master, masterTint)
    {
        if (this.lifeState === 'alive') {
            this.lifeState = 'charmed';
            this.master = master;
            this.setTint(masterTint);
            this.energyTint = masterTint;
            this.attackEmitter.setParticleTint(this.energyTint);
        }
    }

    charmedAttack()
    {
        // find center of map
        const centerTile = {
            x: Math.floor(this.scene.mapWidth / 2),
            y: Math.floor(this.scene.mapHeight / 2)
        };
        const dx = centerTile.x - this.tile.x;
        const dy = centerTile.y - this.tile.y;

        let chosenDir;
        if (Math.abs(dx) > Math.abs(dy)) {
            chosenDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
        } else if (dy !== 0) {
            chosenDir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
        } else {
            chosenDir = Phaser.Math.RND.pick(this.directions);
        }

        // target tiles towards center
        this.targetAttackTiles = [];
        let curTile = this.tile;
        for (let i = 0; i < 4; i++) {
            curTile = {
                x: curTile.x + chosenDir.x,
                y: curTile.y + chosenDir.y
            };
            this.targetAttackTiles.push({ ...curTile });
        }

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

    ghostify(master, masterTint)
    {
        if (this.lifeState === 'dead') {
            this.lifeState = 'ghost';
            this.master = master;
            this.setTint(masterTint);
            this.alpha = 0.5;
            this.energyTint = masterTint;
            this.attackEmitter.setParticleTint(this.energyTint);
        }
    }

    ghostAttack()
    {
        // find center of map
        const centerTile = {
            x: Math.floor(this.scene.mapWidth / 2),
            y: Math.floor(this.scene.mapHeight / 2)
        };
        const dx = centerTile.x - this.tile.x;
        const dy = centerTile.y - this.tile.y;

        let chosenDir;
        if (Math.abs(dx) > Math.abs(dy)) {
            chosenDir = dx > 0 ? { x: 1, y: 0 } : { x: -1, y: 0 };
        } else if (dy !== 0) {
            chosenDir = dy > 0 ? { x: 0, y: 1 } : { x: 0, y: -1 };
        } else {
            chosenDir = Phaser.Math.RND.pick(this.directions);
        }

        // target tiles towards center
        this.targetAttackTiles = [];
        let curTile = this.tile;
        for (let i = 0; i < 5; i++) {
            curTile = {
                x: curTile.x + chosenDir.x,
                y: curTile.y + chosenDir.y
            };
            this.targetAttackTiles.push({ ...curTile });
        }

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

    hitTile(tileX, tileY, damage)
    {
        let wizardHit = this.wasWizardHit(tileX, tileY);
        if (wizardHit) {
            wizardHit.takeDamage(damage, this.energyTint);
        }
    }

    wasWizardHit(tileX, tileY)
    {
        return this.scene.wizardGroup.getChildren().find(wizard => {
            if (wizard === this) {
                return false;      // friendly fire will not be tolerated
            } else if (wizard === this.master) {
                return false;      // don't bite the hand that charms you
            }
            return wizard.tile.x === tileX && wizard.tile.y === tileY;
        });
    }
}
