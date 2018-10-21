namespace t1 {
    interface ClockConstructor {
        new(hour: number, minute: number): ClockInterface;
    }
    interface ClockInterface {
        tick();
    }

    function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
        return new ctor(hour, minute);
    }

    class DigitalClock implements ClockInterface {
        constructor(h: number, m: number) { }
        tick() {
            console.log("beep beep");
        }
    }
    class AnalogClock implements ClockInterface {
        constructor(h: number, m: number) { }
    tick() {
            console.log("tick tock");
        }
    }

    let digital = createClock(DigitalClock, 12, 17);
    let analog = createClock(AnalogClock, 7, 32);

}

// namespace n2 {
//     interface SquareConfig {
//         color: string;
//         width?: number;
//         [propName: string]: any;
//     }

//     function createSquare({ color = 'ss', width = 100 }: SquareConfig): { color: string; area: number } {
//         return { color, area: width ** 2 }
//     }

//     let mySquare = createSquare({ color: "black", f: 2 });
//     // let mySquare = createSquare(<SquareConfig>{ color: "black", f: 2 });

//     console.log(mySquare);
// }



namespace ts{
    // function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
    //     return names.map(n => o[n]);
    // }

    // interface Person {
    //     name: string;
    //     age: number;
    // }
    // let person: Person = {
    //     name: 'Jarid',
    //     age: 35
    // };
    // let strings: string[] = pluck(person, ['name']); // ok, string[]

    // console.log(strings);

    // let personProps: keyof Person;

    class A {}
    class B extends A {
        constructor(public b: string) {
            super();
        }

        say(){}
    }

    interface Box {
        height: number;
        width: number;
    }

    interface Box {
        scale: number;
        // error: 标识符“scale”重复
        // scale: number;
    }

    class Box {
        length: number;

        // error: 接口的非函数的成员应该是唯一的。如果它们不是唯一的，那么它们必须是相同的类型。
        // 如果两个接口中同时声明了同名的非函数成员且它们的类型不同，则编译器会报错
        // width: string;
        // 允许声明合并的不同声明体中存在同名的属性。
        width: number;
    }

    // 标识符“Box”重复。
    // class Box {

    // }

    // 缺少属性“length”
    // let boxErr: Box = { height: 5, width: 6, scale: 10 };
    let box: Box = { height: 5, width: 6, scale: 10, length: 7 };
    console.log(box);
}
