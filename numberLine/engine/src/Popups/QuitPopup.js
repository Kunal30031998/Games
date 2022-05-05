import { BasePopup } from "../Utilities/BasePopup"
import { GUIButton } from "../Utilities/GUIButton"
import { Utilities } from "../Utilities/Utilities"
import { Constants } from "../Utilities/Constants"

export class QuitPopup extends BasePopup {
    constructor(scene) {
        super(scene)
    }

    create() {
        this.children.push(this.scene.add.rectangle(this.scene.screenWidth * .5, this.scene.screenHeight * .5, this.scene.screenWidth, this.scene.screenHeight, 0x000000).setDepth(110).setOrigin(0.5).setAlpha(.7).setInteractive())

        this.panel = this.scene.add.image(this.scene.screenWidth * .5, this.scene.screenHeight * .5, 'quitPanel').setOrigin(0.5).setDepth(110)
        this.quitHeader = this.scene.add.image(0, -205, 'quitlable').setOrigin(0.5).setDepth(110)
        this.yes = new GUIButton(this.scene, this.panel.width * .22, this.panel.height * .2, 'btn', 110, "YES", () => {
            this.close()
            this.onPopupClose()
            Utilities.SendDataToServer(this.scene)
            Utilities.changeScene(this.scene, Constants.MenuView)
        })
        this.yes.text.setFontSize(40)
        this.yes.button.setScale(.7)
        this.no = new GUIButton(this.scene, -this.panel.width * .22, this.panel.height * .2, 'btn', 110, "NO", () => {
            this.close()
            this.onPopupClose()
            this.scene.gameplayTimer && (this.scene.gameplayTimer.paused = false)
            this.scene.time.addEvent({ delay: 300, callback: ()=>{
                this.scene.GameOverPopup && (this.scene.GameOverPopup.GameOverContainer.visible = true);
                this.scene.GameTimeOverPopup && (this.scene.GameTimeOverPopup.GameOverContainer.visible = true);
            }, callbackScope: this.scene})
            // this.scene.settingsBTN.setInteractive();
        })
        this.no.text.setFontSize(40)
        this.no.button.setScale(.7)
        this.text = this.scene.add.text(0, -70, "Are you sure you want to quit ?",
            {
                fontSize: '50px',
                fontFamily: 'Roboto-Bold',
                color: '#000000',
                align: 'center',
                wordWrap: { width: this.panel.width * .8 }
            }).setOrigin(0.5).setDepth(110)

        this.yes.text.followObject = this.no.text.followObject = this.quitHeader.followObject = this.text.followObject = this.yes.button.followObject = this.no.button.followObject = this.panel

        this.children.push(this.panel)
        this.children.push(this.yes.button)
        this.children.push(this.no.button)
        this.children.push(this.text)
        this.children.push(this.quitHeader)
        this.children.push(this.yes.text)
        this.children.push(this.no.text)

        this.hide()
        this.close()
    }
}