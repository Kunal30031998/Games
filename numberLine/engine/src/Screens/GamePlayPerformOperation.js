import { Constants } from "../Utilities/Constants"
import { BaseScene } from "../Utilities/BaseScene"
import { Player } from "../GameObjects/Player"
import { Joypad } from "../GameObjects/Joypad"
import { ThreeStarPopup } from "../Popups/ThreeStarPopup"
import { Utilities } from "../Utilities/Utilities"
import { HintPopup } from "../Popups/HintPopup"
import { GUIButton } from "../Utilities/GUIButton"
import {
    Dropdown
} from "../GameObjects/DropDown"
import { Tilemaps } from "phaser"


export class GamePlayPerformOperation extends BaseScene {
    constructor() {
        super({ key: Constants.GamePlayPerformOperation })

        this.hintPopup = new HintPopup(this)
    }

    create() {
        super.create()
        this.bg = this.add.image(this.screenWidth*0.5,this.screenHeight*0.5,'bg').setOrigin(0.5);
        this.bg.shouldResize = false
        this.GameStarted = true;
        this.createNumberLine();
        this.CreateQuestionHeader();
        this.CreateNumberLineNumberSelections();
        this.AddOperations()
        this.AddOnZoomOut();
        this.AddPopup();
        this.AddCorrectOrWrongPopup();
        this.addTimerAndPoints();
        this.addMultiplier();
        this.GameOverPopup = new ThreeStarPopup(this,Constants.Popups.LevelClear)
        this.GameOverPopup.create()
        this.GameTimeOverPopup = new ThreeStarPopup(this,Constants.Popups.GameOver)
        this.GameTimeOverPopup.create()
        this.correctAnswers = 0
        this.incorrectAnswers = 0
        this.levelData = Utilities.clone(this.jsonData.gameScreen.LevelData)
        this.currentQuestion = this.levelData.questions.shift()
        this.GameLimit = true;
        // this.time.delayedCall(500, () => {
        //     this.GameOverPopup.open(3, 100)
        // })
        
    }

    createNumberLine(){
        this.Scakebg = this.add.image(this.screenWidth*0.5,this.screenHeight*0.93,'Scakebg').setOrigin(0.5).setAlpha(0).setDepth(1);
        this.Scakebg.name = "Scakebg"
        this.line = this.add.image(0,-55,'Line').setAlpha(0).setDepth(2);
        this.line.followObject = this.Scakebg;
        this.MyNumberLines = [];
        this.MyVerticleLines = [];
        this.MyHorizontalLines = [];
        this.MyZoomIn = [];
        this.ZoomOutValuesStack = [];
        this.SelectedNum = this.add.image(0,0 ,"SelectedNum").setOrigin(0.5).setAlpha(0).setDepth(1);
        this.SelectedNum.followObject = this.line
        this.SelectedCorrectNum = this.add.image(0,7 ,"CorrectSelected").setOrigin(0.5).setAlpha(0).setDepth(1);
        this.SelectedCorrectNum.followObject = this.line
        this.SelectedIncorrectNum = this.add.image(0,7 ,"IncorrectSelected").setOrigin(0.5).setAlpha(0).setDepth(1);
        this.SelectedIncorrectNum.followObject = this.line
        this.SelectedNumForOperation;
        this.selected = false;
        this.selectedOrNot = false;
        this.questionCount = 0;
        this.SelectedNumForOperationObj;
        
        for(let i=0;i<11;i++){
            let numbers = this.add.text(-(this.line.width/2) + 120 + i*140,70 ,i+"",{font: "40px Roboto-Bold", fill: "#ffffff", align: "center", wordWrap: { width: 5, useAdvancedWrap: false }}).setOrigin(0.5).setAlpha(0).setInteractive({useHandCursor:true}).setDepth(1);
            var VerticleLine = this.add.image(-(this.line.width/2) + 120 + i*140,0 ,"VerticleLine").setOrigin(0.5).setAlpha(0).setDepth(1);
            var HorizontalLine = this.add.image(-(this.line.width/2) + 120 + i*140,70 ,"HorizontalLine").setOrigin(0.5).setAlpha(0).setVisible(false).setDepth(1);
            HorizontalLine.followObject = VerticleLine.followObject = numbers.followObject = this.line
            this.MyHorizontalLines.push(HorizontalLine)
            if(this.GameOperationStatus =="RationalNumbers"){
                HorizontalLine.visible = true;
            }
            numbers.on('pointerup',()=>{
                this.disableOperationBtn()
                this.OperationBtns.map((btns)=>{
                    btns.setTint(0x605c5c)
                })
                if(!this.selected){
                    this.selected = true;
                    this.SetSelectedNumPos(this.SelectedNum,numbers)
                }
                else{
                    this.PerformOperationWithSelectedNum(numbers)
                }
            })
            this.MyNumberLines.push(numbers)
            this.MyVerticleLines.push(VerticleLine)
            if(i < 10){
                let ZoomIn = this.add.image(-(this.line.width/2) + 190 + i*140,-35 ,"zoomin").setOrigin(0.5).setInteractive({useHandCursor: true}).setAlpha(0).setDepth(1);
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

        this.NextBtn = this.add.image(1060,0 ,"Next").setOrigin(0.5).setAlpha(0).setDepth(1).setInteractive({ useHandCursor: true }).on('pointerup', ()=>{
            this.OnNext();
        });
        this.PrevBtn = this.add.image(-1060,0 ,"previous").setOrigin(0.5).setAlpha(0).setDepth(1).setInteractive({ useHandCursor: true }).on('pointerup', ()=>{
            this.OnPrev();
        });
        this.NextBtn.followObject = this.PrevBtn.followObject = this.line;
        this.PrevBtn.disableInteractive();
        this.NextBtn.disableInteractive();

        this.resetBtn = this.add.image(0,-200 ,"reload").setOrigin(0.5).setAlpha(0).setDepth(1).setInteractive({ useHandCursor: true }).on('pointerup', ()=>{
            this.onReset();
        });
        this.resetBtn.followObject = this.line;
    }

    onReset(){
        this.resetNumberLine();
        this.handleZoomInOutOnZoomIn();
        this.handleZoomInOutOnZoomOut();
    }

    addMultiplier(){
        // this.multiplierBg = this.add.image(0, 282, "10xBg").setOrigin(0.5)
        let x = this.screenWidth * .675
        let y = this.screenHeight * .38
        this.multiplierDropdown = new Dropdown(this, {
            x: x,
            y: y,
            options: ["10X","100X","1000X"],
            depth: 2,
            onChange: (selected) => {
                
                console.log("multiplied")
                switch (selected) {
                    case "10X":
                        this.onMultiplierX(10);
                        break;
                    case "100X":
                        this.onMultiplierX(100);
                        break;
                    case "1000X":
                        this.onMultiplierX(1000);
                        break;
                    default:
                        break;
                }
                this.SelectedNum.setAlpha(0)
            }
        })
        this.showMultiplier(false);
    }

    onMultiplierX(x){
        this.resetNumberLine();
        this.MyNumberLines.map((number)=>{
            if(this.GameOperationStatus =="RationalNumbers"){
                number.text = [Number(number.text.split("\n")[0]) * x,number.text.split("\n")[1]];
            }
            else{
                number.text = Number(number.text) * x;
            }
        })
        this.handleZoomInOutOnZoomOut();
        this.handleZoomInOutOnZoomIn();
    }

    resetNumberLine(){
        switch (this.GameOperationStatus) {
            case "RationalNumbers":
                this.MyNumberLines.map((numbers, i) => {
                    numbers.setText([i - 5,10]);
                })
                break;
            case "RealNumbers":
                this.MyNumberLines.map((numbers, i) => {
                    numbers.setText(i / 10);
                })
                break;
            case "IntegerNumbers":
                this.MyNumberLines.map((numbers,i)=>{
                    numbers.setText(i - 5);
                })
                break;
            case "WholeNumbers":
                this.MyNumberLines.map((numbers,i)=>{
                    numbers.setText(i);
                })
                break;
            case "NaturalNumbers":
                this.MyNumberLines.map((numbers,i)=>{
                    numbers.setText(i+1);
                })
                break;
        }
        this.SelectedNum.setAlpha(0);
        this.time.addEvent({ delay: 1100, callback: ()=>{
            this.MyNumberLines.map((numbers)=>{
                if(this.GameOperationStatus == "RationalNumbers"){
                    if(numbers.text.split("\n")[0] == this.SelectedNumForOperation){
                        this.SelectedNum.x = numbers.x;
                        this.SelectedNum.y = numbers.y + 25*this.globalScale;
                        this.SelectedNum.xOriginal = numbers.xOriginal;
                        this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                        this.SelectedNum.setAlpha(1);
                        
                    }
                }
                else{
                    if(numbers.text == this.SelectedNumForOperation){
                        this.SelectedNum.x = numbers.x;
                        this.SelectedNum.y = numbers.y + 25*this.globalScale;
                        this.SelectedNum.xOriginal = numbers.xOriginal;
                        this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                        this.SelectedNum.setAlpha(1);
                        
                    }
                }
            })
        }, callbackScope: this})
    }
    
    addTimerAndPoints(){
        let textStyle = {
            fontSize: '40px',
            fontFamily: 'Roboto-Bold',
            color: '#ffffff',
            align: 'center',
            lineSpacing: 10,
            wordWrap: { width: this.CorrectOrWrongPopuppanel.width * .8 }
        }
        this.pointsAndTimerContainer = this.add.container(this.screenWidth*.5,0);
        this.pointsAndTimerBG = this.add.image(0,250,'questionbg').setOrigin(.5).setScale(.6)
        this.pointsAndTimerBG.flipX = true
        this.pointsAndTimerBG.followObject = this.header.quitPopup.button;
        this.PointsText = this.add.text(0,0,"Points : ",textStyle).setOrigin(.5);
        this.TimerText = this.add.text(-50,0,"Timer : ",textStyle).setOrigin(.5);
        this.Points = this.add.text(0,0,"0",{...textStyle,color: '#4CCF36',fontSize: '50px' }).setOrigin(.5);
        this.ticTime = 100
        this.gameTime = 60 * 1000;
        this.Timer = this.add.text(-32,0,this.gameTime/1000,{...textStyle, color: '#4CCF36',fontSize: '50px'}).setOrigin(.5);
        this.pointsAndTimerSeprator = this.add.image(0,0,'TimerLineSeprator').setOrigin(.5)
        this.Points.followObject = this.Timer.followObject = this.pointsAndTimerSeprator.followObject = this.TimerText.followObject = this.PointsText.followObject = this.pointsAndTimerBG;
        this.pointsAndTimerContainer.add([this.pointsAndTimerBG,this.PointsText,this.TimerText,this.Points,this.Timer,this.pointsAndTimerSeprator])
        this.currentScore = 0;
        this.Points.setText(this.currentScore);

        this.ticTime = 100
        this.gameTime = 60 * 1000;
        this.gameplayTimer = this.time.addEvent({ delay: this.ticTime, callback: this.onTimerTic, callbackScope: this, repeat: -1 })
        this.gameplayTimer.paused = true
    }

    onTimerTic() {
        this.gameplayTimer.reset({ delay: this.ticTime, callback: this.onTimerTic, callbackScope: this, repeat: -1 })
        if (this.gameTime > 1) {
            this.gameTime -= this.ticTime
            this.Timer.setText(Math.floor(this.gameTime/1000) + "s")
        } else {
            this.gameplayTimer.paused = true
            // this.game.soundManager.play(Constants.Sounds.GameOver)
            this.GameTimeOverPopup.open(this.calculateStars(), this.currentScore)   
        }
    }

    destroyTimer(){
        this.gameplayTimer.paused = false
        this.gameTime = 60 * 1000
        this.timerText.setText(this.gameTime + "s")
    }

    AddCorrectOrWrongPopup(){
        this.CorrectOrWrongPopupcontainer = this.add.container(0, this.screenHeight).setDepth(1000).setAlpha(0)
        
        this.CorrectOrWrongPopuppanel = this.add.image(this.screenWidth*.5, this.screenHeight*.5, 'QuestionsCompletePopup').setOrigin(0.5).setDepth(1000).setScale(.8)
        let textStyle = {
            fontSize: '50px',
            fontFamily: 'Roboto-Bold',
            color: '#000000',
            align: 'center',
            lineSpacing: 10,
            wordWrap: { width: this.CorrectOrWrongPopuppanel.width * .8 }
        }
        this.CorrectOrWrongSCorePanel = this.add.image(0,130, 'pointbg').setOrigin(0.5).setDepth(1000)
        this.CorrectOrWrongPopuptext = this.add.text(0, -150, "",textStyle).setOrigin(0.5)
        this.CorrectOrWrongScoretext = this.add.text(0, 130, "0",{...textStyle,color: '#ffffff'}).setOrigin(0.5)
        this.CorrectOrWrongYouEarntext = this.add.text(0, -25, "You Earn",textStyle).setOrigin(0.5)

        this.CorrectOrWrongYouEarntext.followObject = this.CorrectOrWrongScoretext.followObject = this.CorrectOrWrongPopuptext.followObject = this.CorrectOrWrongSCorePanel.followObject = this.CorrectOrWrongPopuppanel
        this.CorrectOrWrongPopupoverlay = this.add.rectangle(this.screenWidth * .5, this.screenHeight * .5, this.screenWidth, this.screenHeight, 0x000000).setDepth(100).setOrigin(0.5).setAlpha(0).setInteractive()
        this.CorrectOrWrongPopupcontainer.add([this.CorrectOrWrongPopuppanel, this.CorrectOrWrongPopuptext,this.CorrectOrWrongSCorePanel,this.CorrectOrWrongScoretext,this.CorrectOrWrongYouEarntext])
        this.CorrectOrWrongPopupcontainer.yOriginal = this.CorrectOrWrongPopupcontainer.y
    }
    
    PerformOperationWithSelectedNum(numbers){
        let result;
        this.questionCount ++;
        switch (this.OperationStatus) {
            case "Add":
                result = parseFloat((Number(this.SelectedNumForOperation) + Number(this.RandomNum)).toFixed(12));
                break;
            case "Substract":
                result = parseFloat((Number(this.SelectedNumForOperation) - Number(this.RandomNum)).toFixed(12));
                break;
            case "Division":
                result = parseFloat((Number(this.SelectedNumForOperation) / Number(this.RandomNum)).toFixed(12));
                break;
            case "Multiply":
                result = parseFloat((Number(this.SelectedNumForOperation) * Number(this.RandomNum)).toFixed(12));
                break;
        }
        if(this.GameOperationStatus != "RationalNumbers"){
            if(result == Number(numbers.text)){
                this.showOnCorrect(numbers);
            }
            else{
                this.showOnWrong(numbers)
            }
        }
        if(this.GameOperationStatus == "RationalNumbers"){
            if(result == Number(numbers.text.split("\n")[0])){
                this.showOnCorrect(numbers);
            }
            else{
                this.showOnWrong(numbers)
            }
        }
        this.disableAll();
        
    }

    showOnWrong(numbers){
        this.SelectedIncorrectNum.x = numbers.x
        this.SelectedIncorrectNum.y = numbers.y + 30*this.globalScale;
        this.SelectedIncorrectNum.xOriginal = numbers.xOriginal
        this.SelectedIncorrectNum.yOriginal = numbers.yOriginal + 30*this.globalScale;
        this.SelectedIncorrectNum.setAlpha(1)
        this.time.delayedCall(2000, () => {
            this.ShowCorrectOrWrongPopup("Your answer is Wrong")
        })
        this.CorrectOrWrongScoretext.setText("0" + "  Points")
        this.game.soundManager.play(Constants.Sounds.wrongAnswer)
        this.incorrectAnswers += 1;
    }

    showOnCorrect(numbers){
        this.SelectedCorrectNum.x = numbers.x
        this.SelectedCorrectNum.y = numbers.y + 30*this.globalScale;
        this.SelectedCorrectNum.xOriginal = numbers.xOriginal
        this.SelectedCorrectNum.yOriginal = numbers.yOriginal + 30*this.globalScale;
        this.SelectedCorrectNum.setAlpha(1)
        this.time.delayedCall(2000, () => {
            this.ShowCorrectOrWrongPopup("Awesome! Correct Answer!")
        })
        this.currentScore += 10;
        this.Points.setText(this.currentScore);
        this.CorrectOrWrongScoretext.setText("10" + "  Points")
        this.game.soundManager.play(Constants.Sounds.correctAnswer)
        this.correctAnswers += 1;
    }

    ShowCorrectOrWrongPopup(text){
        this.CorrectOrWrongPopuptext.setText(text)
        this.time.addEvent({delay: 250, callback : ()=>{
            this.game.soundManager.play(Constants.Sounds.popupopen)
        }},)

        this.tweens.add({
            targets: this.CorrectOrWrongPopupcontainer,
            y: 0,
            yOriginal: 0,
            alpha : 1,
            ease: Phaser.Math.Easing.Back.InOut,
            duration: 500,
            delay : 250,
            onComplete : ()=>{
                this.time.addEvent({delay: 1000, callback : ()=>{
                    this.game.soundManager.play(Constants.Sounds.popupClose)
                }},)
                this.tweens.add({
                    targets: this.CorrectOrWrongPopupcontainer,
                    y: this.screenHeight,
                    yOriginal: this.screenHeight,
                    alpha : 0,
                    ease: Phaser.Math.Easing.Back.InOut,
                    duration: 500,
                    delay : 1000,
                    onComplete : ()=>{
                        this.NextQues();
                    }
                })
            }
        })
        this.tweens.add({
            targets: this.CorrectOrWrongPopupoverlay,
            alpha: .6,
            ease: Phaser.Math.Easing.Back.InOut,
            duration: 500,
            delay : 500,
            onComplete : ()=>{
                this.tweens.add({
                    targets: this.CorrectOrWrongPopupoverlay,
                    alpha: 0,
                    ease: Phaser.Math.Easing.Back.InOut,
                    duration: 500,
                    delay : 1500,
                })
            }
        })
    }

    disableNumberLine(){
        this.MyNumberLines.map((numbers)=>{
            numbers.disableInteractive();
        })
    }

    disableOperationBtn(){
        this.OperationBtns.map((btns)=>{
            btns.disableInteractive();
        })
    }

    EnableNumberLine(){
        this.MyNumberLines.map((numbers)=>{
            numbers.setInteractive({useHandCursor:true});
        })
    }

    EnableOperationBtn(){
        this.OperationBtns.map((btns)=>{
            btns.setInteractive({useHandCursor:true});
        })
    }

    disableAll(){
        this.disableNumberLine();
        this.disableOperationBtn();

        this.MyZoomIn.map((zoomIn)=>{
            zoomIn.disableInteractive();
        })

        this.NextBtn.disableInteractive();
        this.PrevBtn.disableInteractive();

        this.RealNumberbtn.disableInteractive()
        this.RationalNumberbtn.disableInteractive()
        this.IntegerNumberbtn.disableInteractive()
        this.WholeNumberbtn.disableInteractive()
        this.NaturalNumberbtn.disableInteractive();
        

        this.zoomOut.disableInteractive()
    }

    enableZoomIn(){
        this.MyZoomIn.map((zoomIn)=>{
            zoomIn.setInteractive({useHandCursor:true});
        })
    }

    disableNumberCategory(){
        this.RealNumberbtn.disableInteractive()
        this.RationalNumberbtn.disableInteractive()
        this.IntegerNumberbtn.disableInteractive()
        this.WholeNumberbtn.disableInteractive()
        this.NaturalNumberbtn.disableInteractive();
        this.dropDownOption1.disableInteractive()
        this.dropDownOption2.disableInteractive()

        this.RealNumberbtn.setTint(0x605c5c)
        this.RationalNumberbtn.setTint(0x605c5c)
        this.IntegerNumberbtn.setTint(0x605c5c)
        this.WholeNumberbtn.setTint(0x605c5c)
        this.NaturalNumberbtn.setTint(0x605c5c)
        this.dropDownOption1.setTint(0x605c5c)
        this.dropDownOption2.setTint(0x605c5c)
        this.dropDownOption1Text.setTint(0x605c5c)
        this.dropDownOption2Text.setTint(0x605c5c)

        this.NumberLineSelectedBtnsText.map((numText)=>{
            numText.setTint(0x605c5c)
        })

        switch (this.GameOperationStatus) {
            case "RealNumbers":
                this.RealNumberbtnText.clearTint()
                this.RationalNumberbtnText.clearTint()
                // this.dropDownOption1.clearTint()
                // this.dropDownOption2.clearTint()
                // this.dropDownOption1Text.clearTint()
                // this.dropDownOption2Text.clearTint()
                break;
            case "RationalNumbers":
                this.RealNumberbtnText.clearTint()
                this.RationalNumberbtnText.clearTint()
                // this.dropDownOption1.clearTint()
                // this.dropDownOption2.clearTint()
                // this.dropDownOption1Text.clearTint()
                // this.dropDownOption2Text.clearTint()
                break;
            case "NaturalNumbers":
                this.NaturalNumberbtnText.clearTint()
                break;
            case "WholeNumbers":
                this.WholeNumberbtnText.clearTint()
                break;
            case "IntegerNumbers":  
                this.IntegerNumberbtnText.clearTint() 
                break;
        }
        
    }

    genRandRealNum(min, max, decimalPlaces) {
        return (Math.random() * (max - min) + min).toFixed(decimalPlaces) * 1;
    }

    SetSelectedNumPos(SelectedNum,numbers){
        SelectedNum.x = numbers.x;
        SelectedNum.y = numbers.y + 25*this.globalScale;
        SelectedNum.xOriginal = numbers.x;
        SelectedNum.yOriginal = numbers.y + 25*this.globalScale;
        this.SelectedNumForOperationObj = numbers;
        SelectedNum.setAlpha(1);

        this.SelectedNumForOperation = Number(numbers.text)
        if(this.GameOperationStatus == "RationalNumbers"){
            this.SelectedNumForOperationDen = Number(numbers.text.split("\n")[1]);
            this.SelectedNumForOperation = Number(numbers.text.split("\n")[0]);
        }

        switch (this.GameOperationStatus) {
            case "RealNumbers":
                this.RandomNum = this.genRandRealNum(Number(this.MyNumberLines[1].text),Number(this.MyNumberLines[this.MyNumberLines.length - 4].text),(Number(this.MyNumberLines[1].text)).countDecimals())
                break;
            case "RationalNumbers":
                this.RandomNum = this.randomIntWholeNaturalNumber(1,7);
                break;
            case "NaturalNumbers":
                this.RandomNum = this.randomIntWholeNaturalNumber(1,7);
                break;
            case "WholeNumbers":
                this.RandomNum = this.randomIntWholeNaturalNumber(1,7);
                break;
            case "IntegerNumbers":   
                this.RandomNum = this.randomIntWholeNaturalNumber(1,7);
                break;
        }
        switch (this.OperationStatus) {
            case "Add":
                this.RandomNum = this.GetRandomNumberForAddition()
                this.PerformOperations.setText("Add the selected number with                and click on the correct answer.")
                if(this.GameOperationStatus == "RationalNumbers"){
                    this.RandomNumText.setText(this.RandomNum + "\n" + this.SelectedNumForOperationDen)
                    this.QuesHorizontalLine.setVisible(true);
                    this.QuesHorizontalLine.x = -1 * this.scaleX + 670 * this.globalScale;
                    this.QuesHorizontalLine.xOriginal = -1 * this.scaleX + 670 * this.globalScale;
                    // this.resizeElement(this.QuesHorizontalLine)
                }
                else{
                    this.RandomNumText.setText(this.RandomNum)
                }
                this.RandomNumText.x = -1 * this.scaleX + 670 * this.globalScale
                this.RandomNumText.xOriginal = -1 * this.scaleX + 670 * this.globalScale
                // this.resizeElement(this.RandomNumText)
                break;
            case "Substract":
                this.RandomNum = this.GetRandomNumberForSubstraction()
                this.PerformOperations.setText("Substract the selected number with                and click on the correct answer.")
                if(this.GameOperationStatus == "RationalNumbers"){
                    this.RandomNumText.setText(this.RandomNum + "\n" + this.SelectedNumForOperationDen)
                    this.QuesHorizontalLine.setVisible(true);
                    this.QuesHorizontalLine.x = -1 * this.scaleX + 780 * this.globalScale;
                    this.QuesHorizontalLine.xOriginal = -1 * this.scaleX + 780 * this.globalScale;
                    // this.resizeElement(this.QuesHorizontalLine)
                }
                else{
                    this.RandomNumText.setText(this.RandomNum)
                }
                this.RandomNumText.x = -1 * this.scaleX + 780 * this.globalScale
                this.RandomNumText.xOriginal = -1 * this.scaleX + 835 * this.globalScale
                // this.resizeElement(this.RandomNumText)
                break;
            case "Division":
                this.RandomNum = this.GetRandomNumberForDivision()
                this.PerformOperations.setText("Divide the selected number with           and click on the correct answer.")
                this.RandomNumText.setText(this.RandomNum)
                this.RandomNumText.x = -1 * this.scaleX + 690 * this.globalScale
                break;
            case "Multiply":
                this.RandomNum = this.randomIntWholeNaturalNumber(1,9)
                this.PerformOperations.setText("Multiply the selected number with           and click on the correct answer.")
                this.RandomNumText.setText(this.RandomNum)
                this.RandomNumText.x = -1 * this.scaleX + 720 * this.globalScale
                break;
        }
        this.RandomNumText.visible = true;
        this.showMultiplier(true)
        this.GameLimit = false;
    }

    showMultiplier(bool){
        this.multiplierDropdown.dropDownImg.visible = bool;
        this.multiplierDropdown.dropDownArrow.visible = bool;
        this.multiplierDropdown.options.forEach((option, index) => {
            option.image.visible = bool;
            option.text.visible = bool;
        })
        // this.multiplierBg.visible = bool;
    }

    GetRandomNumberForSubstraction(SelectedNum){
        if(this.GameOperationStatus != "RealNumbers" && this.GameOperationStatus != "RationalNumbers"){
            return Math.floor((Math.random())*(this.SelectedNumForOperation-1+1))+1;
        }
        else if(this.GameOperationStatus == "RealNumbers"){
            let num = Math.floor((Math.random())*(this.SelectedNumForOperation*this.SelectedNumForOperation.countDecimals()-1+1))+1;
            return num/(10**Number(this.MyNumberLines[1].text).countDecimals());
        }
        else if(this.GameOperationStatus == "RationalNumbers"){
            return (Math.floor((Math.random())*(this.SelectedNumForOperation-1+1))+1)
        }
    }

    GetRandomNumberForAddition(){
        if(this.GameOperationStatus != "RealNumbers" && this.GameOperationStatus != "RationalNumbers"){
            return Math.floor((Math.random())*(9-1+1))+1;
        }
        else if(this.GameOperationStatus == "RealNumbers"){
            let num = Math.floor((Math.random())*(9-1+1))+1;
            return num/(10**Number(this.MyNumberLines[1].text).countDecimals());
        }
        else if(this.GameOperationStatus == "RationalNumbers"){
            return (Math.floor((Math.random())*(9-1+1))+1)
        }
    }

    GetRandomNumberForDivision(){

        if(this.GameOperationStatus != "RealNumbers" && this.GameOperationStatus != "RationalNumbers"){
            if(this.SelectedNumForOperation == 0){
                return 1;
            }
            else {
                const factors = number => Array
                .from(Array(number + 1), (_, i) => i)
                .filter(i => number % i === 0)
                return factors(Math.abs(Number(this.SelectedNumForOperation))).sample()
            }
        }
        else if(this.GameOperationStatus == "RealNumbers"){
            if(this.SelectedNumForOperation == 0){
                return 1;
            }
            else {
                const factors = number => Array
                .from(Array(number + 1), (_, i) => i)
                .filter(i => number % i === 0)
                return factors(Math.abs(Number(this.SelectedNumForOperation)* 10**Number(this.SelectedNumForOperation).countDecimals())).sample()
            }
        }
        else if(this.GameOperationStatus == "RationalNumbers"){
            if(this.SelectedNumForOperation == 0){
                return 1;
            }
            else {
                const factors = number => Array
                .from(Array(number + 1), (_, i) => i)
                .filter(i => number % i === 0)
                return factors(Math.abs(Number(this.SelectedNumForOperation)* 10**Number(this.SelectedNumForOperation).countDecimals())).sample()
            }
        }
    }

    getPrimes = (min, max) => {
        const result = Array(max + 1)
          .fill(0)
          .map((_, i) => i);
        for (let i = 2; i <= Math.sqrt(max + 1); i++) {
          for (let j = i ** 2; j < max + 1; j += i) delete result[j];
        }
        return Object.values(result.slice(Math.max(min, 2)));
      };
      
    getRandNum = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
      };
      
    getRandPrime = (min, max) => {
        const primes = this.getPrimes(min, max);
        return primes[this.getRandNum(0, primes.length - 1)];
      };

    randomIntWholeNaturalNumber(min,max) {
        return Math.floor((Math.random())*(max-min+1))+min;
    }

    OnNext(){
        switch (this.GameOperationStatus) {
            case "RationalNumbers":
                if(this.GameLimit){
                    if(Number(this.MyNumberLines[this.MyNumberLines.length - 1].text.split("\n")[0]) < 1000){
                        this.SelectedNum.setAlpha(0)
                        this.NextBtn.disableInteractive();
                        this.AddNumberInLastAndTween()
                        this.AddVericleLinesInLastAndTween()
                        this.AddZoomInInLastAndTween();
                        this.game.soundManager.play(Constants.Sounds.Click)
                    }
                }
                else{
                    if(Number(this.MyNumberLines[this.MyNumberLines.length - 1].text.split("\n")[0]) < 10000){
                        this.SelectedNum.setAlpha(0)
                        this.NextBtn.disableInteractive();
                        this.AddNumberInLastAndTween()
                        this.AddVericleLinesInLastAndTween()
                        this.AddZoomInInLastAndTween();
                        this.game.soundManager.play(Constants.Sounds.Click)
                    }
                }
                break;
            default:
                if(this.GameLimit){
                    if(Number(this.MyNumberLines[this.MyNumberLines.length - 1].text) < 1000){
                        this.SelectedNum.setAlpha(0)
                        this.NextBtn.disableInteractive();
                        this.AddNumberInLastAndTween()
                        this.AddVericleLinesInLastAndTween()
                        this.AddZoomInInLastAndTween();
                        this.game.soundManager.play(Constants.Sounds.Click)
                    }
                }
                else{
                    if(Number(this.MyNumberLines[this.MyNumberLines.length - 1].text) < 10000){
                        this.SelectedNum.setAlpha(0)
                        this.NextBtn.disableInteractive();
                        this.AddNumberInLastAndTween()
                        this.AddVericleLinesInLastAndTween()
                        this.AddZoomInInLastAndTween();
                        this.game.soundManager.play(Constants.Sounds.Click)
                    }
                }
                break;
        }
        this.SelectedNum.setAlpha(0);
        this.time.addEvent({ delay: 1000, callback: ()=>{
            this.MyNumberLines.map((numbers)=>{
                if(this.GameOperationStatus == "RationalNumbers"){
                    if(numbers.text.split("\n")[0] == this.SelectedNumForOperation){
                        this.SelectedNum.x = numbers.x;
                        this.SelectedNum.y = numbers.y + 25*this.globalScale;
                        this.SelectedNum.xOriginal = numbers.xOriginal;
                        this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                        this.SelectedNum.setAlpha(1);
                        // this.resizeElement(this.SelectedNum)
                        
                    }
                }
                else{
                    if(numbers.text == this.SelectedNumForOperation){
                        this.SelectedNum.x = numbers.x;
                        this.SelectedNum.y = numbers.y + 25*this.globalScale;
                        this.SelectedNum.xOriginal = numbers.xOriginal;
                        this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                        this.SelectedNum.setAlpha(1);
                        // this.resizeElement(this.SelectedNum)
                    }
                }
            })
        }, callbackScope: this})
    }

    OnPrev(){
        this.PrevBtn.disableInteractive()
        this.SelectedNum.setAlpha(0)
        switch (this.GameOperationStatus) {
            case "RealNumbers":
                this.AddNumberInStartAndTween()
                this.AddVericleLinesInStartAndTween()
                this.AddZoomInInStartAndTween();
                this.game.soundManager.play(Constants.Sounds.Click)
                this.SelectedNum.setAlpha(0);
                this.time.addEvent({ delay: 1000, callback: ()=>{
                    this.MyNumberLines.map((numbers)=>{
                        if(this.GameOperationStatus == "RationalNumbers"){
                            if(numbers.text.split("\n")[0] == this.SelectedNumForOperation){
                                this.SelectedNum.x = numbers.x;
                                this.SelectedNum.y = numbers.y + 25*this.globalScale;
                                this.SelectedNum.xOriginal = numbers.xOriginal;
                                this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                                this.SelectedNum.setAlpha(1);
                                
                            }
                        }
                        else{
                            if(numbers.text == this.SelectedNumForOperation){
                                this.SelectedNum.x = numbers.x;
                                this.SelectedNum.y = numbers.y + 25*this.globalScale;
                                this.SelectedNum.xOriginal = numbers.xOriginal;
                                this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                                this.SelectedNum.setAlpha(1);
                                
                            }
                        }
                    })
                }, callbackScope: this})
                break;
            case "RationalNumbers":
                this.AddNumberInStartAndTween()
                this.AddVericleLinesInStartAndTween()
                this.AddZoomInInStartAndTween();
                this.game.soundManager.play(Constants.Sounds.Click)
                this.SelectedNum.setAlpha(0);
                this.time.addEvent({ delay: 1000, callback: ()=>{
                    this.MyNumberLines.map((numbers)=>{
                        if(this.GameOperationStatus == "RationalNumbers"){
                            if(numbers.text.split("\n")[0] == this.SelectedNumForOperation){
                                this.SelectedNum.x = numbers.x;
                                this.SelectedNum.y = numbers.y + 25*this.globalScale;
                                this.SelectedNum.xOriginal = numbers.xOriginal;
                                this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                                this.SelectedNum.setAlpha(1);
                                
                            }
                        }
                        else{
                            if(numbers.text == this.SelectedNumForOperation){
                                this.SelectedNum.x = numbers.x;
                                this.SelectedNum.y = numbers.y + 25*this.globalScale;
                                this.SelectedNum.xOriginal = numbers.xOriginal;
                                this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                                this.SelectedNum.setAlpha(1);
                                
                            }
                        }
                    })
                }, callbackScope: this})
            break;
            case "IntegerNumbers":
                this.AddNumberInStartAndTween()
                this.AddVericleLinesInStartAndTween()
                this.AddZoomInInStartAndTween();
                this.game.soundManager.play(Constants.Sounds.Click)
                this.SelectedNum.setAlpha(0);
                this.time.addEvent({ delay: 1000, callback: ()=>{
                    this.MyNumberLines.map((numbers)=>{
                        if(this.GameOperationStatus == "RationalNumbers"){
                            if(numbers.text.split("\n")[0] == this.SelectedNumForOperation){
                                this.SelectedNum.x = numbers.x;
                                this.SelectedNum.y = numbers.y + 25*this.globalScale;
                                this.SelectedNum.xOriginal = numbers.xOriginal;
                                this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                                this.SelectedNum.setAlpha(1);
                                
                            }
                        }
                        else{
                            if(numbers.text == this.SelectedNumForOperation){
                                this.SelectedNum.x = numbers.x;
                                this.SelectedNum.y = numbers.y + 25*this.globalScale;
                                this.SelectedNum.xOriginal = numbers.xOriginal;
                                this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                                this.SelectedNum.setAlpha(1);
                                
                            }
                        }
                    })
                }, callbackScope: this})
                break;
            case "NaturalNumbers":
                if(Number(this.MyNumberLines[0].text) > 1){
                    this.AddNumberInStartAndTween()
                    this.AddVericleLinesInStartAndTween()
                    this.AddZoomInInStartAndTween();
                    this.game.soundManager.play(Constants.Sounds.Click)
                    this.SelectedNum.setAlpha(0);
                    this.time.addEvent({ delay: 1000, callback: ()=>{
                        this.MyNumberLines.map((numbers)=>{
                            if(this.GameOperationStatus == "RationalNumbers"){
                                if(numbers.text.split("\n")[0] == this.SelectedNumForOperation){
                                    this.SelectedNum.x = numbers.x;
                                    this.SelectedNum.y = numbers.y + 25*this.globalScale;
                                    this.SelectedNum.xOriginal = numbers.xOriginal;
                                    this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                                    this.SelectedNum.setAlpha(1);
                                    
                                }
                            }
                            else{
                                if(numbers.text == this.SelectedNumForOperation){
                                    this.SelectedNum.x = numbers.x;
                                    this.SelectedNum.y = numbers.y + 25*this.globalScale;
                                    this.SelectedNum.xOriginal = numbers.xOriginal;
                                    this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                                    this.SelectedNum.setAlpha(1);
                                    
                                }
                            }
                        })
                    }, callbackScope: this})
                }
                this.SelectedNum.setAlpha(1);
                break;
            case "WholeNumbers":
                if(Number(this.MyNumberLines[0].text) > 0){
                    this.AddNumberInStartAndTween()
                    this.AddVericleLinesInStartAndTween()
                    this.AddZoomInInStartAndTween();
                    this.game.soundManager.play(Constants.Sounds.Click)
                    this.SelectedNum.setAlpha(0);
                    this.time.addEvent({ delay: 1000, callback: ()=>{
                        this.MyNumberLines.map((numbers)=>{
                            if(this.GameOperationStatus == "RationalNumbers"){
                                if(numbers.text.split("\n")[0] == this.SelectedNumForOperation){
                                    this.SelectedNum.x = numbers.x;
                                    this.SelectedNum.y = numbers.y + 25*this.globalScale;
                                    this.SelectedNum.xOriginal = numbers.xOriginal;
                                    this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                                    this.SelectedNum.setAlpha(1);
                                    
                                }
                            }
                            else{
                                if(numbers.text == this.SelectedNumForOperation){
                                    this.SelectedNum.x = numbers.x;
                                    this.SelectedNum.y = numbers.y + 25*this.globalScale;
                                    this.SelectedNum.xOriginal = numbers.xOriginal;
                                    this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                                    this.SelectedNum.setAlpha(1);
                                    
                                }
                            }
                        })
                    }, callbackScope: this})
                }
                this.SelectedNum.setAlpha(1);
                break;
            default:
                break;
        }
    }

    afterResize(){
        this.NextBtn.x = this.screenWidth * this.scaleX - 40 * this.globalScale
        this.NextBtn.xOriginal = this.screenWidth * this.scaleX - 40 * this.globalScale
        this.PrevBtn.x = -1 * this.scaleX + 40 * this.globalScale
        this.PrevBtn.xOriginal = -1 * this.scaleX + 40 * this.globalScale
        this.questionbg.x = -1 * this.scaleX + 541 * this.globalScale
        this.questionbg.xOriginal = -1 * this.scaleX + 541 * this.globalScale
        this.pointsAndTimerBG.x = this.screenWidth * this.scaleX - 225 * this.globalScale;
        this.pointsAndTimerBG.xOriginal = this.screenWidth * this.scaleX - 225 * this.globalScale;
        this.PointsText.x = this.screenWidth * this.scaleX - 440 * this.globalScale;
        this.PointsText.xOriginal = this.screenWidth * this.scaleX - 440 * this.globalScale;
        this.TimerText.x =  this.screenWidth * this.scaleX - 190 * this.globalScale;
        this.TimerText.xOriginal =  this.screenWidth * this.scaleX - 190 * this.globalScale;
        this.pointsAndTimerSeprator.x =  this.screenWidth * this.scaleX - 285 * this.globalScale;
        this.pointsAndTimerSeprator.xOriginal =  this.screenWidth * this.scaleX - 285 * this.globalScale;
        this.Timer.x = this.screenWidth * this.scaleX - 65 * this.globalScale;
        this.Timer.xOriginal = this.screenWidth * this.scaleX - 65 * this.globalScale;
        this.Points.x = this.screenWidth * this.scaleX - 340 * this.globalScale;
        this.Points.xOriginal = this.screenWidth * this.scaleX - 340 * this.globalScale;
        this.PerformOperations.x = -1 * this.scaleX + 60 * this.globalScale
        this.PerformOperations.xOriginal = -1 * this.scaleX + 60 * this.globalScale
        this.PerformOperations.x = -1 * this.scaleX + 60 * this.globalScale
        if(this.OperationStatus == "Add"){
            this.RandomNumText.x = -1 * this.scaleX + 670 * this.globalScale
            this.RandomNumText.xOriginal = -1 * this.scaleX + 670 * this.globalScale
            this.QuesHorizontalLine.x = -1 * this.scaleX + 670 * this.globalScale;
        }
        else if(this.OperationStatus == "Substract"){
            this.RandomNumText.x = -1 * this.scaleX + 780 * this.globalScale
            this.RandomNumText.xOriginal = -1 * this.scaleX + 780 * this.globalScale
            this.QuesHorizontalLine.x = -1 * this.scaleX + 780 * this.globalScale;
        }
        else if(this.OperationStatus == "Division"){
            this.RandomNumText.x = -1 * this.scaleX + 690 * this.globalScale
            this.RandomNumText.xOriginal = -1 * this.scaleX + 690 * this.globalScale
        }
        else if(this.OperationStatus == "Multiply"){
            this.RandomNumText.x = -1 * this.scaleX + 720 * this.globalScale
            this.RandomNumText.xOriginal = -1 * this.scaleX + 720 * this.globalScale
        }
        this.multiplierDropdown.dropDownImg.x = this.screenWidth * this.scaleX - 106 * this.globalScale;
        this.multiplierDropdown.dropDownImg.xOriginal = this.screenWidth * this.scaleX - 106 * this.globalScale;
        this.multiplierDropdown.dropDownArrow.x = this.screenWidth * this.scaleX - 106 * this.globalScale;
        this.multiplierDropdown.dropDownArrow.xOriginal = this.screenWidth * this.scaleX - 106 * this.globalScale;
        this.multiplierDropdown.dropDownArrowCollapse.x = this.screenWidth * this.scaleX - 106 * this.globalScale;
        this.multiplierDropdown.dropDownArrowCollapse.xOriginal = this.screenWidth * this.scaleX - 106 * this.globalScale;
        this.multiplierDropdown.options.forEach((option, index) => {
            option.image.x = this.screenWidth * this.scaleX - 110 * this.globalScale;
            option.image.xOriginal = this.screenWidth * this.scaleX - 110 * this.globalScale;
            option.text.x = this.screenWidth * this.scaleX - 110 * this.globalScale;
            option.text.xOriginal = this.screenWidth * this.scaleX - 110 * this.globalScale;
        })

        this.resetBtn.x = -1 * this.scaleX + 75 * this.globalScale
        this.resetBtn.xOriginal = -1 * this.scaleX + 75 * this.globalScale
    }

    CreateQuestionHeader(){
        this.QueationPanel = this.add.text(110,0 ,"Perform Operations",{font: "45px Roboto-Bold", fill: "#ffffff", align: "center"}).setOrigin(0,0.5)
        this.QueationPanel.followObject = this.header.logoImg
        this.questionbg = this.add.image(430,160, 'questionbg').setOrigin(0.5)
        this.questionbg.followObject = this.header.logoImg

        this.PerformOperations = this.add.text(-485,0 ,"Select a Number Type",{font: "40px Roboto-Bold", fill: "#ffffff", align: "left",wordWrap: { width: this.questionbg.width * .9 , height: this.questionbg.height * .9 }}).setOrigin(0,0.5)
        this.PerformOperations.followObject = this.questionbg
        this.RandomNumText = this.add.text(0,-25,"",{font: "55px Roboto-Bold", fill: "#D2F900", align: "center",wordWrap: { height: this.questionbg.height * .8, lineSpacing : -50 }}).setOrigin(0.5,.4);
        this.RandomNumText.followObject = this.questionbg
        this.QuesHorizontalLine = this.add.image(0,-10,"HorizontalLine").setOrigin(0.5).setScale(.8).setTint(0xD2F900).setVisible(false);
        this.QuesHorizontalLine.followObject = this.questionbg;
    }

    AddPopup(){
        this.container = this.add.container(0, this.screenHeight).setDepth(1000).setAlpha(0)
        this.panel = this.add.image(this.screenWidth*.5, this.screenHeight*.5, 'popup').setOrigin(0.5).setDepth(1000)
        this.text = this.add.text(this.screenWidth*.5, this.screenHeight*.5, "CHOOSE AN OPERATION",
            {
                fontSize: '40px',
                fontFamily: 'Roboto-Bold',
                color: '#000000',
                align: 'center',
                lineSpacing: 10,
                wordWrap: { width: this.panel.width * .8 }
            }).setOrigin(0.5)
        this.overlay = this.add.rectangle(this.screenWidth * .5, this.screenHeight * .5, this.screenWidth, this.screenHeight, 0x000000).setDepth(100).setOrigin(0.5).setAlpha(0).setInteractive()
        this.container.add([this.panel, this.text])
        this.container.yOriginal = this.container.y
    }

    UpdateNumbersOnZoomIn(zoomin) {
        let FirstEle={}, LastEle={}, FirstEleVerticalLine, LastEleVerticalLine,FirstEleHorizontalLine,LastEleHorizontalLine;
        this.MyNumberLines.filter((number, i) => {
            if(this.GameOperationStatus == "RationalNumbers"){
                let num = number.text.split("\n")[0];
                let den = number.text.split("\n")[1];
                if (num == zoomin.startingIndex) {
                    FirstEle.text = [num , den];
                    LastEle.text = [this.MyNumberLines[i + 1].text.split("\n")[0], this.MyNumberLines[i + 1].text.split("\n")[1] ]
                    FirstEleVerticalLine = this.MyVerticleLines[i];
                    LastEleVerticalLine = this.MyVerticleLines[i + 1];
                    FirstEleHorizontalLine = this.MyHorizontalLines[i];
                    LastEleHorizontalLine = this.MyHorizontalLines[i + 1];
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
                    FirstEleHorizontalLine = this.MyHorizontalLines[i];
                    LastEleHorizontalLine = this.MyHorizontalLines[i + 1];
                }
            }
        })
        let FirstEleClone = this.add.text(FirstEle.xOriginal, 70, FirstEle.text, {
            font: "40px Roboto-Bold",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(.5).setDepth(1)
        let LastEleClone = this.add.text(LastEle.xOriginal, 70, LastEle.text, {
            font: "40px Roboto-Bold",
            fill: "#ffffff",
            align: "center"
        }).setOrigin(.5).setDepth(1)
        let FirstVerticleLineClone = this.add.image(FirstEleVerticalLine.xOriginal, 0, 'VerticleLine').setOrigin(.5).setDepth(1)
        let LastVerticleLineClone = this.add.image(LastEleVerticalLine.xOriginal, 0, 'VerticleLine').setOrigin(.5).setDepth(1)
        let FirstHorizontalLineClone = this.add.image(FirstEleHorizontalLine.xOriginal, 70, 'HorizontalLine').setOrigin(.5).setDepth(1).setVisible(false)
        let LastHorizontalLineClone = this.add.image(LastEleHorizontalLine.xOriginal, 70, 'HorizontalLine').setOrigin(.5).setDepth(1).setVisible(false)
        if(this.GameOperationStatus =="RationalNumbers"){
            FirstHorizontalLineClone.visible = true;
            LastHorizontalLineClone.visible = true;
        }
        FirstHorizontalLineClone.followObject = LastHorizontalLineClone.followObject = FirstVerticleLineClone.followObject = LastVerticleLineClone.followObject = FirstEleClone.followObject = LastEleClone.followObject = this.line
        this.resizeElement(FirstEleClone)
        this.resizeElement(LastEleClone)
        this.resizeElement(FirstVerticleLineClone)
        this.resizeElement(LastVerticleLineClone)
        this.resizeElement(FirstHorizontalLineClone)
        this.resizeElement(LastHorizontalLineClone)
        this.hideShowNumberLine(false, zoomin);
        this.ZoomInAnimation(FirstEleClone, LastEleClone, FirstVerticleLineClone, LastVerticleLineClone, zoomin,FirstHorizontalLineClone,LastHorizontalLineClone );
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
                targets: [numbers, this.MyVerticleLines[i],this.MyHorizontalLines[i]],
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

  
    updateNumberLineOnZoom(zoomin) {
        let startingIndex = zoomin.startingIndex;
        let endingIndex = zoomin.endingIndex;
        let diff = (endingIndex - startingIndex) / 10;
        this.MyNumberLines.map((numbers, i) => {
            if(this.GameOperationStatus == "RealNumbers"){
                let result = this.addNum(Number(startingIndex) + diff * i,12)
                numbers.setText(result);
            }
            else if(this.GameOperationStatus == "RationalNumbers"){
                let result = [((startingIndex*10) + i), zoomin.den*10];
                numbers.setText(result);
            }
            else{
                numbers.setText(Number(startingIndex) + diff * i);
            }
        })
    }

    ZoomInAnimation(FirstEleClone,LastEleClone,FirstEleVerticalLine,LastEleVerticalLine,zoomin,FirstHorizontalLineClone,LastHorizontalLineClone ){
        this.tweens.add({
            targets: [FirstEleClone,FirstEleVerticalLine,FirstHorizontalLineClone],
            x: this.MyNumberLines[1].x - 139.7*this.globalScale,
            xOriginal: this.MyNumberLines[1].xOriginal  - 139.7,
            ease: 'Quad',
            duration: 500,
            delay: 500,
            onComplete: ()=>{
            }
            // repeat: -1
        },this)
        this.tweens.add({
            targets: [LastEleClone,LastEleVerticalLine,LastHorizontalLineClone],
            x: this.MyNumberLines[9].x + 139.7*this.globalScale,
            xOriginal: this.MyNumberLines[9].xOriginal + 139.7,
            ease: 'Quad',
            duration: 500,
            delay: 500,
            onComplete: ()=>{
                this.SelectedNum.setAlpha(0)
                this.hideShowNumberLine(true,zoomin,{
                    FirstEleClone:FirstEleClone,
                    FirstEleVerticalLine:FirstEleVerticalLine,
                    LastEleClone:LastEleClone,
                    LastEleVerticalLine:LastEleVerticalLine,
                    FirstHroizontalLineClone: FirstHorizontalLineClone,
                    LastHroizontalLineClone: LastHorizontalLineClone});
            }
            // repeat: -1
        },this)
    }

    AddNumberInStartAndTween(){
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
        }).setOrigin(0.5).setDepth(1);
        AddnumberOnFirst.followObject = this.line
        AddnumberOnFirst.setInteractive({useHandCursor:true}).on('pointerup',()=>{
            this.disableOperationBtn()
            this.OperationBtns.map((btns)=>{
                btns.setTint(0x605c5c)
            })
            if(!this.selected){
                this.selected = true;
                this.SetSelectedNumPos(this.SelectedNum,AddnumberOnFirst)
            }
            else{
                this.PerformOperationWithSelectedNum(AddnumberOnFirst)
            }
        })
        this.resizeElement(AddnumberOnFirst)
        let ToDeleteNum = this.MyNumberLines.pop();
        ToDeleteNum.destroy()
        this.MyNumberLines.map((numbers)=>{
            this.OnNextTween = this.tweens.add({
                targets: numbers,
                x: numbers.x + 139.7*this.globalScale,
                xOriginal: numbers.xOriginal + 139.7,
                ease: 'Quad',
                duration: 500,
                delay: 0,
                onComplete: ()=>{
                    if(numbers.text == this.SelectedNumForOperation){
                        this.SelectedNumForOperationObj = numbers;
                    }
                }
                // repeat: -1
            },this)
        })
        this.OnNextnewNumberTween = this.tweens.add({
            targets: AddnumberOnFirst,
            x: AddnumberOnFirst.x + 139.7*this.globalScale,
            xOriginal: AddnumberOnFirst.xOriginal + 139.7,
            ease: 'Quad',
            duration: 500,
            delay: 0,
            onComplete: ()=>{
                this.MyNumberLines.unshift( AddnumberOnFirst);
                this.NextBtn.setInteractive({useHandCursor:true});
                this.PrevBtn.setInteractive({useHandCursor:true});
            }
            // repeat: -1
        },this)
    }

    AddVericleLinesInStartAndTween(){
        let AddVerticleLineOnStart = this.add.image(-(this.line.width/2) - 20,0 ,"VerticleLine").setOrigin(0.5).setDepth(1);
        let AddHorizontalLineOnStart = this.add.image(-(this.line.width/2) - 20,70 ,"HorizontalLine").setOrigin(0.5).setVisible(false).setDepth(1);
        if(this.GameOperationStatus =="RationalNumbers"){
            AddHorizontalLineOnStart.visible = true;
        }
        AddHorizontalLineOnStart.followObject = AddVerticleLineOnStart.followObject = this.line
        // AddVerticleLineOnStart.mask = new Phaser.Display.Masks.GeometryMask(this, this.maskShape);
        this.resizeElement(AddVerticleLineOnStart)
        let ToDeletAddVerticleLineOnStart = this.MyVerticleLines.pop();
        ToDeletAddVerticleLineOnStart.destroy(true)
        this.resizeElement(AddHorizontalLineOnStart)
        let ToDeletHorizontalLineOnStart = this.MyHorizontalLines.pop();
        ToDeletHorizontalLineOnStart.destroy(true)
        // ToDeleteNum = undefined
        // console.log(this.MyNumberLines.length,ToDeleteNum)
        
        this.MyVerticleLines.map((AddVerticleLineOnStart)=>{
            this.OnNextTween = this.tweens.add({
                targets: AddVerticleLineOnStart,
                x: AddVerticleLineOnStart.x + 139.7*this.globalScale,
                xOriginal: AddVerticleLineOnStart.xOriginal + 139.7,
                ease: 'Quad',
                duration: 500,
                delay: 0,
                onComplete: ()=>{
                    // this.OnNextTween.destroy()
                }
                // repeat: -1
            },this)
        })
        this.MyHorizontalLines.map((AddHorizontalLineOnStart)=>{
            this.OnNextTween = this.tweens.add({
                targets: AddHorizontalLineOnStart,
                x: AddHorizontalLineOnStart.x + 139.7*this.globalScale,
                xOriginal: AddHorizontalLineOnStart.xOriginal + 139.7,
                ease: 'Quad',
                duration: 500,
                delay: 0,
                onComplete: ()=>{
                    // this.OnNextTween.destroy()
                }
                // repeat: -1
            },this)
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
                this.MyHorizontalLines.unshift(AddHorizontalLineOnStart)
            }
            // repeat: -1
        }, this)
    }

    AddZoomInInStartAndTween() {
        let AddZoomInOnStart = this.add.image(-(this.line.width / 2) + 50, -35, "zoomin").setOrigin(0.5).setDepth(1).setInteractive({
            useHandCursor: true
        })
        AddZoomInOnStart.followObject = this.line
        // AddZoomInOnStart.mask = new Phaser.Display.Masks.GeometryMask(this, this.maskShape);
        this.resizeElement(AddZoomInOnStart)
        let ToDeletZoomInOnStart = this.MyZoomIn.pop();
        ToDeletZoomInOnStart.destroy(true)
        // ToDeleteNum = undefined
        // console.log(this.MyNumberLines.length,ToDeleteNum)

        this.MyZoomIn.map((ZoomIn) => {
            this.OnNextTween = this.tweens.add({
                targets: ZoomIn,
                x: ZoomIn.x + 139.7 * this.globalScale,
                xOriginal: ZoomIn.xOriginal + 139.7,
                ease: 'Quad',
                duration: 500,
                delay: 0,
                onComplete: () => {
                    // this.OnNextTween.destroy()
                }
                // repeat: -1
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

    AddNumberInLastAndTween(){
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
        }).setOrigin(0.5).setDepth(1);
        AddnumberOnLast.followObject = this.line
        AddnumberOnLast.setInteractive({useHandCursor:true}).on('pointerup',()=>{
            this.disableOperationBtn()
            this.OperationBtns.map((btns)=>{
                btns.setTint(0x605c5c)
            })
            if(!this.selected){
                this.selected = true;
                this.SetSelectedNumPos(this.SelectedNum,AddnumberOnLast)
            }
            else{
                this.PerformOperationWithSelectedNum(AddnumberOnLast)
            }
        })
        // AddnumberOnLast.mask = new Phaser.Display.Masks.GeometryMask(this, this.maskShape);
        this.resizeElement(AddnumberOnLast)
        let ToDeleteNum = this.MyNumberLines.shift();
        ToDeleteNum.destroy()

        this.MyNumberLines.map((numbers)=>{
            this.OnNextTween = this.tweens.add({
                targets: numbers,
                x: numbers.x -139.7*this.globalScale,
                xOriginal: numbers.xOriginal - 139.7,
                ease: 'Quad',
                duration: 500,
                delay: 0,
                onComplete: ()=>{
                    if(numbers.text == this.SelectedNumForOperation){
                        this.SelectedNumForOperationObj = numbers;
                    }
                }
                // repeat: -1
            },this)
        })
        this.OnNextnewNumberTween = this.tweens.add({
            targets: AddnumberOnLast,
            x: AddnumberOnLast.x -139.7*this.globalScale,
            xOriginal: AddnumberOnLast.xOriginal - 139.7,
            ease: 'Quad',
            duration: 500,
            delay: 0,
            onComplete: ()=>{
                this.MyNumberLines.push(AddnumberOnLast)
                this.NextBtn.setInteractive({useHandCursor:true});
                this.PrevBtn.setInteractive({useHandCursor:true});
            }
            // repeat: -1
        },this)
    }

    AddVericleLinesInLastAndTween(){
        let AddVerticleLineOnLast = this.add.image(-(this.line.width/2) + 260 + this.MyNumberLines.length*140,0 ,"VerticleLine").setOrigin(0.5).setDepth(1);
        let AddHorizontalLineOnLast = this.add.image(-(this.line.width/2) + 260 + this.MyNumberLines.length*140,70 ,"HorizontalLine").setOrigin(0.5).setVisible(false).setDepth(1);
        if(this.GameOperationStatus =="RationalNumbers"){
            AddHorizontalLineOnLast.visible = true;
        }
        AddHorizontalLineOnLast.followObject = AddVerticleLineOnLast.followObject = this.line
        // AddVerticleLineOnLast.mask = new Phaser.Display.Masks.GeometryMask(this, this.maskShape);
        this.resizeElement(AddVerticleLineOnLast)
        let ToDeletAddVerticleLineOnLast = this.MyVerticleLines.shift();
        ToDeletAddVerticleLineOnLast.destroy(true)
        this.resizeElement(AddHorizontalLineOnLast)
        let ToDeletAddHorizontalLineOnLast = this.MyHorizontalLines.shift();
        ToDeletAddHorizontalLineOnLast.destroy(true)
        // ToDeleteNum = undefined
        // console.log(this.MyNumberLines.length,ToDeleteNum)
        
        this.MyVerticleLines.map((AddVerticleLineOnLast)=>{
            this.OnNextTween = this.tweens.add({
                targets: AddVerticleLineOnLast,
                x: AddVerticleLineOnLast.x -139.7*this.globalScale,
                xOriginal: AddVerticleLineOnLast.xOriginal - 139.7,
                ease: 'Quad',
                duration: 500,
                delay: 0,
                onComplete: ()=>{
                    // this.OnNextTween.destroy()
                }
                // repeat: -1
            },this)
        })
        this.MyHorizontalLines.map((AddHorizontalLineOnLast)=>{
            this.OnNextTween = this.tweens.add({
                targets: AddHorizontalLineOnLast,
                x: AddHorizontalLineOnLast.x -139.7*this.globalScale,
                xOriginal: AddHorizontalLineOnLast.xOriginal - 139.7,
                ease: 'Quad',
                duration: 500,
                delay: 0,
                onComplete: ()=>{
                    // this.OnNextTween.destroy()
                }
                // repeat: -1
            },this)
        })
        this.OnNextnewNumberTween = this.tweens.add({
            targets: AddVerticleLineOnLast,
            x: AddVerticleLineOnLast.x -139.7*this.globalScale,
            xOriginal: AddVerticleLineOnLast.xOriginal - 139.7,
            ease: 'Quad',
            duration: 500,
            delay: 0,
            onComplete: ()=>{
                this.MyVerticleLines.push(AddVerticleLineOnLast)
            }
            // repeat: -1
        },this)
        this.OnNextnewNumberTween = this.tweens.add({
            targets: AddHorizontalLineOnLast,
            x: AddHorizontalLineOnLast.x -139.7*this.globalScale,
            xOriginal: AddHorizontalLineOnLast.xOriginal - 139.7,
            ease: 'Quad',
            duration: 500,
            delay: 0,
            onComplete: ()=>{
                this.MyHorizontalLines.push(AddHorizontalLineOnLast)
            }
            // repeat: -1
        },this)
    }

    AddZoomInInLastAndTween() {
        let AddZoomInOnLast = this.add.image(-(this.line.width / 2) + 190 + this.MyNumberLines.length * 140, -35, "zoomin").setOrigin(0.5).setDepth(1).setInteractive({
            useHandCursor: true
        })
        AddZoomInOnLast.followObject = this.line
        // AddZoomInOnLast.mask = new Phaser.Display.Masks.GeometryMask(this, this.maskShape);
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
                delay: 0,
                onComplete: () => {
                    // this.OnNextTween.destroy()
                }
                // repeat: -1
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
                        // repeat: -1
                    }, this)
                }
                // repeat: -1
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
                        delay: 0,
                        onComplete: () => {
                            // this.OnNextTween.destroy()
                        }
                        // repeat: -1
                    }, this)
                }
                // repeat: -1
            }, this)
        })
        let MyHorizontalLinesOriginalX = []
        this.MyHorizontalLines.map((lines, i) => {
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
                        delay: 0,
                        onComplete: () => {
                            // this.OnNextTween.destroy()
                        }
                        // repeat: -1
                    }, this)
                }
                // repeat: -1
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
                        // repeat: -1
                    }, this)
                }
                // repeat: -1
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
        this.MyHorizontalLines.map((lines)=>{
            lines.visible = true;
        })
    }

    hideHorizontalLines(){
        this.MyHorizontalLines.map((lines)=>{
            lines.visible = false;
        })
    }


    CreateNumberLineNumberSelections(){
        this.NumberOperationContainer = this.add.container(230*this.globalScale,0);
        this.NumberOperationBg = this.add.image(this.screenWidth*.43,this.screenHeight*.49 ,"NumberOperationBg").setOrigin(0.5)
        this.NumberOperationBg.name = "NumberOperationBg"
        this.NumberLineBtns = [];
        this.RealNumberbtn = this.add.image(-210,-100 ,"questionbtn").setOrigin(0.5).setScale(.64).setInteractive({ useHandCursor: true }).on('pointerup', ()=>{
            this.GameStarted && (this.AddOperationAndNumSelectionTween())            
            this.ShowRealNumbers();
            this.game.soundManager.play(Constants.Sounds.Click)
        }).setVisible(false);
        this.NumberLineBtns.push(this.RealNumberbtn)
        this.RationalNumberbtn = this.add.image(-225,70 ,"questionbtn").setOrigin(0.5).setScale(.64).setInteractive({ useHandCursor: true }).on('pointerup', ()=>{            
            this.GameStarted && (this.AddOperationAndNumSelectionTween())            
            this.RealNumberSelection()
            this.ShowZoomIn();
            this.dropDownContainer.visible = true;
            this.game.soundManager.play(Constants.Sounds.Click)
        });;
        this.NumberLineBtns.push(this.RationalNumberbtn)
        this.IntegerNumberbtn = this.add.image(225,-60 ,"questionbtn").setOrigin(0.5).setScale(.64).setInteractive({ useHandCursor: true }).on('pointerup', ()=>{   
            this.GameStarted && (this.AddOperationAndNumSelectionTween())            
            this.ZoomOutIntegerUpto = 1;
            this.ShowIntegerNumbers();
            this.hideHorizontalLines();
            this.dropDownContainer.visible = false;
            this.game.soundManager.play(Constants.Sounds.Click)
        });
        this.NumberLineBtns.push(this.IntegerNumberbtn)
        this.WholeNumberbtn = this.add.image(-225 , -60,"questionbtn").setOrigin(0.5).setScale(.64).setInteractive({ useHandCursor: true }).on('pointerup', ()=>{
            this.GameStarted && (this.AddOperationAndNumSelectionTween())            
            this.ZoomOutIntegerUpto = 1;
            this.ShowWholeNumbers();
            this.hideHorizontalLines();
            this.dropDownContainer.visible = false;
            this.game.soundManager.play(Constants.Sounds.Click)
        });
        this.NumberLineBtns.push(this.WholeNumberbtn)
        this.NaturalNumberbtn = this.add.image(225,70,"questionbtn").setOrigin(0.5).setScale(.64).setInteractive({ useHandCursor: true }).on('pointerup', ()=>{
            this.GameStarted && (this.AddOperationAndNumSelectionTween())            
            this.ZoomOutIntegerUpto = 1;
            this.ShowNaturalNumbers();
            this.hideHorizontalLines();
            this.dropDownContainer.visible = false;
            this.game.soundManager.play(Constants.Sounds.Click)
        });
        this.NumberLineBtns.push(this.NaturalNumberbtn)
        this.RealNumberbtn.followObject = this.RationalNumberbtn.followObject = this.IntegerNumberbtn.followObject = this.WholeNumberbtn.followObject = this.NaturalNumberbtn.followObject = this.NumberOperationBg;

        this.RealNumberbtn.input.hitArea.setTo(30*this.scaleX, 25*this.scaleY, 560, 150);
        this.RationalNumberbtn.input.hitArea.setTo(30*this.scaleX, 25*this.scaleY, 560, 150);
        this.IntegerNumberbtn.input.hitArea.setTo(30*this.scaleX, 25*this.scaleY, 560, 150);
        this.WholeNumberbtn.input.hitArea.setTo(30*this.scaleX, 25*this.scaleY, 560, 150);
        this.NaturalNumberbtn.input.hitArea.setTo(30*this.scaleX, 25*this.scaleY, 560, 150);
        this.NumberLineSelectedBtns = [];
        this.RealNumberbtnSelected = this.add.image(-210,-125 ,"selectedbtn").setOrigin(0.5).setScale(.65).setAlpha(0).setVisible(false)
        this.NumberLineSelectedBtns.push(this.RealNumberbtnSelected)
        this.RationalNumberbtnSelected = this.add.image(-225,70 ,"selectedbtn").setOrigin(0.5).setScale(.65).setAlpha(0)
        this.NumberLineSelectedBtns.push(this.RationalNumberbtnSelected)
        this.IntegerNumberbtnSelected = this.add.image(225,-60 ,"selectedbtn").setOrigin(0.5).setScale(.65).setAlpha(0)
        this.NumberLineSelectedBtns.push(this.IntegerNumberbtnSelected)
        this.WholeNumberbtnSelected = this.add.image(-225,-60 ,"selectedbtn").setOrigin(0.5).setScale(.65).setAlpha(0)
        this.NumberLineSelectedBtns.push(this.WholeNumberbtnSelected)
        this.NaturalNumberbtnSelected = this.add.image(225,70,"selectedbtn").setOrigin(0.5).setScale(.65).setAlpha(0)
        this.NumberLineSelectedBtns.push(this.NaturalNumberbtnSelected)

        this.RealNumberbtnSelected.followObject = this.RationalNumberbtnSelected.followObject = this.IntegerNumberbtnSelected.followObject = this.WholeNumberbtnSelected.followObject = this.NaturalNumberbtnSelected.followObject = this.NumberOperationBg;

        this.NumberLineSelectedBtnsText = [];
        this.RealNumberbtnText = this.add.text(0,-5 ,"Real Numbers",{font: "40px Roboto-Bold", fill: "#ffffff", align: "center"}).setOrigin(0.5).setVisible(false)
        this.RationalNumberbtnText = this.add.text(0,-5 ,"Rational Numbers",{font: "35px Roboto-Bold", fill: "#ffffff", align: "center"}).setOrigin(0.5)
        this.IntegerNumberbtnText = this.add.text(0,-5 ,"Integers",{font: "35px Roboto-Bold", fill: "#ffffff", align: "center"}).setOrigin(0.5)
        this.WholeNumberbtnText = this.add.text(0,-5 ,"Whole Numbers",{font: "35px Roboto-Bold", fill: "#ffffff", align: "center"}).setOrigin(0.5)
        this.NaturalNumberbtnText = this.add.text(0,-5 ,"Natural Numbers",{font: "35px Roboto-Bold", fill: "#ffffff", align: "center"}).setOrigin(0.5)

        this.NumberLineSelectedBtnsText.push(this.RealNumberbtnText);
        this.NumberLineSelectedBtnsText.push(this.RationalNumberbtnText);
        this.NumberLineSelectedBtnsText.push(this.IntegerNumberbtnText);
        this.NumberLineSelectedBtnsText.push(this.WholeNumberbtnText);
        this.NumberLineSelectedBtnsText.push(this.NaturalNumberbtnText);

        this.RealNumberbtnText.followObject = this.RealNumberbtn;
        this.RationalNumberbtnText.followObject = this.RationalNumberbtn;
        this.IntegerNumberbtnText.followObject = this.IntegerNumberbtn;
        this.WholeNumberbtnText.followObject = this.WholeNumberbtn;
        this.NaturalNumberbtnText.followObject = this.NaturalNumberbtn;
        
        this.NumberOperationContainer.add([this.NumberOperationBg,this.RealNumberbtn,this.RationalNumberbtn,this.IntegerNumberbtn,this.WholeNumberbtn,this.NaturalNumberbtn])
        this.NumberOperationContainer.add([this.RealNumberbtnSelected,this.RationalNumberbtnSelected,this.IntegerNumberbtnSelected,this.WholeNumberbtnSelected,this.NaturalNumberbtnSelected])
        this.NumberOperationContainer.add([this.RealNumberbtnText,this.RationalNumberbtnText,this.IntegerNumberbtnText,this.WholeNumberbtnText,this.NaturalNumberbtnText])

        
        this.dropDownContainer = this.add.container(0,0);
        this.dropDownMarker = this.add.image(-230,160,'dropdown').setOrigin(.5).setScale(.75);
        this.dropDownOption1 = this.add.image(0,55,'convert_btn').setOrigin(.5).setInteractive({useHandCursor:true});
        this.dropDownOption2 = this.add.image(0,55,'convert_btn').setOrigin(.5).setDepth(1).setInteractive({useHandCursor:true});
        this.dropDownMarker.name = 'dropdown'
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
        this.dropDownMarker.followObject = this.NumberOperationBg
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

    //     this.tweens.add({
    //         targets: [this.dropDownOption1,this.dropDownOption2],
    //         scale: .75 * this.globalScale,
    //         ease: "linear",
    //         duration: 500,
    //         yoyo: true,
    //         delay : 200,
    //         repeat: -1
    //     })
    // this.tweens.add({
    //     targets: [this.dropDownMarker],
    //     scale: 1 * this.globalScale,
    //     ease: "linear",
    //     duration: 500,
    //     yoyo: true,
    //     delay : 200,
    //     repeat: -1
    // })
    // this.tweens.add({
    //     targets: [this.dropDownOption1Text,this.dropDownOption2Text],
    //     scale: 1.5 * this.globalScale,
    //     ease: "linear",
    //     duration: 500,
    //     yoyo: true,
    //     delay : 200,
    //     repeat: -1
    // })
    }

    showDropDownOption(){
        this.dropDownOption1.visible = false;
        this.dropDownOption1Text.visible = false;
        this.dropDownOption2.visible = true;
        this.dropDownOption2Text.visible = true;
        this.ShowRealNumbers();
        this.game.soundManager.play(Constants.Sounds.Click)
    }

    showDropDownOption2(){
        this.dropDownOption1.visible = true;
        this.dropDownOption1Text.visible = true;
        this.dropDownOption2.visible = false;
        this.dropDownOption2Text.visible = false;
        this.ShowRationalNumbers();
        this.game.soundManager.play(Constants.Sounds.Click)
    }

    AddOperations(){
        this.OperationContainer = this.add.container(-350*this.globalScale,0);
        this.OperationBg = this.add.image(630,0 ,"OperationsBg").setOrigin(0.5)
        this.OperationBg.name = "OperationBg"
        this.OperationBtns = [];
        this.OperationBg.followObject = this.NumberOperationBg;
        this.OperationText = this.add.text(0,-205,"Operations",{font: "40px Roboto-Bold", fill: "#ffffff", align: "center"}).setOrigin(.5);
        this.OperationText.followObject = this.OperationBg
        this.AdditionBtn = this.add.image(-70,-53 ,"Plus").setOrigin(0.5).setScale(.8).setInteractive({ useHandCursor: true }).on('pointerup', ()=>{
            this.OperationStatus = "Add"
            this.onAddition()
            this.disableNumberCategory()
            this.game.soundManager.play(Constants.Sounds.Click)
        });
        this.OperationBtns.push(this.AdditionBtn)
        this.SubstractionBtn = this.add.image(70,-53 ,"Minus").setOrigin(0.5).setScale(.8).setInteractive({ useHandCursor: true }).on('pointerup', ()=>{
            this.OperationStatus = "Substract"
            this.onSubstaction()
            this.disableNumberCategory()
            this.game.soundManager.play(Constants.Sounds.Click)
        });
        this.OperationBtns.push(this.SubstractionBtn)
        this.DivisionBtn = this.add.image(-70,75 ,"Divide").setOrigin(0.5).setScale(.8).setInteractive({ useHandCursor: true }).on('pointerup', ()=>{
            this.OperationStatus = "Division"
            this.onDivision()
            this.disableNumberCategory()
            this.game.soundManager.play(Constants.Sounds.Click)
        });
        this.OperationBtns.push(this.DivisionBtn)
        this.MultiplicationBtn = this.add.image(70,75 ,"Multiply").setOrigin(0.5).setScale(.8).setInteractive({ useHandCursor: true }).on('pointerup', ()=>{
            this.OperationStatus = "Multiply"
            this.onMultiplicationn()
            this.disableNumberCategory()
            this.game.soundManager.play(Constants.Sounds.Click)
        });
        this.OperationBtns.push(this.MultiplicationBtn)
        this.AdditionBtn.followObject = this.SubstractionBtn.followObject = this.DivisionBtn.followObject = this.MultiplicationBtn.followObject = this.OperationBg;

        this.OperationBtnsSelected = []
        this.AdditionBtnSelected = this.add.image(-70,-53 ,"Plus_active").setOrigin(0.5).setScale(.8).setAlpha(0);
        this.OperationBtnsSelected.push(this.AdditionBtnSelected);
        this.SubstractionBtnSelected = this.add.image(70,-53  ,"Minus_active").setOrigin(0.5).setScale(.8).setAlpha(0);
        this.OperationBtnsSelected.push(this.SubstractionBtnSelected);
        this.DivisionBtnSelected = this.add.image(-70,75 ,"Divide_active").setOrigin(0.5).setScale(.8).setAlpha(0);
        this.OperationBtnsSelected.push(this.DivisionBtnSelected);
        this.MultiplicationBtnSelected = this.add.image(70,75 ,"Multiply_active").setOrigin(0.5).setScale(.8).setAlpha(0);
        this.OperationBtnsSelected.push(this.MultiplicationBtnSelected);
        this.AdditionBtnSelected.followObject = this.SubstractionBtnSelected.followObject = this.DivisionBtnSelected.followObject = this.MultiplicationBtnSelected.followObject = this.OperationBg;

        this.OperationContainer.add([this.OperationBg,this.AdditionBtn,this.SubstractionBtn,this.DivisionBtn,this.MultiplicationBtn])
        this.OperationContainer.add([this.AdditionBtnSelected,this.SubstractionBtnSelected,this.DivisionBtnSelected,this.MultiplicationBtnSelected,this.OperationText])
        this.OperationContainer.setAlpha(0);

    }

    onAddition(){
        this.PerformOperations.setText("Choose a number from the number line below")
        for(let i=0;i<this.OperationBtnsSelected.length;i++){
            this.OperationBtnsSelected[i].setAlpha(0);
            this.OperationBtns[i].setAlpha(1).setInteractive({ useHandCursor: true })
        }

        this.AdditionBtn.disableInteractive()
        this.AdditionBtn.setAlpha(0);
        this.AdditionBtnSelected.setAlpha(1);
        this.zoomOut.setInteractive({ useHandCursor: true })
        this.EnableNumberLine()
        this.PrevBtn.setInteractive({useHandCursor:true})
        this.NextBtn.setInteractive({useHandCursor:true})
        this.MyZoomIn.map((zoomIn)=>{
            zoomIn.setInteractive({useHandCursor:true});
        })
    }

    onSubstaction(){
        this.PerformOperations.setText("Choose a number from the number line below")
        for(let i=0;i<this.OperationBtnsSelected.length;i++){
            this.OperationBtnsSelected[i].setAlpha(0);
            this.OperationBtns[i].setAlpha(1).setInteractive({ useHandCursor: true })
        }

        this.SubstractionBtn.disableInteractive()
        this.SubstractionBtn.setAlpha(0);
        this.SubstractionBtnSelected.setAlpha(1);
        this.zoomOut.setInteractive({ useHandCursor: true })
        this.EnableNumberLine()
        this.PrevBtn.setInteractive({useHandCursor:true})
        this.NextBtn.setInteractive({useHandCursor:true})
        this.MyZoomIn.map((zoomIn)=>{
            zoomIn.setInteractive({useHandCursor:true});
        })
    }

    onDivision(){
        this.PerformOperations.setText("Choose a number from the number line below")
        for(let i=0;i<this.OperationBtnsSelected.length;i++){
            this.OperationBtnsSelected[i].setAlpha(0);
            this.OperationBtns[i].setAlpha(1).setInteractive({ useHandCursor: true })
        }

        this.DivisionBtn.disableInteractive()
        this.DivisionBtn.setAlpha(0);
        this.DivisionBtnSelected.setAlpha(1);
        this.zoomOut.setInteractive({ useHandCursor: true })
        this.EnableNumberLine()
        this.PrevBtn.setInteractive({useHandCursor:true})
        this.NextBtn.setInteractive({useHandCursor:true})
        this.MyZoomIn.map((zoomIn)=>{
            zoomIn.setInteractive({useHandCursor:true});
        })
    }

    onMultiplicationn(){
        this.PerformOperations.setText("Choose a number from the number line below")
        for(let i=0;i<this.OperationBtnsSelected.length;i++){
            this.OperationBtnsSelected[i].setAlpha(0);
            this.OperationBtns[i].setAlpha(1).setInteractive({ useHandCursor: true })
        }

        this.MultiplicationBtn.disableInteractive()
        this.MultiplicationBtn.setAlpha(0);
        this.MultiplicationBtnSelected.setAlpha(1);
        this.zoomOut.setInteractive({ useHandCursor: true })
        this.EnableNumberLine()
        this.PrevBtn.setInteractive({useHandCursor:true})
        this.NextBtn.setInteractive({useHandCursor:true})
        this.MyZoomIn.map((zoomIn)=>{
            zoomIn.setInteractive({useHandCursor:true});
        })
    }

    AddOperationAndNumSelectionTween(){
        this.GameStarted = false
        this.gameTime = 60 * 1000;
        this.gameplayTimer.paused = false
        this.tweens.add({
            targets: [this.NumberOperationContainer,this.pointsAndTimerContainer],
            x: 0,
            xOriginal: 0,
            ease: 'Quad',
            duration: 500,
            delay: 0,
        },this)
        this.tweens.add({
            targets: [this.OperationContainer],
            x: 0,
            xOriginal: 0,
            alpha: 1,
            ease: 'Quad',
            duration: 500,
            delay: 0,
        },this)
        this.tweens.add({
            targets: [this.Scakebg,this.line,this.PrevBtn,this.NextBtn,this.zoomOut,this.dotted_lineLeft,this.dotted_lineRight, this.resetBtn],
            alpha: 1,
            ease: 'Quad',
            duration: 500,
            delay: 0,
        },this)
        this.MyNumberLines.map((numbers,i)=>{
            this.tweens.add({
                targets: [numbers,this.MyVerticleLines[i],this.MyHorizontalLines[i]],
                alpha: 1,
                ease: 'Quad',
                duration: 500,
                delay: 0,
                onComplete: ()=>{
                    this.selectedOrNot = true
                }
            },this)
        })
        
    }

    ShowChooseOperationFirst(){
        this.PerformOperations.setText("Choose an operation")
        this.gameplayTimer.paused = true
        this.disableNumberLine()
        this.disableOperationBtn();
        this.MyZoomIn.map((zoomIn)=>{
            zoomIn.disableInteractive();
        })

        this.tweens.add({
            targets: this.container,
            y: 0,
            yOriginal: 0,
            alpha : 1,
            ease: Phaser.Math.Easing.Back.InOut,
            duration: 500,
            delay : 500,
            onComplete : ()=>{
                this.tweens.add({
                    targets: this.container,
                    y: this.screenHeight,
                    yOriginal: this.screenHeight,
                    alpha : 0,
                    ease: Phaser.Math.Easing.Back.InOut,
                    duration: 500,
                    delay : 1500,
                    onComplete : ()=>{
                        this.zoomOut.disableInteractive();
                        this.gameplayTimer.paused = false
                        this.EnableOperationBtn();
                    }
                })
            }
        })
        this.tweens.add({
            targets: this.overlay,
            alpha: .6,
            ease: Phaser.Math.Easing.Back.InOut,
            duration: 500,
            delay : 500,
            onComplete : ()=>{
                this.tweens.add({
                    targets: this.overlay,
                    alpha: 0,
                    ease: Phaser.Math.Easing.Back.InOut,
                    duration: 500,
                    delay : 1500,
                })
            }
        })
    }

    ShowRealNumbers() {
        this.hideHorizontalLines();
        this.zoomOut.visible = false;
        this.dotted_lineLeft.visible = false
        this.dotted_lineRight.visible = false
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
    }

    updateNumberLineForRealNumbers() {
        this.ZoomOutValuesStack = [];
        this.MyNumberLines.map((numbers, i) => {
            numbers.setText(i / 10);
        })
        for (let i = 0; i < 10; i++) {
            this.MyZoomIn[i].ToZoomInIndex = {
                startingIndex: Number(this.MyNumberLines[i].text),
                endingIndex: Number(this.MyNumberLines[i + 1].text)
            }
        }
        this.ShowChooseOperationFirst();
    }

    ShowRationalNumbers(){
        this.showHorizontalLines()
        this.zoomOut.visible = false;
        this.dotted_lineLeft.visible = false
        this.dotted_lineRight.visible = false
        for(let i=0;i<this.NumberLineSelectedBtns.length;i++){
            this.NumberLineSelectedBtns[i].setAlpha(0);
            this.NumberLineBtns[i].setAlpha(1).setInteractive({ useHandCursor: true })
        }
// 
        this.RationalNumberbtn.disableInteractive()
        this.RationalNumberbtn.setAlpha(0);
        this.RationalNumberbtnSelected.setAlpha(1);
        this.GameOperationStatus = "RationalNumbers"
        this.updateNumberLineForRationalNumber();
    }

    updateNumberLineForRationalNumber(){
        this.ZoomOutValuesStack = [];
        this.MyNumberLines.map((numbers, i) => {
            numbers.setText([i,10]);
        })
        for (let i = 0; i < 10; i++) {
            this.MyZoomIn[i].ToZoomInIndex = {
                startingIndex: Number(this.MyNumberLines[i].text),
                endingIndex: Number(this.MyNumberLines[i + 1].text)
            }
        }
        this.ShowChooseOperationFirst();
    }

    RealNumberSelection(){
        this.ShowRealNumbers()
        this.showDropDownOption()
    }

    ShowIntegerNumbers(){
        this.HideZoomIn();
        this.zoomOut.visible = true;
        this.dotted_lineLeft.visible = true
        this.dotted_lineRight.visible = true
        for(let i=0;i<this.NumberLineSelectedBtns.length;i++){
            this.NumberLineSelectedBtns[i].setAlpha(0);
            this.NumberLineBtns[i].setAlpha(1);
            this.NumberLineBtns[i].setInteractive({ useHandCursor: true })
        }

        this.IntegerNumberbtn.disableInteractive()
        this.IntegerNumberbtn.setAlpha(0);
        this.IntegerNumberbtnSelected.setAlpha(1);
        this.GameOperationStatus = "IntegerNumbers"
        this.UpdateNumberLineForIntegers();
    }

    UpdateNumberLineForIntegers(){
        this.ZoomOutValuesStack = [];
        this.MyNumberLines.map((numbers,i)=>{
            numbers.setText(i - 5);
        })
        for(let i=0;i<10;i++){
            this.MyZoomIn[i].ToZoomInIndex = {
                startingIndex : parseInt(this.MyNumberLines[i].text),
                endingIndex : parseInt(this.MyNumberLines[i+1].text)
            }
        }
        this.ShowChooseOperationFirst();
    }

    ShowWholeNumbers(){
        this.HideZoomIn();
        this.zoomOut.visible = true;
        this.dotted_lineLeft.visible = true
        this.dotted_lineRight.visible = true
        for(let i=0;i<this.NumberLineSelectedBtns.length;i++){
            this.NumberLineSelectedBtns[i].setAlpha(0);
            this.NumberLineBtns[i].setAlpha(1).setInteractive({ useHandCursor: true })
        }

        this.WholeNumberbtn.disableInteractive()
        this.WholeNumberbtn.setAlpha(0);
        this.WholeNumberbtnSelected.setAlpha(1);
        this.GameOperationStatus = "WholeNumbers"
        this.UpdateNumberLineForWhole();
    }

    UpdateNumberLineForWhole(){
        this.ZoomOutValuesStack = [];
        this.MyNumberLines.map((numbers,i)=>{
            numbers.setText(i);
        })
        for(let i=0;i<10;i++){
            this.MyZoomIn[i].ToZoomInIndex = {
                startingIndex : parseInt(this.MyNumberLines[i].text),
                endingIndex : parseInt(this.MyNumberLines[i+1].text)
            }
        }
        this.ShowChooseOperationFirst();
    }

    ShowNaturalNumbers(){
        this.HideZoomIn();
        this.zoomOut.visible = true;
        this.dotted_lineLeft.visible = true
        this.dotted_lineRight.visible = true
        for(let i=0;i<this.NumberLineSelectedBtns.length;i++){
            this.NumberLineSelectedBtns[i].setAlpha(0);
            this.NumberLineBtns[i].setAlpha(1).setInteractive({ useHandCursor: true })
        }

        this.NaturalNumberbtn.disableInteractive()
        this.NaturalNumberbtn.setAlpha(0);
        this.NaturalNumberbtnSelected.setAlpha(1);
        this.GameOperationStatus = "NaturalNumbers"
        this.UpdateNumberLineForNatural()
    }

    UpdateNumberLineForNatural(){
        this.ZoomOutValuesStack = [];
        this.MyNumberLines.map((numbers,i)=>{
            numbers.setText(i+1);
        })
        for(let i=0;i<10;i++){
            this.MyZoomIn[i].ToZoomInIndex = {
                startingIndex : parseInt(this.MyNumberLines[i].text),
                endingIndex : parseInt(this.MyNumberLines[i+1].text)
            }
        }
        this.ShowChooseOperationFirst();
    }

    HideZoomIn(){
        this.MyZoomIn.map((zoomin)=>{
            zoomin.setVisible(false);
        })
    }

    ShowZoomIn(){
        this.MyZoomIn.map((zoomin) => {
            zoomin.setVisible(true);
            zoomin.setAlpha(1);
        })
    }

    AddOnZoomOut(){
        this.dotted_lineLeft = this.add.image(-390,-102,'dotted_line').setOrigin(.5).setAlpha(0).setScale(1.3);
        this.dotted_lineRight = this.add.image(390,-102,'dotted_line').setOrigin(.5).setAlpha(0).setScale(1.3);
        this.dotted_lineRight.flipX = true
        this.zoomOut = this.add.image(0,-130,'zoomout').setOrigin(.5).setAlpha(0).setInteractive({useHandCursor: true}).on('pointerup',()=>{
            this.zoomOut.disableInteractive()
            this.SelectedNum.setAlpha(0)
            this.game.soundManager.play(Constants.Sounds.ExpandScale)
            switch (this.GameOperationStatus) {
                case "RealNumbers":
                    this.onZoomOutInteger()
                    break;
                case "RationalNumbers":
                    this.onZoomOutInteger()
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
        });
        this.zoomOut.input.hitArea.setTo(35*this.scaleX, 30*this.scaleY, 65, 65);
        this.dotted_lineRight.followObject = this.dotted_lineLeft.followObject = this.zoomOut.followObject = this.line;
    }

    NextQues(){
        this.saveQuestionData();
        if(this.questionCount == 4){
            this.gameplayTimer.paused = true
            this.GameOverPopup.open(this.calculateStars(), this.currentScore)
            this.SelectedNumForOperation = undefined
        }
        else{
            this.cameras.main.fadeOut(300, 0, 0, 0)
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.cameras.main.fadeIn(400, 1, 1, 1)
                this.ResetGame()
            })
        }
    }

    clearBtnTint(){
        this.OperationBtns.map((btns)=>{
            btns.clearTint()
        })
        this.NumberLineBtns.map((btns)=>{
            btns.clearTint()
        })
        this.NumberLineSelectedBtns.map((btns)=>{
            btns.clearTint()
        })
        this.NumberLineSelectedBtnsText.map((text)=>{
            text.clearTint()
        })
        this.dropDownOption1.clearTint()
        this.dropDownOption2.clearTint()
        this.dropDownOption1Text.clearTint()
        this.dropDownOption2Text.clearTint()
    }

    calculateStars() {
        if (this.currentScore < 10) {
            return 0
        }
        if (10 <= this.currentScore && this.currentScore < 20) {
            return 1
        }
        if (20 <= this.currentScore && this.currentScore < 30) {
            return 2
        }
        if (this.currentScore >= 30) {
            return 3
        }
    }

    ResetGame(){
        this.gameTime = 60 * 1000;
        this.SelectedNumForOperation = undefined;
        for(let i=0;i<this.NumberLineSelectedBtns.length;i++){
            this.NumberLineBtns[i].setAlpha(1);
            this.NumberLineBtns[i].setInteractive({useHandCursor:true})
            this.NumberLineSelectedBtns[i].setAlpha(0);
            // this.NumberLineBtns[i].disableInteractive();
        }
        this.OperationBtnsSelected.map((operationSelcted)=>{
            operationSelcted.setAlpha(0);
        })
        this.OperationBtns.map((operationSelcted)=>{
            operationSelcted.setAlpha(1);
        })
        this.showMultiplier(false);
        this.RandomNumText.visible = false;
        this.QuesHorizontalLine.setVisible(false);
        this.dropDownOption1.setInteractive({useHandCursor:true})
        this.dropDownOption2.setInteractive({useHandCursor:true})
        this.PrevBtn.disableInteractive({useHandCursor:true})
        this.NextBtn.disableInteractive({useHandCursor:true})
        this.enableZoomIn()
        this.SelectedNum.setAlpha(0);
        this.SelectedCorrectNum.setAlpha(0);
        this.SelectedIncorrectNum.setAlpha(0);
        this.selected = false
        this.PerformOperations.setText("Select a Number Type")
        this.GameLimit = true;
        this.resetUserInput();
        this.clearBtnTint();
        this.handleZoomInOutOnZoomIn()
        this.handleZoomInOutOnZoomOut()
    }

    resetUserInput(){
        switch (this.GameOperationStatus) {
            case "RealNumbers":
                this.ShowRealNumbers();
                break;
            case "RationalNumbers":
                this.ShowRationalNumbers();
                break;
            case "IntegerNumbers":
                this.ShowIntegerNumbers()
                break;
            case "NaturalNumbers":
                this.ShowNaturalNumbers();
                break;
            case "WholeNumbers":
                this.ShowWholeNumbers();
                break;
        }
    }

    replayGame(){
        this.cameras.main.fadeOut(300, 0, 0, 0)
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
                this.cameras.main.fadeIn(400, 1, 1, 1)
                this.scene.restart();
            })
    }

    saveQuestionData() {
        this.storage.writeData(Constants.QuestionID + this.currentQuestion.id, {
            timeTaken: this.gameTime,
            currentScore: this.currentScore,
            correctAnswers: this.correctAnswers,
            incorrectAnswers: this.incorrectAnswers,
        })
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
        this.SelectedNum.setAlpha(0);
        this.time.addEvent({ delay: 1000, callback: ()=>{
            this.MyNumberLines.map((numbers)=>{
                if(this.GameOperationStatus == "RationalNumbers"){
                    if(numbers.text.split("\n")[0] == this.SelectedNumForOperation){
                        this.SelectedNum.x = numbers.x;
                        this.SelectedNum.y = numbers.y + 25*this.globalScale;
                        this.SelectedNum.xOriginal = numbers.xOriginal;
                        this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                        this.SelectedNum.setAlpha(1);
                        
                    }
                }
                else{
                    if(numbers.text == this.SelectedNumForOperation){
                        this.SelectedNum.x = numbers.x;
                        this.SelectedNum.y = numbers.y + 25*this.globalScale;
                        this.SelectedNum.xOriginal = numbers.xOriginal;
                        this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                        this.SelectedNum.setAlpha(1);
                        
                    }
                }
            })
        }, callbackScope: this})
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
                if(num > 1){
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
                            zoomin.setAlpha(1);
                        })
                        console.log("zoomInTrue")
                    } else {
                        console.log("zoomInFalse")
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
        this.SelectedNum.setAlpha(0);
        this.MyNumberLines.map((numbers)=>{
            if(this.GameOperationStatus == "RationalNumbers"){
                if(numbers.text.split("\n")[0] == this.SelectedNumForOperation){
                    this.SelectedNum.x = numbers.x;
                    this.SelectedNum.y = numbers.y + 25*this.globalScale;
                    this.SelectedNum.xOriginal = numbers.xOriginal;
                    this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                    this.SelectedNum.setAlpha(1);
                    
                }
            }
            else{
                if(numbers.text == this.SelectedNumForOperation){
                    this.SelectedNum.x = numbers.x;
                    this.SelectedNum.y = numbers.y + 25*this.globalScale;
                    this.SelectedNum.xOriginal = numbers.xOriginal;
                    this.SelectedNum.yOriginal = numbers.yOriginal + 25;
                    this.SelectedNum.setAlpha(1);
                    
                }
            }
        })
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

    update() {
        // this.player.update()
    }
}

Number.prototype.countDecimals = function () {
    if(Math.floor(this.valueOf()) === this.valueOf()) return 0;
    return this.toString().split(".")[1].length || 0; 
}

Array.prototype.sample = function(){
    return this[Math.floor(Math.random()*this.length)];
  }