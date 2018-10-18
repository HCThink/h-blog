class BeeKeeper {
    hasMask: boolean = true;
}

class ZooKeeper {
    nametag: string = 'ZooKeeper';
}

class Animal {
    numLegs: number;
}

class Bee extends Animal {
    keeper: BeeKeeper = new BeeKeeper();
}

class Lion extends Animal {
    keeper: ZooKeeper = new ZooKeeper();
}

// 泛型约束构造， 其中 c: new () => A 是构造描述， 即类类型。
function createInstance<A extends Animal>(c: new () => A): A {
    return new c();
}

const nametag = createInstance(Lion).keeper.nametag;  // typechecks!
const hasMask = createInstance(Bee).keeper.hasMask;   // typechecks!

console.log(nametag, hasMask);
