/**
 * 使用泛型定义函数后，函数体的实现却显得很不自由。简单的操作都有很多限制，考虑类型和转换等问题。
 * 很多类型不能断言到具体类型，不得不将其 any 化。
 * 其实与其转成 any 还不如使用 any 或者 直接不写类型。徒增复杂度。
 *
 * 如下提供了两种设计方案解决上述问题
 */
namespace generics1 {
    // 泛型和实现分离
    interface Animal<T, U, V> {
        // 联合类型 U | V
        eat(food: T): U | V;
    }

    class Dog implements Animal<Food, string, null> {
        // U | V => string | null
        eat(food: Food): string | null{
            return food.name;
        }

        static eat(food: Food): string {
            return food.name;
        }
    }

    class Food {
        constructor(public name: string) {}
    }

    const eatWhat = new Dog().eat(new Food('骨头'));

    console.log(eatWhat);
}

namespace generics2 {
    // 使用接口将函数泛型转移到抽象描述上，使用匿名函数表达式实现抽象描述。 也能做解决上述问题。
    interface GenericIdentityFn<T> {
        (arg: T): T;
    }

    let myIdentity: GenericIdentityFn<number> = function (n: number): number {
        return n ** 2;
    }

    console.log(myIdentity(5));
}

namespace generics3 {
    /**
     * 官方提供的方案， 我认为很别扭。可能只是个说明。
     */
    class GenericNumber<T> {
        zeroValue: T;
        // 属性化化方法。我认为不是一种好的实现
        add: (x: T, y: T) => T;
    }

    let myGenericNumber = new GenericNumber<number>();
    myGenericNumber.zeroValue = 0;
    myGenericNumber.add = function (x, y) { return x + y; };
}

namespace generics4 {
    // 定义泛型规范用来解决上述问题。
    interface Lengthwise {
        length: number;
    }

    function loggingIdentity<T extends Lengthwise>(arg: T): T {
        console.log(arg.length);  // Now we know it has a .length property, so no more error
        return arg;
    }

    // error： 如果如下方式能成功， 则此方案是个好选择， 局限性还是比较大
    // function loggingIdentity_1<T extends Number>(arg: T): T {
    //     return arg++;
    // }
}
