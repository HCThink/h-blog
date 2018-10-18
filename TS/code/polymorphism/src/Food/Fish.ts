import AbsFood from './Food_abs'

class Fish extends AbsFood {
    private addition: number = 0.8;
    supportEnergy(): number {
        return this._energy * this.addition;
    }
}

export default Fish;
