import WizardBook from './wizardBook.js';
import Potion from '../Potion.js';

async function loadWow() {
    const response = await fetch('../../../data/wow.json');
    return await response.json();
}

export default class JacobBook extends WizardBook {
    constructor() {
        super();

        loadWow().then(sentiments => {
            this.normalizedSentiments = sentiments.map(s => 
                s < 0 ? -1 : (s > 0 ? 1 : 0)
            );
        });

        this.currentSentimentIndex = 0;
    }

    wowPotionDrop(wizard) {
        const potionType = this.normalizedSentiments?.[this.currentSentimentIndex] ?? 0;

        const potion = new Potion(wizard.scene, wizard.x, wizard.y, 0, potionType);
        wizard.scene.add.existing(potion);

        this.currentSentimentIndex = (this.currentSentimentIndex + 1) % (this.normalizedSentiments?.length ?? 1);
    }
}
