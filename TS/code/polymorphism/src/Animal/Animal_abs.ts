import IAnimal from './Animal_interface'
import Food from '../Food/Food_interface'
import Tools from '../Tool'

const { Log } = Tools;

abstract class AbsAnimal implements IAnimal {
    constructor(protected _name: string,
        protected _maxEnergy: number = 100,
        protected _curEnergy: number = 0) {}

    sleep(): void {
        const costEnergy = this._maxEnergy / 2;
        this._curEnergy -= costEnergy;
        Log(`${this.name}：eat too much, need to sleep.`);
        // 抽象类批量切换实现
        // Log(`${this.name}：eat too much, need to sleep. will cost ${costEnergy} energy.`);
    }

    // play(): void {
    //     // this._curEnergy -= 10;
    //     Log(`${this.name}：play.`);
    // }

    /**
     * get set 同访问修饰符有点蛋疼， 实际上想要做这样的场景就比较麻烦：
     *  所有人都可以访问名字， 但只有实例自己能修改名字。
     */
    get name(): string {
        return this._name;
    }
    // set name(newName: string) {
    //     this._name = newName;
    // }

    get maxEnergy(): number {
        return this._maxEnergy;
    }
    // set maxEnergy(newMaxEnergy: number) {
    //     this._maxEnergy = newMaxEnergy;
    // }

    protected get curEnergy(): number {
        return this._curEnergy;
    }
    protected set curEnergy(newCurEnergy: number) {
        this._curEnergy = newCurEnergy;
    }

    /**
     *
     * @param food
     *
     * 这里到底是依赖接口还是依赖抽象类？理论上应该依赖最抽象的层次，考虑了很多情况, 还是应该依赖接口。
     * 原因在于： 我们添加抽象类则是为了解决接口扩充的问题，接口本身还是规范，抽象类并不是， 或者一个
     * 完整的继承描述层次不应该有多个规范存在， 如果有接口，那就只能依赖接口
     */
    abstract eat(food: Food): any;
    /**
     * 实际上可以讲 commonEat 和 eat 合成一个， 在子类里同样的调用 super.eat()
     * 但是 eat 在接口中声明了， 所以不能降低访问权限到 protected。
     *
     * 如果是比较通用的实现，可以提到抽象类中，然后使用 protected 限制使用范围为子类， 也是比较好的方案。
     * @param food
     */
    protected commonEat(food: Food): any {
        const supEnergy = food.supportEnergy();
        this.curEnergy += supEnergy;

        return this.curEnergy;
    };
}

export default AbsAnimal;
