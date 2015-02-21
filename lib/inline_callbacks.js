"use strict";

const nextTick = process ? process.nextTick : function (f) {setTimeout(f, 0);}
const unshift = Array.prototype.unshift;

const empty = function (array) {
  array.splice(0, array.length);
  return array;
};

function unwrap (retByReference, gen) {
  let next = gen.next();
  if (next.done) {
    return retByReference;
  }

  empty(retByReference).push(next.value);

  let v = next.value;

  let f;
  let isArray = Array.isArray(v);
  if (isArray) {
    f = v[0];
  } else {
    f = v;
  }
  if (typeof(f) !== "function") {
    return unwrap(retByReference, gen);
  }

  if (isArray) {
    // pop off f
    v = v.shift();
  } else {
    v = [];
  }

  v.push(function () {
    nextTick(function () {
      return unwrap(retByReference, gen);
    });
    empty(retByReference);
    Array.prototype.forEach.call(arguments, function (arg) {
      retByReference.push(arg);
    });
  });
  return f.apply(this, v);
}

function wrap (f) {
  let ret = [];
  unshift.call(arguments, ret)
  let gen = f.apply(this, arguments);
  unwrap(ret, gen);
}

module.exports = wrap;