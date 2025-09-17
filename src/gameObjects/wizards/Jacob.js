import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';
import JacobBook from './JacobBook.js';

const actions = Object.keys(ASSETS.audio.wizards.jacob);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.jacob[action].key;
});

export default class Jacob extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Jacob, Naughty Alchemist`, voicelines, 0xBED300, 28);

        this.attackEmitter = scene.add.particles(0, 0, 'orb', {
            tint: this.energyTint,
            lifespan: 400,
            speed: { min: 5, max: 35 },
            scale: { start: 1.2, end: 0 },
            blendMode: 'NORMAL',
            emitting: false
        });
        this.attackEmitter.setDepth(200);

        this.book = new JacobBook();

        this.attackStep = 0;
    }

    attack() {
        this.auraPulse();
        this.attackStep++;
        if (this.attackStep % 2 === 0) {
            this.book.wowPotionDrop(this);
        }
    }
}
