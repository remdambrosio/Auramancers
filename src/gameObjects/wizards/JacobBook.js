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

        // normalize from 0-8, with neutral sentiment always being 4 (no potion)
        loadWow().then(sentiments => {
            const nonZero = sentiments.filter(s => s !== 0);
            const bound = Math.max(...nonZero.map(Math.abs));
            this.normalizedSentiments = sentiments.map(s => {
                if (s === 0) return 4;
                if (s < 0) {
                    return Math.round((Math.abs(s) - 1) * 3 / (bound - 1));
                } else {
                    return Math.min(7, 5 + Math.round((s - 1) * 3 / (bound - 1)));
                }
            });
        });
    }
    
    wowPotionDrop(wizard) {
        let potionExists = this.potionExistsAt(wizard.scene, wizard.tile.x, wizard.tile.y);
        if (this.normalizedSentiments[this.currentSentimentIndex] !== 4 && !potionExists) {
            const potionType = this.normalizedSentiments[this.currentSentimentIndex];
            new Potion(wizard.scene, wizard.tile.x, wizard.tile.y, wizard, potionType);
        }
        this.currentSentimentIndex = (this.currentSentimentIndex + 1) % (this.normalizedSentiments?.length ?? 1);
    }

    potionExistsAt(scene, tileX, tileY) {
        return scene.potionGroup.getChildren().some(
            potion => potion.tileX === tileX && potion.tileY === tileY
        );
    }
}
