function ajax(url, cb) {
    console.log(url);
    setTimeout(() => {
        cb({ url, code: 200 });
    }, 200)
}

// 多个异步会干扰， 所以执行文件的时候 可以添加参数 1， 2， 3， eg： node node thunk.2.js 2 执行第二个模块 普通 thunk
const nodeArgs = +(process.argv.slice(2)[0] || 1);

nodeArgs === 1 && (() => {
    // 回调式
    ajax('http://xxx.com/1', (data) => {
        ajax('http://xxx.com/2', (data) => {
            ajax('http://xxx.com/2', (data) => {
                console.log('cb do something...');
            });
        });
    })
})()


nodeArgs === 2 && (() => {
    // 普通 thunk
    function thunkIfy(fn) {
        return (...args) => (cb) => fn.call(null, ...args, cb);
    }

    const thAjax = thunkIfy(ajax);
    const ajax1 = thAjax('http://xxx.com/1');
    const ajax2 = thAjax('http://xxx.com/2');
    const ajax3 = thAjax('http://xxx.com/3');

    ajax1((data1) => {
        ajax2((data2) => {
            ajax3((data3) => {
                console.log('thunk cb do something...');
            });
        });
    });
})();
