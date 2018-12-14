# Delegates(TJ)

[homepage](https://github.com/tj/node-delegates)

> Delegates 可以帮我们方便快捷地使用设计模式当中的委托模式（Delegation Pattern），即外层暴露的对象将请求委托给内部的其他对象进行处理.


## 基础使用

基本用法就是将内部对象的变量或者函数绑定在暴露在外层的变量上，直接通过 delegates 方法进行如下委托。

主要 api 也很简单明了：

- Delegate(proto, prop):
Creates a delegator instance used to configure using the prop on the given proto object. (which is usually a prototype)
- getter：外部对象可以直接访问内部对象的值
- setter：外部对象可以直接修改内部对象的值
- access：包含 getter 与 setter 的功能
- method：外部对象可以直接调用内部对象的函数

```js
const delegate = require('delegates');

const School = {
  Class: {
    id: 10000,
    name: 'B-3',
    level: '高中',
    studentList: [],
    tech(){
      // .... tech
    },
    put(student){
      this.student.push(student);
    }
  }
};

const { Class: classes } = School;

delegate(School, 'Class')
  .method('tech')
  .access('name')
  .getter('id')
  .setter('level');

// 委托之后就可以使用 School 操作 School.Class 上被委托的属性
console.log(School.name, School.id, School.level, 'level' in School, 'put' in School, 'tech' in School);
console.log(classes.name, classes.id, classes.level, 'level' in classes, 'put' in classes, 'tech' in classes);

School.level = '重点高中';
console.log(School.level, School.Class.level);

// B-3 10000 undefined true false true
// B-3 10000 高中 true true true
// undefined '重点高中'
```

> fluent
```js
const delegate = require('delegates');

const obj = {
  settings: {
    env: 'development'
  }
};

delegate(obj, 'settings').fluent('env');

console.log(typeof obj.env, obj.env());
console.log(obj.env('setting production'));
console.log(obj.env(), obj.env() === obj.settings.env);
// function development
// { settings: { env: 'setting production' }, env: [Function] }
// setting production true
```

> auto
```js
const delegate = require('../index');

const obj = {
    main: {
        a: 1,
        b: 2,
        c() {

        }
    }
}

delegate.auto(obj, obj.main, 'main');
console.log(obj.a, obj.main.a, obj.b, obj.c === obj.main.c);
```


## 源码分析

__所有源码分析均以「注释」的方式提供在如下源码文件中【私以为这么做相对好一些，有更好的方式欢迎告知】__

源码参考：[delegates.js source](./index.js)


## 问题

使用已经废弃的 api

`Delegator.prototype.getter` ， `Delegator.prototype.setter` 两个 api 实现中使用了 `__defineGetter__ or __defineSetter__` , 这两个 api 是非标准 api ，并且目前已经明确表明废弃了。

修正方案：

```js
Object.defineProperty(proto, name, {
    get() {
        return this[target][name];
    }
});
```

__TJ 已经不更新，此库慎用__

## koa 使用此库。

[koa 源码分析](../koa2/readme.md)

## 参考 & 鸣谢

- https://github.com/tj/node-delegates
- https://juejin.im/post/5b9339136fb9a05d3634ba13
