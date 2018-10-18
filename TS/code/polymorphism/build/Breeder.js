export default class Breeder {
    async feed(animal, food) {
        let isEnough;
        while (!(isEnough = await animal.eat(food)))
            ;
        await animal.sleep();
    }
}
