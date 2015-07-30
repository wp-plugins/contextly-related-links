Contextly = window.Contextly || {};

Contextly.createClass = function (data) {
  var abstracts = data.abstracts || [],
    statics = data.statics || {},
    extend = data.extend || [];

  if (!(extend instanceof Array)) {
    extend = [extend];
  }

  // define constructor
  var constructor;
  if (data.construct) {
    constructor = data.construct;
  }
  else if (extend.length) {
    constructor = function () {
      for (var i = 0; i < extend.length; i++) {
        extend[i].apply(this, arguments);
      }
    }
  }
  else {
    constructor = function () {};
  }

  // prototype for our class.
  var proto = {};

  delete data.construct;
  delete data.abstracts;
  delete data.statics;
  delete data.extend;

  // borrow methods from parent classes
  for (var i = 0; i < extend.length; i++) {
    var parent = extend[i];

    // Copy static methods, except for static constructor.
    for (var p in parent) {
      // copy only functions
      if (typeof parent[p] != "function" || p == "construct") {
        continue;
      }
      constructor[p] = parent[p];
    }

    // Copy prototype methods.
    for (var p in parent.prototype) {
      if (typeof parent.prototype[p] != "function" || p == "constructor") {
        continue;
      }
      proto[p] = parent.prototype[p];
    }
  }

  // build abstract static methods
  if (statics.abstracts) {
    for (var p = 0; p < statics.abstracts.length; p++) {
      proto[ statics.abstracts[p] ] = Contextly.abstractMethod(p);
    }
  }

  // build abstract prototype methods
  for (var p = 0; p < abstracts.length; p++) {
    proto[ abstracts[p] ] = Contextly.abstractMethod(p);
  }

  // internal methods
  proto.instanceOf = function (_class) {
    if (arguments.length > 1) {
      var res = true;
      for (var i = 0; i < arguments.length; i++) {
        res = res && this.instanceOf(arguments[i]);
      }
      return res;
    }

    if (constructor === _class) {
      return true;
    }

    for (var i = 0; i < extend.length; i++) {
      if (extend[i].prototype.instanceOf.call(this, _class)) {
        return true;
      }
    }

    return _class === Object;
  };

  // rest of data are prototype methods
  for (var p in data) {
    // copy only functions
    if (typeof data[p] != "function") {
      continue;
    }
    proto[p] = data[p];
  }

  // static functions of class
  for (var p in statics) {
    // copy only functions
    if (typeof statics[p] != "function") {
      continue;
    }
    constructor[p] = statics[p];
  }

  // Build static constructor from parents' constructors if there is no own one.
  if (typeof constructor.construct === 'undefined' && extend.length) {
    var parentStaticConstructors = [];
    for (var i = 0; i < extend.length; i++) {
      var parent = extend[i];
      if (typeof parent.construct == "function") {
        parentStaticConstructors.push(parent.construct);
      }
    }
    if (parentStaticConstructors.length) {
      constructor.construct = function() {
        for (var i = 0; i < parentStaticConstructors.length; i++) {
          parentStaticConstructors[i].call(this);
        }
      };
    }
  }

  // Call current class static constructor, if any...
  if (typeof constructor.construct == "function") {
    constructor.construct.call(constructor);
  }

  // proto.constructor = constructor;
  constructor.prototype = proto;
  constructor.fn = proto; // short case

  // Finally, return the constructor function
  return constructor;
};

/**
 * Re-usable abstract function generator.
 *
 * @param {string} [name]
 *   Function name to include into the exception.
 *
 * @return {function}
 */
Contextly.abstractMethod = function(name) {
  return function() {
    if (name) {
      throw name + ' is abstract method.';
    }
    else {
      throw 'Abstract method must not be called directly.';
    }
  }
};
