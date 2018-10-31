使用如下命令编译：

node > 9

tsc --target ES6 --experimentalDecorators xx.ts && node xx.js

如果报错可以使用： ES5, 使用了 reflect-metadata .需要添加 --emitDecoratorMetadata 参数。

tsc --target ES5 --experimentalDecorators --emitDecoratorMetadata  xx.ts && node xx.js

调试

tsc --sourceMap --target ES5 --experimentalDecorators --emitDecoratorMetadata decorators.5.ts && ndb decorators.5.js
