import { Constants } from "../Utilities/Constants"
import { BaseScene } from "../Utilities/BaseScene"
import { GUIButton } from "../Utilities/GUIButton"
import { Utilities } from "../Utilities/Utilities"
import { HelpPopup } from "../Popups/HelpPopup"

export class LevelSelectView extends BaseScene {
    constructor() {
        super({ key: Constants.LevelSelectView })
        this.helpPopup = new HelpPopup(this)
    }

    create() {
        super.create()
        this.helpPopup.create()
        this.SetUpLevelSelection();
    }

    SetUpLevelSelection(){
        this.bg = this.add.image(this.screenWidth*0.5,this.screenHeight*0.5,'bg').setOrigin(0.5);
        this.bg.shouldResize = false
        this.bgElement = this.add.image(this.screenWidth*0.5,this.screenHeight*0.5,'bgelelement').setOrigin(0.5);

        this.Gameplay2 = this.add.image(this.screenWidth*0.725,this.screenHeight*0.55,'LevelSelect').setOrigin(0.5).setInteractive({useHandCursor: true})
        this.Gameplay1 = this.add.image(this.screenWidth*0.275,this.screenHeight*0.55,'LevelSelect').setOrigin(0.5).setInteractive({useHandCursor: true})

        this.Gameplay1.on('pointerup', () => {
            this.Gameplay1.scale = (this.Gameplay1.scale) / 1.2
            this.scene.game.soundManager.play(Constants.Sounds.Click)
            this.clicked = false
        })

        this.Gameplay1.on('pointerout', () => {
            if (this.clicked) {
                this.Gameplay1.scale = (this.Gameplay1.scale) / 1.2
                this.clicked = false
            }
        })
        this.Gameplay1Text = this.add.text(0,-10 ,"Explore Number Lines",{font: "70px Roboto-Bold", fill: "#ffffff", align: "center",wordWrap: { width: this.Gameplay1.width * .7 }}).setOrigin(0.5)
        this.Gameplay2Text = this.add.text(0,-10 ,"Perform Operations",{font: "70px Roboto-Bold", fill: "#ffffff", align: "center",wordWrap: { width: this.Gameplay2.width * .8 }}).setOrigin(0.5)
        this.Gameplay1Text.followObject = this.Gameplay1;
        this.Gameplay2Text.followObject = this.Gameplay2;

        this.Gameplay2.on("pointerdown", () => {
            this.game.soundManager.play(Constants.Sounds.Click)
            Utilities.changeScene(this, Constants.GamePlayPerformOperation)
        })

        this.Gameplay1.on("pointerdown", () => {
            this.clicked = true
            this.Gameplay1.scale = (this.Gameplay1.scale) * 1.2
            this.game.soundManager.play(Constants.Sounds.Click)
            Utilities.changeScene(this, Constants.GamePlayView)
        })
        this.playBtnShine(this.Gameplay1)  
        this.playBtnShine(this.Gameplay2)  
    }

    playModeAnimation(){

        this.Gameplay2Tween = this.tweens.add({
            targets: this.Gameplay2Container,
            x: this.screenWidth*0.725 * this.scaleX,
            xOriginal: this.screenWidth*0.75,
            ease: 'Quad',
            duration: 500,
            delay: 0,
            onComplete: ()=>{
                this.playBtnShine(this.Gameplay2,this.Gameplay2Container)
            }
            // repeat: -1
        })

        this.Gameplay1Tween = this.tweens.add({
            targets: this.Gameplay1Container,
            x: this.screenWidth*0.275 * this.scaleX,
            xOriginal: this.screenWidth*0.25,
            ease: 'Quad',
            duration: 500,
            delay: 0,
            onComplete: ()=>{
                this.playBtnShine(this.Gameplay1,this.Gameplay1Container)   
            }
        })
    }

    playBtnShine(gameplay,container){
        let GamePlaybtnShine = this.add.image(-1000,-10,'btnShine').setOrigin(0.5).setDepth(1)
        GamePlaybtnShine.followObject = gameplay;
        let GamePlaymaskShape = this.add.graphics();
        GamePlaymaskShape.fillStyle(0x000000, 0);
        GamePlaymaskShape.fillRect(-gameplay.width/2 + 39*this.scaleX,-gameplay.height/2 + 29*this.scaleY, gameplay.width - 90 * this.globalScale, gameplay.height - 88 * this.globalScale);
        GamePlaymaskShape.followObject = gameplay
        GamePlaybtnShine.mask = new Phaser.Display.Masks.GeometryMask(this, GamePlaymaskShape);

        this.GameplayBtnShineTween = this.tweens.add({
            targets: GamePlaybtnShine,
            x: this.screenWidth,
            xOriginal: this.screenWidth,
            ease: 'Quad',
            duration: 2000,
            delay: 0,
            repeat: -1,
        })
    }
}