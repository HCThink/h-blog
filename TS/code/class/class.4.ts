namespace getStateFormClass {
    class A {
        public a: string
        private a1: string;
        protected a2: string

        constructor(a, a1, a2) {
            this.a = a;
            this.a1 = a1;
            this.a2 = a2;
        }
    }

    class B extends A {
        constructor(a, a1, a2) {
            super(a, a1, a2)
        }
    }

    const b: B = new B('1', '2', '3');

    // 尽管不能访问私有，保护的属性, 但是直接输出 b 还是能够得到完整的结构
    // B { a: "1", a1: "2", a2: "3" }
    console.log(b);

    //所以说还是能够拿到类的内部状态. 但是拿不到方法
    const cbs = JSON.parse(JSON.stringify(b));
    console.log(cbs.a, cbs.a1, cbs.a2);
}
