class AbsFood {
    constructor(_name, _energy) {
        this._name = _name;
        this._energy = _energy;
    }
    supportEnergy() {
        return this.energy;
    }
    get name() {
        return this._name;
    }
    get energy() {
        return this._energy;
    }
}
export default AbsFood;
