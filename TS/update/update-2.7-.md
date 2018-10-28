# TS2.7- 版本部分重要特性梳理

### [TS2.6](https://www.tslang.cn/docs/release-notes/typescript-2.6.html)

1. 严格函数类型
2. 通过 '// @ts-ignore' 注释隐藏 .ts 文件中的错误


### TS2.5

...

### TS2.4

1. 支持字符串枚举值

2. 动态导入表达式: 没成功
```typescript
async function getZipFile(name: string, files: File[]): Promise<File> {
    const zipUtil = await import('./utils/create-zip-file');
    const zipContents = await zipUtil.getContentAsBlob(files);      // error
    return new File(zipContents, name);
}
```

### TS2.3

1. 迭代器和生成器支持： Iterator, Generator. 引入 AsyncIterator

```typescript
interface AsyncIterator<T> {
  next(value?: any): Promise<IteratorResult<T>>;
  return?(value?: any): Promise<IteratorResult<T>>;
  throw?(e?: any): Promise<IteratorResult<T>>;
}
```

2. 异步生成器

```typescript
async function* g() {
  yield 1;
  await sleep(100);
  yield* [2, 3];
  yield* (async function *() {
    await sleep(100);
    yield 4;
  })();
}
```

3. 异步可迭代对象迭代器： for-await-of。

ES2015引入了for..of语句来迭代可迭代对象。相似的，异步迭代提案引入了for..await..of语句来迭代可异步迭代的对象。

```typescript
async function f() {
  for await (const x of g()) {
     console.log(x);
  }
}
```

4. 泛型参数默认类型

```typescript
declare function create<T extends HTMLElement = HTMLDivElement, U = T[]>(element?: T, children?: U): Container<T, U>;
```

5. --checkJS选项下 .js 文件中的错误

即便使用了--allowJs，TypeScript编译器默认不会报 .js 文件中的任何错误。TypeScript 2.3 中使用--checkJs选项，.js文件中的类型检查错误也可以被报出.

你可以通过为它们添加// @ts-nocheck注释来跳过对某些文件的检查，反过来你也可以选择通过添加// @ts-check注释只检查一些.js文件而不需要设置--checkJs编译选项。你也可以通过添加// @ts-ignore到特定行的一行前来忽略这一行的错误.


### TS2.2

1. object类型

TypeScript没有表示非基本类型的类型，即不是number | string | boolean | symbol | null	| undefined的类型。一个新的object类型登场。

```typescript
declare function create(o: object | null): void;
```

2. 支持 new.target

new.target元属性是ES2015引入的新语法。当通过new构造函数创建实例时，new.target的值被设置为对最初用于分配实例的构造函数的引用。如果一个函数不是通过new构造而是直接被调用，那么new.target的值被设置为undefined。

很多库里都会有一段代码判断用户的调用方式，通过 this instanceof 等判断调用方式是不是 new ，如果不是则将 `return new  xxx（param）`,现在可以使用 `mew.target` 处理

```typescript
function f() {
  if (new.target) { /* called via 'new' */ }
}
```

3. 新的jsx: react-native


### TS2.1

1. keyof和查找类型

在JavaScript中属性名称作为参数的API是相当普遍的，但是到目前为止还没有表达在那些API中出现的类型关系。

输入索引类型查询或keyof，索引类型查询keyof T产生的类型是T的属性名称。keyof T的类型被认为是string的子类型。

```typescript
interface Person {
    name: string;
    age: number;
    location: string;
}

type K1 = keyof Person; // "name" | "age" | "location"
type K2 = keyof Person[];  // "length" | "push" | "pop" | "concat" | ...
type K3 = keyof { [x: string]: Person };  // string

// -------------

function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key];  // 推断类型是T[K]
}

function setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]) {
    obj[key] = value;
}

let x = { foo: 10, bar: "hello!" };

let foo = getProperty(x, "foo"); // number
let bar = getProperty(x, "bar"); // string

let oops = getProperty(x, "wargarbl"); // 错误！"wargarbl"不存在"foo" | "bar"中

setProperty(x, "foo", "string"); // 错误！, 类型是number而非string

```
