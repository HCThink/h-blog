/**
 * 接口多实现， 接口继承接口
 *
 * 和类一样，接口也可以相互继承。 这让我们能够从一个接口里复制成员到另一个接口里，可以更灵活地将接口分割到可重用的模块里。
 *
 * 一个接口可以继承多个接口，创建出多个接口的合成接口。
 */

namespace i3 {
    interface A1 {
        a1: number;
    }

    interface A2 {
        a2: number;
    }

    interface B extends A1, A2 {
        b: number;
    }

    interface C {
        c: number;
    }

    class D { }

    class E extends D implements B, C {
        a1: number;
        a2: number;
        b: number;
        c: number;
    }
}
