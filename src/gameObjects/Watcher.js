import ASSETS from '../assets.js';

export default class Watcher extends Phaser.Physics.Arcade.Sprite
{
    constructor(scene, x, y, spriteKey)
    {
        super(scene, x, y, ASSETS.spritesheet.characters.key, spriteKey);
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

        this.emitter = scene.add.particles(0, 0, 'spark', {
            tint: 0x000000,
            lifespan: 1000,
            speed: { min: 5, max: 50 },
            scale: { start: 0.5, end: 0 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.emitter.setDepth(100);
    }

    die()
    {
        this.setTint(0x000000);
        this.emitter.emitParticleAt(this.x, this.y, 10);
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {
                this.destroy();
            }
        });
    }
}