import Food from '../Food/Food_interface'

interface Animal {
    // eat(food: Food): Promise<boolean>;
    // 尽量避免在接口中声明属性， 因为接口字段都是 public 的， 但实际情况中，很少有属性会直接设计成 public。
    // 属性一般是私有的， 行为是共享的。
    // curEnergy: string;
    name: string;
    // TODO 这里返回 any 显然不是一个好的做法， 偷懒。 稍后用泛型改造。
    eat(food: Food): any;
    sleep(): void;
    // play(): void;
}

export default Animal;
