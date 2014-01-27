function Omniture(instance) {
  this.instance = s_gi(instance);
  this.util = this.instance.util; 
  var visitorNS = instance + "Visitor";

  this.setOption("account", instance);
  this.setOption("visitorNamespace", visitorNS);

  this.setOption("charSet", "UTF-8");
  this.setOption("linkTrackVars", "None");
  this.setOption("linkTrackEvents", "None");

  this.routes = [];
  this.autotrack();
}
Omniture.prototype.setOption = function (key, value) {
  this.instance[key] = value;
  return this;
};
Omniture.prototype.getOption = function (key) {
  return this.instance[key];
};
Omniture.prototype.setSeqParam = function (key, seq, value) {
  this.setOption(key + seq, value);
  return this;
};
Omniture.prototype.setEVar = function (id, value) {
  this.setSeqParam("eVar", id, value);
  return this;
};
Omniture.prototype.setHier = function (id, hierarchy) {
  this.setSeqParam("hier", id, hierarchy.join("|"));
  return this;
};
Omniture.prototype.setProp = function (id, value) {
  this.setSeqParam("prop", id, value);
  return this;
};
Omniture.prototype.route = function (route, callback) {
  this.routes.push({route: route, callback: callback});
  return this;
};
Omniture.prototype.clear = function () {
  this.instance.clearVars();
  return this;
};

// Aliases
Omniture.prototype.set        = Omniture.prototype.setOption;
Omniture.prototype.get        = Omniture.prototype.getOption;
Omniture.prototype.evar       = Omniture.prototype.setEVar;
Omniture.prototype.hier       = Omniture.prototype.setHier;
Omniture.prototype.hierarchy  = Omniture.prototype.setHier;
Omniture.prototype.prop       = Omniture.prototype.setProp;
Omniture.prototype.property   = Omniture.prototype.setProp;

Omniture.prototype.run = function (_path) {
  var path = _path || window.location.pathname + window.location.search + window.location.hash;
  for (var i=0, route; i < this.routes.length; i++) {
    router = this.routes[i];
    switch (typeof router.route) {
      case "string":
        if (router.route == path) {
          router.callback.call(this, router.route);
        } 
        break;
      case "object":
        if (router.route instanceof RegExp) {
          var match = path.match(router.route);
          if (match) {
            router.callback.apply(this, match.splice(1));
          }
        } else {
          throw new Error("Unacceptable route type! Use string or regexp.");
        }
        break;
    }
  }
  this.push();
  return this;
};

Omniture.prototype.push = function () {
  return this.instance.t();
};

Omniture.prototype.track = function (selector, event, evar, title, action, callback) {
  if (jQuery) {
    var self = this;
    $(document).on(event, selector, function () {
      self.set("linkTrackVars", "eVar" + evar);
      self.evar(evar, [self.get("pageName"), title].join(" : "));
      if (callback && callback.call) {
        callback.call(this);
      }
      self.instance.tl(this, 'o', action);
    });
  } else {
    throw new Error("Element tracking need jQuery");
  }
  return this;
};

Omniture.prototype.autotrack = function () {
  var self = this;
  $(document).ready(function () {
    $("[data-track]").each(function () {
      var $el = $(this);
      $el.on($el.data("track-on"), function () {
        var evar = $el.data("track-evar");
        if (evar) {
          self.set("linkTrackVars", "eVar" + evar);
          self.evar(evar, [self.get("pageName"), $el.data("track")].join(" : "));
        }
        self.instance.tl($el.get(0), ($el.data("track-link") || "o").substr(0, 1), $el.data("track-action"));
      });
    });
  });
  return this;
};

Omniture.prototype.errorPage = function (code) {
  var self = this;
  return function () {
    switch (code) {
      case 404:
        self.set("pageType", "errorPage");
        break;
      case 500:
        self.set("pageName", "500 Error:" + window.location.href);
        self.set("pageType", "errorPage");
        break;
    }
  }
};

Omniture.prototype.serialize = function (mainEvent, items, map) {
  var list = [];
  var events = [mainEvent];
  var map = (map || "").split(",");
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var itemData = [];
    for (var j = 0; j < map.length; j++) {
      var value = item[map[j]] || "";
      itemData.push(value);
    }
    if (item.events) {
      var eventData = [];
      for (var event in item.events) {
        if (item.events.hasOwnProperty(event)) {
          var eventValue = item.events[event];
          var eventKey = "event" + event;
          if (events.indexOf(eventKey) == -1) {
            events.push(eventKey);
          }
          eventData.push([eventKey, eventValue].join("="));
        }
      }
      itemData.push(eventData.join("|"));
    }
    list.push(itemData.join(";"));
  }
  return {
    events: events.join(","),
    list: list.join(",")
  };
};

Omniture.prototype.productsEvent = function (products) {
  var serialized = this.serialize("prodView", products,
    "category,product"
  );
  this.setOption("events", serialized.events);
  this.setOption("products", serialized.list);
};

Omniture.prototype.purchaseEvent = function (purchaseId, products) {
  if (typeof purchaseId == "object") {
    products = purchaseId;
  } else if (purchaseId) {
    this.setOption("purchaseID", purchaseId);
  }
  var serialized = this.serialize("purchase", products,
    "category,product,quantity,price"
  );
  this.setOption("events", serialized.events);
  this.setOption("products", serialized.list);
};

Omniture.prototype.productEvent = function (product) {
  this.productsEvent([product]);
};

Omniture.prototype.preset = function (event/*, arguments... */) {
  var method = this[event + "Event"];
  if (typeof method == "function") {
    method.apply(this, Array.prototype.slice.call(arguments, 1));
  } else {
    throw new Error(event + " is not a registered event to call. Please add 'Event' prefix to the method name");
  }
};

function omni(rsid) { return new Omniture(rsid); }

