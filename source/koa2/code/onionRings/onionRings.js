'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
/**
 * node 执行： tsc onionRings.ts --lib 'es2015' --sourceMap && node onionRings.js
 * deno 执行： deno onionRings.ts: 因为存在文件引用， 以及 node原生模块 fs， 不建议使用 deno 执行
 */
var koa_readFile_1 = require("./koa-readFile");
var onionRings;
(function (onionRings) {
    var _this = this;
    var Log = function () {
        var any = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            any[_i] = arguments[_i];
        }
        // @ts-ignore
        console.log.apply(console, any);
    };
    var Loop = function () { };
    var App = /** @class */ (function () {
        function App() {
            this.middList = [];
        }
        App.prototype.use = function (middleware) {
            this.middList.push(middleware);
        };
        App.prototype.deal = function (i) {
            if (i === void 0) { i = 0; }
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            debugger;
                            if (i >= this.middList.length) {
                                return [2 /*return*/, false];
                            }
                            return [4 /*yield*/, this.middList[i](this, this.deal.bind(this, i + 1))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        App.prototype.listen = function (port) {
            var _this = this;
            // @ts-ignore
            setTimeout(function () {
                debugger;
                _this.deal();
            }, Math.random() * port);
        };
        return App;
    }());
    // test
    var app = new App();
    app.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Log(1);
                    return [4 /*yield*/, next()];
                case 1:
                    _a.sent();
                    Log(2);
                    return [2 /*return*/];
            }
        });
    }); });
    app.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Log(3);
                    return [4 /*yield*/, next()];
                case 1:
                    _a.sent();
                    Log(4);
                    return [2 /*return*/];
            }
        });
    }); });
    // 外部中间件
    app.use(koa_readFile_1["default"]('./onionRings.ts'));
    app.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        var deal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    Log(ctx.context.length);
                    return [4 /*yield*/, readFile('./onionRings.ts')];
                case 1:
                    deal = _a.sent();
                    Log(deal);
                    return [4 /*yield*/, next()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    app.listen(3000);
    function readFile(path, operate) {
        if (operate === void 0) { operate = { charles: 'utf-8' }; }
        return new Promise(function (resolve, reject) {
            // @ts-ignore
            setTimeout(function () {
                resolve(5);
            }, 3000);
        });
    }
    // 1 3 5 4 2
})(onionRings || (onionRings = {}));
//# sourceMappingURL=onionRings.js.map