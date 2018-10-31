# TypeScript

🌀 高级特性：
- 类型, 高级类型
- 类型推断，类型兼容
- 接口，类，抽象类
- 成员访问权限控制
- 命名空间
- 模块，模块解析
- 封装继承->多态
- override 、 overload
- 类似反射机制
- 泛型
- 装饰器
- mixins
- jsx

### [base](./base.md)

### [interface](./interface.md)

### [class](./class.md)

### [__综合使用案例__](./code/polymorphism/src/)

- [目录](./code/polymorphism/src/)
- [入口](./code/polymorphism/src/main.ts)

### [function](./function.md)

### [泛型](./Generics.md)

### [高级类型](./advancedTypes.md)                （小部分未完成）

### [module](./module.md)                （小部分未完成）

### [namespace](./namespace.md) [模块和命名空间的取舍]

### [mixins](./mixins.md)

### [modifier](./modifier.md)

### [模块解析](./moduleResolution.md)                （小部分未完成）

### [装饰器](./decorators.md)

### [javascript 文件类型检查](./fileTypeChecking.md)

### [update 2.7+](./update/readme.md)                （跟进+补充）

### [声明文件](./d.ts.md)

### [配置文件](./tsconfig.md)

---

### [接入 & 迁移 & 构建](./TODO.md)
### [react](./TODO.md)


[TODO](./TODO.md)


---

### 强调

1. TypeScript 使用的是结构性类型系统, 参考 base.md >
   [类型兼容性](./base.md##Type) 。 当我们比较两种不同的类型时，并不在乎它们从何处而来(类型是否匹配，或者存在与相同的继承关系)，如果所有成员的类型都是兼容的，我们就认为它们的类型是兼容的。[demo](./code/class/class.9.ts)
2. 同一个属性的  get set 方法如果都存在，则访问修饰符必须一致，访问器装饰器声明在一个访问器的声明之前
3. 多态性：多种形态。 父类引用指向子类实例， 以父类为模板，以具体实现类的方法为实现【该引用中的成员以引用类型为准，指向的实现类扩展成员不可访问，实现以指向实例为准。多种状态】。
4. 接口声明的规范都是默认 公开 的， 不能使用访问修饰符修饰，包括 public，可以声明行为和属性。
5. instanceof 的右操作数必须是一个构造函数，接口抽象类都不行。
6. 接口可以继承类，包括 private 属性也能继承。
7. 类可以实现类，用以实现 mixins
