import AbsAnimal from './Animal_abs';
import Tools from '../Tool';
const { Log } = Tools;
/**
 * 这里的设计在接口和实现类之间加了一层抽象类，实现类就不要直接和抽象类交互
 */
class Dog extends AbsAnimal {
    eat(food) {
        return new Promise((resolve /*, reject*/) => {
            const supEnergy = food.supportEnergy();
            this.curEnergy += supEnergy;
            const { maxEnergy, curEnergy } = this;
            Log(`${this.name} like eat ${food.name}/${supEnergy}, and now my Energy from ${curEnergy - supEnergy} to ${curEnergy}  (maxEnergy=${maxEnergy})`);
            curEnergy >= maxEnergy ? resolve(true) : resolve(false);
        });
    }
}
export default Dog;
