import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const actions = Object.keys(ASSETS.audio.wizards.tariq);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.tariq[action].key;
});

export default class Tariq extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Tariq, Friend of Trees`, voicelines, 0x228B22, 8);
    }
}
