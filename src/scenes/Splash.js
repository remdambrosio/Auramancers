/* global Phaser */

export class Splash extends Phaser.Scene {
    constructor() {
        super('Splash');
        this.rainbowHue = 0;
    }

    create() {
        this.sound.play('themeSong', { loop: true });
        const centreX = this.scale.width * 0.5;
        const centreY = this.scale.height * 0.5;

        this.backdrop = this.add.graphics();
        this.drawRainbowBackdrop();

        this.titleText = this.add.text(
            centreX, centreY - 165,
            'AURAMANCERS',
            {
                fontFamily: 'Tagesschrift',
                fontSize: 48,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 7,
                align: 'center',
            }
        ).setOrigin(0.5);

        this.clickText = this.add.text(
            centreX, centreY - 100,
            'CLICK TO BEGIN THE TOURNEY',
            {
                fontFamily: 'Tagesschrift',
                fontSize: 24,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                align: 'center',
            }
        ).setOrigin(0.5);

        this.titlemapImage = this.add.image(centreX, centreY, 'titlemap');

        this.input.on('pointerdown', () => {
            this.sound.stopByKey('themeSong');
            this.scene.start('Menu');
        });
    }

    updateStartButtonState() {
        if (this.canStartGame()) {
            this.startBtn.setAlpha(1);
            this.startBtn.setInteractive();
        } else {
            this.startBtn.setAlpha(0.5);
            this.startBtn.disableInteractive();
        }
    }

    update() {
        this.rainbowHue = (this.rainbowHue + 0.1) % 360;
        this.drawRainbowBackdrop();
    }

    drawRainbowBackdrop() {
        const color = Phaser.Display.Color.HSLToColor(this.rainbowHue / 360, 0.6, 0.5).color;
        this.backdrop.clear();
        this.backdrop.fillStyle(color, 1);
        this.backdrop.fillRect(0, 0, this.scale.width, this.scale.height);
        this.backdrop.setDepth(-100);
    }
}