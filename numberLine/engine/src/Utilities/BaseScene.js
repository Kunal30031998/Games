import {
    Header
} from "./Header"
import {
    Storage
} from "./Storage"
import {
    Toast
} from "./Toast"

export class BaseScene extends Phaser.Scene {
    constructor(data) {
        super(data)
        this.header = new Header(data.key, this)
        this.toast = new Toast(this)
        this.storage = new Storage(this)
    }

    create() {
        this.screenWidth = 1920
        this.screenHeight = 1080
        this.scaleX = this.game.scale.width / this.screenWidth
        this.scaleY = this.game.scale.height / this.screenHeight
        this.globalScale = this.scaleX
        if (this.scaleY < this.scaleX)
            this.globalScale = this.scaleY

        this.events.once('preupdate', () => {
            this.children.list.forEach((obj) => {
                if (obj.type === "Container") {
                    obj.list.forEach((child) => {
                        this.setUpVariables(child)
                    })
                }
                this.setUpVariables(obj)
            })

            this.resize()
        })

        this.game.scale.on('resize', this.resize, this)
        this.events.on('shutdown', this.shutdown, this)

        this.jsonData = this.cache.json.get('jsonData').root
        this.toast.create()
        this.header.create()

        this.inactivityTime = 60 * 1000 * 1000
        this.inactivityTimer = this.time.delayedCall(this.inactivityTime, () => {
            this.toast.showToast(this.jsonData.common.Toast.InactivityToast)
            this.inactivityCallBack()
        })
        this.input.on('pointerdown', this.inactivityCallBack, this)

        this.cameras.main.fadeIn(300, 0, 0, 0)
        this.overlay = this.add.rectangle(this.screenWidth * .5, this.screenHeight * .5, this.screenWidth, this.screenHeight, 0x000000).setDepth(1000).setOrigin(0.5).setAlpha(.7).setInteractive()
        this.overlay.visible = false
        this.overlay.setAlpha(0)
    }

    inactivityCallBack() {
        this.inactivityTimer.destroy()
        this.inactivityTimer = this.time.delayedCall(this.inactivityTime, () => {
            // this.toast.showToast(this.jsonData.common.Toast.InactivityToast)
            this.inactivityCallBack()
        })
    }

    shutdown() {
        this.game.scale.off('resize', this.resize, this)
    }

    setUpVariables(obj) {
        if (obj.type === "Container") {
            obj.list.forEach((child) => {
                this.setUpVariables(child)
            })
        } else if (obj.type === "Text") {
            obj.originalFontSize = obj.style.fontSize.replace("px", "")
            obj.originalWordWrapWidth = obj.style.wordWrapWidth
        }
        if (obj.mask) {
            if (obj.mask.bitmapMask) {
                obj.mask.bitmapMask.scaleOriginal = obj.mask.bitmapMask.scale
                obj.mask.bitmapMask.xOriginal = obj.mask.bitmapMask.x
                obj.mask.bitmapMask.yOriginal = obj.mask.bitmapMask.y
            } else {
                obj.mask.scaleOriginal = obj.mask.scale
                obj.mask.xOriginal = obj.mask.x
                obj.mask.yOriginal = obj.mask.y
            }
        }
        obj.scaleOriginal = obj.scale
        obj.xOriginal = obj.x
        obj.yOriginal = obj.y
        if (!obj.hasOwnProperty("shouldResize"))
            obj.shouldResize = true
    }

    resize() {
        this.scaleX = this.game.scale.width / this.screenWidth
        this.scaleY = this.game.scale.height / this.screenHeight
        this.globalScale = this.scaleX
        if (this.scaleY < this.scaleX)
            this.globalScale = this.scaleY

        this.children.list.forEach((obj) => {
            if (obj.type === "Container") {
                obj.list.forEach((child) => {
                    if (child.followObject && child.followObject.followObject &&  child.followObject.followObject.followObject) {
                        this.resizeElement(child.followObject.followObject)
                    }
                    if (child.followObject && child.followObject.followObject) {
                        this.resizeElement(child.followObject.followObject)
                    }
                    if (child.followObject) {
                        this.resizeElement(child.followObject)
                    }
                })
            }
            if (obj.followObject && obj.followObject.followObject && obj.followObject.followObject.followObject) {
                this.resizeElement(obj.followObject.followObject)
            }
            if (obj.followObject && obj.followObject.followObject) {
                this.resizeElement(obj.followObject.followObject)
            }
            if (obj.followObject) {
                this.resizeElement(obj.followObject)
            }
        })
        this.children.list.forEach((obj) => {
            if (obj.type === "Container") {
                obj.list.forEach((child) => {
                    this.resizeElement(child)
                })
            }
            this.resizeElement(obj)
        })

        this.game.confetti.resize()
        this.afterResize()
    }

    afterResize() {}

    resizeElement(obj) {
        if (obj.type === "Text") {
            if (!obj.hasOwnProperty("originalFontSize") || !obj.hasOwnProperty("originalWordWrapWidth")) {
                this.setUpVariables(obj)
            }
        }
        if (!obj.hasOwnProperty("scaleOriginal") || !obj.hasOwnProperty("xOriginal") || !obj.hasOwnProperty("yOriginal")) {
            this.setUpVariables(obj)
        }
        if (obj.type === "Container") {
            obj.list.forEach((child) => {
                this.resizeElement(child)
            })
        }
        else if (obj.type === "rexChart" || obj.type === "rexSlider" || obj.type === "rexRoundRectangleShape") {
            obj.setScale(obj.scaleOriginal * this.globalScale)
        }
         else if (obj.type === "Image" || obj.type == "Sprite" || obj.type == 5) {
            if (obj.shouldResize) {
                if (obj.mask) {
                    if (obj.mask.bitmapMask) {
                        if(obj.mask.bitmapMask.followObject){
                            obj.mask.bitmapMask.setScale(obj.mask.bitmapMask.scaleOriginal * this.globalScale)
                            obj.mask.bitmapMask.x = obj.mask.bitmapMask.followObject.x + obj.mask.bitmapMask.xOriginal * this.scaleX
                            obj.mask.bitmapMask.y = obj.mask.bitmapMask.followObject.y + obj.mask.bitmapMask.yOriginal * this.scaleY
                        }
                        else{
                            obj.mask.bitmapMask.setScale(obj.mask.bitmapMask.scaleOriginal * this.globalScale)
                            obj.mask.bitmapMask.x = obj.mask.bitmapMask.xOriginal * this.scaleX
                            obj.mask.bitmapMask.y = obj.mask.bitmapMask.yOriginal * this.scaleY
                        }
                        
                    } else {
                        if(obj.mask.geometryMask){
                            if(obj.mask.geometryMask.followObject){
                                obj.mask.geometryMask.setScale(obj.mask.geometryMask.scaleOriginal * this.globalScale)
                                obj.mask.geometryMask.x = obj.mask.geometryMask.followObject.x + obj.mask.geometryMask.xOriginal * this.scaleX
                                obj.mask.geometryMask.y = obj.mask.geometryMask.followObject.y + obj.mask.geometryMask.yOriginal * this.scaleY
                            }
                            else{
                                obj.mask.geometryMask.setScale(obj.mask.geometryMask.scaleOriginal * this.globalScale)
                                obj.mask.geometryMask.x = obj.mask.geometryMask.x + obj.mask.geometryMask.xOriginal * this.scaleX
                                obj.mask.geometryMask.y = obj.mask.geometryMask.y + obj.mask.geometryMask.yOriginal * this.scaleY
                            }
                        }
                       
                    }
                }
                if (obj.name == "Scakebg") {
                    obj.setScale((window.innerWidth) / obj.width, obj.scaleOriginal * this.globalScale);
                    // obj.y = window.innerHeight
                    // obj.yOriginal = window.innerHeight
                }
                else if (obj.name == "NumberOperationBg") {
                    obj.setScale(.85 * this.globalScale, .975 * this.globalScale);
                    // obj.y = window.innerHeight
                    // obj.yOriginal = window.innerHeight
                }
                else if (obj.name == "OperationBg") {
                    obj.setScale(.95 * this.globalScale, .95 * this.globalScale);
                    // obj.y = window.innerHeight
                    // obj.yOriginal = window.innerHeight
                }
                else if (obj.name == "convert_btn") {
                    obj.setScale(.6 * this.globalScale, .8 * this.globalScale);
                }
                else{
                    obj.setScale(obj.scaleOriginal * this.globalScale)
                }
                // if(obj.name == "line"){
                //     obj.setScale(2.5 * this.globalScale ,obj.scaleOriginal * this.globalScale)
                // }
            }
        } else if (obj.type === "Graphics") {
            if(obj.name == "maskShape"){
                obj.setScale(1.3 * this.globalScale,1.19 * this.globalScale)
            }
            else{
                obj.setScale(obj.scaleOriginal * this.globalScale)
            }            
        } 
        else if (obj.type === "Text") {
            obj.setFontSize(obj.originalFontSize * this.globalScale + "px")
            obj.setWordWrapWidth(obj.originalWordWrapWidth * this.globalScale)
        } else {
            obj.setScale(this.scaleX, this.scaleY)
        }
        if (obj.followObject) {
            obj.x = obj.followObject.x + obj.xOriginal * this.globalScale
            obj.y = obj.followObject.y + obj.yOriginal * this.globalScale
            obj.originalTweenX = obj.followObject.x + obj.xOriginal * this.globalScale
            obj.originalTweenY = obj.followObject.y + obj.yOriginal * this.globalScale
        } else {
            if(obj.name !== "element1" && obj.name !== "element2" && obj.name !== "element3" && obj.name !== "element4" && obj.name !== "element5" && obj.name !== "element6" && obj.name !== "element7" && obj.name !== "element8" ){
                obj.x = obj.xOriginal * this.scaleX
                obj.y = obj.yOriginal * this.scaleY
                obj.originalTweenX = obj.xOriginal * this.scaleX
                obj.originalTweenY = obj.yOriginal * this.scaleY  
            }  
        }
    }
}