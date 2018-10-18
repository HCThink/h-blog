import Tools from '../Tool';
const { Log } = Tools;
class AbsAnimal {
    constructor(_name, _maxEnergy = 100, _curEnergy = 0) {
        this._name = _name;
        this._maxEnergy = _maxEnergy;
        this._curEnergy = _curEnergy;
    }
    sleep() {
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
    get name() {
        return this._name;
    }
    // set name(newName: string) {
    //     this._name = newName;
    // }
    get maxEnergy() {
        return this._maxEnergy;
    }
    // set maxEnergy(newMaxEnergy: number) {
    //     this._maxEnergy = newMaxEnergy;
    // }
    get curEnergy() {
        return this._curEnergy;
    }
    set curEnergy(newCurEnergy) {
        this._curEnergy = newCurEnergy;
    }
    /**
     * 实际上可以讲 commonEat 和 eat 合成一个， 在子类里同样的调用 super.eat()
     * 但是 eat 在接口中声明了， 所以不能降低访问权限到 protected。
     *
     * 如果是比较通用的实现，可以提到抽象类中，然后使用 protected 限制使用范围为子类， 也是比较好的方案。
     * @param food
     */
    commonEat(food) {
        const supEnergy = food.supportEnergy();
        this.curEnergy += supEnergy;
        return this.curEnergy;
    }
    ;
}
export default AbsAnimal;
