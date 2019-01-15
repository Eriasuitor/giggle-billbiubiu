import Variable from './variable'

export default class AEnum extends Variable {
    constructor({ value, validMethod, options, humanReadableName }) {
        super({ value, validMethod, humanReadableName })
        this.options = options
        this.set(value)
    }

    set(value) {
        if (!this.options.includes(value)) {
            throw new Error(`The value ${this.value} is not in ${this.options.map(_o => `'_o'`)}`)
        }
        this.value = value
    }
}