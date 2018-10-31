'use strict';
namespace decorators {
    function fnPlus(target, propertyKey: string, descriptor: PropertyDescriptor) {
        const oldFn = target[propertyKey];
        target[propertyKey + '_plus'] = target[propertyKey] =  (...param) => {
            console.log('format param: ', ...param);
            const dealParam = oldFn.call(target, ...param);
            console.log('deal result: ', dealParam);
        }
    }

    class Person {
        @fnPlus
        fn(pa: string): string {
            console.log('fn call..');
            return pa;
        }
    }

    const lm = new Person();
    lm.fn('fn');
    console.log('----------');
    // @ts-ignore
    lm.fn_plus('fn_plus');
}
