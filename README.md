This librayr provides the ability to inline async javascript callbacks using ECMA6 generators.

A flock of seagulls:
```javascript
function (a) {
  setTimeout(function () {
    setTimeout(function () {
      console.log("the thing I want");
    });
  });
}
``` 

Using Async:
```javascript
async.series([
  function (cb) {
    setTimeout(function () {return cb()}, 0);
  },
  function (cb) {
    setTimeout(function () {return cb()}, 0);
  },
], function (err) {});
```

Inlined:
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
