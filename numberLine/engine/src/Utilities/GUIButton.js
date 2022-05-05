import { Constants } from "./Constants"

export class GUIButton {
    constructor(scene, x, y, image, depth, text = "", pointerUp = (() => { }), pointerDown = (() => { })) {
        this.scene = scene
        this.pointerDown = pointerDown
        this.pointerUp = pointerUp

        this.clicked = false

        this.button = this.scene.add
            .image(x, y, image)
            .setInteractive({ useHandCursor: true })
            .setDepth(depth)

        if (text !== "") {
            this.text = this.scene.add
                .text(x, y - 5, text, {
                    fontSize: '60px',
                    fontFamily: 'Roboto-Bold',
                    color: '#ffffff',
                    wordWrap: { width: this.button.width * .4 }
                })
                .setOrigin(0.5)
                .setDepth(depth)
            //.setShadow(0, 3, '#000000', 5)
        }

        this.button.on("pointerdown", () => {
            this.clicked = true
            this.button.scale = (this.button.scale) * 1.2
            this.pointerDown()
        })

        this.button.on('pointerup', () => {
            this.button.scale = (this.button.scale) / 1.2
            this.pointerUp()
            this.scene.game.soundManager.play(Constants.Sounds.Click)
            this.clicked = false
        })

        this.button.on('pointerout', () => {
            if (this.clicked) {
                this.button.scale = (this.button.scale) / 1.2
                this.clicked = false
            }
        })

        this.setActive(true)
    }

    setActive(active) {
        this.active = active
        this.button.input.enabled = active
        if (active) {
            this.button.clearTint()
        } else {
            this.button.setTint(0x444444)
        }
    }
}
