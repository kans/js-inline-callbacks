Fun with inlining javascript seagulls using ECMA6 generator support (iojs) to use this library.

Example Usage:

```javascript
// Avoid the flock of seagulls
function (a) {
  setTimeout(function () {
    setTimeout(function () {
      console.log("the thing I want");
    });
  });
}

// Avoid async primitives
async.series([
  function (cb) {
    setTimeout(function () {return cb()}, 0);
  },
  function (cb) {
    setTimeout(function () {return cb()}, 0);
  },
], function (err) {});

function* a (ret) {
  yield 1;
  console.log(ret[0])
  yield function (cb) {
    setTimeout(function () {return cb(2)}, 0);
  }
  console.log(ret[0])
  yield function (cb) {
    setTimeout(function () {return cb(3)}, 0);
  }
  console.log(ret[0])
};

// yield calls are made sequentially, after their callbacks have fired
> require("inline_callbacks").inline(a, function (ret) {
  console.log("finished", ret);
});
// 1
// 2
// 3
// finished 3
```
