import confetti from "canvas-confetti"
import { Constants } from "./Constants"

export class Confetti {
    constructor(scene) {
        this.scene = scene

        this.canvas = document.createElement("canvas");
        this.canvas.style.position = "fixed"
        this.canvas.style.cursor = "not-allowed"
        this.canvas.style.pointerEvents = "none"
        this.canvas.style.left = "0px"
        this.canvas.style.top = "0px"

        if (this.scene.scale.scaleMode == Phaser.Scale.FIT) {
            this.canvas.style.width = scene.game.canvas.style.width
            this.canvas.style.height = scene.game.canvas.style.height
            this.canvas.style.marginLeft = scene.game.canvas.style.marginLeft
            this.canvas.style.marginTop = scene.game.canvas.style.marginTop
        } else if (this.scene.scale.scaleMode == Phaser.Scale.RESIZE) {
            this.canvas.style.width = "100%"
            this.canvas.style.height = "100%"
        }

        document.body.appendChild(this.canvas)
        scene.game.canvas.parentElement.appendChild(this.canvas)

        this.myConfetti = confetti.create(this.canvas, {
            resize: true
        })
        this.playSchoolPrade = false
    }

    resize() {
        if (this.scene.scale.scaleMode == Phaser.Scale.FIT) {
            this.canvas.style.width = this.scene.game.canvas.style.width
            this.canvas.style.height = this.scene.game.canvas.style.height
            this.canvas.style.marginLeft = this.scene.game.canvas.style.marginLeft
            this.canvas.style.marginTop = this.scene.game.canvas.style.marginTop
        }
        this.scene.game.canvas.parentElement.appendChild(this.canvas)
    }

    play(type, x, y) {
        switch (type) {
            case Constants.Confetti.SchoolParade:
                if (!this.playSchoolPrade) {
                    this.playSchoolPrade = true
                    this.wait = 5;
                    this.schoolPradeFrame()
                }
                break;
            case Constants.Confetti.Cannon:
                this.myConfetti({
                    particleCount: 100,
                    spread: 70,
                    origin: {
                        x: x / this.scene.screenWidth,
                        y: y / this.scene.screenHeight
                    }
                });
                break;
            default:
                break;
        }
    }

    stop(type) {
        switch (type) {
            case Constants.Confetti.SchoolParade:
                this.playSchoolPrade = false
                break;
            default:
                break;
        }
    }

    schoolPradeFrame() {
        this.wait--
        if (this.wait <= 0) {
            this.wait = 5
            this.myConfetti({
                particleCount: 20,
                angle: 60,
                spread: 55,
                origin: {
                    x: 0,
                    y: .65
                }
            });
            this.myConfetti({
                particleCount: 20,
                angle: 120,
                spread: 55,
                origin: {
                    x: 1,
                    y: .65
                },
                // scalar:
            });
        }
        if (this.playSchoolPrade) {
            requestAnimationFrame(() => {
                this.schoolPradeFrame()
            })
        }
    }
}