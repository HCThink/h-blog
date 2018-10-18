import Breeder from './Breeder';
import Tool from './Tool';
import Fish from './Food/Fish';
import Bone from './Food/Bone';
import DogFood from './Food/DogFood';
import Dog from './Animal/Dog';
import Cat from './Animal/Cat';
class BreederManager {
    constructor() {
        this._breeder = new Breeder();
    }
    async main() {
        await this.testOne();
        await this.testTwo();
        await this.testThree();
    }
    async testThree() {
        Tool.Log();
        Tool.Log('----------------testThree---------------------');
        const tom = new Cat('Tom');
        const fish = new Fish('鱼', 25);
        await this._breeder.feed(tom, fish);
    }
    async testTwo() {
        Tool.Log();
        Tool.Log('----------------testTwo---------------------');
        const yelloDog = new Dog('黄狗');
        const dogFood = new DogFood('狗粮', 25);
        await this._breeder.feed(yelloDog, dogFood);
        Tool.Log('..........dev..........');
        const bigBone = new Bone('小骨头', 50);
        await this._breeder.feed(yelloDog, bigBone);
    }
    async testOne() {
        Tool.Log();
        Tool.Log('----------------testOne---------------------');
        const xiaohuang = new Dog('小黄');
        const smallBone = new Bone('小骨头', 25);
        await this._breeder.feed(xiaohuang, smallBone);
        Tool.Log('..........dev..........');
        const dahuang = new Dog('大黄');
        const bigBone = new Bone('大骨头', 50);
        await this._breeder.feed(dahuang, bigBone);
        Tool.Log('..........dev..........');
        await this._breeder.feed(xiaohuang, bigBone);
        Tool.Log('..........dev..........');
        await this._breeder.feed(dahuang, smallBone);
    }
    get breeder() {
        return this._breeder;
    }
}
new BreederManager().main();
