import { BasePopup } from "../Utilities/BasePopup"
import { Constants } from "../Utilities/Constants"
import { GUIButton } from "../Utilities/GUIButton"
import { Utilities } from "../Utilities/Utilities"

export class ThreeStarPopup extends BasePopup {
    constructor(scene, type) {
        super(scene)
        this.scene = scene
        this.type = type
    }

    create() {
        this.GameOverContainer = this.scene.add.container(0,0).setDepth(150);
        let overlay = this.scene.add.rectangle(this.scene.screenWidth * .5, this.scene.screenHeight * .5, this.scene.screenWidth, this.scene.screenHeight, 0x000000).setDepth(150).setOrigin(0.5).setAlpha(.7).setInteractive()
        this.children.push(overlay)

        this.StartShine = this.scene.add.image(0, -325,  'rays').setOrigin(0.5).setDepth(150)
        this.blurbg = this.scene.add.image(0, 0,  'blurbg').setOrigin(0.5).setDepth(150)
        this.panel = this.scene.add.image(this.scene.screenWidth * .5, this.scene.screenHeight * .5, 'QuestionsCompletePopup').setOrigin(0.5).setDepth(150)

        this.children.push(this.blurbg)
        this.children.push(this.StartShine)
        this.children.push(this.panel)
        this.StartShine.followObject = this.panel;
        this.blurbg.followObject = this.StartShine;

        this.particles = this.scene.add.particles('particleStar').setDepth(150);

        this.emitter = this.particles.createEmitter({
            x: 0,
            y: -260,
            angle: { min: 180, max: 360 },
            speed: { min: 10, max: 150 },
            gravityY: 0,
            delay: 1000,
            maxParticles: 250,
            lifespan: 3000,
            quantity: 1,
            scale: { start: 1, end: 1 },
            alpha: { start: 1, end: 0 },
            rotation: { start: 0, end: 1 },
            blendMode: 'ADD'
        });
        this.particles.followObject = this.panel;
        this.children.push(this.particles)

        this.GameCompleteText = this.scene.add.text(0,-210, 'Game Completed',{
            fontSize: '65px',
            fontFamily: 'Roboto-Bold',
            color: '#000000',
            align: 'center',
            lineSpacing: 10,
        }).setOrigin(0.5).setDepth(150);
        this.GameCompleteText.followObject = this.panel

        this.children.push(this.panel)
        this.children.push(this.GameCompleteText)

        this.blankLeftStars = this.scene.add.image(-155, -340, 'blankLeftStar').setOrigin(0.5).setDepth(151)
        this.blankCenterStars = this.scene.add.image(0, -390, 'blankCenterStar').setOrigin(0.5).setDepth(151)
        this.blankRightStars = this.scene.add.image(155, -340, 'blankRightStar').setOrigin(0.5).setDepth(151)
        this.blankLeftStars.followObject = this.panel
        this.blankCenterStars.followObject = this.panel
        this.blankRightStars.followObject = this.panel
        this.children.push(this.blankLeftStars)
        this.children.push(this.blankCenterStars)
        this.children.push(this.blankRightStars)

        this.scoreBg = this.scene.add.image(0, 50, 'pointbg').setOrigin(0.5).setDepth(151);
        this.score = this.scene.add.text(0, 50, "Score",
            {
                fontSize: '70px',
                fontFamily: 'Roboto-Bold',
                color: '#ffffff',
                align: 'center',
                lineSpacing: 10,
            }).setOrigin(0.5).setDepth(151)
        this.score.followObject = this.panel;
        this.scoreBg.followObject = this.panel;
        this.children.push(this.scoreBg);
        this.children.push(this.score)

        this.YouEarnText = this.scene.add.text(0,-50, 'You Earn',{
            fontSize: '45px',
            fontFamily: 'Roboto-Bold',
            color: '#000000',
            align: 'center',
            lineSpacing: 10,
        }).setOrigin(0.5).setDepth(150);
        this.YouEarnText.followObject = this.panel

        this.children.push(this.YouEarnText)

        this.filledLeftStar = this.scene.add.image(-155, -340, 'filledLeftStar').setOrigin(0.5).setDepth(151)
        this.filledCenterStar = this.scene.add.image(0, -390, 'filledCenterStar').setOrigin(0.5).setDepth(151)
        this.filledRightStar = this.scene.add.image(155, -340,  'filledRightStar').setOrigin(0.5).setDepth(151)

        this.filledLeftStar.followObject = this.panel
        this.filledCenterStar.followObject = this.panel
        this.filledRightStar.followObject = this.panel

        this.children.push(this.filledLeftStar)
        this.children.push(this.filledCenterStar)
        this.children.push(this.filledRightStar)
        

        switch (this.type) {
            case Constants.Popups.GameOver:
                this.button = new GUIButton(this.scene, -this.scene.screenWidth * .11, this.scene.screenHeight * .18, 'replyBTN', 150, '', () => {
                    this.close()
                    this.onPopupClose()
                    this.scene.replayGame()
                })
                this.homebtn = new GUIButton(this.scene, this.scene.screenWidth * .11, this.scene.screenHeight * .18, 'homebtn', 150, '', () => {
                    // this.close()
                    // Utilities.SendDataToServer(this.scene)
                    Utilities.changeScene(this.scene, Constants.LevelSelectView)
                })
                this.homebtn.button.setScale(.9)
                this.button.button.setScale(.9)
                this.GameCompleteText.setText("Time's Up")
                // this.quitBTN.button.setDepth(100)
                this.homebtn.button.followObject = this.panel
                this.children.push(this.homebtn.button)
                break
            case Constants.Popups.BetweenLevelClear:
                this.button = new GUIButton(this.scene, 0, this.scene.screenHeight * .15, 'nextBTN', 150, '', () => {
                    this.close()
                    this.onPopupClose()
                    this.scene.nextQuestion()
                })
                break
            case Constants.Popups.LevelClear:
                this.button = new GUIButton(this.scene, -this.scene.screenWidth * .11, this.scene.screenHeight * .18, 'replyBTN', 150, '', () => {
                    this.close()
                    this.onPopupClose()
                    this.scene.replayGame()
                })
                this.homebtn = new GUIButton(this.scene, this.scene.screenWidth * .11, this.scene.screenHeight * .18, 'homebtn', 150, '', () => {
                    // this.close()
                    // Utilities.SendDataToServer(this.scene)
                    Utilities.changeScene(this.scene, Constants.LevelSelectView)
                })
                this.homebtn.button.setScale(.9)
                this.button.button.setScale(.9)
                this.GameCompleteText.setText("Game Completed")
                // this.quitBTN.button.setDepth(100)
                this.homebtn.button.followObject = this.panel
                this.children.push(this.homebtn.button)
                break
        }

        // this.button.button.setDepth(100)
        this.button.button.followObject = this.panel
        this.children.push(this.button.button)

        this.GameOverContainer.add([overlay,this.StartShine,this.blurbg,this.particles,this.panel,this.GameCompleteText,this.blankLeftStars,this.blankCenterStars,this.blankRightStars,this.scoreBg,
            this.score,this.YouEarnText,this.filledLeftStar,this.filledCenterStar,this.filledRightStar,this.button.button,this.homebtn.button])

        this.hide()
        this.close()
    }

    open(stars = 3, score = 0) {
        super.open()

        this.scene.time.addEvent({ delay: 250, callback: ()=>{

            this.filledLeftStar.setAlpha(0)
            this.filledCenterStar.setAlpha(0)
            this.filledRightStar.setAlpha(0)
            this.filledLeftStar.setScale(10)
            this.filledCenterStar.setScale(10)
            this.filledRightStar.setScale(10)
            this.StartShine.rotation = -.4
            this.score.text = score
    
            this.scene.tweens.add({
                targets: this.StartShine,
                rotation: .7,
                ease: 'linear',
                duration: 20000,
                yoyo: true,
                repeat: -1
            })
    
            this.scene.tweens.add({
                targets: this.filledLeftStar,
                scale: 1 * this.scene.globalScale,
                scaleOriginal: 1,
                alpha: 1,
                ease: 'linear',
                duration: 250,
                delay: 500,
                onComplete: ()=>{
                    if(stars > 0){
                        this.scene.game.soundManager.play(Constants.Sounds.StarCollect)
                    }
                    if(stars == 1){
                        this.scene.game.soundManager.play(Constants.Sounds.winGame)
                    }
                }
            })
            this.scene.tweens.add({
                targets: this.filledCenterStar,
                scale: 1 * this.scene.globalScale,
                scaleOriginal: 1,
                alpha: 1,
                ease: 'linear',
                duration: 250,
                delay: 1000,
                onComplete: ()=>{
                    if(stars > 1){
                        this.scene.game.soundManager.play(Constants.Sounds.StarCollect)
                    }
                    if(stars == 2){
                        this.scene.game.soundManager.play(Constants.Sounds.winGame)
                    }
                }
            })
            this.scene.tweens.add({
                targets: this.filledRightStar,
                scale: 1 * this.scene.globalScale,
                scaleOriginal: 1,
                alpha: 1,
                ease: 'linear',
                duration: 250,
                delay: 1500,
                onComplete: ()=>{
                    if(stars > 2){
                        this.scene.game.soundManager.play(Constants.Sounds.StarCollect)
                    }
                    if(stars == 3){
                        this.scene.game.soundManager.play(Constants.Sounds.winGame)
                    }
                }
            })
    
            if (stars === 0) {
                this.filledLeftStar.visible = false
                this.filledCenterStar.visible = false
                this.filledRightStar.visible = false
            } else if (stars === 1) {
                this.filledLeftStar.visible = true
                this.filledCenterStar.visible = false
                this.filledRightStar.visible = false
            } else if (stars === 2) {
                this.filledLeftStar.visible = true
                this.filledCenterStar.visible = true
                this.filledRightStar.visible = false
            } else if (stars === 3) {
                this.filledLeftStar.visible = true
                this.filledCenterStar.visible = true
                this.filledRightStar.visible = true
            }
            this.particles.visible = true
            console.log(this.particles)

        }, callbackScope: this})
        // this.scene.game.soundManager.pauseMusic()
        
    }

    close() {
        this.scene.game.soundManager.playMusic()
        this.scene.game.confetti.stop(Constants.Confetti.SchoolParade)
        super.close()
    }
}