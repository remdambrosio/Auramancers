/* global Phaser */
import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const actions = Object.keys(ASSETS.audio.wizards.julian);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.julian[action].key;
});

export default class Julian extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Julian, Herald of the Curse`, voicelines, 0xFF8C00, 20);

        this.attackEmitter = scene.add.particles(0, 0, 'slash', {
            tint: [0xFFC73A, 0xFF8C00],
            lifespan: 250,
            speed: { min: 5, max: 50 },
            scale: { start: 2, end: 0 },
            rotate: { min: 0, max: 360 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.attackEmitter.setDepth(200);

        this.hasRevived = false;
        this.baseSpriteKey = 20;
        this.revivedSpriteKey = 24;
    }

    attack()
    {
        // target tiles
        const dir = this.book.attackDirection(this);
        this.targetAttackTiles = [];
        let curTile = this.tile;
        for (let i = 0; i < 2; i++) {
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
                this.attackEmitter.emitParticleAt(pixelX, pixelY, 3);
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

        this.setFrame(this.getBaseSpriteKey() + healthFrame);
        this.scene.time.delayedCall(250, () => { this.setFrame(this.getBaseSpriteKey()); });
    }

    die(attackTint) {
        if (this.hasRevived) {
            this.lifeState = 'dead';
            this.scene.deadWizards.push(this);
            this.scene.liveWizards = this.scene.liveWizards.filter(wiz => wiz !== this);
            if (this.scene.liveWizards.length <= 1) {
                this.scene.endGame();
            }
        } else {
            this.hasRevived = true;
            this.lifeState = 'dead';
            this.scene.time.delayedCall(2000, () => {
                this.scene.sound.play(this.voicelines.revive);
                this.lifeState = 'alive';
                this.health = this.maxHealth;
                this.scene.tweens.add({
                    targets: [this, ash],
                    alpha: {
                        getStart: (target) => target === this ? 0 : 1,
                        getEnd: (target) => target === this ? 1 : 0
                    },
                    duration: 250,
                    ease: 'Linear',
                    onComplete: () => {
                        this.setVisible(true);
                        this.clearTint();
                    }
                });
            });
        }
        this.scene.sound.play(this.voicelines.die);
        this.setTint(attackTint);
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
                this.setFrame(this.getBaseSpriteKey());
            }
        });
    }
    getBaseSpriteKey() {
        if (this.hasRevived) {
            return this.revivedSpriteKey;
        } else {
            return this.baseSpriteKey;
        }
    }
}
