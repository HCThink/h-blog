/**
 * 仅仅为了说明问题而使用中文做标识符，十分不提倡！！！！
 * 仅仅为了说明问题而使用中文做标识符，十分不提倡！！！！
 * 仅仅为了说明问题而使用中文做标识符，十分不提倡！！！！
 */

namespace 饿汉式 {
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
}

namespace 懒汉式{
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

    // error: 类“Singleton”的构造函数是私有的，仅可在类声明中访问。
    // const sl: Singleton = new Singleton(1, 3, 5);

    const sl: Singleton = Singleton.getInstance([1, 3, 5]);

    console.log(sl);
}
