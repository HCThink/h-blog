'use strict';
import "reflect-metadata";

namespace decorators {
    // @ts-ignore
    const formatMetadataKey = Symbol("format");

    enum format {
        toUpperCase,
        toLowerCase,
        toLocaleUpperCase,
        toLocaleLowerCase
    }

    /**
     * 当 @format("Hello, %s")被调用时，它添加一条这个属性的元数据，通过reflect-metadata库里的Reflect.metadata函数。
     * 当 getFormat被调用时，它读取格式的元数据。
     */
    class Greeter {
        @Reflect.metadata(formatMetadataKey, format.toLocaleUpperCase)
        greeting: string;

        constructor(message: string) {
            this.greeting = message;
        }

        greet() {
            let formatType = getFormat(this, "greeting");
            return `${format[formatType]}: ${this.greeting[format[formatType] || 0]()}`;
        }
    }

    function getFormat(target: any, propertyKey: string) {
        console.log(target, propertyKey);
        return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
    }

    const greeter = new Greeter('Greeter');
    console.log(greeter.greet());
}
