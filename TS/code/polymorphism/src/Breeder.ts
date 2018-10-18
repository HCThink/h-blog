import Animal from './Animal/Animal_interface';
import Food from './Food/Food_interface';

export default class Breeder {
    async feed(animal: Animal, food: Food) {
        let isEnough: boolean;
        while (!(isEnough = await animal.eat(food)));

        await animal.sleep();
    }
}
