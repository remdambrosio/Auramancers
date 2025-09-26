import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const actions = Object.keys(ASSETS.audio.wizards.gene);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.gene[action].key;
});

export default class Gene extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Gene, Mirage Mage`, voicelines, 0xE52B63, 40);

        this.turnsSinceClone = 0;
        this.clone = null;
    }

    attack()
    {
        // target tiles
        const dir = this.book.attackDirection(this);
        this.targetAttackTiles = [];
        let curTile = this.tile;
        for (let i = 0; i < 3; i++) {
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
                this.attackEmitter.emitParticleAt(pixelX, pixelY, 5);
            });
        });
    }

    move ()
    {
        super.move();

        if (!(this instanceof GeneClone) && !this.clone) {
            this.turnsSinceClone += 1;
            if (this.turnsSinceClone >= 3) {
                this.scene.sound.play(this.voicelines.clone);
                this.clone = new GeneClone(this.scene, this.tile.x, this.tile.y, this);
                this.scene.wizardGroup.add(this.clone);
                this.turnsSinceClone = 0;
            }
        }
    }

    wasWizardHit(tileX, tileY)
    {
        return this.scene.wizardGroup.getChildren().find(wizard => {
            if (wizard === this || wizard === this.clone) {
                return false;      // friendly fire will not be tolerated
            }
            return wizard.tile.x === tileX && wizard.tile.y === tileY;
        });
    }

    die() {
        super.die();
        if (this.clone) {
            this.clone.die(true);
        }
    }
}

class GeneClone extends Gene {
    constructor(scene, x, y, master) {
        super(scene, x, y, `Gene's Clone`, voicelines, 0xE52B63, 40);

        this.master = master;

        this.sparkleEmitter = scene.add.particles(0, 0, 'spark', {
            tint: [0xFFFFFF, 0xFFC73A, 0xE52B63],
            lifespan: 1000,
            speed: { min: 10, max: 50 },
            scale: { start: 1, end: 0 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.sparkleEmitter.setDepth(100);
    }

    takeDamage()
    {
        this.die();
    }

    heal()
    {
        return;
    }

    die(masterDead = false) {
        if (this.lifeState === 'dead') {
            return;
        }
        if (!masterDead) {
            this.scene.sound.play(this.voicelines.tada);
        }
        this.lifeState = 'dead';
        this.sparkleEmitter.emitParticleAt(this.x, this.y, 10);
        this.scene.tweens.add({
            targets: this,
            alpha: {
                getStart: 1,
                getEnd: 0
            },
            duration: 250,
            ease: 'Linear',
            onComplete: () => {
                this.scene.wizardGroup.remove(this, true, true);
                if (!masterDead && this.master) {
                    this.master.clone = null;
                }
            }
        });
    }

    wasWizardHit(tileX, tileY)
    {
        return this.scene.wizardGroup.getChildren().find(wizard => {
            if (wizard === this.master) {
                return false;      // friendly fire will not be tolerated
            }
            return wizard.tile.x === tileX && wizard.tile.y === tileY;
        });
    }
}
