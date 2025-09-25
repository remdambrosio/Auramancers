import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const actions = Object.keys(ASSETS.audio.wizards.brianna);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.brianna[action].key;
});

export default class Brianna extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Brianna, Person of Things`, voicelines, 0x228B22, 36);
    }
}
