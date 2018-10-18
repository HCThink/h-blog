import Tools from '../Tool';
const { Log } = Tools;
class AbsAnimal {
    constructor(_name) {
        this._name = _name;
    }
    sleep() {
        Log(`${this.name}：eat too much, need to sleep.`);
    }
    ;
    get name() {
        return this._name;
    }
}
export default AbsAnimal;
