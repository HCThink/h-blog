import AbsFood from './Food_abs';
class DogFood extends AbsFood {
    constructor() {
        super(...arguments);
        this.addition = 2;
    }
    supportEnergy() {
        return this.energy * this.addition;
    }
}
export default DogFood;
