import WizardBook from './WizardBook.js';
import Potion from '../Potion.js';

async function loadWow() {
    const response = await fetch('../../../data/wow.json');
    return await response.json();
}

export default class JacobBook extends WizardBook {
    constructor() {
        super();

        this.currentSentimentIndex = 0;

        // normalize from 1-9, with neutral sentiment always being 5 (no potion)
        loadWow().then(sentiments => {
            const nonZero = sentiments.filter(s => s !== 0);
            const bound = Math.max(...nonZero.map(Math.abs));
            this.normalizedSentiments = sentiments.map(s => {
                if (s === 0) return 5;
                if (s < 0) {
                    return 1 + Math.round((Math.abs(s) - 1) * 3 / (bound - 1));
                }
                return 6 + Math.round((s - 1) * 3 / (bound - 1));
            });
        });
    }
    
    wowPotionDrop(wizard) {
        if (this.normalizedSentiments[this.currentSentimentIndex] !== 5) {
            const potionType = this.normalizedSentiments[this.currentSentimentIndex];
            new Potion(wizard.scene, wizard.tile.x, wizard.tile.y, wizard, potionType);
        }
        this.currentSentimentIndex = (this.currentSentimentIndex + 1) % (this.normalizedSentiments?.length ?? 1);
    }
}
