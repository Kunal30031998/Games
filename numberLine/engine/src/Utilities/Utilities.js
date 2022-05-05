import { Constants } from "./Constants"

export const Utilities = {
    fullScreen: function (scene, image) {
        if (scene.scale.isFullscreen) {
            scene.scale.stopFullscreen()
            image.setTexture("fullScreen")
        } else {
            scene.scale.startFullscreen()
            image.setTexture("fullScreenClose")
        }
        scene.resize()
    },
    ValidateJSON: function (str) {
        try {
            JSON.parse(str)
        } catch (e) {
            return false
        }
        return true
    },
    textStyle: {
        fontSize: 40,
        fontFamily: 'Roboto-Bold',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 10,
    },
    createDiv: function (x, y, width, height) {
        let div = document.createElement("div")
        div.style.left = x + "px"
        div.style.top = y + "px"
        div.style.width = width + "px"
        div.style.height = height + "px"
        div.style.position = "fixed"
        div.id = "test-slider"
        document.body.appendChild(div)
        return div
    },
    scaleNumberRange: function (number, inMin, inMax, outMin, outMax) {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin
    },
    createSlider: function (parent, min, max, value) {
        let input = document.createElement("input")
        input.type = "range"
        input.min = min
        input.max = max
        input.value = value
        input.className += "slider"
        parent.appendChild(input)
        return input
    },
    SendDataToServer: function (scene) {
        let dataToSend = Utilities.getDataToSendToServer(scene)
        console.log("Entered into SendDataToServer:", dataToSend)
        try {
            if (typeof (user_response) !== "undefined" && user_response !== null) {
                user_response(dataToSend)
            }
            else if (typeof (parent.user_response) !== "undefined" && parent.user_response !== null) {
                parent.user_response(dataToSend)
            }
            else {
                window.parent.postMessage(JSON.stringify(dataToSend), "*")
            }
        } catch (error) {
            const regex = new RegExp('SecurityError: Blocked a frame with origin "https://cdn-nucleuspoc.extramarks.com" from accessing a cross-origin frame.')
            if (regex.test(error)) {
                window.parent.postMessage(JSON.stringify(dataToSend), "*")
            }
            else {
                console.error("SendDataToServer: Error: " + error)
            }
        }
        // window.close()
    },
    getDataToSendToServer: function (scene) {
        try {
            let gameData = {GamePlay:{}}
            var GamePlayTotalCorrectAnswers = 0;
            var GamePlayTotalIncorrectAnswers = 0;
            var GamePlayTotalScore = 0;
            var GamePlayTotalTimeTaken = 0;

            scene.jsonData.gameScreen.LevelData.questions.forEach((question) => {
                let data = scene.storage.readData(Constants.QuestionID + question.id)
                if (data === undefined)
                    data = {
                        currentScore: 0,
                        correctAnswers: 0,
                        incorrectAnswers: 0,
                        timeTaken: 0
                    }
                gameData.GamePlay[question.id] = data
                GamePlayTotalScore += data.currentScore
                GamePlayTotalCorrectAnswers += data.correctAnswers
                GamePlayTotalIncorrectAnswers += data.incorrectAnswers
                GamePlayTotalTimeTaken += data.timeTaken
            })
            let USER_RESULT_DATA_FOR_SERVER = {
                template_id: scene.jsonData.common.template_id,
                template_type: scene.jsonData.common.templateType,
                GamePlay_final_user_score: {
                    right: GamePlayTotalCorrectAnswers,
                    wrong: GamePlayTotalIncorrectAnswers,
                    total: scene.jsonData.gameScreen.LevelData.questions.length,
                    score: GamePlayTotalScore,
                    bonus: 0,
                    total_time_taken: GamePlayTotalTimeTaken,
                    attempts: 0,
                    attempts_count: 0
                },
            }
            return USER_RESULT_DATA_FOR_SERVER
        } catch (error) {
            console.error(error)
        }
    },
    calculateTime: function (startTime, endTime) {
        var difference = endTime - startTime;
        new Date().getTime() - localStorage.getItem('startTime');
        var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24);
        difference -= daysDifference * 1000 * 60 * 60 * 24;

        var hoursDifference = Math.floor(difference / 1000 / 60 / 60);
        difference -= hoursDifference * 1000 * 60 * 60;

        var minutesDifference = Math.floor(difference / 1000 / 60);
        difference -= minutesDifference * 1000 * 60;

        var secondsDifference = Math.floor(difference / 1000);
        // console.log('difference = ' + secondsDifference + ' second/s ');
        return secondsDifference;
    },
    sweetToast: function (log) {
        Toastify({
            text: log,
            duration: 3000,
            newWindow: true,
            close: false,
            gravity: "top",
            position: "right",
            stopOnFocus: true,
            style: {
                background: "#222222",
                fontSize: "100px",
            },
        }).showToast();
    },
    convertToPremitive: function (value) {
        if (value == "true") {
            return true
        } else if (value == "false") {
            return false
        }
        return value
    },
    getServerParam: function (scene, key) {
        let value = scene.storage.readData(Constants.ServerStoragePrefix + key)
        if (value == null) {
            value = scene.jsonData.common[key]
            if (value == null) {
                return Constants.ServerParameterDefaults[key]
            }
            return value
        }
        return value
    },
    clone: function (obj) {
        var copy

        // Handle the 3 simple types, and null or undefined
        if (null == obj || "object" != typeof obj)
            return obj

        // Handle Date
        if (obj instanceof Date) {
            copy = new Date()
            copy.setTime(obj.getTime())
            return copy
        }

        // Handle Array
        if (obj instanceof Array) {
            copy = []
            for (var i = 0, len = obj.length; i < len; i++) {
                copy[i] = Utilities.clone(obj[i])
            }
            return copy
        }

        // Handle Object
        if (obj instanceof Object) {
            copy = {}
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr))
                    copy[attr] = Utilities.clone(obj[attr])
            }
            return copy
        }

        throw new Error("Unable to copy obj! Its type isn't supported.")
    },
    timeToText: function (time) {
        return parseInt((time / 60000)) + " : " + Utilities.toTwoDigitString((time % 60000) / 1000)
    },
    toTwoDigitString: function (num) {
        if (num < 10) {
            return "0" + num
        }
        return num + ""
    },
    createAnim: function (scene, Spritekey, animKey, x, y, speed = 30, repeat = -1) {
        let anim = scene.add.sprite(x, y, Spritekey, 0).setOrigin(0.5)
        scene.anims.create({
            key: animKey,
            frames: scene.anims.generateFrameNames(Spritekey),
            frameRate: speed
        })
        anim.play({ key: animKey, repeat: repeat })
    },
    changeScene: function (scene, sceneToChange, dataToPass = {}) {
        scene.overlay.visible = true
        scene.overlay.setAlpha(0.7)
        scene.cameras.main.fadeOut(300, 0, 0, 0)
        scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
            scene.scene.start(sceneToChange, dataToPass)
        })
    },
    calculateTotalTime: function () {

        var difference = new Date().getTime() - localStorage.getItem('startTime')

        var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24)
        difference -= daysDifference * 1000 * 60 * 60 * 24

        var hoursDifference = Math.floor(difference / 1000 / 60 / 60)
        difference -= hoursDifference * 1000 * 60 * 60

        var minutesDifference = Math.floor(difference / 1000 / 60)
        difference -= minutesDifference * 1000 * 60

        var secondsDifference = Math.floor(difference / 1000)

        console.log('difference = ' +
            daysDifference + ' day/s ' +
            hoursDifference + ' hour/s ' +
            minutesDifference + ' minute/s ' +
            secondsDifference + ' second/s ')
    },
}