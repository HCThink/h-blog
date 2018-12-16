/**
 * @Author: hooper <hucheng-rj>
 * @Date:   2017-Nov-21 1:28:27 pm
 * @Email:  hooper.echo@gmail.com, hucheng-rj@ofo.com
 * @Filename: cb-dealsync.js
 * @Last modified by:   hucheng-rj
 * @Last modified time: 2017-Nov-21 2:52:01 pm
 *
 * @desc cb 处理多异步场景方案1: 控制发出顺序.
 */


function log(data, newLine) {
    console.log(JSON.stringify(Object(data)));
    newLine && console.log();
}

function ajax(url) {
    return function (cb) {
        setTimeout(function() {
            cb({
                url
            });
        }, Math.random() * 3000);
    }
}


const A = ajax('/ofo/a');

const B = ajax('/ofo/b');

const C = ajax('/ofo/c');


log('ajax A send...');
A(function (a) {
    log('ajax A receive...');
    log(a, true);

    log('ajax B send...');
    B(function (b) {
        log('ajax B receive...');
        log(b, true);

        log('ajax C send...');
        C(function (C) {
            log('ajax C receive...');
            log(C);
        });
    })
})
