import IFood from './Food_interface'

abstract class AbsFood implements IFood {
    constructor(protected _name: string,
        protected _energy: number) {}

    supportEnergy(): number {
        return this.energy;
    }

    get name(): string {
        return this._name;
    }

    get energy(): number {
        return this._energy;
    }
}

export default AbsFood;
