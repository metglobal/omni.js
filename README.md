# omni.js v0.0.5: Adobe Omniture Analytics Client

Adobe Omniture Client is a client for websites which uses Adobe Analytics.

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

### Resources
[https://microsite.omniture.com/t2/help/en_US/sc/implement/index.html](https://microsite.omniture.com/t2/help/en_US/sc/implement/index.html)

### License

Copyright (c) 2014 Metglobal LLC.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
