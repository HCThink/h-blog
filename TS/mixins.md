# mixins

> 混入： 代码复用。

但是一般来讲混入的对象之间不存在 is 的关系，也不是 has 的关系，就是一种单纯的代码复用，TS 中使用 implements 实现 mixins 总觉得有点别扭。

TS 中很多比较基础，比较重要的语法，功能不够单一，会随着操作数的不同二产生不同的效果，我认为是非常不好的设计。比如 implements， 如果右操作数可以是接口，也可以是类。 extends 的左右操作数也一样。徒增复杂度，用起来也别扭。

还不采用如用 vue 类似的 mixins 语法。


---

基本思路：

1. 利用 implements 强制添加操作占位。
2. 利用成员方法挂在在 prototype 上， 于是批量覆盖替换.
3. 其实吧，implements 是多余的， 还带来类型的变化。
4. 总之这个特性实现的不好，用起来别扭。

```typescript
// Disposable Mixin
class Disposable {
    isDisposed: boolean;
    dispose() {
        this.isDisposed = true;
    }

}

// Activatable Mixin
class Activatable {
    isActive: boolean;
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
}

class SmartObject implements Disposable, Activatable {
    constructor() {
        setInterval(() => console.log(this.isActive + " : " + this.isDisposed), 500);
    }

    interact() {
        this.activate();
    }

    // 占位： 不可省略， 类似 implements 接口
    isDisposed: boolean = false;
    dispose: () => void;

    isActive: boolean = false;
    activate: () => void;
    deactivate: () => void;
}
applyMixins(SmartObject, [Disposable, Activatable]);

let smartObj = new SmartObject();
setTimeout(() => smartObj.interact(), 1000);
// 类型已经被覆盖： Activatable { isDisposed: false, isActive: false }
console.log(smartObj);

////////////////////////////////////////
// In your runtime library somewhere
////////////////////////////////////////
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
```
