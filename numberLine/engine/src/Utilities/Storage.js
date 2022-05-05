import { Utilities } from "./Utilities"

export class Storage {
    constructor(scene) {
        this.scene = scene
        this.data = {}
        this.readData()
    }

    readData(keyToCheck) {
        for (const key in localStorage) {
            if (Object.hasOwnProperty.call(localStorage, key)) {
                const value = localStorage[key]
                if (Utilities.ValidateJSON(value)) {
                    this.data[key] = JSON.parse(value)
                    // console.log(key, value)
                }
            }
        }
        return this.data[keyToCheck]
    }

    writeData(key, value) {
        this.data[key] = value
        for (const key in this.data) {
            if (Object.hasOwnProperty.call(this.data, key)) {
                const value = this.data[key]
                localStorage.setItem(key, JSON.stringify(value))
            }
        }
    }

    clear() {
        localStorage.clear()
    }
}