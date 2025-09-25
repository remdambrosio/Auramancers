import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const actions = Object.keys(ASSETS.audio.wizards.avalon);
const voicelines = {};
actions.forEach(action => {
    voicelines[action] = ASSETS.audio.wizards.avalon[action].key;
});

export default class Avalon extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, `Avalon, Person of Things`, voicelines, 0x228B22, 32);
    }
}
