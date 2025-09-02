export class Menu extends Phaser.Scene {
    constructor() {
        super('Menu');
        this.wizardNames = [
            'Andrew', 'Mia', 'Tariq', '???', '???', '???', '???', '???',
            '???', '???', '???', '???'
        ];
        this.selectedWizards = ['Andrew', 'Mia', 'Tariq'];
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

            const isEnabled = this.wizardNames[i] !== '???';
            let isSelected = this.selectedWizards.includes(this.wizardNames[i]);

            const btn = this.add.rectangle(
                x,
                y,
                100, 100,
                isEnabled
                    ? ( (isSelected) ? 0x008000 : 0x555555 )
                    : 0x222222
            ).setStrokeStyle(4, 0x000000);

            if (isEnabled) {
                btn.setInteractive();
                btn.on('pointerdown', () => {
                    isSelected = this.selectedWizards.includes(this.wizardNames[i]);
                    if (isSelected) {
                        this.selectedWizards = this.selectedWizards.filter(name => name !== this.wizardNames[i]);
                    } else {
                        this.selectedWizards.push(this.wizardNames[i]);
                    }
                    btn.setFillStyle(this.selectedWizards.includes(this.wizardNames[i]) ? 0x008000 : 0x555555);
                    this.updateStartButtonState();
                });
            }

            this.add.text(
                btn.x, btn.y,
                this.wizardNames[i],
                {
                    fontFamily: 'Arial Black',
                    fontSize: 18,
                    color: isEnabled ? '#ffffff' : '#888888',
                    stroke: '#000000',
                    strokeThickness: 4,
                    align: 'center',
                }
            ).setOrigin(0.5);

            this.buttons.push(btn);
        }

        this.startBtn = this.add.text(centreX, buttonSpacing * numRows + 110, 'IGNITE AURA', {
            fontFamily: 'Arial Black',
            fontSize: 24,
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 16, y: 8 },
        }).setOrigin(0.5).setInteractive();

        this.startBtn.on('pointerdown', () => {
            if (this.canStartGame()) {
                this.scene.start('Game', { selectedWizards: this.selectedWizards });
            }
        });

        this.updateStartButtonState();
    }

    canStartGame() {
        const count = this.selectedWizards.length;
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