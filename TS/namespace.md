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


## 注意
1. TypeScript 1.5里术语名已经发生了变化。 “内部模块”现在称做“命名空间”。 “外部模块”现在则简称为“模块”，这是为了与 ECMAScript 2015里的术语保持一致，(也就是说 module X { 相当于现在推荐的写法 namespace X {)。
2. 任何使用 module关键字来声明一个内部模块的地方都应该使用namespace关键字来替换。 这就避免了让新的使用者被相似的名称所迷惑。
