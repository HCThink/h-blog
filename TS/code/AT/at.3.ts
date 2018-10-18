namespace at3 {
    class Bird {
        fly() { }
        layEggs() { }
    }

    class Fish {
        swim() { }
        layEggs() { }
    }

    function getSmallPet(): Fish | Bird {
        return new Fish();
    }

    // common method
    let pet = getSmallPet();
    pet.layEggs(); // okay
    // pet.swim();    // errors 类型“Bird | Fish”上不存在属性“swim”。


    // ----------------deal----------------
    // 1. 类型断言
    if ((<Fish>pet).swim) {
        (<Fish>pet).swim();
    }


    // 2. 类型谓词
    // pet is Fish就是类型谓词
    function isFish(pet: Fish | Bird): pet is Fish {
        return (<Fish>pet).swim !== undefined;
    }
    if (isFish(pet)) {
        // 每当使用一些变量调用 isFish时，TypeScript会将变量缩减为那个具体的类型，只要这个类型与变量的原始类型是兼容的。
        pet.swim();
    } else {
        pet.fly();
    }


    // 3. 自动类型保护机制
    // instanceof 触发类型保护
    if (pet instanceof Fish) {
        // 类型细化为 Fish
        pet.swim();
    } else {
        // 类型细化为 Bird
        pet.fly();
    }
}


namespace at3_1{
    /**
     * TS 自动识别的类型保护： typeof。
     * 满足如下条件会被识别为类型保护，不需要手动添加类型谓词判断
     *  > typeof v === "typename"
     *  > typeof v !== "typename"，
     *  > "typename"必须是 "number"， "string"， "boolean"或 "symbol"。
     *
     * TypeScript并不会阻止你与其它字符串比较，语言不会把那些表达式识别为类型保护。
     */

    function padLeft(value: number | string | boolean): number | string[] | boolean {
        // error: 算术操作数必须为类型 "any"、"number" 或枚举类型
        // value ++;

        // 类型保护
        if (typeof value === 'number') {
            return value ++;
        } else if (typeof value === 'string') {
            return value.split('');
        } else {
            return !!value
        }
    }
}
