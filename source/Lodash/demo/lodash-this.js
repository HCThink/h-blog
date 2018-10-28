(function () {
    const root = this;
    // 利用 Function 中的代码始终在全局域执行.
    const root1 = Function('return this')();

    console.log(root, root === global, root1 === global);
}.call({a: 2}))