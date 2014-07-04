# omni.js v0.0.5: Adobe Omniture Analytics Client

Adobe Omniture Client is a client for websites which uses Adobe Analytics.

## Installation

You can install Omni.js with Bower.

```bash
bower install omnijs
```

## Overview

It has a clean interface than Adobe's official client.

It simplifies the usage of API which detailed in [documentation](https://microsite.omniture.com/t2/help/en_US/sc/implement/index.html)

```javascript
// Easily create an instance
omni("namespace")

  // Set Variables
  .set("pageName", "My Main Site")

  // Define Routes
  .route(/products.html$/, function () {
    this.set("pageName", "Products Page")
        .evar(1, "User Entered to Products Page")
  })

  .route(/purchase\/([0-9]+)/, function (purchaseId) {

    this.set("purchaseID", purchaseId);

    // Use Preset Events for eCommerce
    this.preset("purchase", /*optional purchaseId:*/"123456789", [
      {category: "Running", product: "Shoe", quantity: 1, price: 69.95},
      {category: "Running", product: "Socks", quantity: 1, price: 29.95, events: {1: "34.99"}},
      {product: "Boats", quantity: 2}
    ]);

    this.preset("product", {
      category: "Running",
      product: "Shoe",
      quantity: 1,
      price: 69.95
    });
  })

  // Track custom events from DOM
  .track("button.purchase", "click", /*evar:*/15, "Purchase", "Purchase Button Clicked");
  .run();
```

## API

### `omni(namespace, options)`

Omni is the main function that returns the instance of the Omniture tracker object.

```javascript
var s = omni("namespace");
```
It sets `s_account` variable of Omniture.

It also creates `Visitor` object with additional `"Visitor"` suffix. Then your Visitor namespace will be `"namespaceVisitor"`

You can pass ``options`` object with two useful properties which allow you to disable autotrack and namespacing visitor. Just flag both of them as ``{ autotrack: false, namespace: false }``, by default they are enabled.

### `setOption(key, value)` or `set`

It sets the option and the value of a Omniture variable.

```javascript
s.set("pageName", "My Project");
```

### `getOption(key)` or `get`

It gets a defined Omniture variable.

```javascript
console.log(s.get("pageName")); //=> "My Project"
```

### `setVisitorOption(key, value)`

Sets a value for `Visitor` instance that created at the construction.

### `setSeqParam(key, sequence, value)`

Sets a sequenced parameter. Used for `eVar`, `prop` or `hier`

```javascript
s.setSeqParam("eVar", 1, "hello");
console.log(s.get("eVar1")); //=> "hello"
```

### `setEVar(id, value)` or `evar`

Shortcut for `eVar` setting. Simply makes a `setSeqParam` with currying.

```javascript
s.setEVar(1, "hello"); // same with `s.evar(1, "hello")`
console.log(s.get("eVar1")); //=> "hello"
```

You can also use same pattern with `setHier` (alias: `hier()`) and `setProp` (alias: `prop()`):

### `route(route, callback)`

It registers a route to router stack to match and run by `run` method.

```javascript
s.route("index.html", function () {
  this.set("pageName", "Index Page");
});

s.route("about.html", function () {
  this.set("pageName", "About Page");
});

s.run(); //=> This is required to find routes.
```

### `run()`

It searches for the current location and runs the matching function. So you can define analytics for each page in one JavaScript file.

### `preset(name, args...)`

This uses Adobe Omniture's preset events. These are generally about content for an ecommerce site.

Built in Presets:
  - purchase
  - product
  - products

```javascript
s.preset("purchase", [
  {category: "Running", product: "Shoe", "price": 10.99}
]);
```

### Chaining

You can chain every method after creating the omniture object.

```javascript
var s = omni("hello").set("pageName", "hello").push();
```

### Sending Async Tracking Data

You can also send async data to Omniture. To do that, use `push` method.
It can be used after ajax calls or something.

```javascript
s.evar(1, "hello").push();
```

## Advanced API

These are for contribution or advanced customizing.

### Define Presets

You can define custom presets. Just add a method with a `Event` suffix.

```javascript
Omniture.prototype.customeventEvent = function (data) {
  console.log(data);
};

s.preset("customevent", data);
```

### Serialize Objects for Omniture

Omniture uses a special serialization method. You can serialize your datausing `serialize` function.

```javascript
var ser = s.serialize("custom", [
    {a: 1, b: 2, events: {1: "hello"}},
    {a: 3, b: 4}],
"a,b");
console.log(ser.events); //=> "custom,event1"
console.log(ser.list); //=> "1;2;event1=hello,3;4"
```

### Resources
[https://microsite.omniture.com/t2/help/en_US/sc/implement/index.html](https://microsite.omniture.com/t2/help/en_US/sc/implement/index.html)

### License

Copyright (c) 2014 Metglobal LLC.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
