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
            align: 'center',
            resolution: 2
        })
            .setOrigin(0.5)
            .setDepth(1000)
            .setVisible(false);
    }

preload() {
    function loadAssets(type, obj, loader) {
        for (let key in obj) {
            if (obj[key].args && obj[key].key) {
                let args = obj[key].args.slice();
                args.unshift(obj[key].key);
                loader[type].apply(loader, args);
            } else if (typeof obj[key] === 'object') {
                loadAssets(type, obj[key], loader);
            }
        }
    }
    for (let type in ASSETS) {
        loadAssets(type, ASSETS[type], this.load);
    }
}

    create() {
        this.outline.setVisible(false);
        this.bar.setVisible(false);
        this.startGameText.setVisible(true);
        this.startGameText.setVisible(true);
        this.input.once('pointerdown', () => {
            this.scene.start('Menu');
        });
    }
}
