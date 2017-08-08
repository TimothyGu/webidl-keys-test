(() => {
  "use strict";
  
  const sym = Symbol();
  
  console.log("%cStorage", "font-size: 2em");
  // Storage
  // Supports named property getter, setter, and deleter, but no indexed
  // property support.
  // No special annotation.
  const { sessionStorage } = window;
  sessionStorage.clear();
  
  // Sets an own property symbol.
  sessionStorage[sym] = 42;
  console.log("Expected", [sym.toString()]);
  console.log("Actual", Reflect.ownKeys(sessionStorage));
  // >>> FIREFOX: Prints []
  // >>> EDGE:    Prints []

  // "getItem" is a property on Storage.prototype, and thus not visible
  // according to the named property visibility algorithm. So while setting it
  // will invoke the setter, getting it will fall back to the prototype
  // property.
  sessionStorage.getItem = 42;
  console.log("Expected", "function");
  console.log("Actual", typeof sessionStorage.getItem);
  // >>> CHROME: Prints number
  console.log("Expected", [sym.toString()]);
  console.log("Actual", Reflect.ownKeys(sessionStorage));
  // >>> CHROME: Prints ["getItem", Symbol()]
  // >>> EDGE:   Prints ["getItem"]

  // Supported property names should be enumerated first. When setting, 42 is
  // coerced to a string through IDL type conversion.
  sessionStorage.myProp = 42;
  console.log("Expected", "string");
  console.log("Actual", typeof sessionStorage.myProp);
  console.log("Expected", ["myProp", sym.toString()]);
  console.log("Actual", Reflect.ownKeys(sessionStorage));
  // >>> CHROME: Prints ["getItem", Symbol(), "myProp"]

  // Sets an integer index property but not an array index. Treated as a named
  // property. When getting all own property keys it should be ordered
  // chronologically per Storage semantics instead of before other own
  // properties as in ordinary objects.
  sessionStorage[1099511627776/*=2**40*/] = 42;
  console.log("Expected", ["myProp", "1099511627776", sym.toString()]);
  console.log("Actual", Reflect.ownKeys(sessionStorage));
  // >>> CHROME:  Prints ["getItem", Symbol(), "1099511627776", "myProp"]
  // >>> FIREFOX: Prints ["1099511627776", "myProp"]

  // Sets an array index property. Not treated as a named property under the
  // current [[Set]] spec (TODO), but as an own property. When getting all own
  // property keys it should be ordered chronologically instead of before other
  // own properties as in ordinary objects.
  sessionStorage[1] = 42;
  console.log("Expected", "number");
  console.log("Expected w/ revised [[Set]]", "string");
  console.log("Actual", typeof sessionStorage[1]);
  // >>> CHROME:  Prints "string"
  // >>> FIREFOX: Prints "string"
  // >>> EDGE:    Prints "string"
  console.log("Expected", ["myProp", "1099511627776", "1", sym.toString()]);
  console.log("Actual", Reflect.ownKeys(sessionStorage));
  // >>> CHROME:  Prints ["getItem", Symbol(), "1", "1099511627776", "myProp"]
  // >>> FIREFOX: Prints ["1099511627776", "1", "myProp"]
})();
