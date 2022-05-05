import {
    Constants
} from "../Utilities/Constants"
import {
    BaseScene
} from "../Utilities/BaseScene"
import {
    Player
} from "../GameObjects/Player"
import {
    Joypad
} from "../GameObjects/Joypad"
import {
    ThreeStarPopup
} from "../Popups/ThreeStarPopup"
import {
    Utilities
} from "../Utilities/Utilities"
import {
    HintPopup
} from "../Popups/HintPopup"
import {
    GUIButton
} from "../Utilities/GUIButton"
import {
    Dropdown
} from "../GameObjects/DropDown"

export class GamePlayView extends BaseScene {
    constructor() {
        super({
            key: Constants.GamePlayView
        })
    }

    create() {
        super.create()
        this.bg = this.add.image(this.screenWidth * 0.5, this.screenHeight * 0.5, 'bg').setOrigin(0.5);
        this.bg.shouldResize = false
        this.gameStarted = true
        this.createNumberLine();
        this.CreateQuestionHeader();
        this.CreateNumberLineNumberSelections();
        this.AddOnZoomOut();
        this.RealNumberSelection()
    }

    createNumberLine() {
        this.Scakebg = this.add.image(this.screenWidth * 0.5, this.screenHeight * 0.93, 'Scakebg').setOrigin(0.5);
        this.Scakebg.name = "Scakebg"
        this.line = this.add.image(0, -60, 'Line');
        this.line.followObject = this.Scakebg;
        this.MyNumberLines = [];
        this.MyVerticleLines = [];
        this.MyHorizontalLine = [];
        this.MyZoomIn = [];
        this.ZoomOutValuesStack = [];
        this.zoomInUpTo = 0;
        this.zoomOutUpTo = 0;
        for (let i = 0; i < 11; i++) {
            let numbers = this.add.text(-(this.line.width / 2) + 120 + i * 140, 70, i + "", {
                font: "40px Roboto-Bold",
                fill: "#ffffff",
                align: "center",
            }).setOrigin(0.5)
            var VerticleLine = this.add.image(-(this.line.width / 2) + 120 + i * 140, 0, "VerticleLine").setOrigin(0.5)
            VerticleLine.followObject = numbers.followObject = this.line
            this.MyNumberLines.push(numbers)
            this.MyVerticleLines.push(VerticleLine)
            var HorizontalLine = this.add.image(-(this.line.width / 2) + 120 + i * 140, 70, "HorizontalLine").setOrigin(0.5).setVisible(false);
            HorizontalLine.followObject = this.line
            this.MyHorizontalLine.push(HorizontalLine)
            if(this.GameOperationStatus =="RationalNumbers"){
                HorizontalLine.visible = true;
            }
            if (i < 10) {
                let ZoomIn = this.add.image(-(this.line.width / 2) + 190 + i * 140, -35, "zoomin").setOrigin(0.5).setInteractive({
                    useHandCursor: true
                })
                ZoomIn.followObject = this.line
                this.MyZoomIn.push(ZoomIn)
                ZoomIn.off('pointerup');
                ZoomIn.on('pointerup', () => {
                    this.game.soundManager.play(Constants.Sounds.ExpandScale)
                    this.zoomInUpTo += 1;
                    this.MyZoomIn.map((zoomin) => {
                        zoomin.disableInteractive();
                    })
                    if(this.GameOperationStatus =="RationalNumbers"){
                        let a,b;
                        a = this.MyNumberLines[i].text.split("\n")[0]
                        b = this.MyNumberLines[i+1].text.split("\n")[0]
                        ZoomIn.ToZoomInIndex = {
                            startingIndex: Number(a),
                            endingIndex: Number(b)
                        }
                        
                        a = this.MyNumberLines[0].text.split("\n")[0];
                        b = this.MyNumberLines[this.MyNumberLines.length - 1].text.split("\n")[0];

                        this.ZoomOutValuesStack.push({
                            startingIndex: Number(a),
                            endingIndex: Number(b)
                        })
                    }     
                    else{
                        ZoomIn.ToZoomInIndex = {
                            startingIndex: Number(this.MyNumberLines[i].text),
                            endingIndex: Number(this.MyNumberLines[i + 1].text)
                        }
                        this.ZoomOutValuesStack.push({
                            startingIndex: Number(this.MyNumberLines[0].text),
                            endingIndex: Number(this.MyNumberLines[this.MyNumberLines.length - 1].text)
                        })
                    }    
                    this.UpdateNumbersOnZoomIn(ZoomIn.ToZoomInIndex)
                })
            }
        }

        this.NextBtn = this.add.image(1060, 0, "Next").setOrigin(0.5).setInteractive({
            useHandCursor: true
        }).on('pointerup', () => {
            this.OnNext();
        });
        this.PrevBtn = this.add.image(-1060, 0, "previous").setOrigin(0.5).setInteractive({
            useHandCursor: true
        }).on('pointerup', () => {
            this.OnPrev();
        });
        this.NextBtn.followObject = this.PrevBtn.followObject = this.line;
    }

    OnNext() {
        this.NextBtn.disableInteractive();
        this.AddNumberInLastAndTween()
        this.AddVericleLinesInLastAndTween()
        this.AddZoomInInLastAndTween();
        this.game.soundManager.play(Constants.Sounds.Click)
    }

    OnPrev() {
        this.PrevBtn.disableInteractive();
        switch (this.GameOperationStatus) {
            case "RealNumbers":
                this.AddNumberInStartAndTween()
                this.AddVericleLinesInStartAndTween()
                this.AddZoomInInStartAndTween();
                this.game.soundManager.play(Constants.Sounds.Click)
                break;
            case "RationalNumbers":
                this.AddNumberInStartAndTween()
                this.AddVericleLinesInStartAndTween()
                this.AddZoomInInStartAndTween();
                this.game.soundManager.play(Constants.Sounds.Click)
                break;
            case "IntegerNumbers":
                this.AddNumberInStartAndTween()
                this.AddVericleLinesInStartAndTween()
                this.AddZoomInInStartAndTween();
                this.game.soundManager.play(Constants.Sounds.Click)
                break;
            case "NaturalNumbers":
                if (this.MyNumberLines[0].text != '1') {
                    this.AddNumberInStartAndTween()
                    this.AddVericleLinesInStartAndTween()
                    this.AddZoomInInStartAndTween();
                    this.game.soundManager.play(Constants.Sounds.Click)
                }
                break;
            case "WholeNumbers":
                if (this.MyNumberLines[0].text != '0') {
                    this.AddNumberInStartAndTween()
                    this.AddVericleLinesInStartAndTween()
                    this.AddZoomInInStartAndTween();
                    this.game.soundManager.play(Constants.Sounds.Click)
                }
                break;
            default:
                break;
        }
    }

    afterResize() {
        console.log(this.MyNumberLines[0].x,this.MyNumberLines[0].y)
        this.NextBtn.x = this.screenWidth * this.scaleX - 40 * this.globalScale
        this.NextBtn.xOriginal = this.screenWidth * this.scaleX - 40 * this.globalScale
        this.PrevBtn.x = -1 * this.scaleX + 40 * this.globalScale
        this.PrevBtn.xOriginal = -1 * this.scaleX + 40 * this.globalScale
    }

    CreateQuestionHeader() {
        this.QueationPanel = this.add.text(100, 0, "Let us Explore the Numbers", {
            font: "50px Roboto-Bold",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0, 0.5)
        this.QueationPanel.followObject = this.header.logoImg
    }

    UpdateNumbersOnZoomIn(zoomin) {
        let FirstEle={}, LastEle={}, FirstEleVerticalLine, LastEleVerticalLine, FirstEleHorizontalLine, LastEleHorizontalLine;
        this.MyNumberLines.filter((number, i) => {
            if(this.GameOperationStatus == "RationalNumbers"){
                let num = number.text.split("\n")[0];
                let den = number.text.split("\n")[1];
                if (num == zoomin.startingIndex) {
                    FirstEle.text = [num , den];
                    LastEle.text = [this.MyNumberLines[i + 1].text.split("\n")[0], this.MyNumberLines[i + 1].text.split("\n")[1] ]
                    FirstEleVerticalLine = this.MyVerticleLines[i];
                    LastEleVerticalLine = this.MyVerticleLines[i + 1];
                    FirstEleHorizontalLine = this.MyHorizontalLine[i];
                    LastEleHorizontalLine = this.MyHorizontalLine[i + 1];
                    FirstEle.xOriginal = number.xOriginal;
                    LastEle.xOriginal = this.MyNumberLines[i + 1].xOriginal;
                }
                zoomin.den = den;
            }
            else{
                if (number.text == zoomin.startingIndex) {
                    FirstEle = number;
                    LastEle = this.MyNumberLines[i + 1]
                    FirstEleVerticalLine = this.MyVerticleLines[i];
                    LastEleVerticalLine = this.MyVerticleLines[i + 1];
                    FirstEleHorizontalLine = this.MyHorizontalLine[i];
                    LastEleHorizontalLine = this.MyHorizontalLine[i + 1];
                }
            }
        })
        let FirstEleClone = this.add.text(FirstEle.xOriginal, 70, FirstEle.text, {
            font: "40px Roboto-Bold",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(.5)
        let LastEleClone = this.add.text(LastEle.xOriginal, 70, LastEle.text, {
            font: "40px Roboto-Bold",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(.5)
        let FirstVerticleLineClone = this.add.image(FirstEleVerticalLine.xOriginal, 0, 'VerticleLine').setOrigin(.5)
        let LastVerticleLineClone = this.add.image(LastEleVerticalLine.xOriginal, 0, 'VerticleLine').setOrigin(.5)
        let FirstHroizontalLineClone = this.add.image(FirstEleHorizontalLine.xOriginal, 70, 'HorizontalLine').setOrigin(.5).setVisible(false);
        let LastHroizontalLineClone = this.add.image(LastEleHorizontalLine.xOriginal, 70, 'HorizontalLine').setOrigin(.5).setVisible(false);
        if(this.GameOperationStatus =="RationalNumbers"){
            FirstHroizontalLineClone.visible = true;
            LastHroizontalLineClone.visible = true;
        }
        FirstHroizontalLineClone.followObject = LastHroizontalLineClone.followObject = FirstVerticleLineClone.followObject = LastVerticleLineClone.followObject = FirstEleClone.followObject = LastEleClone.followObject = this.line
        this.resizeElement(FirstEleClone)
        this.resizeElement(LastEleClone)
        this.resizeElement(FirstVerticleLineClone)
        this.resizeElement(LastVerticleLineClone)
        this.resizeElement(FirstHroizontalLineClone)
        this.resizeElement(LastHroizontalLineClone)
        this.hideShowNumberLine(false, zoomin);
        this.ZoomInAnimation(FirstEleClone, LastEleClone, FirstVerticleLineClone, LastVerticleLineClone, zoomin,FirstHroizontalLineClone,LastHroizontalLineClone);
    }

    hideShowNumberLine(bool, zoomin, toDeleteClones) {
        let alpha = 0;
        if (bool) {
            alpha = 1
            this.updateNumberLineOnZoom(zoomin)
        }
        if (toDeleteClones) {
            for (let key in toDeleteClones) {
                this.tweens.add({
                    targets: toDeleteClones[key],
                    alpha: 0,
                    ease: 'Quad',
                    duration: 500,
                    delay: 0,
                    onComplete: () => {
                        toDeleteClones[key].destroy();
                    }
                }, this)
            }
        }
        this.MyNumberLines.map((numbers, i) => {
            this.OnNextTween = this.tweens.add({
                targets: [numbers, this.MyVerticleLines[i],this.MyHorizontalLine[i]],
                alpha: alpha,
                ease: 'Quad',
                duration: 500,
                delay: 0,
                onComplete: () => {
                    if (i == 0) {
                        this.MyZoomIn.map((zoomin) => {
                            zoomin.setInteractive({
                                useHandCursor: true
                            });
                        })
                    }
                }
            }, this)
            if (i < 10) {
                this.OnHideNumberLineTween = this.tweens.add({
                    targets: this.MyZoomIn,
                    alpha: alpha,
                    ease: 'Quad',
                    duration: 500,
                    delay: 0,
                }, this)
            }
        })

        this.handleZoomInOutOnZoomIn();
    }

    handleZoomInOutOnZoomIn(){
        switch (this.GameOperationStatus) {
            case "RealNumbers":
                if(Number(this.MyNumberLines[0].text) >= 0 && this.MyNumberLines[1].text.length < 5){
                    this.MyZoomIn.map((zoomin) => {
                        zoomin.setVisible(true);
                    })
                }
                else if(Number(this.MyNumberLines[this.MyNumberLines.length - 1].text) <= 0 && this.MyNumberLines[1].text.length < 6){
                    this.MyZoomIn.map((zoomin) => {
                        zoomin.setVisible(true);
                    })
                }
                else{
                    this.MyZoomIn.map((zoomin) => {
                        zoomin.setVisible(false);
                    }) 
                }

                if(Number(this.MyNumberLines[0].text) >= 0 && this.MyNumberLines[1].text.length < 4){
                    this.zoomOut.visible = false;
                    this.dotted_lineLeft.visible = false
                    this.dotted_lineRight.visible = false
                }
                else if(Number(this.MyNumberLines[this.MyNumberLines.length - 1].text) <= 0 && this.MyNumberLines[1].text.length < 5){
                    this.zoomOut.visible = false;
                    this.dotted_lineLeft.visible = false
                    this.dotted_lineRight.visible = false
                }
                else{
                    this.zoomOut.visible = true;
                    this.dotted_lineLeft.visible = true
                    this.dotted_lineRight.visible = true
                }
                break;
            case "RationalNumbers":
                let num = this.numberLength(Number(this.MyNumberLines[1].text.split("\n")[1]));
                if(num < 4){
                    this.MyZoomIn.map((zoomin) => {
                        zoomin.setVisible(true);
                    })
                }
                else{
                    this.MyZoomIn.map((zoomin) => {
                        zoomin.setVisible(false);
                    }) 
                }
                num = this.numberLength(Number(this.MyNumberLines[0].text.split("\n")[0]) - Number(this.MyNumberLines[this.MyNumberLines.length - 1].text.split("\n")[0]));
                if(num > 1 && Number(this.MyNumberLines[0].text.split("\n")[0]!= 0)){
                    this.zoomOut.visible = true;
                    this.dotted_lineLeft.visible = true
                    this.dotted_lineRight.visible = true
                }
                else{
                    this.zoomOut.visible = false;
                    this.dotted_lineLeft.visible = false
                    this.dotted_lineRight.visible = false
                }
                break;
            default:
                if (Math.abs(Number(this.MyNumberLines[1].text) - Number(this.MyNumberLines[0].text) > 1)) {
                        this.MyZoomIn.map((zoomin) => {
                            zoomin.setVisible(true);
                        })
                    } else {
                        this.MyZoomIn.map((zoomin) => {
                            zoomin.setVisible(false);
                        })
                    }
                    if(this.numberLength(Number(this.MyNumberLines[0].text) - Number(this.MyNumberLines[this.MyNumberLines.length - 1].text)) < 4){
                        this.zoomOut.setVisible(true)
                        this.dotted_lineLeft.setVisible(true)
                        this.dotted_lineRight.setVisible(true)
                    }else{
                        this.zoomOut.setVisible(false)
                        this.dotted_lineLeft.setVisible(false)
                        this.dotted_lineRight.setVisible(false)
                    }
                break;
        }
    }

    numberLength(number) {

        let length = 0
        let n = Math.abs(number)
      
        do {
          n /=  10
          length++
        } while (n >= 1)
      
        return length
      }

    updateNumberLineOnZoom(zoomin) {
        let startingIndex = zoomin.startingIndex;
        let endingIndex = zoomin.endingIndex;
        let diff = (endingIndex - startingIndex) / 10;
        this.MyNumberLines.map((numbers, i) => {
            if(this.GameOperationStatus == "RealNumbers"){
                let oldWidth, newWidth;
                oldWidth = numbers.width;
                let result = this.addNum(Number(startingIndex) + diff * i,12)
                numbers.setText(result);
            }
            else if(this.GameOperationStatus == "RationalNumbers"){
                let oldWidth, newWidth;
                oldWidth = numbers.width;
                let result = [((startingIndex*10) + i), zoomin.den*10];
                numbers.setText(result);
                newWidth = numbers.width;
            }
            else{
                let oldWidth, newWidth;
                oldWidth = numbers.width;
                numbers.setText(Number(startingIndex) + diff * i);
                newWidth = numbers.width;
            }
        })
    }

    ZoomInAnimation(FirstEleClone, LastEleClone, FirstEleVerticalLine, LastEleVerticalLine, zoomin,FirstHroizontalLineClone,LastHroizontalLineClone) {
        this.tweens.add({
            targets: [FirstEleClone, FirstEleVerticalLine,FirstHroizontalLineClone],
            x: this.MyNumberLines[1].x - 139.7 * this.globalScale,
            xOriginal: this.MyNumberLines[1].xOriginal - 139.7,
            ease: 'Quad',
            duration: 500,
            delay: 500,
            onComplete: () => {}
        }, this)
        this.tweens.add({
            targets: [LastEleClone, LastEleVerticalLine,LastHroizontalLineClone],
            x: this.MyNumberLines[9].x + 139.7 * this.globalScale,
            xOriginal: this.MyNumberLines[9].xOriginal + 139.7,
            ease: 'Quad',
            duration: 500,
            delay: 500,
            onComplete: () => {
                this.hideShowNumberLine(true, zoomin, {
                    FirstEleClone: FirstEleClone,
                    FirstEleVerticalLine: FirstEleVerticalLine,
                    LastEleClone: LastEleClone,
                    LastEleVerticalLine: LastEleVerticalLine,
                    FirstHroizontalLineClone: FirstHroizontalLineClone,
                    LastHroizontalLineClone: LastHroizontalLineClone
                });
                this.zoomOut.setInteractive({useHandCursor:true})
            }
        }, this)
    }

    sub(b, c) {
        let b1 = b.toString().split(".")
        let b1_max = 0
        if (b1.length == 2) {
            b1_max = b1[1].length
        }
        let c1 = c.toString().split(".")
        let c1_max = 0
        if (c1.length == 2) {
            c1_max = c1[1].length
        }
        let max_len = b1_max > c1_max ? b1_max : c1_max
        return Number((b - c).toFixed(max_len))
    }

    addNum(number, decimals) {
        var newnumber = new Number(number+'').toFixed(parseInt(decimals));
        return parseFloat(newnumber); 
    }

    gcd = (a, b) => {
        if (a == 0)
            return b;
        return this.gcd(b % a, a);
    }
     
    lowest = (den3, num3) => {
        let common_factor = this.gcd(num3, den3);
        den3 = parseInt(den3 / common_factor);
        num3 = parseInt(num3 / common_factor);
    }
     
    addFraction = (num1, den1, num2, den2) => {

        let den3 = this.gcd(den1, den2);
        den3 = (den1 * den2) / den3;
        let num3 = ((num1) * (den3 / den1) + (num2) * (den3 / den2));
        this.lowest(den3, num3);
    }

    ConvertToRational(num1,num2){
        if(num2){
            var a = {};
            a.num = "",a.den = "";
            let i=0;
            while(num2.text[i] != "/"){
                a.num += num2.text[i];
                i++;
            }
            a.num = Number(a.num);
            i++;
            while(i < num2.text.length){
                a.den += num2.text[i];
                i++;
            }
            a.den = Number(a.den);
        }
        if(num1){
            var b = {};
            b.num = "",b.den = "";
            let j=0;
            while(num1.text[j] != "/"){
                b.num += num1.text[j];
                j++;
            }
            b.num = Number(b.num);
            j++;
            while(j < num1.text.length){
                b.den += num1.text[j];
                j++;
            }
            b.den = Number(b.den);
        }

        if(a && b){
            return {a,b};
        }
        else if(a){
            return a;
        }
        else{
            return b;
        }
        
    }

    findLCM(num1,num2){
        let min = (num1 > num2) ? num1 : num2;    
        while (true) {
            if (min % num1 == 0 && min % num2 == 0) {
                break;
            }
            min++;
        }
        return min;
    }

    SubstractRational(a,b,LCM){
        let result = {};
        let num1 = (LCM/a.den) * a.num;
        let num2 = (LCM/b.den) * b.num;
        result.num = num1-num2;
        result.den = LCM
        return result;
    }

    AddNumberInStartAndTween() {
        let diff,result;
        if(this.GameOperationStatus == "RealNumbers"){
            diff = this.sub(Number(this.MyNumberLines[1].text), Number(this.MyNumberLines[0].text));
            result = this.sub(Number(this.MyNumberLines[0].text),diff)
        }
        else if(this.GameOperationStatus == "RationalNumbers"){
            let a = this.MyNumberLines[0].text.split("\n")[0];
            let b = this.MyNumberLines[1].text.split("\n")[0];
            diff = b - a;
            result = [Math.round(a - diff) , this.MyNumberLines[0].text.split("\n")[1]]
        }
        else{
            diff = Number(this.MyNumberLines[1].text) - Number(this.MyNumberLines[0].text);
            result = Math.round(Number(this.MyNumberLines[0].text) - diff)
        }
        let AddnumberOnFirst = this.add.text(-(this.line.width / 2) - 20, 70, result, {
            font: "40px Roboto-Bold",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5)
        AddnumberOnFirst.followObject = this.line
        this.resizeElement(AddnumberOnFirst)
        let ToDeleteNum = this.MyNumberLines.pop();
        ToDeleteNum.destroy(true)
        this.MyNumberLines.map((numbers) => {
            this.OnNextTween = this.tweens.add({
                targets: numbers,
                x: numbers.x + 139.7 * this.globalScale,
                xOriginal: numbers.xOriginal + 139.7,
                ease: 'Quad',
                duration: 500,
                delay: 0
            }, this)
        })
        this.OnNextnewNumberTween = this.tweens.add({
            targets: AddnumberOnFirst,
            x: AddnumberOnFirst.x + 139.7 * this.globalScale,
            xOriginal: AddnumberOnFirst.xOriginal + 139.7,
            ease: 'Quad',
            duration: 500,
            delay: 0,
            onComplete: () => {
                this.MyNumberLines.unshift(AddnumberOnFirst);
                this.NextBtn.setInteractive({
                    useHandCursor: true
                });
                this.PrevBtn.setInteractive({
                    useHandCursor: true
                });
            }
        }, this)
    }

    AddVericleLinesInStartAndTween() {
        let AddVerticleLineOnStart = this.add.image(-(this.line.width / 2) - 20, 0, "VerticleLine").setOrigin(0.5)
        let AddHorizontalLineOnStart = this.add.image(-(this.line.width / 2) - 20, 70, "HorizontalLine").setOrigin(0.5).setVisible(false);
        if(this.GameOperationStatus =="RationalNumbers"){
            AddHorizontalLineOnStart.visible = true;
        }
        AddHorizontalLineOnStart.followObject = AddVerticleLineOnStart.followObject = this.line
        this.resizeElement(AddVerticleLineOnStart)
        this.resizeElement(AddHorizontalLineOnStart)
        let ToDeletAddVerticleLineOnStart = this.MyVerticleLines.pop();
        ToDeletAddVerticleLineOnStart.destroy(true)
        let ToDeletAddHorizontalLineOnStart = this.MyHorizontalLine.pop();
        ToDeletAddHorizontalLineOnStart.destroy(true)

        this.MyVerticleLines.map((AddVerticleLineOnStart) => {
            this.OnNextTween = this.tweens.add({
                targets: AddVerticleLineOnStart,
                x: AddVerticleLineOnStart.x + 139.7 * this.globalScale,
                xOriginal: AddVerticleLineOnStart.xOriginal + 139.7,
                ease: 'Quad',
                duration: 500,
                delay: 0
            }, this)
        })
        this.MyHorizontalLine.map((AddhorizontalLineOnStart) => {
            this.OnNextTween = this.tweens.add({
                targets: AddhorizontalLineOnStart,
                x: AddhorizontalLineOnStart.x + 139.7 * this.globalScale,
                xOriginal: AddhorizontalLineOnStart.xOriginal + 139.7,
                ease: 'Quad',
                duration: 500,
                delay: 0
            }, this)
        })
        this.OnNextnewNumberTween = this.tweens.add({
            targets: [AddVerticleLineOnStart,AddHorizontalLineOnStart],
            x: AddVerticleLineOnStart.x + 139.7 * this.globalScale,
            xOriginal: AddVerticleLineOnStart.xOriginal + 139.7,
            ease: 'Quad',
            duration: 500,
            delay: 0,
            onComplete: () => {
                this.MyVerticleLines.unshift(AddVerticleLineOnStart)
                this.MyHorizontalLine.unshift(AddHorizontalLineOnStart)
            }
        }, this)
    }

    AddZoomInInStartAndTween() {
        let AddZoomInOnStart = this.add.image(-(this.line.width / 2) + 50, -35, "zoomin").setOrigin(0.5).setInteractive({
            useHandCursor: true
        })
        AddZoomInOnStart.followObject = this.line
        this.resizeElement(AddZoomInOnStart)
        let ToDeletZoomInOnStart = this.MyZoomIn.pop();
        ToDeletZoomInOnStart.destroy(true)

        this.MyZoomIn.map((ZoomIn) => {
            this.OnNextTween = this.tweens.add({
                targets: ZoomIn,
                x: ZoomIn.x + 139.7 * this.globalScale,
                xOriginal: ZoomIn.xOriginal + 139.7,
                ease: 'Quad',
                duration: 500,
                delay: 0
            }, this)
        })
        this.OnNextnewNumberTween = this.tweens.add({
            targets: AddZoomInOnStart,
            x: AddZoomInOnStart.x + 139.7 * this.globalScale,
            xOriginal: AddZoomInOnStart.xOriginal + 139.7,
            ease: 'Quad',
            duration: 500,
            delay: 0,
            onComplete: () => {
                this.MyZoomIn.unshift(AddZoomInOnStart)
                this.updateZoomInData();
            }
        }, this)
        if(this.GameOperationStatus == "RealNumbers" || this.GameOperationStatus == "RationalNumbers"){
            AddZoomInOnStart.setVisible(true);
        }
        else{
            if (Math.abs(Number(this.MyNumberLines[1].text) - Number(this.MyNumberLines[0].text) > 1)) {
                AddZoomInOnStart.setVisible(true);
            } else {
                AddZoomInOnStart.setVisible(false);
            }
        }
        if(this.MyZoomIn[1].visible){
            AddZoomInOnStart.setVisible(true);
        }
        else{
            AddZoomInOnStart.setVisible(false);
        }
    }

    AddNumberInLastAndTween() {
        let diff = Number(this.MyNumberLines[this.MyNumberLines.length - 1].text) - Number(this.MyNumberLines[this.MyNumberLines.length - 2].text);
        if(this.GameOperationStatus == "RealNumbers"){
            diff = this.addNum(diff,12)
        }
        let result = (Number(this.MyNumberLines[this.MyNumberLines.length - 1].text) + diff)
        if(this.GameOperationStatus == "RealNumbers"){
            result = this.addNum(result,12);
        }
        else if(this.GameOperationStatus == "RationalNumbers"){
            let a = this.MyNumberLines[this.MyNumberLines.length - 2].text.split("\n")[0];
            let b = this.MyNumberLines[this.MyNumberLines.length - 1].text.split("\n")[0];
            diff = b - a;
            result = [Number(b) + Number(diff), this.MyNumberLines[0].text.split("\n")[1]]
        }
        let AddnumberOnLast = this.add.text(-(this.line.width / 2) + 120 + this.MyNumberLines.length * 140, 70, result, {
            font: "40px Roboto-Bold",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5)
        AddnumberOnLast.followObject = this.line
        this.resizeElement(AddnumberOnLast)
        let ToDeleteNum = this.MyNumberLines.shift();
        ToDeleteNum.destroy(true)

        this.MyNumberLines.map((numbers) => {
            this.OnNextTween = this.tweens.add({
                targets: numbers,
                x: numbers.x - 139.7 * this.globalScale,
                xOriginal: numbers.xOriginal - 139.7,
                ease: 'Quad',
                duration: 500,
                delay: 0
            }, this)
        })
        this.OnNextnewNumberTween = this.tweens.add({
            targets: AddnumberOnLast,
            x: AddnumberOnLast.x - 139.7 * this.globalScale,
            xOriginal: AddnumberOnLast.xOriginal - 139.7,
            ease: 'Quad',
            duration: 500,
            delay: 0,
            onComplete: () => {
                this.MyNumberLines.push(AddnumberOnLast)
                this.NextBtn.setInteractive({
                    useHandCursor: true
                });
                this.PrevBtn.setInteractive({
                    useHandCursor: true
                });
            }
        }, this)
    }

    AddVericleLinesInLastAndTween() {
        let AddVerticleLineOnLast = this.add.image(-(this.line.width / 2) + 260 + this.MyNumberLines.length * 140, 0, "VerticleLine").setOrigin(0.5)
        let AddhorizontalLineOnLast = this.add.image(-(this.line.width / 2) + 260 + this.MyNumberLines.length * 140, 70, "HorizontalLine").setOrigin(0.5).setVisible(false);
        if(this.GameOperationStatus =="RationalNumbers"){
            AddhorizontalLineOnLast.visible = true;
        }
        AddhorizontalLineOnLast.followObject = AddVerticleLineOnLast.followObject = this.line
        this.resizeElement(AddVerticleLineOnLast)
        let ToDeletAddVerticleLineOnLast = this.MyVerticleLines.shift();
        ToDeletAddVerticleLineOnLast.destroy(true)
        this.resizeElement(AddhorizontalLineOnLast)
        let ToDeletAddHorizontalLineOnLast = this.MyHorizontalLine.shift();
        ToDeletAddHorizontalLineOnLast.destroy(true)

        this.MyVerticleLines.map((AddVerticleLineOnLast) => {
            this.OnNextTween = this.tweens.add({
                targets: AddVerticleLineOnLast,
                x: AddVerticleLineOnLast.x - 139.7 * this.globalScale,
                xOriginal: AddVerticleLineOnLast.xOriginal - 139.7,
                ease: 'Quad',
                duration: 500,
                delay: 0
            }, this)
        })
        this.MyHorizontalLine.map((AddHorizontalLineOnLast) => {
            this.OnNextTween = this.tweens.add({
                targets: AddHorizontalLineOnLast,
                x: AddHorizontalLineOnLast.x - 139.7 * this.globalScale,
                xOriginal: AddHorizontalLineOnLast.xOriginal - 139.7,
                ease: 'Quad',
                duration: 500,
                delay: 0
            }, this)
        })
        this.OnNextnewNumberTween = this.tweens.add({
            targets: [AddVerticleLineOnLast,AddhorizontalLineOnLast],
            x: AddVerticleLineOnLast.x - 139.7 * this.globalScale,
            xOriginal: AddVerticleLineOnLast.xOriginal - 139.7,
            ease: 'Quad',
            duration: 500,
            delay: 0,
            onComplete: () => {
                this.MyVerticleLines.push(AddVerticleLineOnLast)
                this.MyHorizontalLine.push(AddhorizontalLineOnLast)
            }
        }, this)
    }

    AddZoomInInLastAndTween() {
        let AddZoomInOnLast = this.add.image(-(this.line.width / 2) + 190 + this.MyNumberLines.length * 140, -35, "zoomin").setOrigin(0.5).setInteractive({
            useHandCursor: true
        })
        AddZoomInOnLast.followObject = this.line
        this.resizeElement(AddZoomInOnLast)
        let ToDeletZoomInOnLast = this.MyZoomIn.shift();
        ToDeletZoomInOnLast.destroy(true)

        this.MyZoomIn.map((ZoomIn) => {
            this.OnNextTween = this.tweens.add({
                targets: ZoomIn,
                x: ZoomIn.x - 139.7 * this.globalScale,
                xOriginal: ZoomIn.xOriginal - 139.7,
                ease: 'Quad',
                duration: 500,
                delay: 0
            }, this)
        })
        this.OnNextnewNumberTween = this.tweens.add({
            targets: AddZoomInOnLast,
            x: AddZoomInOnLast.x - 139.7 * this.globalScale,
            xOriginal: AddZoomInOnLast.xOriginal - 139.7,
            ease: 'Quad',
            duration: 500,
            delay: 0,
            onComplete: () => {
                this.MyZoomIn.push(AddZoomInOnLast)
                this.updateZoomInData();
            }
        }, this)
        if(this.GameOperationStatus == "RealNumbers" || this.GameOperationStatus == "RationalNumbers"){
            AddZoomInOnLast.setVisible(true);
        }
        else{
            if (Math.abs(Number(this.MyNumberLines[1].text) - Number(this.MyNumberLines[0].text) > 1)) {
                AddZoomInOnLast.setVisible(true);
            } else {
                AddZoomInOnLast.setVisible(false);
            }
        }
        if(this.MyZoomIn[1].visible){
            AddZoomInOnLast.setVisible(true);
        }
        else{
            AddZoomInOnLast.setVisible(false);
        }
    }

    updateZoomInData() {
        for (let i = 0; i < 10; i++) {
            this.MyZoomIn[i].off('pointerup');
            this.MyZoomIn[i].on('pointerup', () => {
                this.game.soundManager.play(Constants.Sounds.ExpandScale)
                this.MyZoomIn.map((zoomin) => {
                    zoomin.disableInteractive();
                })
                let a,b;
                if(this.GameOperationStatus == "RationalNumbers"){
                    a = this.MyNumberLines[i].text.split("\n")[0]
                    b = this.MyNumberLines[i].text.split("\n")[i+1]
                    this.MyZoomIn[i].ToZoomInIndex = {
                        startingIndex: a,
                        endingIndex: b
                    }
                    this.ZoomOutValuesStack.push({
                        startingIndex: this.MyNumberLines[0].text.split("\n")[0],
                        endingIndex: this.MyNumberLines[this.MyNumberLines.length-1].text.split("\n")[0]
                    })
                }
                else{
                    this.MyZoomIn[i].ToZoomInIndex = {
                        startingIndex: Number(this.MyNumberLines[i].text),
                        endingIndex: Number(this.MyNumberLines[i + 1].text)
                    }
                    this.ZoomOutValuesStack.push({
                        startingIndex: Number(this.MyNumberLines[0].text),
                        endingIndex: Number(this.MyNumberLines[this.MyNumberLines.length - 1].text)
                    })
                }

                this.ZoomOutIntegerUpto++;
                this.UpdateNumbersOnZoomIn(this.MyZoomIn[i].ToZoomInIndex)
            })
        }
    }

    onZoomOutInteger() {
        let MyNumberLinesOriginalX = []
        this.MyNumberLines.map((numbers, i) => {
            MyNumberLinesOriginalX.push({
                xPos: numbers.x,
                xOriginal: numbers.xOriginal
            })
            this.OnNextTween = this.tweens.add({
                targets: numbers,
                x: window.innerWidth * .5,
                alpha: 0,
                scale: .5,
                ease: 'Quad',
                duration: 500,
                delay: 0,
                onComplete: () => {
                    if (i == 0) {
                        this.updateIntegersOnZoomOut()
                    }
                    this.OnNextTween = this.tweens.add({
                        targets: numbers,
                        x: MyNumberLinesOriginalX[i].xPos,
                        xOriginal: MyNumberLinesOriginalX[i].xOriginal,
                        alpha: 1,
                        scale: 1,
                        ease: 'Quad',
                        duration: 500,
                        delay: 0,
                        onComplete: () => {
                            if (i == 0) {
                                this.zoomOut.setInteractive({
                                    useHandCursor: true
                                })
                            }
                        }
                    }, this)
                }
            }, this)
        })
        let MyVerticleLinesOriginalX = []
        this.MyVerticleLines.map((lines, i) => {
            MyVerticleLinesOriginalX.push({
                xPos: lines.x,
                xOriginal: lines.xOriginal
            })
            this.OnNextTween = this.tweens.add({
                targets: lines,
                x: window.innerWidth * .5,
                alpha: 0,
                scale: .5,
                ease: 'Quad',
                duration: 500,
                delay: 0,
                onComplete: () => {
                    this.OnNextTween = this.tweens.add({
                        targets: lines,
                        x: MyVerticleLinesOriginalX[i].xPos,
                        xOriginal: MyVerticleLinesOriginalX[i].xOriginal,
                        alpha: 1,
                        scale: this.globalScale,
                        ease: 'Quad',
                        duration: 500,
                        delay: 0
                    }, this)
                }
            }, this)
        })
        let MyHorizontalLinesOriginalX = []
        this.MyHorizontalLine.map((lines, i) => {
            MyHorizontalLinesOriginalX.push({
                xPos: lines.x,
                xOriginal: lines.xOriginal
            })
            this.OnNextTween = this.tweens.add({
                targets: lines,
                x: window.innerWidth * .5,
                alpha: 0,
                scale: .5,
                ease: 'Quad',
                duration: 500,
                delay: 0,
                onComplete: () => {
                    this.OnNextTween = this.tweens.add({
                        targets: lines,
                        x: MyHorizontalLinesOriginalX[i].xPos,
                        xOriginal: MyHorizontalLinesOriginalX[i].xOriginal,
                        alpha: 1,
                        scale: this.globalScale,
                        ease: 'Quad',
                        duration: 500,
                        delay: 0
                    }, this)
                }
            }, this)
        })
        let MyZoomInOriginalX = []
        this.MyZoomIn.map((MyZoom, i) => {
            MyZoomInOriginalX.push({
                xPos: MyZoom.x,
                xOriginal: MyZoom.xOriginal
            })
            this.OnNextTween = this.tweens.add({
                targets: MyZoom,
                x: window.innerWidth * .5,
                alpha: 0,
                scale: .1,
                ease: 'Quad',
                duration: 500,
                delay: 0,
                onComplete: () => {
                    this.OnNextTween = this.tweens.add({
                        targets: MyZoom,
                        x: MyZoomInOriginalX[i].xPos,
                        xOriginal: MyZoomInOriginalX[i].xOriginal,
                        alpha: 1,
                        scale: 1 * this.globalScale,
                        ease: 'Quad',
                        duration: 500,
                        delay: 0,
                        onComplete: () => {
                            if (i == 0) {
                                this.zoomOut.setInteractive({
                                    useHandCursor: true
                                })
                            }
                        }
                    }, this)
                }
            }, this)
        })
    }

    updateIntegersOnZoomOut() {
        let data = this.ZoomOutValuesStack.pop();
        if (data) {
            let firstnumber = data.startingIndex;
            let diff;
            if(this.GameOperationStatus == "RealNumbers"){
                diff = (this.sub(data.endingIndex,data.startingIndex)/10);
            }
            else if(this.GameOperationStatus == "RationalNumbers"){
                diff = (this.sub(data.endingIndex,data.startingIndex)/10);
            }
            else{
                diff = (data.endingIndex - data.startingIndex) / 10;   
            }
            this.MyNumberLines.map((number, i) => {
                let result;
                if(this.GameOperationStatus == "RealNumbers"){
                    result = (this.addNum(firstnumber + i * diff,12));
                }
                else if(this.GameOperationStatus == "RationalNumbers"){
                    result = [Number(firstnumber) + i * diff,number.text.split("\n")[1]/10]
                }
                else{
                    result = firstnumber + i * diff
                }
                number.setText(result)
                if (i < 10) {
                    this.MyZoomIn[i].ToZoomInIndex = {
                        startingIndex: Number(number.text),
                        endingIndex: Number(number.text)
                    }
                }
            })
        } else {
            this.MyNumberLines.map((number, i) => {
                number.setText(Number(number.text) * 10)
                if (i < 10) {
                    this.MyZoomIn[i].ToZoomInIndex = {
                        startingIndex: Number(number.text),
                        endingIndex: Number(number.text)
                    }
                }
            }) 
        }

        this.handleZoomInOutOnZoomOut();
        // if(this.GameOperationStatus == "RealNumbers" || this.GameOperationStatus == "RationalNumbers"){
        //     this.MyZoomIn.map((zoomin) => {
        //         zoomin.setVisible(true);
        //     })
        //     if(this.GameOperationStatus == "RealNumbers"){     
        //         if(Number(this.MyNumberLines[0].text) >= 0 && this.MyNumberLines[1].text.length < 4){
        //             this.zoomOut.visible = false;
        //             this.dotted_lineLeft.visible = false
        //             this.dotted_lineRight.visible = false
        //         }
        //         else if(Number(this.MyNumberLines[this.MyNumberLines.length - 1].text) <= 0 && this.MyNumberLines[1].text.length < 5){
        //             this.zoomOut.visible = false;
        //             this.dotted_lineLeft.visible = false
        //             this.dotted_lineRight.visible = false
        //         }
        //         else{
        //             this.zoomOut.visible = true;
        //             this.dotted_lineLeft.visible = true
        //             this.dotted_lineRight.visible = true
        //         }
        //     }
        //     else{
        //         let num = this.numberLength(Number(this.MyNumberLines[1].text.split("\n")[0]));
        //         if(num > 1){
        //             this.zoomOut.setVisible(true)
        //             this.dotted_lineLeft.setVisible(true)
        //             this.dotted_lineRight.setVisible(true)
        //         }
        //         else{
        //             this.zoomOut.setVisible(false)
        //             this.dotted_lineLeft.setVisible(false)
        //             this.dotted_lineRight.setVisible(false)
        //         }
        //     }
        // }
        // else{
        //     if (Math.abs(Number(this.MyNumberLines[1].text) - Number(this.MyNumberLines[0].text) > 1)) {
        //         this.MyZoomIn.map((zoomin) => {
        //             zoomin.setVisible(true);
        //         })
        //     } else {
        //         this.MyZoomIn.map((zoomin) => {
        //             zoomin.setVisible(false);
        //         })
        //     }
        //     if(this.numberLength(Number(this.MyNumberLines[0].text) - Number(this.MyNumberLines[this.MyNumberLines.length - 1].text)) < 4){
        //         this.zoomOut.setVisible(true)
        //         this.dotted_lineLeft.setVisible(true)
        //         this.dotted_lineRight.setVisible(true)
        //     }else{
        //         this.zoomOut.setVisible(false)
        //         this.dotted_lineLeft.setVisible(false)
        //         this.dotted_lineRight.setVisible(false)
        //     }
        // }
    }

    handleZoomInOutOnZoomOut(){
        switch (this.GameOperationStatus) {
            case "RealNumbers":
                this.MyZoomIn.map((zoomin) => {
                    zoomin.setVisible(true);
                })
                if(Number(this.MyNumberLines[1].text).countDecimals() < 2){
                    this.zoomOut.visible = false;
                    this.dotted_lineLeft.visible = false
                    this.dotted_lineRight.visible = false
                }
                else if(Number(this.MyNumberLines[this.MyNumberLines.length - 1].text) <= 0 && this.MyNumberLines[1].text.length < 5){
                    this.zoomOut.visible = false;
                    this.dotted_lineLeft.visible = false
                    this.dotted_lineRight.visible = false
                }
                else{
                    this.zoomOut.visible = true;
                    this.dotted_lineLeft.visible = true
                    this.dotted_lineRight.visible = true
                }
                break;
            case "RationalNumbers":
                this.MyZoomIn.map((zoomin) => {
                    zoomin.setVisible(true);
                })
                let num = this.numberLength(Number(this.MyNumberLines[1].text.split("\n")[1]));
                if(num > 2){
                    this.zoomOut.setVisible(true)
                    this.dotted_lineLeft.setVisible(true)
                    this.dotted_lineRight.setVisible(true)
                }
                else{
                    this.zoomOut.setVisible(false)
                    this.dotted_lineLeft.setVisible(false)
                    this.dotted_lineRight.setVisible(false)
                }
                break
            default:
                if (Math.abs(Number(this.MyNumberLines[1].text) - Number(this.MyNumberLines[0].text) > 1)) {
                    this.MyZoomIn.map((zoomin) => {
                        zoomin.setVisible(true);
                    })
                } else {
                    this.MyZoomIn.map((zoomin) => {
                        zoomin.setVisible(false);
                    })
                }
                if(this.numberLength(Number(this.MyNumberLines[0].text) - Number(this.MyNumberLines[this.MyNumberLines.length - 1].text)) < 4){
                    this.zoomOut.setVisible(true)
                    this.dotted_lineLeft.setVisible(true)
                    this.dotted_lineRight.setVisible(true)
                }else{
                    this.zoomOut.setVisible(false)
                    this.dotted_lineLeft.setVisible(false)
                    this.dotted_lineRight.setVisible(false)
                }
                break;
        }
    }

    getFrac(x, maxErr){
        let s = x<0?-1:1
        let i,d;
        x = Math.abs(x),
        i = Math.floor(x),
        d = x-i,
        maxErr = maxErr ? maxErr : Math.pow(10,-6);
        if(d<maxErr) return [i,1];
        let n = 1,
            nmax = Math.ceil(d*Math.min(
                Math.pow(10,Math.ceil(Math.abs(Math.log10(maxErr)))),
                Number.MAX_SAFE_INTEGER
            )),
            min = Infinity,
            best = [0,0];
        while(n <= nmax){
            let err = Math.abs(d - n/Math.round(n/d));
            if(err < maxErr) return [s*(n+i*Math.round(n/d)), Math.round(n/d)];
            else if(err < min){
                min = err;
                best = [s*(n+i*Math.round(n/d)), Math.round(n/d)];
            }
            n++;
        }
        return best[1] == 0 ? false : best;
      }

    firstDigit(n) {
        while (n >= 10)
            n /= 10;
        return Math.floor(n);
    }

    showHorizontalLines(){
        this.MyHorizontalLine.map((lines)=>{
            lines.visible = true;
        })
    }

    hideHorizontalLines(){
        this.MyHorizontalLine.map((lines)=>{
            lines.visible = false;
        })
    }

    CreateNumberLineNumberSelections() {
        this.NumberLineBtns = [];

        this.RealNumberbtn = this.add.image(-637, 0, "questionbtn").setOrigin(0.5).setInteractive({
            useHandCursor: true
        }).on('pointerup', () => {
            this.ShowRealNumbers();
        }).setVisible(false)
        this.NumberLineBtns.push(this.RealNumberbtn)
        this.RationalNumberbtn = this.add.image(this.screenWidth * .32, this.screenHeight * .45, "questionbtn").setOrigin(0.5).setInteractive({
            useHandCursor: true
        }).on('pointerup', () => {
            this.RealNumberSelection();
            this.game.soundManager.play(Constants.Sounds.Click)
        });
        this.NumberLineBtns.push(this.RationalNumberbtn)
        this.IntegerNumberbtn = this.add.image(this.screenWidth * .68, this.screenHeight * .25, "questionbtn").setOrigin(0.5).setInteractive({
            useHandCursor: true
        }).on('pointerup', () => {
            this.ZoomOutIntegerUpto = 1;
            this.ShowIntegerNumbers();
            this.hideHorizontalLines();
            this.dropDownContainer.visible = false;
            this.game.soundManager.play(Constants.Sounds.Click)
        });
        this.NumberLineBtns.push(this.IntegerNumberbtn)
        this.WholeNumberbtn = this.add.image(this.screenWidth * .32, this.screenHeight * .25, "questionbtn").setOrigin(0.5).setInteractive({
            useHandCursor: true
        }).on('pointerup', () => {
            this.ZoomOutIntegerUpto = 1;
            this.ShowWholeNumbers();
            this.hideHorizontalLines();
            this.dropDownContainer.visible = false;
            this.game.soundManager.play(Constants.Sounds.Click)
        });
        this.NumberLineBtns.push(this.WholeNumberbtn)
        this.NaturalNumberbtn = this.add.image(this.screenWidth * .68, this.screenHeight * .45, "questionbtn").setOrigin(0.5).setInteractive({
            useHandCursor: true
        }).on('pointerup', () => {
            this.ZoomOutIntegerUpto = 1;
            this.ShowNaturalNumbers();
            this.hideHorizontalLines();
            this.dropDownContainer.visible = false;
            this.game.soundManager.play(Constants.Sounds.Click)
        });
        this.NumberLineBtns.push(this.NaturalNumberbtn)

        this.RealNumberbtn.input.hitArea.setTo(30 * this.scaleX, 25 * this.scaleY, 560, 150);
        this.RationalNumberbtn.input.hitArea.setTo(30 * this.scaleX, 25 * this.scaleY, 560, 150);
        this.IntegerNumberbtn.input.hitArea.setTo(30 * this.scaleX, 25 * this.scaleY, 560, 150);
        this.WholeNumberbtn.input.hitArea.setTo(30 * this.scaleX, 25 * this.scaleY, 560, 150);
        this.NaturalNumberbtn.input.hitArea.setTo(30 * this.scaleX, 25 * this.scaleY, 560, 150);
        this.NumberLineSelectedBtns = [];
        this.RealNumberbtnSelected = this.add.image(-637, 0, "selectedbtn").setOrigin(0.5).setAlpha(0)
        this.NumberLineSelectedBtns.push(this.RealNumberbtnSelected)
        this.RationalNumberbtnSelected = this.add.image(this.screenWidth * .32, this.screenHeight * .45, "selectedbtn").setOrigin(0.5).setAlpha(0)
        this.NumberLineSelectedBtns.push(this.RationalNumberbtnSelected)
        this.IntegerNumberbtnSelected = this.add.image(this.screenWidth * .68, this.screenHeight * .25, "selectedbtn").setOrigin(0.5).setAlpha(0)
        this.NumberLineSelectedBtns.push(this.IntegerNumberbtnSelected)
        this.WholeNumberbtnSelected = this.add.image(this.screenWidth * .32, this.screenHeight * .25, "selectedbtn").setOrigin(0.5).setAlpha(0)
        this.NumberLineSelectedBtns.push(this.WholeNumberbtnSelected)
        this.NaturalNumberbtnSelected = this.add.image(this.screenWidth * .68, this.screenHeight * .45, "selectedbtn").setOrigin(0.5).setAlpha(0)
        this.NumberLineSelectedBtns.push(this.NaturalNumberbtnSelected)

        this.RationalNumberbtnText = this.add.text(0, -10, "Rational Numbers", {
            font: "50px Roboto-Bold",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5)
        this.IntegerNumberbtnText = this.add.text(0, -10, "Integers", {
            font: "50px Roboto-Bold",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5)
        this.WholeNumberbtnText = this.add.text(0, -10, "Whole Numbers", {
            font: "50px Roboto-Bold",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5)
        this.NaturalNumberbtnText = this.add.text(0, -10, "Natural Numbers", {
            font: "50px Roboto-Bold",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(0.5)

        this.RationalNumberbtnText.followObject = this.RationalNumberbtn;
        this.IntegerNumberbtnText.followObject = this.IntegerNumberbtn;
        this.WholeNumberbtnText.followObject = this.WholeNumberbtn;
        this.NaturalNumberbtnText.followObject = this.NaturalNumberbtn;

        this.dropDownContainer = this.add.container(0,0);
        this.dropDownMarker = this.add.image(this.screenWidth*.32,this.screenHeight*.56,'dropdown').setOrigin(.5).setScale(.75);
        this.dropDownOption1 = this.add.image(0,55,'convert_btn').setOrigin(.5).setInteractive({useHandCursor:true});
        this.dropDownOption2 = this.add.image(0,55,'convert_btn').setOrigin(.5).setDepth(1).setInteractive({useHandCursor:true});
        this.dropDownOption1.name = 'convert_btn'
        this.dropDownOption2.name = 'convert_btn'
        this.dropDownOption1Text = this.add.text(0,0,'Convert into Decimal',{
            font: "35px Roboto-Bold",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(.5);
        this.dropDownOption2Text = this.add.text(0,0,'Convert into Fraction',{
            font: "35px Roboto-Bold",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(.5).setDepth(1);
        this.dropDownOption1.followObject = this.dropDownMarker
        this.dropDownOption2.followObject = this.dropDownMarker
        this.dropDownOption1Text.followObject = this.dropDownOption1;
        this.dropDownOption2Text.followObject = this.dropDownOption2;
        this.dropDownContainer.add([this.dropDownMarker,this.dropDownOption1,this.dropDownOption1Text,this.dropDownOption2,this.dropDownOption2Text])
        this.dropDownContainer.visible = false;

        this.dropDownOption1.on('pointerup',()=>{
            this.showDropDownOption();
        })
        this.dropDownOption2.on('pointerup',()=>{
            this.showDropDownOption2();
        })
    }

    showDropDownOption(){
        this.dropDownOption1.visible = false;
        this.dropDownOption1Text.visible = false;
        this.dropDownOption2.visible = true;
        this.dropDownOption2Text.visible = true;
        this.ShowRealNumbers();
        if(!this.gameStarted){
            this.game.soundManager.play(Constants.Sounds.Click)
            
        }
        this.gameStarted = false
    }

    showDropDownOption2(){
        this.dropDownOption1.visible = true;
        this.dropDownOption1Text.visible = true;
        this.dropDownOption2.visible = false;
        this.dropDownOption2Text.visible = false;
        this.ShowRationalNumbers();
        if(!this.gameStarted){
            this.game.soundManager.play(Constants.Sounds.Click)
        }
        this.gameStarted = false
    }
    
    RealNumberSelection(){

        this.dropDownContainer.visible = true;
        this.ShowRealNumbers()
        this.showDropDownOption()
    }

    hideZoomOut(){
        this.zoomOut.setVisible(false)
    }

    ShowRealNumbers() {
        this.hideHorizontalLines()
        this.ShowZoomIn();
        if(this.ZoomOutValuesStack.length == 0){
            this.zoomOut.visible = false;
            this.dotted_lineLeft.visible = false
            this.dotted_lineRight.visible = false
        }
        for (let i = 0; i < this.NumberLineSelectedBtns.length; i++) {
            this.NumberLineSelectedBtns[i].setAlpha(0);
            this.NumberLineBtns[i].setAlpha(1);
            this.NumberLineBtns[i].setInteractive({
                useHandCursor: true
            })
        }
        this.RationalNumberbtn.disableInteractive()
        this.RationalNumberbtn.setAlpha(0);
        this.RationalNumberbtnSelected.setAlpha(1);
        this.GameOperationStatus = "RealNumbers"
        this.updateNumberLineForRealNumbers();
        this.handleZoomInOutOnZoomIn();
    }

    ShowRationalNumbers() {
        this.showHorizontalLines()
        this.ShowZoomIn();
        if(this.ZoomOutValuesStack.length == 0){
            this.zoomOut.visible = false;
            this.dotted_lineLeft.visible = false
            this.dotted_lineRight.visible = false
        }
        for (let i = 0; i < this.NumberLineSelectedBtns.length; i++) {
            this.NumberLineSelectedBtns[i].setAlpha(0);
            this.NumberLineBtns[i].setAlpha(1);
            this.NumberLineBtns[i].setInteractive({
                useHandCursor: true
            })
        }

        this.RationalNumberbtn.disableInteractive()
        this.RationalNumberbtn.setAlpha(0);
        this.RationalNumberbtnSelected.setAlpha(1);
        this.GameOperationStatus = "RationalNumbers"
        this.updateNumberLineForRationalNumber();
        this.handleZoomInOutOnZoomIn();
    }

    ShowIntegerNumbers() {
        this.HideZoomIn();
        this.zoomOut.visible = true;
        this.dotted_lineLeft.visible = true
        this.dotted_lineRight.visible = true
        for (let i = 0; i < this.NumberLineSelectedBtns.length; i++) {
            this.NumberLineSelectedBtns[i].setAlpha(0);
            this.NumberLineBtns[i].setAlpha(1);
            this.NumberLineBtns[i].setInteractive({
                useHandCursor: true
            })
        }

        this.IntegerNumberbtn.disableInteractive()
        this.IntegerNumberbtn.setAlpha(0);
        this.IntegerNumberbtnSelected.setAlpha(1);
        this.GameOperationStatus = "IntegerNumbers"
        this.UpdateNumberLineForIntegers();
    }

    updateNumberLineForRationalNumber(){
        this.ZoomOutValuesStack.map((obj,i)=>{
            obj.startingIndex = obj.startingIndex * 10 ** (Number(this.MyNumberLines[1].text).countDecimals() - (this.ZoomOutValuesStack.length -i))
            obj.endingIndex = obj.endingIndex * 10 ** (Number(this.MyNumberLines[1].text).countDecimals()-(this.ZoomOutValuesStack.length-i))
        })
        let multiplyDec = Number(this.MyNumberLines[1].text).countDecimals()
        this.MyNumberLines.map((numbers, i) => {
            if(i == 0 || i == this.MyNumberLines.length-1){
                numbers.setText([parseFloat((Number(numbers.text) * 10**(multiplyDec)).toFixed(12)),10**(multiplyDec)]);
            }
            else{
                numbers.setText([parseFloat((Number(numbers.text) * 10**Number(numbers.text).countDecimals()).toFixed(12)),10**Number(numbers.text).countDecimals()]);
            }
        })
        for (let i = 0; i < 10; i++) {
            this.MyZoomIn[i].ToZoomInIndex = {
                startingIndex: Number(this.MyNumberLines[i].text),
                endingIndex: Number(this.MyNumberLines[i + 1].text)
            }
        }
    }

    UpdateNumberLineForIntegers() {
        this.ZoomOutValuesStack = [];
        this.MyNumberLines.map((numbers, i) => {
            numbers.setText(i - 5);
        })
        for (let i = 0; i < 10; i++) {
            this.MyZoomIn[i].ToZoomInIndex = {
                startingIndex: Number(this.MyNumberLines[i].text),
                endingIndex: Number(this.MyNumberLines[i + 1].text)
            }
        }
    }

    updateNumberLineForRealNumbers() {
        this.ZoomOutValuesStack.map((obj,i)=>{
            obj.startingIndex = parseFloat((obj.startingIndex / (Number(this.MyNumberLines[0].text.split("\n")[1])/10**(this.ZoomOutValuesStack.length-i))).toFixed(12))
            obj.endingIndex = parseFloat((obj.endingIndex / (Number(this.MyNumberLines[0].text.split("\n")[1])/10**(this.ZoomOutValuesStack.length-i))).toFixed(12))
            
        })
        this.MyNumberLines.map((numbers, i) => {
            if(numbers.text.split("\n")[0]){
                numbers.setText(numbers.text.split("\n")[0] / numbers.text.split("\n")[1]);
            }
            else{
                numbers.setText(i/10)
            }
        })
        for (let i = 0; i < 10; i++) {
            this.MyZoomIn[i].ToZoomInIndex = {
                startingIndex: Number(this.MyNumberLines[i].text),
                endingIndex: Number(this.MyNumberLines[i + 1].text)
            }
        }
    }

    ShowWholeNumbers() {
        this.HideZoomIn();
        this.zoomOut.visible = true;
        this.dotted_lineLeft.visible = true
        this.dotted_lineRight.visible = true
        for (let i = 0; i < this.NumberLineSelectedBtns.length; i++) {
            this.NumberLineSelectedBtns[i].setAlpha(0);
            this.NumberLineBtns[i].setAlpha(1).setInteractive({
                useHandCursor: true
            })
        }

        this.WholeNumberbtn.disableInteractive()
        this.WholeNumberbtn.setAlpha(0);
        this.WholeNumberbtnSelected.setAlpha(1);
        this.GameOperationStatus = "WholeNumbers"
        this.UpdateNumberLineForWhole();
    }

    UpdateNumberLineForWhole() {
        this.ZoomOutValuesStack = [];
        this.MyNumberLines.map((numbers, i) => {
            numbers.setText(i);
        })
        for (let i = 0; i < 10; i++) {
            this.MyZoomIn[i].ToZoomInIndex = {
                startingIndex: Number(this.MyNumberLines[i].text),
                endingIndex: Number(this.MyNumberLines[i + 1].text)
            }
        }
    }

    ShowNaturalNumbers() {
        this.HideZoomIn();
        this.zoomOut.visible = true;
        this.dotted_lineLeft.visible = true
        this.dotted_lineRight.visible = true
        for (let i = 0; i < this.NumberLineSelectedBtns.length; i++) {
            this.NumberLineSelectedBtns[i].setAlpha(0);
            this.NumberLineBtns[i].setAlpha(1).setInteractive({
                useHandCursor: true
            })
        }

        this.NaturalNumberbtn.disableInteractive()
        this.NaturalNumberbtn.setAlpha(0);
        this.NaturalNumberbtnSelected.setAlpha(1);
        this.GameOperationStatus = "NaturalNumbers"
        this.UpdateNumberLineForNatural()
    }

    UpdateNumberLineForNatural() {
        this.ZoomOutValuesStack = [];
        this.MyNumberLines.map((numbers, i) => {
            numbers.setText(i + 1);
        })
        for (let i = 0; i < 10; i++) {
            this.MyZoomIn[i].ToZoomInIndex = {
                startingIndex: Number(this.MyNumberLines[i].text),
                endingIndex: Number(this.MyNumberLines[i + 1].text)
            }
        }
    }

    HideZoomIn() {
        this.MyZoomIn.map((zoomin) => {
            zoomin.setVisible(false);
        })
    }

    ShowZoomIn(){
        this.MyZoomIn.map((zoomin) => {
            zoomin.setVisible(true);
        })
    }

    AddOnZoomOut() {
        this.dotted_lineLeft = this.add.image(-390, -102, 'dotted_line').setOrigin(.5).setAlpha(1).setScale(1.3);
        this.dotted_lineRight = this.add.image(390, -102, 'dotted_line').setOrigin(.5).setAlpha(1).setScale(1.3);
        this.dotted_lineRight.flipX = true
        this.zoomOut = this.add.image(0, -130, 'zoomout').setOrigin(.5).setAlpha(1).setScale(1.3).setInteractive({
            useHandCursor: true
        }).on('pointerup', () => {
            if(this.ZoomOutValuesStack.length < 4){
                this.zoomOut.disableInteractive()
                this.game.soundManager.play(Constants.Sounds.ExpandScale)
                switch (this.GameOperationStatus) {
                    case "RealNumbers":
                        this.onZoomOutInteger()
                        break;
                    case "RationalNumbers":
                        if(this.ZoomOutValuesStack.length > 0){
                            this.onZoomOutInteger()
                        }
                        break;
                    case "IntegerNumbers":
                        this.onZoomOutInteger()
                        break;
                    case "NaturalNumbers":
                        this.onZoomOutInteger();
                        break;
                    case "WholeNumbers":
                        this.onZoomOutInteger();
                        break;
                    default:
                        break;
                }
            }
            
        });
        this.zoomOut.input.hitArea.setTo(35 * this.scaleX, 30 * this.scaleY, 65, 65);
        this.dotted_lineRight.followObject = this.dotted_lineLeft.followObject = this.zoomOut.followObject = this.line;
    }

    update() {
    }
};

Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0; 
}