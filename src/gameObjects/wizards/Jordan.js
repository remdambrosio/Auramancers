import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const actions = Object.keys(ASSETS.audio.wizards.jordan);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.jordan[action].key;
});

export default class Jordan extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Jordan, Racecar Ritualist`, voicelines, 0xFFD800, 52);
    }
}
