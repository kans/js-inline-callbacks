"use strict";

var inline = require("../lib/inline_callbacks");

exports.testBasic = function(test){
  function* a () {
    yield 1;
    yield 2;
    test.ok(true, "this assertion should pass");
    test.done();
  };

  test.expect(1);
  inline(a)
};

exports.testReturnByReference = function(test){
  function* a (ret) {
    let yeilded = 1;
    yield yeilded;
    test.equals(ret[0], yeilded, "this assertion should pass");
    yeilded = 2;
    yield function (cb) {
      setTimeout(function () {return cb(yeilded)}, 0);
    }
    test.equals(ret[0], yeilded, "this assertion should pass");
    test.done();
  };

  test.expect(2);
  inline(a)
};

exports.testCB = function(test){
  let yeilded = 1;
  function* a (ret) {
    yield function (cb) {
      setTimeout(function () {return cb(yeilded)}, 0);
    }
  };

  test.expect(1);

  inline(a, function (ret) {
    test.equals(ret, yeilded, "this assertion should pass");
    test.done();   
  });
};