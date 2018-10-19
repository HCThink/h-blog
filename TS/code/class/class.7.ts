/**
 * 使用 typeof Greeter，意思是取Greeter类的类型，而不是实例的类型。
 * 或者更确切的说，"告诉我 Greeter标识符的类型"，也就是构造函数的类型。
 * 这个类型包含了类的所有静态成员和构造函数。
 */
namespace constructorType{
    class Greeter {
        static standardGreeting = "Hello, there";
        greeting: string;
        greet() {
            if (this.greeting) {
                return "Hello, " + this.greeting;
            }
            else {
                return Greeter.standardGreeting;
            }
        }
    }

    let greeter1: Greeter = new Greeter();
    Greeter.standardGreeting = 'cahnge default';
    console.log(greeter1.greet());  // cahnge default

    console.log(typeof Greeter);    // function

    let greeterMaker: typeof Greeter = Greeter;
    greeterMaker.standardGreeting = "Hey there!";

    // 简单来说 greeterMaker 就是一个类类型， 通过类类型实例化一个类对象。
    // 类似反射的概念，但是 js 始终是函数式语言，函数式一等公民，所以这种情景下的反射并没有 java 中的反射给人感觉那么强大。
    // 因为我们可以直接修改 Greeter.standardGreeting。
    let greeter2: Greeter = new greeterMaker();
    console.log(greeterMaker);              // [Function: Greeter]
    console.log(greeter2.greet());          // Hey there!
    // 反射之后 standardGreeting 已经被改变。
    console.log(new Greeter().greet());     // Hey there!
}
