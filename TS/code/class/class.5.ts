namespace static {
    class Dog{
        static legCount = 4;
        constructor(public name: string, private age: number) {}

        gatekeeper() {
            console.log(`${this.name}: go away！`);
        }

        static run() {
            // shift(没打错，梗)! 静态方法也能访问 this ？ 这不是很好理解啊
            // 这里的 this 则是类本身，他和普通方法中的 this 是两个不同的上下文。一定要区分开。
            console.log(this === Dog);
            console.log(`running dog by ${this.legCount} legs`);
            console.log(`running dog by ${Dog.legCount} legs`);

            // 类型“typeof Dog”上不存在属性“age”。
            // console.log(this.age);
        }
    }

    Dog.run();
    new Dog('dahuang', 4).gatekeeper();    // dahuang: wang! wang!
}
