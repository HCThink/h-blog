export default class Tools {
    // 重载无参无返回情况， 针对换行需求。
    static Log(): void;
    // 重载单一参数，有返回
    static Log(data: any): string;
    // 重载函数体： 参数是可选参数
    static Log(data?: any): string {
        if (data) {
            const dataStr = JSON.stringify(Object(data), null, 4)
            console.log();
            console.log(dataStr);
            return dataStr;
        } else {
            console.log();
        }
    }
}
