import AbsFood from './Food_abs';
class Fish extends AbsFood {
    constructor() {
        super(...arguments);
        this.addition = 0.8;
    }
    supportEnergy() {
        return this._energy * this.addition;
    }
}
export default Fish;
