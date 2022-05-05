import { Constants } from "../Utilities/Constants"
import { BaseScene } from "../Utilities/BaseScene"
import { GUIButton } from "../Utilities/GUIButton"
import { Utilities } from "../Utilities/Utilities"
import { HelpPopup } from "../Popups/HelpPopup"
import { SoundManager } from "../Utilities/SoundManager"

export class MenuView extends BaseScene {
    constructor() {
        super({ key: Constants.MenuView })
        this.storage.writeData(Constants.StartTime, new Date().getTime())
        this.helpPopup = new HelpPopup(this)
    }

    create() {
        super.create()
        this.helpPopup.create()

        this.add.image(this.screenWidth * .5, this.screenHeight * .5, 'menuBG').setOrigin(0.5).shouldResize = false
        this.add.image(this.screenWidth * .5, this.screenHeight * .5, 'bgelelement1').setOrigin(0.5)
        this.add.image(this.screenWidth * .5, this.screenHeight * .5, 'titlebg').setOrigin(0.5).setDepth(1)
        this.mask = this.add.image(this.screenWidth * .5, this.screenHeight * .5, 'mask').setOrigin(0.5).setDepth(1)
        this.add.image(this.screenWidth * .5, this.screenHeight * .48, 'Gamelogo').setOrigin(0.5).setDepth(1)

        this.elementArr = [];
        this.elementArrPos = [];

        this.element1 = this.add.image(this.screenWidth * .63, this.screenHeight * .165, 'element1').setOrigin(0.5)
        this.element2 = this.add.image(this.screenWidth * .63, this.screenHeight * .78, 'element1').setOrigin(0.5).setScale(.5)
        this.element2.rotation = .55
        this.element3 = this.add.image(this.screenWidth * .15, this.screenHeight * .6, 'element1').setOrigin(0.5)
        this.element3.rotation = -.3
        this.element4 = this.add.image(this.screenWidth * .83, this.screenHeight * .35, 'element1').setOrigin(0.5).setScale(.65)
        this.element4.rotation = .3
        this.element5 = this.add.image(this.screenWidth * .17, this.screenHeight * .3, 'element2').setOrigin(0.5)
        this.element5.rotation = -.6
        this.element6 = this.add.image(this.screenWidth * .84, this.screenHeight * .75, 'element2').setOrigin(0.5)
        this.element7 = this.add.image(this.screenWidth * .4, this.screenHeight * .84, 'element3').setOrigin(0.5)
        this.element8 = this.add.image(this.screenWidth * .3, this.screenHeight * .16, 'element3').setOrigin(0.5)

        this.element1.name = "element1"
        this.element2.name = "element2"
        this.element3.name = "element3"
        this.element4.name = "element4"
        this.element5.name = "element5"
        this.element6.name = "element6"
        this.element7.name = "element7"
        this.element8.name = "element8"

        this.elementArr.push(this.element1)
        this.elementArr.push(this.element8)
        this.elementArr.push(this.element7)
        this.elementArr.push(this.element6)
        this.elementArr.push(this.element5)
        this.elementArr.push(this.element4)
        this.elementArr.push(this.element3)
        this.elementArr.push(this.element2)

        for(let i=0;i<this.elementArr.length;i++){
            this.elementArrPos.push({
                x: this.elementArr[i].x,
                y: this.elementArr[i].y
            })
        }

        this.maskShape = this.add.graphics();
        this.maskShape.fillStyle(0x000000, 0);
        this.maskShape.fillRect(-(this.mask.width/2), -(this.mask.height/2) + 65, this.mask.width, 200);
        this.maskShape.followObject = this.mask;
        this.tweenArr = [];

        let scaleArr = [];
        for(let i=0;i<9;i++){
            scaleArr.push(this.add.image(-420 + i*105, 100, 'scaleGroup').setOrigin(0.5).setDepth(1))
            scaleArr[i].followObject = this.mask;
            scaleArr[i].mask = new Phaser.Display.Masks.GeometryMask(this, this.maskShape);
            this.time.delayedCall(500,()=>{
                this.playScaleAnim(scaleArr[i],i);
            })
        }

        this.playBtnText = this.add.text(0,-10, "PLAY", {
            font: "60px Roboto-Bold",
            fill: "#ffffff",
            align: "center",
        }).setOrigin(0.5).setDepth(11)

        this.helpBtnText = this.add.text(0,-10, "HELP", {
            font: "60px Roboto-Bold",
            fill: "#ffffff",
            align: "center",
        }).setOrigin(0.5).setDepth(11)
    
        this.playBtn = new GUIButton(this, this.screenWidth * .85, this.screenHeight * .9, 'btn', 10, '', () => {
            Utilities.changeScene(this, Constants.LevelSelectView)
            this.helpPopup.images[this.helpPopup.currentHelp].audio.pause()
        })
        this.helpBtn = new GUIButton(this, this.screenWidth * .15, this.screenHeight * .9, 'btn', 10, '', () => {
            this.helpPopup.open()
        })

        this.playBtnText.followObject = this.playBtn.button;
        this.helpBtnText.followObject = this.helpBtn.button;
        this.playElementTween()
        this.playHalfElementTween()
    }

    playScaleAnim(scale,i){
        this.tweens.add({
            targets: scale,
            y: this.mask.y + 150 * this.scaleY,
            yOriginal: this.mask.yOriginal + 150,
            ease: "linear",
            duration: 500,
            delay : 200 * i,
            onComplete: ()=>{
                this.tweens.add({
                    targets: scale,
                    y: this.mask.y + 100 * this.scaleY,
                    yOriginal: this.mask.yOriginal + 100,
                    ease: "linear",
                    duration: 500,
                    onComplete: ()=>{
                        this.playScaleAnim(scale);
                    }
                })
            }
        })
    }

    playElementTween(){

        for(let i=0;i<this.elementArr.length/2;i++){
            this.tweenArr.push(this.tweens.add({
                targets: this.elementArr[i],
                y: '-=20',
                x: '-=10',
                yOriginal: '-=20',
                xOriginal: '-=10',
                ease: 'Sine.easeInOut',
                delay: 100 * (i+1),
                duration: 3000,
                onComplete: ()=>{
                    this.tweens.add({
                        targets: this.elementArr[i],
                        y: '+=20',
                        x: '+=10',
                        yOriginal: '+=20',
                        xOriginal: '+=10',
                        ease: 'Sine.easeInOut',
                        duration: 3000,
                        onComplete: ()=>{
                            if(i == (this.elementArr.length/2)-1){
                                this.playElementTween()
                            }
                        }
                    })
                }
            }));
        }
    }

    playHalfElementTween(){
        for(let i=this.elementArr.length/2;i<this.elementArr.length;i++){
            this.tweenArr.push(this.tweens.add({
                targets: this.elementArr[i],
                y: '+=20',
                x: '+=10',
                yOriginal: '+=20',
                xOriginal: '+=10',
                ease: 'Sine.easeInOut',
                delay: 100 * (i+1),
                duration: 3000,
                onComplete: ()=>{
                    this.tweens.add({
                        targets: this.elementArr[i],
                        y: '-=20',
                        x: '-=10',
                        yOriginal: '-=20',
                        xOriginal: '-=10',
                        ease: 'Sine.easeInOut',
                        duration: 3000,
                        onComplete: ()=>{
                            if(i == this.elementArr.length-1){
                                this.playHalfElementTween()
                            }
                        }
                    })
                }
            }));
        }
    }

    // stopTween(){
    //     this.tweenArr.map((tween)=>{
    //         tween.stop();
    //     })
    // }

    resetPos(){
        for(let i=0;i<this.elementArr.length;i++){
            this.elementArr[i].x = this.elementArrPos[i].x * this.scaleX
            this.elementArr[i].y = this.elementArrPos[i].y * this.scaleY
        }
    }

    resize(){
        super.resize();
        for(let i=0;i<this.tweenArr.length;i++){
            this.tweenArr[i].stop();
        }
        this.tweenArr = []
        this.gameplayTimer = this.time.addEvent({ delay: 2000, callback: ()=>{
            this.resetPos();
            this.tweenArr = []
            this.playElementTween()
            this.playHalfElementTween()
        }, callbackScope: this })
    }

}