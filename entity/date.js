import Variable from './variable'

export default class ADate extends Variable {
    constructor({ value, validMethod, humanReadableName }) {
        super({ value, validMethod, humanReadableName })
        this.set(value)
    }

    set(value) {
        if (value instanceof Date) {
            return this.value = value
        }
        this.value = new Date(value)
    }
}