/* global Phaser */
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

        this.cameras.main.setBackgroundColor('0x3F2631');
        
        this.outline = this.add.rectangle(centreX, centreY, barWidth, barHeight).setStrokeStyle(1, 0xffffff);
        this.bar = this.add.rectangle(centreX - (barWidth * 0.5) + barMargin, centreY, barMargin, barHeight - barMargin, 0xffffff);

        this.load.on('progress', (progress) => {
            this.bar.width = barMargin + ((barWidth - (barMargin * 2)) * progress);
        });
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
        
        this.fontLoaded = false;
        document.fonts.load('1em Tagesschrift').then(() => {
            this.fontLoaded = true;
        });
    }

    create() {
        this.outline.setVisible(false);
        this.bar.setVisible(false);

        if (this.fontLoaded) {
            this.scene.start('Splash');
        } else {
            this.time.addEvent({
                delay: 50,
                callback: () => {
                    if (this.fontLoaded) {
                        this.scene.start('Splash');
                    }
                },
                repeat: -1,
            });
        }
    }
}
