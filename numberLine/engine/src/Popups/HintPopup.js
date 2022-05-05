import { BasePopup } from "../Utilities/BasePopup"
import { GUIButton } from "../Utilities/GUIButton"

export class HintPopup extends BasePopup {
    constructor(scene) {
        super(scene)
    }

    create() {
        this.children.push(this.scene.add.rectangle(this.scene.screenWidth * .5, this.scene.screenHeight * .5, this.scene.screenWidth, this.scene.screenHeight, 0x000000).setDepth(100).setOrigin(0.5).setAlpha(.7).setInteractive())

        this.panel = this.scene.add.image(this.scene.screenWidth * .5, this.scene.screenHeight * .5, 'hintPanel').setOrigin(0.5).setDepth(100)
        this.text = this.scene.add.text(0, 0, "",
            {
                fontSize: '50px',
                fontFamily: 'Roboto-Bold',
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: this.panel.width * .8 }
            }).setOrigin(0.5).setDepth(100)
        this.closeBTN = new GUIButton(this.scene, this.panel.width * .45, -this.panel.height * .35, 'close', 100, "", () => {
            this.close()
            this.onPopupClose()
        })

        this.text.followObject = this.closeBTN.button.followObject = this.panel

        this.children.push(this.panel)
        this.children.push(this.text)
        this.children.push(this.closeBTN.button)

        this.close()
        this.hide()
    }

    open(message) {
        this.text.text = message
        super.open()
    }
}