/**
 * 基础接口继承模型
 */

// 抽象接口
interface Animal {
    age: number;
    height: number;
    widget: number;

    say(): string;
}

interface Personal {
    readonly name: string;

    talk(): Personal;
}


// 数据描述接口
interface ChineseInterfaceData {
    sel: number;
    age: number;
    name: string;
    height?: number;
    widget?: number;
}

class Chinese implements Animal, Personal {
    age: number;
    name: string;
    height: number;
    public widget: number;
    protected readonly sel: number;

    constructor({
        sel,
        name,
        age = 0,
        widget = 0,
        height = 0,
    }: ChineseInterfaceData = <ChineseInterfaceData>{}) {
        this.name = name;
        this.age = age;
        this.widget = widget;
        this.height = height;

        this.sel = sel;
    };

    talk(): Chinese {
        return this;
    };

    say(): string {
        return `${this.name}, ${this.age}`;
    };
}


const lm: Chinese = new Chinese({ name: 'lm', age: 10, sel: 10000 });

console.log(lm);
