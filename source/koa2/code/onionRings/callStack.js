function App() {
    this._middList = [];
}

App.prototype.use = function (fn) {
    this._middList.push(fn);
}

App.prototype._deal = function (index = 0) {
    if (index >= this._middList.length) {
        return false;
    }
    this._middList[index](this, this._deal.bind(this, index + 1));
}

App.prototype.listen = function (port) {
    setTimeout(() => {
        this._deal();
    }, Math.random() * port);
}

const app = new App();

app.use((ctx, next) => {
    console.log(1);
    next();
    console.log(2);
})

app.use((ctx, next) => {
    console.log(3);
    next();
    console.log(4);
})

app.use((ctx, next) => {
    console.log(5);
    next();
})


app.listen(2000);
