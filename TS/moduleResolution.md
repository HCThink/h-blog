# 模块解析

> 模块的实现细节

模块解析是指编译器在查找导入模块内容时所遵循的流程。


---


## 模块解析

TS 对 `import { a } from "moduleA";` 这样一个基本引入语句是怎么处理的呢？


### 模块解析流程

实际上这并不容易，由于 node 设计上的缺陷【作者都认为是缺陷了】，导致现在所有 node 和 node 周边设施的引入大多遵循这一规则：import 、 require 没有后缀，着看似人性化，实际上并非如此。deno 已经不这么干了。

回到 TS 上，同样的 TS 也有这样的省略， 所以 moduleA 可能在你写的某个.ts/.tsx文件，或者在你的代码所依赖的.d.ts里。

首先，编译器会尝试定位表示导入模块的文件。 编译器会遵循以下二种策略之一： [Classic](#node)或[Node](#Classic)。 这些策略会告诉编译器到 哪里去查找moduleA。

如果上面的解析失败了并且模块名是非相对的（且是在"moduleA"的情况下），编译器会尝试定位一个外部模块声明。

最后，如果编译器还是不能解析这个模块，它会记录一个错误。 在这种情况下，错误可能为 error TS2307: Cannot find module 'moduleA'.


1. 相对 vs. 非相对模块导入

根据模块引用是相对的还是非相对的，模块导入会以不同的方式解析。

- 相对导入是以/，./或../开头的
- 所有其它形式的导入被当作非相对的, eg:

```typescript
import * as $ from "jQuery";
import { Component } from "@angular/core";
```

相对导入在解析时是相对于导入它的文件，并且不能解析为一个外部模块声明。 __你应该为你自己写的模块使用相对导入__，这样能确保它们在运行时的相对位置。

非相对模块的导入可以相对于baseUrl或通过下文会讲到的路径映射来进行解析。 它们还可以被解析成 外部模块声明。 使用非相对路径来导入你的外部依赖。

注： 部分项目[vue 源码？记不清了]，目录过深的时候，往往会将几个基础目录做处理，你可能会看到 `require('widget/xxx')`, 这种虽然简单，单也引起理解上的不便，并且和非相对模块区分度不高。可以考虑加个项目标识前缀。


模块解析策略：Node和Classic。 你可以使用 --moduleResolution标记来指定使用哪种模块解析策略。若未指定，那么在使用了 --module AMD | System | ES2015 时的默认值为Classic，其它情况时则为Node。


#### Classic

这种策略在以前是TypeScript默认的解析策略。 现在，它存在的理由主要是为了向后兼容。

- 相对导入的模块是相对于导入它的文件进行解析的。 因此 /root/src/folder/A.ts文件里的import { b } from "./moduleB"会使用下面的查找流程：

```sh
/root/src/folder/moduleB.ts
/root/src/folder/moduleB.d.ts
```

- 对于非相对模块的导入，编译器则会从包含导入文件的目录开始依次向上级目录遍历，尝试定位匹配的声明文件。比如：import { b } from "moduleB"，它是在/root/src/folder/A.ts文件里，会以如下的方式来定位"moduleB"：

```sh
/root/src/folder/moduleB.ts
/root/src/folder/moduleB.d.ts
/root/src/moduleB.ts
/root/src/moduleB.d.ts
/root/moduleB.ts
/root/moduleB.d.ts
/moduleB.ts
/moduleB.d.ts
```


#### ndoe: [node api ](https://nodejs.org/api/modules.html#modules_all_together)

- 相对导入： /root/src/moduleA.js，包含了一个导入var x = require("./moduleB"); Node.js 解析顺序如下：

1. 检查/root/src/moduleB.js文件是否存在。
2. 检查/root/src/moduleB目录是否包含一个package.json文件，且package.json文件指定了一个"main"模块。 在我们的例子里，如果Node.js发现文件 /root/src/moduleB/package.json包含了{ "main": "lib/mainModule.js" }，那么Node.js会引用/root/src/moduleB/lib/mainModule.js。
3. 检查/root/src/moduleB目录是否包含一个index.js文件。 这个文件会被隐式地当作那个文件夹下的"main"模块。


- 非相对模块导入: Node会在一个特殊的文件夹 node_modules 逐层目录向上递归查询

```sh
1. /root/src/node_modules/moduleB.js
2. /root/src/node_modules/moduleB/package.json (如果指定了"main"属性)
3. /root/src/node_modules/moduleB/index.js

4. /root/node_modules/moduleB.js
5. /root/node_modules/moduleB/package.json (如果指定了"main"属性)
6. /root/node_modules/moduleB/index.js

7. /node_modules/moduleB.js
8. /node_modules/moduleB/package.json (如果指定了"main"属性)
9. /node_modules/moduleB/index.js
```


#### TypeScript如何解析模块

TypeScript是模仿Node运行时的解析策略来在编译阶段定位模块定义文件。 因此，TypeScript在Node解析逻辑基础上增加了TypeScript源文件的扩展名（ .ts，.tsx和.d.ts）。 同时，TypeScript在 package.json里使用字段"types"来表示类似"main"的意义 - 编译器会使用它来找到要使用的"main"定义文件。

- 相对导入：基本上是 node 检索文件方式。

```sh
/root/src/moduleB.ts
/root/src/moduleB.tsx
/root/src/moduleB.d.ts
/root/src/moduleB/package.json (如果指定了"types"属性)
/root/src/moduleB/index.ts
/root/src/moduleB/index.tsx
/root/src/moduleB/index.d.ts
```

- 非相对模块导入: 依据当前文件的路径，依次递归向上检索 `node_modules` 文件夹下的 `.ts` , `.tsx`, `.d.ts`  ....

```sh
/root/src/node_modules/moduleB.ts
/root/src/node_modules/moduleB.tsx
/root/src/node_modules/moduleB.d.ts
/root/src/node_modules/moduleB/package.json (如果指定了"types"属性)
/root/src/node_modules/moduleB/index.ts
/root/src/node_modules/moduleB/index.tsx
/root/src/node_modules/moduleB/index.d.ts

....

在上层目录中重复上述过程
```


---


## 附加的模块解析标记

通常情况下，工程源码结构与输出结构不同，伴随编译构建，会引起一些变化：.ts编译成.js，不同位置的依赖拷贝至一个输出位置, 文件名，路径都可能不同。

TypeScript编译器有一些额外的标记用来通知编译器在源码编译成最终输出的过程中都发生了哪个转换。

有一点要特别注意的是编译器不会进行这些转换操作； 它只是利用这些信息来指导模块的导入。

参考： [附加的模块解析标记](https://www.tslang.cn/docs/handbook/module-resolution.html)
