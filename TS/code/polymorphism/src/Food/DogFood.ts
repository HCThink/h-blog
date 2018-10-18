import AbsFood from './Food_abs'

class DogFood extends AbsFood {
    private addition: number = 2;
    supportEnergy(): number {
        return this.energy * this.addition;
    }
}

export default DogFood;
