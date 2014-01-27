var AppMeasurement;
AppMeasurement = {
  getInstance: function (instance) {
    return {
      instance: instance,
      t: function () {
        AppMeasurement.called_t = true;
      },
      tl: function () {
        AppMeasurement.called_tl = true;
      },
      util: function () {}
    };
  }
};
function s_gi(x) { return AppMeasurement.getInstance(x); }

test("Test Construction", function() {
  
  var omniTest = omni("hello");

  ok(omniTest.instance.visitorNamespace == "hellovisitor",
    "visitorNamespace of hello is hellovisitor");

  ok(omniTest.instance.account == "hello",
    "visitor account is hello");

  ok(omniTest.instance.charSet == "UTF-8",
    "Charset is UTF-8");

  ok(typeof omniTest.routes == "object" && omniTest.routes.length == 0,
    "Omni routes is set and empty");

});

test("Test setOption", function () {
  
  var omniTest = omni("hello"); 

  omniTest.setOption("hello", "world");
  
  ok(omniTest.instance.hello == "world",
    "setOption sets instance variable");

  ok(omniTest.hello !== "hello",
    "setOption doesn't touch omni itself");

});

test("Test getOption", function () {
  
  var omniTest = omni("hello");

  omniTest.setOption("hello", "world");
  ok(omniTest.getOption("hello") == "world",
    "Setting hello and getting back is ok.");

});

test("Test setSeqParam", function () {
  
  var omniTest = omni("hello");
  omniTest.setSeqParam("hello", 1, "world");
  omniTest.setSeqParam("world", 4, "hello");

  ok(omniTest.instance.hello1 == "world",
    "Setting hello with seq 1 sets hello1.");
  
  ok(omniTest.instance.world4 == "hello",
  "Setting world with seq 4 sets world.");

});

test("Set EVar", function () {
  
  var omniTest = omni("hello");
  omniTest.setEVar(1, "world");
  omniTest.setEVar(5, "hello");

  ok(omniTest.instance.eVar1 == "world",
    "evar1 is world");

  ok(omniTest.instance.eVar5 == "hello",
    "evar5 is hello");

});

test("Set Hier", function () {
  
  var omniTest = omni("hello");
  omniTest.setHier(1, ["world"]);
  omniTest.setHier(5, ["hello", "world"]);

  ok(omniTest.instance.hier1 == "world",
    "hier1 is world");

  ok(omniTest.instance.hier5 == "hello|world",
    "hier5 is hello|world");

});

test("Set Prop", function () {

  var omniTest = omni("hello");
  omniTest.setProp(1, "world");
  omniTest.setProp(5, "hello");

  ok(omniTest.instance.prop1 == "world",
    "prop1 is world");

  ok(omniTest.instance.prop5 == "hello",
    "prop1 is hello");
});


test("add a string route", function () {

  var omniTest = omni("hello");
  var spy = function () {};
  omniTest.route("world", spy);

  ok(omniTest.routes.length == 1,
    "adding route increases routes length");

  ok(omniTest.routes[0].callback == spy,
    "the callback is the spy");

  ok(omniTest.routes[0].route == "world",
    "the route is world");

});

test("add a RegExp route", function () {

  var omniTest = omni("hello");
  var spy = function () {};
  omniTest.route(/hello/, spy);

  ok(omniTest.routes.length == 1,
    "adding route increases routes length");

  ok(omniTest.routes[0].callback == spy,
    "the callback is the spy");

  ok(omniTest.routes[0].route instanceof RegExp,
    "the route is regexp");

  ok(omniTest.routes[0].route.test("hello"),
    "the route matches the hello string");

});

test("test aliases", function () {

  var omniTest = omni("hello");

  ok(omniTest.set == omniTest.setOption, "set -> setOption");
  ok(omniTest.get == omniTest.getOption, "get -> getOption");
  ok(omniTest.evar == omniTest.setEVar, "evar -> setEVar");
  ok(omniTest.hier == omniTest.setHier, "set -> setHier");
  ok(omniTest.prop == omniTest.setProp, "set -> setProp");

});

test("test run", function () {

  var omniTest = omni("hello");
  var called = false, called2 = false, called3 = false;
  var spy = function () { called = true; };
  var spy2 = function () { called2 = true; };
  var spy3 = function () { called3 = true; };
  omniTest.route("hello", spy);
  omniTest.route("world", spy2);
  omniTest.route(/h.o/, spy3);

  ok(called == false && called2 == false && called3 == false,
    "adding routes doesnt call spies.");

  omniTest.run("hello");
  ok(called == true && called2 == false && called3 == false,
    "run hello route spy");

  omniTest.run("world");
  ok(called == true && called2 == true && called3 == false,
    "run world route spy");
  
  omniTest.run("hio");
  ok(called == true && called2 == true && called3 == true,
    "run hio route spy with regexp");
});
