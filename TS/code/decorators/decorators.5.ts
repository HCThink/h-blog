'use strict';
import "reflect-metadata";

namespace decorators {
    type paramDecorators = {
        index: number,
        method: string | symbol,
        constructors: Function,
    };

    // @ts-ignore
    const requiredMetadataKey = Symbol("required");

    class Greeter {
        greeting: string;

        constructor(message: string) {
            this.greeting = message;
        }

        fn() {}

        @validate
        greet(p1, p2, p3, @required name: string, p5) {
            // loc 仅仅用于占位， 用来测试 required 的第三个参数。
            return "Hello " + name + ", " + this.greeting;
        }
    }

    // 属性装饰器优先级更高
    function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
        // console.log(`method： ${<string>propertyKey}，第 ${parameterIndex + 1} 个参数。`);
        // 可能有多个 属性装饰器， 所以需要去 push 到已有队列中。
        let existingRequiredParameters: paramDecorators[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
        existingRequiredParameters.push({
            index: parameterIndex,
            method: propertyKey,
            constructors: target.constructor,
        });
        debugger;
        Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
    }

    // 方法装饰器： greet 增强
    function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
        let method = descriptor.value;
        descriptor.value = function () {
            let requiredParameters: paramDecorators[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
            if (requiredParameters) {
                for (let { index, method, constructors } of requiredParameters) {
                    if (index >= arguments.length || arguments[index] === undefined) {
                        // 只是为了说明问题， 实际上 method 并非直接挂在 class 上的。
                        // @ts-ignore
                        throw (`${constructors.name}.${String(method)}[ ${constructors.name}.prototype.${String(method)} ] 第 ${index + 1} 个参数是必传参数，请提供。`);
                        // throw new Error("Missing required argument.");
                    }
                }
            }

            return method.apply(this, arguments);
        }
    }

    const greeter = new Greeter('greeter');

    // @ts-ignore
    console.log(greeter.greet());
}
