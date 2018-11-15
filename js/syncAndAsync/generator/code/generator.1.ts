namespace gen1 {
    Array.prototype['iterator'] = function* iterator(array: number[] = this) {
        let index: number = 0;
        while (index < array.length) {
            yield array[index++];
        }
    }

    const fbnq: number[] = [1, 1, 2, 3, 5, 8, 13, 21];

    // @ts-ignore
    let iteratorGen: Generator = fbnq.iterator();

    let n = iteratorGen.next();
    while (!n.done) {
        console.log(n.value);
        n = iteratorGen.next();
    }
}
