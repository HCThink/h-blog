/**
 *  接口继承， 抽象类，
 */

// 这个接口作为返回值描述，描述了用两个 number 类型的参数去实例化，然后返回一个 ClockInterface 对象。
// 接口使用 new 关键字和类似构造入参 一级返回值类型描述。
interface ClockConstructor {
    new(hour: number, minute: number): ClockInterface;
}
interface ClockInterface {
    h: number;
    m: number;
    tick();
    help();
}

// 抽象类。
abstract class ClockInterfaceAbs implements ClockInterface{
    h: number;
    m: number;

    constructor(h: number, m: number) {
        this.h = h;
        this.m = m
    }

    abstract help();

    tick(): string {
        return `(h: ${this.h}, m: ${this.m})`;
    }
}

class DigitalClock extends ClockInterfaceAbs {
    constructor(h: number, m: number) {
        super(h, m);
    }
    help() {}
}
class AnalogClock extends ClockInterfaceAbs {
    constructor(h: number, m: number) {
        super(h, m);
    }
    help() { }
}

function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);

console.log(digital, analog);

console.log(digital.tick());
