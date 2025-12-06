/* global Phaser */
import wizardClasses from '../wizardClasses.js';

export class Splash extends Phaser.Scene {
    constructor() {
        super('Splash');
        this.rainbowHue = 0;
        this.wizardIndex = 0;
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

        const clickTextWords =
            ['TOURNEY', 'MELEE', 'ENTANGLEMENT',
            'BASH', 'SHOWDOWN', 'RUCKUS',
            'FRACAS', 'DONNYBROOK', 'PUGILISM',
            'HULLABALOO', 'RUMBLE', 'DUST-UP',
            'ALTERCATION', 'RUMPUS', 'TUSSLE',
            'SCUFFLE', 'SKIRMISH', 'ENGAGEMENT', 'AFFAIR',
            'WRASTLE', 'DRAMA', 'COMMOTION',];
        const clickTextWord = clickTextWords[Math.floor(Math.random() * clickTextWords.length)];

        this.clickText = this.add.text(
            centreX, centreY - 100,
            `CLICK TO BEGIN THE ${clickTextWord}`,
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
        this.titlemapImage.setDepth(-500);

        this.wizardText = this.add.text(
            centreX, centreY + 135,
            '',
            {
                fontFamily: 'Tagesschrift',
                fontSize: 24,
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 6,
                align: 'center',
            }
        ).setOrigin(0.5);

        this.shuffledWizards = Phaser.Utils.Array.Shuffle(wizardClasses);
        this.nextWizardTime = this.time.now + 1000;

        this.input.on('pointerdown', () => {
            this.sound.stopByKey('themeSong');
            this.scene.start('Menu');
        });
    }

    update(time) {
        this.rainbowHue = (this.rainbowHue + 0.1) % 360;
        this.drawRainbowBackdrop();

        if (time >= this.nextWizardTime) {
            this.wizardIndex = (this.wizardIndex + 1) % this.shuffledWizards.length;
            this.wizardText.setText(this.shuffledWizards[this.wizardIndex].name);
            this.nextWizardTime = time + 1000;
        }
    }

    drawRainbowBackdrop() {
        const color = Phaser.Display.Color.HSLToColor(this.rainbowHue / 360, 0.6, 0.5).color;
        this.backdrop.clear();
        this.backdrop.fillStyle(color, 1);
        this.backdrop.fillRect(0, 0, this.scale.width, this.scale.height);
        this.backdrop.setDepth(-1000);
    }
}
