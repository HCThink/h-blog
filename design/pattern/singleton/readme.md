# 单例模式

> 单例模式确保某一个类只有一个实例，而且自行实例化并向整个系统提供这个实例单例模式。单例模式只应在有真正的“单一实例”的需求时才可使用


### 基本条件

1. 私有构造
2. 私有静态属性引用实例
3. 静态方法提供实例

### 特征

1. 单例模式类只能有一个实例
2. 单例模式类必须自己创建自己的唯一实例
3. 单例模式类必须给所有其他对象提供这一实例


### 代码实现

完整代码参考： [singleton](./singleton.ts)

#### 懒汉式

由于 js 不存在多线程，也没有异步的构造，所以 js 的懒汉反而不需要什么同步机制啊，锁机制之类的控制

```typescript
class Singleton {
    private static SingletonObj: Singleton = null;
    private constructor(...any: any[]) {
        Object.assign(this, ...any);
    }

    static getInstance(...any: any[]): Singleton {
        // 在其他语言中这实际上有些线程不安全，但 js 是单线程语言则不存在这个问题。
        if (!this.SingletonObj) {
            // 用的时候创建
            // Lazy Loading, 如果从始至终从未使用过这个实例，则不会造成内存的浪费。
            this.SingletonObj = new Singleton(...any);
        }
        return this.SingletonObj;
    }
}

const sl: Singleton = Singleton.getInstance([1, 3, 5]);
console.log(sl);
```

#### 饿汉式

```typescript
class Singleton {
    private static SingletonObj: Singleton = new Singleton([1, 2, 4, 8]);
    private constructor(...any: any[]) {
        Object.assign(this, ...any);
    }

    static getInstance(): Singleton {
        return this.SingletonObj;
    }
}

// error: 类“Singleton”的构造函数是私有的，仅可在类声明中访问。
// const sl: Singleton = new Singleton(1, 3, 5);

const sl: Singleton = Singleton.getInstance();
console.log(sl);
```


### 注意

- 单例模式是可以达到节省资源的目的，但如果为了节省资源就使用单例模式的话可能造成单例模式的滥用。单例模式是为了确保在整个应用期间只有一个实例，以达到用户的特定的使用目的。
- 多线程环境需要考虑锁机制
- 实例指针一定要设为静态, 因为 getInstance 是静态的
- 懒汉是 时间换空间， 恶汉是空间换时间


### 应用、场景

- 适合初始化复杂对象，大型对象，避免重复实例化造成多次开销。
- 核心流程状态的一致性，比如交易之类的。
- 依据场景,时间，空间等合理选择懒汉和恶汉。


### 弊端

- 扩展困难，实例，构造都是 private。
- 线程安全问题[多线程语言]。
