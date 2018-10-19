/**
 *  接口继承， 抽象类，
 */

// 这个接口用于描述构造器
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

// 模拟时钟
class DigitalClock extends ClockInterfaceAbs {
    // 如果没有扩展属性，可以省略，交给抽象了统一处理， 如果有 调用 super。
    // constructor(h: number, m: number) {
    //     super(h, m);
    // }
    help() {}
}

// 数码时钟
class AnalogClock extends ClockInterfaceAbs {
    help() { }
}

/**
 *
 * @param ctor 构造函数： 由 ClockConstructor 描述并约束
 * @param hour
 * @param minute
 */
function createClock(ctor: ClockConstructor, hour: number, minute: number): ClockInterface {
    return new ctor(hour, minute);
}

let digital = createClock(DigitalClock, 12, 17);
let analog = createClock(AnalogClock, 7, 32);

console.log(digital, analog);

console.log(digital.tick());
