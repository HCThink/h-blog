namespace gen2 {
    const Log = console.log;

    // 柯里化通式
    function currying (fn: Function, ...args) {
        return (...innargs) => fn(...args, ...innargs);
    }

    /**
     * generator 无限生成式 通用处理形如 A 的函数
     * 函数 A 描述
     *    函数描述的是某个无穷数列中。
     *    通过通用方式推导能得出数列中任意一项。
     * 比如： 斐波那契竖列, 阶乘, 等等。
     *
     * @param generator
     * @param n
     * @param list
     */
    function dealGenerator(generatorFn: GeneratorFunction, n: number, list: boolean = false): number | number[] {
        const generator: Generator = generatorFn();
        let index: number = 0;
        let re: IteratorResult<number> = generator.next();
        const reList: number[] = [re.value];

        while (++index < n && !re.done) {
            re = generator.next(re);
            reList.push(re.value);
        }

        return list ? reList : re.value;
    }

    // 斐波那契数列生成器： f(n) = f(n-1) + f(n-2)
    function* fib() {
        let [x, y]: [number, number] = [0, 1];
        while (true) {
            [x, y] = [y, x + y];
            yield x;
        }
    }

    // 三角数: fn = n*(n+1)/2
    function* triangle() {
        let x: number = 1;
        while (true) {
            yield (x * (x + 1)) / 2;
            x ++;
        }
    }

    // 正方形数: fn = n ** 2
    function* square() {
        let x: number = 1;
        while (true) {
            yield x ** 2;
            x ++;
        }
    }

    // 阶乘: fn = n!
    function* factorial() {
        let x: number = 1;
        let fac: number = 1;
        while (true) {
            yield fac;
            fac = fac * ++x;
        }
    }


    // 斐波那契数列生成器 柯里化
    const fibGen = currying(dealGenerator, fib);
    // 三角数 柯里化
    const triangleGen = currying(dealGenerator, triangle);
    // 三角数 柯里化
    const squareGen = currying(dealGenerator, square);
    // 阶乘
    const factorialGen = currying(dealGenerator, factorial);

    // 测试代码
    const count: number = 12;

    // 斐波那契数列
    let v: number = <number>fibGen(count);
    let listv: number[] = <number[]>fibGen(count, true);
    Log(v, listv);

    // 三角数
    v = <number>triangleGen(count, true);
    Log(v)

    // 正方形数
    v = <number>squareGen(count, true);
    Log(v)

    // 阶乘
    v = <number>factorialGen(count, true);
    Log(v)
}
