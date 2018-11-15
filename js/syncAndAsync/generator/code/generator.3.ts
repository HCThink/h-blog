
const Log = console.log;

namespace gen3 {
    /**
     * generator 入参和返回。
     */
    function x10(n: number): number {
        return 10 * n;
    }

    function* fn(n: number) {
        // yield x10(n) + 10 结果为：30， 下次 next 时传入的值做了 +10， 则 g1 值为： 40
        let g1 = yield x10(n) + 10;
        Log(g1);            // 40
        // 同理： (yield x10(g1)) 结果为： 40 * 10 = 400， 下次 next 时传入的值： 400 + 10 = 410
        // 代入中断的点： g1 = 410（yield x10(g1)） + 10 =  420
        g1 = (yield x10(g1)) + 10;
        Log(g1);            // 420
    }

    const fnGenx: Generator = fn(2);
    let genObj = fnGenx.next(100);    // 第一次入参会被丢弃， 因为他没有上一个 yield

    while (!genObj.done) {
        Log("outer: ", genObj.value);
        genObj = fnGenx.next(genObj.value + 10);
    }
}

Log()

namespace  gen3_1 {
    function* createIterator() {
        let first = yield 1;
        let second = yield first + 2; // 4 + 2
        // first =4 是next(4)将参数赋给上一条的
        yield second + 3;             // 5 + 3
    }

    let iterator = createIterator();

    Log(iterator.next());    // "{ value: 1, done: false }"
    Log(iterator.next(4));   // "{ value: 6, done: false }"
    Log(iterator.next(5));   // "{ value: 8, done: false }"
    Log(iterator.next());    // "{ value: undefined, done: true }"
}
