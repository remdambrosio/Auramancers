import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const actions = Object.keys(ASSETS.audio.wizards.rem);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.rem[action].key;
});

export default class Rem extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Rem, Entitled Prince`, voicelines, 0xFF72DE, 12);
    }
}
