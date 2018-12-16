/**
 * @Author: hooper <hucheng-rj>
 * @Date:   2017-Nov-21 1:28:27 pm
 * @Email:  hooper.echo@gmail.com, hucheng-rj@ofo.com
 * @Filename: cb-dealsync.js
 * @Last modified by:   hucheng-rj
 * @Last modified time: 2017-Nov-22 11:25:26 am
 *
 * @desc cb 处理多异步场景方案2: 控制处理顺序.
 */

function log(data, newLine) {
    console.log(JSON.stringify(Object(data), null, 4));
    newLine && console.log();
}

const sender = [];
function ajax(url, time) {
    return function(cb) {
        sender.push(url);
        setTimeout(function() {
            const data = {
                from: url,
                reso: 'ok'
            };

            dealReceive({url, cb, data});
        }, time);
    }
}


const receiver = {};
function dealReceive({url, cb, data}) {
    receiver[url] = {cb, data};
    for (var i = 0; i < sender.length; i++) {
        let operate = receiver[sender[i]];
        if(typeof operate === 'object') {
            operate.cb.call(null, operate.data);
        } else {
            return;
        }
    }
}

const A = ajax('/ofo/a', 4000);

const B = ajax('/ofo/b', 600);

const C = ajax('/ofo/c', 2000);


A(function (a) {
    log(a);
});

B(function (b) {
    log(b);
});

C(function (c) {
    log(c);
});

// {"from":"/ofo/a","reso":"ok"}
// {"from":"/ofo/b","reso":"ok"}
// {"from":"/ofo/c","reso":"ok"}
