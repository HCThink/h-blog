/**
 * 静态成员也能继承， omg!
 */
namespace static {
    class A {
        static a = 1;
        private static b = 2;
        protected static c = 3;

        static f1() {
            this.f3();
        }
        protected static f3() {
            this.f2();
        }
        private static f2() {
            console.log(`(a: ${this.a}, b: ${this.b}, c: ${this.c})`);
        }
    }

    class B extends A {}

    console.log(B.a);
    // error  Property 'b' is private and only accessible within class 'A'.
    // console.log(B.b);
    // console.log(B.c);

    B.f1();
    // error 属性“f2”为私有属性，只能在类“A”中访问
    // B.f2();
    // B.f3();
}
