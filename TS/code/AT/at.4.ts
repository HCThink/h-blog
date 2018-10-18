namespace at4 {
    enum ShapeKind { square, rectangle, circle };
    const { square, rectangle, circle } = ShapeKind;

    interface Square {
        kind: ShapeKind.square;
        size: number;
    }
    interface Rectangle {
        kind: ShapeKind.rectangle;
        width: number;
        height: number;
    }
    interface Circle {
        kind: ShapeKind.circle;
        radius: number;
    }

    // 类型别名 + 联合类型
    type Shape = Square | Rectangle | Circle;

    function area(s: Shape): number {
        switch (s.kind) {
            // kind 做辩识
            case square: return s.size * s.size;
            case rectangle: return s.height * s.width;
            case circle: return Math.PI * s.radius ** 2;
            default: return assertNever<Shape>(s);
        }
    }

    // 这里有个小技巧，比如我们添加了一种新的图形，这时候我们讲 Shape 更新为：  Shape = Square | Rectangle | Circle | othShape;
    // 但是忘记了更新 switch case 的话， 新的类型就会走到 default 进而触发 error 。
    function assertNever<T>(x: T): never {
        throw new Error("Unexpected object: " + x);
    }

    const squareArea = area({
        kind: square,
        size: 10
    })
    const circleArea = area({
        kind: circle,
        radius: 5
    })

    console.log(squareArea, circleArea);
}
