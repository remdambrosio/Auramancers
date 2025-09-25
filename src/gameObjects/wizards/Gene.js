import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const actions = Object.keys(ASSETS.audio.wizards.gene);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.gene[action].key;
});

export default class Gene extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Gene, Person of Things`, voicelines, 0x228B22, 40);
    }
}
