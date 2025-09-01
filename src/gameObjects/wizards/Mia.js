import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const actions = Object.keys(ASSETS.audio.mia);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.mia[action].key;
});

export default class Mia extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, 'Mialeficent', voicelines, 0x8300FF, 4);
    }
}
