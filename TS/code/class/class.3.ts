namespace AccessModifier1 {
    interface AData {
        a1: string;
        a2: string;
        a3: string;
    }

    class A {
        private a1: string;
        protected a2: string;
        public a3: string;

        constructor({ a1, a2, a3 }: AData = <AData>{}) {
            this.a1 = a1;
            this.a2 = a2;
            this.a3 = a3;
        }

        visit(): void {
            // 自身随意访问
            console.log(this.a1, this.a2, this.a3);
        }
    }

    class B extends A{
        constructor(aData: AData) {
            super(aData);
        }

        childVisit(): void {
            // ERROR this.a1 : 子类可以访问 protected， 不可访问 private。
            console.log(this.a1, this.a2, this.a3);
        }
    }

    const aData = {
        a1: '1',
        a2: '2',
        a3: '3'
    };
    const a = new A(aData);
    // error a.a1, a.a2: 外部访问: 只能访问 pbulic。
    console.log(a.a1);
    console.log(a.a2);
    console.log(a.a3);

    const b = new B(aData);
    // console.log(b.a1);
    // console.log(b.a2);
    console.log(b.a3);
}


namespace AccessModifier2 {
    // 构造器 + 访问修饰符
    class A {
        private constructor() { }
        // protected constructor() { }

        static Singleton(): A {
            // 可以在内部进行初始化
            return new A();
        }

        desc() {
            console.log('singleton A..');
        }
    }

    // error: 不可继承类： 无法扩展类“A”。类构造函数标记为私有。
    class B extends A {

    }

    // error: private, protected 构造不能再外部实例化。 类“A”的构造函数是私有的，仅可在类声明中访问。
    new A();

    A.Singleton().desc();
}

namespace AccessModifier3 {
    // 构造器 + 访问修饰符
    class A {
        protected constructor() { }

        static Singleton(): A {
            // 可以在内部进行初始化
            return new A();
        }

        desc() {
            console.log('singleton A..');
        }
    }

    // 可继承类
    class B extends A {
        des() {
            new A();
        }
    }

    // error: protected 构造不能再外部实例化。 类“A”的构造函数是私有的，仅可在类声明中访问。
    new A();
    A.Singleton().desc();
}
