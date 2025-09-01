export class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
        this.selectedWizards = Array(12).fill(false);
        this.selectedWizards[0] = true;
        this.selectedWizards[1] = true;
        this.wizardNames = [
            'Andrew', 'Mia', '???', '???', '???', '???', '???', '???',
            '???', '???', '???', '???'
        ];
    }

    create() {
        const centreX = this.scale.width * 0.5;
        const centreY = this.scale.height * 0.5 -50;
        const buttonSpacing = 100;
        const buttonsPerRow = 4;
        const numRows = 3;

        this.buttons = [];

        for (let i = 0; i < 12; i++) {
            const row = Math.floor(i / buttonsPerRow);
            const col = i % buttonsPerRow;
            const x = centreX - buttonSpacing * (buttonsPerRow / 2 - 0.5) + buttonSpacing * col;
            const y = centreY - 50 - buttonSpacing * 0.5 + buttonSpacing * row;

            const isEnabled = i < this.wizardNames.length;

            const btn = this.add.rectangle(
                x,
                y,
                100, 100,
                isEnabled
                    ? (this.selectedWizards[i] ? 0x008000 : 0x555555)
                    : 0x222222
            ).setStrokeStyle(4, 0xffffff);

            if (isEnabled) {
                btn.setInteractive();
            }

            this.add.text(
                btn.x, btn.y,
                this.wizardNames[i],
                {
                    fontFamily: 'Arial Black',
                    fontSize: 18,
                    color: isEnabled ? '#ffffff' : '#888888',
                    align: 'center'
                }
            ).setOrigin(0.5);

            if (isEnabled) {
                btn.on('pointerdown', () => {
                    this.selectedWizards[i] = !this.selectedWizards[i];
                    btn.setFillStyle(this.selectedWizards[i] ? 0x008000 : 0x555555);
                    this.updateStartButtonState();
                });
            }

            this.buttons.push(btn);
        }

        this.startBtn = this.add.text(centreX, buttonSpacing * numRows + 110, 'IGNITE AURA', {
            fontFamily: 'Arial Black', fontSize: 24, color: '#ffffff',
            backgroundColor: '#000000', padding: { x: 16, y: 8 }
        }).setOrigin(0.5).setInteractive();

        this.startBtn.on('pointerdown', () => {
            if (this.canStartGame()) {
                this.scene.start('Game', { selectedWizards: this.selectedWizards });
            }
        });

        this.updateStartButtonState();
    }

    canStartGame() {
        let count = 0;
        for (let i = 0; i < this.selectedWizards.length; i++) {
            if (this.selectedWizards[i] && this.wizardNames[i] !== '???') {
                count++;
            }
        }
        return count >= 2 && count <= 4;
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
}