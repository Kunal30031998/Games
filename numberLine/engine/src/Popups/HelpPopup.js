import { BasePopup } from "../Utilities/BasePopup"
import { Constants } from "../Utilities/Constants"
import { GUIButton } from "../Utilities/GUIButton"
import { Utilities } from "../Utilities/Utilities"

export class HelpPopup extends BasePopup {
    constructor(scene) {
        super(scene)
        this.scene = scene
    }

    create() {
        this.children.push(this.scene.add.rectangle(this.scene.screenWidth * .5, this.scene.screenHeight * .5, this.scene.screenWidth, this.scene.screenHeight, 0x000000).setDepth(100).setOrigin(0.5).setAlpha(.7).setInteractive())

        this.panel = this.scene.add.image(this.scene.screenWidth * .5, this.scene.screenHeight * .53, 'helpPanel').setOrigin(0.5).setDepth(100)
        // this.Helpoutline = this.scene.add.image(0, 0, 'helpoutline').setOrigin(0.5).setDepth(110)
        // this.Helpoutline.followObject = this.panel;

        this.playBTN = new GUIButton(this.scene, 0, this.panel.height * .525, 'btn', 101, "PLAY", () => {
            if(this.scene.scene.key === Constants.MenuView){
                Utilities.changeScene(this.scene, Constants.LevelSelectView)
            }
            else{
                this.close()
                this.scene.gameplayTimer && (this.scene.gameplayTimer.paused = false)
                this.scene.time.addEvent({ delay: 300, callback: ()=>{
                    this.scene.GameOverPopup && (this.scene.GameOverPopup.GameOverContainer.visible = true);
                    this.scene.GameTimeOverPopup && (this.scene.GameTimeOverPopup.GameOverContainer.visible = true);
                }, callbackScope: this.scene})
            }
        })
        this.playBTN.button.setScale(.7);
        this.playBTN.text.setScale(.7);
        this.leftArrow = new GUIButton(this.scene, -this.panel.width * .53, 0, "helpprevious", 101, "", () => {
            this.disableButtons()
            this.images[this.currentHelp].audio.pause()
            this.currentHelp--
            this.images.forEach((image, index) => {
                this.scene.tweens.add({
                    targets: image.image,
                    x: image.image.x + this.panel.width * this.scene.globalScale,
                    xOriginal: image.image.xOriginal + this.panel.width,
                    duration: 350
                }).on("complete", () => {
                    this.activateButtons()
                    this.images[this.currentHelp].audio.play()
                })
            })
        })
        this.rightArrow = new GUIButton(this.scene, this.panel.width * .53, 0,  "helpnext", 101, "", () => {
            this.disableButtons()
            this.images[this.currentHelp].audio.pause()
            this.currentHelp++
            this.images.forEach((image, index) => {
                this.scene.tweens.add({
                    targets: image.image,
                    x: image.image.x - this.panel.width * this.scene.globalScale,
                    xOriginal: image.image.xOriginal - this.panel.width,
                    duration: 350
                }).on("complete", () => {
                    this.activateButtons()
                    this.images[this.currentHelp].audio.play()
                })
            })
        })
        // this.leftArrow.button.flipX = true

        this.mask = this.scene.make.image({
            x: 0,
            y: 0,
            key: 'helpPanel',
            add: false
        }).setOrigin(.5)
        this.mask.followObject = this.panel
        this.images = this.scene.jsonData.common.Instructions
        this.images.forEach((image, index) => {
            image.image = this.scene.add.image(this.panel.width * index, 0, image.id).setOrigin(0.5).setDepth(100)
            image.audio = this.scene.sound.add(image.id)
            image.image.mask = new Phaser.Display.Masks.BitmapMask(this.scene, this.mask);
            image.image.followObject = this.panel
            this.children.push(image.image)
        })
        this.currentHelp = 0
        
        this.disableButtons()
        this.activateButtons()

        this.leftArrow.button.followObject = this.rightArrow.button.followObject = this.panel

        this.playBTN.button.followObject = this.panel
        if(this.playBTN && this.playBTN.text){
            this.playBTN.text.followObject = this.panel
        }
        
        this.children.push(this.panel)
        this.children.push(this.playBTN.button)
        if(this.playBTN && this.playBTN.text){
            this.children.push(this.playBTN.text)
        }
        this.children.push(this.leftArrow.button)
        this.children.push(this.rightArrow.button)
        // this.children.push(this.Helpoutline)

        this.hide()
        this.close()
    }

    disableButtons() {
        this.leftArrow.button.input.enabled = false
        this.rightArrow.button.input.enabled = false
    }

    activateButtons() {
        if (this.currentHelp < this.images.length - 1) {
            this.rightArrow.button.input.enabled = true
            this.rightArrow.button.clearTint()
        } else {
            this.rightArrow.button.setTint(0x444444)
        }
        if (this.currentHelp > 0) {
            this.leftArrow.button.input.enabled = true
            this.leftArrow.button.clearTint()
        } else {
            this.leftArrow.button.setTint(0x444444)
        }
    }

    open(){
        super.open();
        this.images[this.currentHelp].audio.play()
    }

    close(){
        super.close();
    }
}