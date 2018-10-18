export default class Tools {
    // 重载函数体： 参数是可选参数
    static Log(data) {
        if (data) {
            const dataStr = JSON.stringify(Object(data), null, 4);
            console.log();
            console.log(dataStr);
            return dataStr;
        }
        else {
            console.log();
        }
    }
}
