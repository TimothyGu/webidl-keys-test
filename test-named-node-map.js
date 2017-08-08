(() => {
  "use strict";
  
  const sym = Symbol();
  const el = document.createElement("div");
  el.setAttribute("id", "attributes");
  
  console.log("%cNamedNodeMap", "font-size: 2em");
  // NamedNodeMap
  // Supports indexed and named property getters, but no setters.
  // Annotated with [LegacyUnenumerableNamedProperties].
  const attributes = el.attributes;

  // Supported property indices should be enumerated before supported property
  // names.
  console.log("Expected", ["0", "id"]);
  console.log("Actual", Reflect.ownKeys(attributes));
  // >>> CHROME: ["0"]
  //             (same issue also present in rest of tests, but is omitted)
  
  // Sets own properties, but Symbols are always last.
  attributes[sym] = 42;
  attributes.ownProp = 42;
  console.log("Expected", ["0", "id", "ownProp", sym]);
  console.log("Actual", Reflect.ownKeys(attributes));

  // Sets an integer index property, but not an array index. Should be treated
  // as a named property, but since there isn't a named property setter it
  // should fall back to setting an own property. When getting all own property
  // keys it should be ordered chronologically instead of before other own
  // properties as in ordinary objects.
  attributes[1099511627776/*=2**40*/] = 42;
  attributes.ownProp2 = 42;
  console.log("Expected", [
    "0", "id",
    "ownProp", "1099511627776", "ownProp2", sym
  ]);
  console.log("Actual", Reflect.ownKeys(attributes));

  // Adds another attribute.
  el.setAttribute("class", "my-class");
  console.log("Expected", [
    "0", "1", "id", "class",
    "ownProp", "1099511627776", "ownProp2", sym
  ]);
  console.log("Actual", Reflect.ownKeys(attributes));
  
  // Sets an array index property. Because there is no setter for indexed
  // properties, it should fall back to setting an own property. Keys should be
  // ordered chronologically instead of before other own properties as in
  // ordinary objects.
  attributes[2] = 42;
  // >>> FIREFOX: throws when setting attributes[2].
  attributes.ownProp3 = 42;
  console.log("Expected", [
    "0", "1", "id", "class",
    "ownProp", "1099511627776", "ownProp2", "2", "ownProp3", sym
  ]);
  console.log("Actual", Reflect.ownKeys(attributes));
  // >>> CHROME: ["2", "0", "1",
  //              "ownProp", "1099511627776", "ownProp2", "ownProp3", sym]

  // Adds another node. Indexed properties should always shadow own properties,
  // since there isn't an "indexed property visibility algorithm".
  el.setAttribute("data-third", "third");
  const attr = document.createAttribute("data-third");
  attr.value = "third";
  console.log("Expected", attr);
  console.log("Actual", attributes[2]);
  console.log("Expected", [
    "0", "1", "2", "id", "class", "data-third",
    "ownProp", "1099511627776", "ownProp2", "ownProp3", sym
  ]);
  console.log("Actual", Reflect.ownKeys(attributes));
  // >>> CHROME: ["2", "0", "1",
  //              "ownProp", "1099511627776", "ownProp2", "ownProp3", sym]
})();
