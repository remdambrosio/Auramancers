import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const actions = Object.keys(ASSETS.audio.andrew);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.andrew[action].key;
});

export default class Andrew extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, 'Andrew the Red', voicelines, 0xFF0000, 0);
    }
}
