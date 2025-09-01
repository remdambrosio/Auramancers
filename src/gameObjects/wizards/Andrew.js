import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const voicelines = {
    hit: ASSETS.audio.andrew_hit.key,
    die: ASSETS.audio.andrew_die.key,
};

export default class Andrew extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, 'Andrew', voicelines, 0x0000FF, 0);
    }
}
