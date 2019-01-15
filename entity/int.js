import Variable from './variable'

export default class AInt extends Variable {
    constructor({ value, validMethod, fixTo, humanReadableName }) {
        super({ value, validMethod, humanReadableName })
        this.fixTo = fixTo
        this.set(value)
    }

    set(value) {
        let fix = Math.pow(10, this.fixTo)
        this.value = Math.round(value * fix) / fix
    }
}