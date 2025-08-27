import ASSETS from '../assets.js';

export class Preloader extends Phaser.Scene {
    constructor() {
        super('Preloader');
    }

    init() {
        const centreX = this.scale.width * 0.5;
        const centreY = this.scale.height * 0.5;

        const barWidth = 468;
        const barHeight = 32;
        const barMargin = 4;

        this.outline = this.add.rectangle(centreX, centreY, barWidth, barHeight).setStrokeStyle(1, 0xffffff);
        this.bar = this.add.rectangle(centreX - (barWidth * 0.5) + barMargin, centreY, barMargin, barHeight - barMargin, 0xffffff);

        this.load.on('progress', (progress) => {
            this.bar.width = barMargin + ((barWidth - (barMargin * 2)) * progress);
        });

        this.startGameText = this.add.text(centreX, centreY, 'AURAMANCERS\nClick to Start', {
            fontFamily: 'Arial Black', fontSize: 42, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        })
            .setOrigin(0.5)
            .setDepth(1000)
            .setVisible(false);
    }

    preload() {
        //  Load the assets for the game - see ./src/assets.js
        for (let type in ASSETS) {
            for (let key in ASSETS[type]) {
                let args = ASSETS[type][key].args.slice();
                args.unshift(ASSETS[type][key].key);
                this.load[type].apply(this.load, args);
            }
        }
    }

    create() {
        //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
        //  For example, you can define global animations here, so we can use them in other scenes.

        this.outline.setVisible(false);
        this.bar.setVisible(false);

        if (this.sound.locked) {
            this.startGameText.setVisible(true);
            this.input.once('pointerdown', () => {
                this.scene.start('Game');
            });
        } else {
            this.scene.start('Game');
        }
    }
}
