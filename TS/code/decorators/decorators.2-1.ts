'use strict';
namespace decorators {
    function fnPlus(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const oldFn = target[propertyKey];
        descriptor.value = (...param) => {
            console.log('before fn deal:', ...param);
            const dealParam = oldFn.call(target, ...param);
            console.log('after fn deal:', dealParam);
        }
    }

    class Person {
        @fnPlus
        fn(pa: string): string {
            console.log('fn deal..');
            return pa;
        }
    }

    const lm = new Person();
    lm.fn('fn');
}
