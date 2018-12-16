{
    // sps
    const squ = (arg1) => arg1() ** 2

    const getArg = (n, fn) => fn(n);

    let n = 10;
    const re = squ(getArg.bind(null, n, (n) => n + 1));

    console.log(re);

}

{
    // thunk
    const squ = (arg1) => arg1() ** 2

    const getArg = (n, fn) => fn(n);
    const getArgThunk = thunkIfy(getArg);

    function thunkIfy(getArg) {
        return (n) => {
            return (fn) => () => getArg(n, fn);
        }
    }

    let n = 10;
    const re = squ(getArgThunk(n)(() => n + 1));

    console.log(re);
}
