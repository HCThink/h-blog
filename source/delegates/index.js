/**
 * Expose `Delegator`.
 */

module.exports = Delegator;

/**
 * Initialize a delegator.
 *
 * @param {Object} proto
 * @param {String} target
 * @api public
 */

function Delegator(proto, target) {
  // 兼容调用方式，常见做法， 可以参考 new.targer
  if (!(this instanceof Delegator)) return new Delegator(proto, target);

  this.proto = proto;
  this.target = target;

  // api 配备 list， 仅用于记录
  this.methods = [];
  this.getters = [];
  this.setters = [];
  this.fluents = [];
}


// ------------------------ api ------------------------

/**
 * Automatically delegate properties
 * from a target prototype
 *
 * @param {Object} proto
 * @param {object} targetProto
 * @param {String} targetProp
 * @api public
 */
Delegator.auto = function (proto, targetProto, targetProp) {
debugger;
  // 调用主入口, 委托 targetProp 到 proto
  var delegator = Delegator(proto, targetProp);
  // 循环处理每个属性：targetProto's properties， 依次按照规则委托到 proto
  var properties = Object.getOwnPropertyNames(targetProto);
  for (var i = 0; i < properties.length; i++) {
    var property = properties[i];
    var descriptor = Object.getOwnPropertyDescriptor(targetProto, property);
    if (descriptor.get) {
      delegator.getter(property);
    }
    if (descriptor.set) {
      delegator.setter(property);
    }

    // 依据类型依次代理。
    if (descriptor.hasOwnProperty('value')) { // could be undefined but writable
      var value = descriptor.value;
      if (value instanceof Function) {
        delegator.method(property);
      } else {
        delegator.getter(property);
      }
      //  这里优点奇怪，如果 targetProto 有函数成员，此时委托会将 delegator.method(property); 覆盖变为 ： c: [Setter]。
      // 不是很明吧这里的用意
      if (descriptor.writable) {
        delegator.setter(property);
      }
    }
  }
};

/**
 * Delegate method `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.method = function (name) {
  var proto = this.proto;
  var target = this.target;
  // 仅用于记录，并且没有去重。
  this.methods.push(name);

  // 执行器
  proto[name] = function () {
    // 维护委托操作中的 this 指向， 以保证其正常执行
    return this[target][name].apply(this[target], arguments);
  };

  // 链式
  return this;
};

/**
 * Delegator accessor `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.access = function (name) {
  return this.getter(name).setter(name);
};

/**
 * Delegator getter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.getter = function (name) {
  var proto = this.proto;
  var target = this.target;
  this.getters.push(name);

  // __defineGetter__: 方法可以将一个函数绑定在当前对象的指定属性上，当那个属性的值被读取时，你所绑定的函数就会被调用。
  // 该特性是非标准的，请尽量不要在生产环境中使用它！
  // 该特性已经从 Web 标准中删除，虽然一些浏览器目前仍然支持它，但也许会在未来的某个时间停止支持，请尽量不要使用该特性。
  /**
   * 参考： Object.defineProperty api 可以改造。
        Object.defineProperty(proto, name, {
          get() {
            return this[target][name];
          }
        });
   */
  proto.__defineGetter__(name, function () {
    return this[target][name];
  });

  return this;
};

/**
 * Delegator setter `name`.
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.setter = function (name) {
  var proto = this.proto;
  var target = this.target;
  this.setters.push(name);

  proto.__defineSetter__(name, function (val) {
    return this[target][name] = val;
  });

  return this;
};

/**
 * Delegator fluent accessor
 *
 * @param {String} name
 * @return {Delegator} self
 * @api public
 */

Delegator.prototype.fluent = function (name) {
  var proto = this.proto;
  var target = this.target;
  this.fluents.push(name);

  proto[name] = function (val) {
    if ('undefined' != typeof val) {
      this[target][name] = val;
      return this;
    } else {
      return this[target][name];
    }
  };

  return this;
};
