# 怎么使 if(aﾠ==1 && a== 2 && ﾠa==3) 返回 true?


- toString / valueOf : 最直接的方案
```javascript
let a = {
    i: 1,
    toString: function () {
        return a.i++;
    }
}
```

- getter : 新式
```javascript
var i = 0;

with({
  get a() {
    return ++i;
  }
}) {
  if (a == 1 && a == 2 && a == 3)
    console.log("wohoo");
}

// or

Object.defineProperty(window, 'a', {
    get: function() {
        return ++val;
    }
});

// or

window.__defineGetter__( 'a', function(){
    if( typeof i !== 'number' ){
        // define i in the global namespace so that it's not lost after this function runs
        i = 0;
    }
    return ++i;
});
```

- es6 Proxy
```javascript
var a = new Proxy({ i: 0 }, {
    get: (target, name) => name === Symbol.toPrimitive ? () => ++target.i : target[name],
});
console.log(a == 1 && a == 2 && a == 3);
```

- 别具匠心
```javascript
// This works because == invokes toString which calls .join for Arrays.
a = [1,2,3];
a.join = a.shift;
console.log(a == 1 && a == 2 && a == 3);
```

- 新潮
```javascript
// Another solution, using Symbol.toPrimitive which is an ES6 equivalent of toString/valueOf
let a = {[Symbol.toPrimitive]: ((i) => () => ++i) (0)};

console.log(a == 1 && a == 2 && a == 3);
```

- amazed 最让我吃惊的方案
```javascript
var aﾠ = 1;
var a = 2;
var ﾠa = 3;
if(aﾠ ==1 && a == 2 && ﾠa ==3) {
    console.log("Why hello there!")
}

// let aﾠ = 1;
// let a = 2;
// let ﾠa = 3;
// https://stackoverflow.com/questions/48270127/can-a-1-a-2-a-3-ever-evaluate-to-true#
// 这里三个是不同的变量，第一个和第三个 a 前后的空白字符不是空格，Unicode FFA0
// 请注意if 语句中的奇怪间距。它是半宽度韩文=,=。这是一个 Unicode 空格字符，但是 ECMAScript 不将其解释为一个空格 —— 这意味着它是一个有效的标识符。因此有三个完全不同的变量，一个是a后加半宽度韩文，一个是a， 一个是a前加半宽度韩文。

```

- 覆盖式: 原理同上, if 后面有一个字符. 在 chrome 调试中可以看得到, 你没法覆盖掉真正的 if. 所以大括号必须新起一行
```javascript
if‌=()=>!0;

var i = 1;
if‌(i == 1 && i == 2 && i == 3)
{
    console.log(i)
}
```


- 拓展: 数字变量名
```javascript
var  a = 1;
var ﾠ1 = a;
var ﾠ2 = a;
var ﾠ3 = a;
console.log( a ==ﾠ1 && a ==ﾠ2 && a ==ﾠ3 );
```
