'use strict';
import "reflect-metadata";

namespace decorators {
    // @ts-ignore
    const requiredMetadataKey = Symbol("required");

    class Greeter {
        greeting: string;

        constructor(message: string) {
            this.greeting = message;
        }

        fn() {}

        @validate
        greet(loc, @required name: string) {
            // loc 仅仅用于占位， 用来测试 required 的第三个参数。
            return "Hello " + name + ", " + this.greeting;
        }
    }

    // 属性装饰器优先级更高
    function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
        console.log(`method： ${<string>propertyKey}，第 ${parameterIndex} 个参数。`);
        // 可能有多个 属性装饰器， 所以需要去 push 到已有队列中。
        let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
        existingRequiredParameters.push(parameterIndex);
        Reflect.defineMetadata(requiredMetadataKey, existingRequiredParameters, target, propertyKey);
    }

    // 方法装饰器： greet 增强
    function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
        let method = descriptor.value;
        descriptor.value = function () {
            let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
            if (requiredParameters) {
                for (let parameterIndex of requiredParameters) {
                    if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
                        throw new Error("Missing required argument.");
                    }
                }
            }

            return method.apply(this, arguments);
        }
    }

    const greeter = new Greeter('greeter');

    console.log(greeter.greet('', 'nice'));
}
