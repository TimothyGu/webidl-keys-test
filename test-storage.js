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
  
  // Sets own properties. "getItem" is an own property because it is a property
  // on Storage.prototype, and thus not visible according to the named property
  // visibility algorithm, so setting it will fall back to setting own
  // property. Symbols are always last.
  sessionStorage[sym] = 42;
  sessionStorage.getItem = 42;
  console.log("Expected", "number");
  console.log("Actual", typeof sessionStorage.getItem);
  // >>> FIREFOX: Prints function getItem()
  console.log("Expected", ["getItem", sym.toString()]);
  console.log("Actual", Reflect.ownKeys(sessionStorage));
  // >>> FIREFOX: Prints []

  // Supported property names should be enumerated first. When setting, 42 is
  // coerced to a string through IDL type conversion.
  sessionStorage.myProp = 42;
  console.log("Expected", "string");
  console.log("Actual", typeof sessionStorage.myProp);
  console.log("Expected", ["myProp", "getItem", sym.toString()]);
  console.log("Actual", Reflect.ownKeys(sessionStorage));
  // >>> CHROME: Prints ["getItem", Symbol(), "myProp"]
  // >>> FIREFOX: Prints ["myProp"]

  // Sets an integer index property but not an array index. Treated as a named
  // property. When getting all own property keys it should be ordered
  // chronologically instead of before other own properties as in ordinary
  // objects.
  sessionStorage[1099511627776/*=2**40*/] = 42;
  console.log("Expected", ["myProp", "1099511627776", "getItem", sym.toString()]);
  console.log("Actual", Reflect.ownKeys(sessionStorage));
  // >>> CHROME: Prints ["getItem", Symbol(), "1099511627776", "myProp"].
  // >>> FIREFOX: Prints ["1099511627776", "myProp"]

  // Sets an array index property. Not treated as a named property under the
  // current [[Set]] spec (TODO), but as an own property. When getting all own
  // property keys it should be ordered chronologically instead of before other
  // own properties as in ordinary objects.
  sessionStorage[1] = 42;
  console.log("Expected", "number");
  console.log("Expected w/ revised [[Set]]", "string");
  console.log("Actual", typeof sessionStorage[1]);
  // >>> CHROME: Prints "42".
  // >>> FIREFOX: Prints "42".
  console.log("Expected", ["myProp", "1099511627776", "getItem", "1", sym.toString()]);
  console.log("Expected w/ revised [[Set]]", ["myProp", "1099511627776", "1", "getItem", sym.toString()]);
  console.log("Actual", Reflect.ownKeys(sessionStorage));
  // >>> CHROME: Prints ["getItem", Symbol(), "1", "1099511627776", "myProp"]
  // >>> FIREFOX: Prints ["1099511627776", "1", "myProp"]
})();
