import ASSETS from '../../assets.js';
import Wizard from './Wizard.js';

const voicelines = {
    hit: ASSETS.audio.mia_hit.key,
    die: ASSETS.audio.mia_die.key,
};

export default class Mia extends Wizard {
    constructor(scene, x, y) {
        super(scene, x, y, 'Mia', voicelines, 0xFF0000, 4);
    }
}
