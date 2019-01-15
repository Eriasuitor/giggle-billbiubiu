export default class Variable {
    constructor({ value, validMethod, humanReadableName }) {
        this.value = value
        this.validMethod = validMethod
        this.humanReadableName = humanReadableName
    }

    valid(value) {
        return this.validMethod(value)
    }

    get type() {
        return this.constructor.name
    }
}