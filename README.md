You need ECMA6 generator support (iojs) to use this library.

Example Usage:

```javascript
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
