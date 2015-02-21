"use strict";

const nextTick = process ? process.nextTick : function (f) {setTimeout(f, 0);}
const unshift = Array.prototype.unshift;

const empty = function (array) {
  array.splice(0, array.length);
  return array;
};

function unwrap (retByReference, gen, cb) {
  let next;
  try {
    next = gen.next();
  } catch (e) {
    return cb(e);
  }

  if (next.done) {
    return cb(retByReference[0]);
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
    return unwrap(retByReference, gen, cb);
  }

  if (isArray) {
    // pop off f
    v = v.shift();
  } else {
    v = [];
  }

  v.push(function () {
    nextTick(function () {
      return unwrap(retByReference, gen, cb);
    });
    empty(retByReference);
    Array.prototype.forEach.call(arguments, function (arg) {
      retByReference.push(arg);
    });
  });

  try {
    return f.apply(this, v);
  } catch (e) {
    return cb(e);
  }
}

function wrap (f, cb) {
  let ret = [];
  unshift.call(arguments, ret)
  let gen = f.apply(this, arguments);
  if (typeof(cb) !== "function") {
    cb = function () {};
  }
  unwrap(ret, gen, cb);
}

module.exports = wrap;