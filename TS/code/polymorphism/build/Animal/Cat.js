import AbsAnimal from './Animal_abs';
import Tools from '../Tool';
class Cat extends AbsAnimal {
    eat(food) {
        const curEnergy = super.commonEat(food);
        Tools.Log(`${this.name} like eat ${food.name}. now have ${curEnergy} energy.`);
        return true;
    }
    // override.
    sleep() {
        Tools.Log(`${this.name}：白天睡觉，晚上留着肚子吃老鼠！`);
    }
}
export default Cat;
