# namespace

> 代码组织方案之一。
> 适合处理那种不足以份文件维护的代码量。

---

1. 基础语法
```typescript
namespace xxx {
    // every thing of ts
}
```

1. 多 `namespace`

- 单文件多
  单个文件可以重复定义 namespace ，但是同名 namespace 之间的数据只要 export 了就可以直接在其他同名命名空间下使用。
    [namespace.1.ts](./code/namespace/namespace.1.ts)

  * 不推荐一个文件中存在多个同名命名空间。

- 多个文件
  多个文件里可以存在同名的 namespace ，通过 三斜线指令引用，可以使用其他文件的同名命名空间 export 的成员

  注意： 1. 使用三斜线指令引入对应文件。  2. 需要收
    [namespace.1.js](./code/namespace/namespace.1.js)
    [namespace.1.ts](./code/namespace/namespace.1.ts)
    [namespace.2.ts](./code/namespace/namespace.2.ts)


2. namespace 别名： 场景不多，和 `import x = require...` 区分度不高。
```typescript
namespace Shapes {
    export namespace Polygons {
        export class Triangle { }
        export class Square { }
    }
}

import polygons = Shapes.Polygons;
let sq = new polygons.Square();
```


---


### __模块 & 命名空间__

命名空间:
- 命名空间组织代码，很难去识别组件之间的依赖关系，尤其是在大型的应用中。

模块:
- 命名空间一样，模块可以包含代码和声明。 不同的是模块可以 声明它的依赖。
- 模块会把依赖添加到模块加载器上（例如CommonJs / Require.js）。 对于小型的JS应用来说可能没必要，但是对于大型应用，这一点点的花费会带来长久的模块化和可维护性上的便利。 模块也提供了更好的代码重用，更强的封闭性以及更好的使用工具进行优化。

对于Node.js应用来说，模块是默认并推荐的组织代码的方式。

从ECMAScript 2015开始，模块成为了语言内置的部分，应该会被所有正常的解释引擎所支持。 因此，对于新项目来说推荐使用模块做为组织代码的方式


#### 误区

1. 对模块使用/// <reference>

一个常见的错误是使用/// <reference>引用模块文件，应该使用import.

2. 不必要的命名空间

```typescript
export namespace Shapes {
    export class Triangle { /* ... */ }
    export class Square { /* ... */ }
}
```

TypeScript里模块的一个特点是不同的模块永远也不会在相同的作用域内使用相同的名字。 因为使用模块的人会为它们命名，所以完全没有必要把导出的符号包裹在一个命名空间里。

请注意： 不应该对模块使用命名空间，使用命名空间是为了提供逻辑分组和避免命名冲突。 模块文件本身已经是一个逻辑分组，并且它的名字是由导入这个模块的代码指定，所以没有必要为导出的对象增加额外的模块层。



## 注意
1. TypeScript 1.5里术语名已经发生了变化。 “内部模块”现在称做“命名空间”。 “外部模块”现在则简称为“模块”，这是为了与 ECMAScript 2015里的术语保持一致，(也就是说 module X { 相当于现在推荐的写法 namespace X {)。
2. 任何使用 module关键字来声明一个内部模块的地方都应该使用namespace关键字来替换。 这就避免了让新的使用者被相似的名称所迷惑。
