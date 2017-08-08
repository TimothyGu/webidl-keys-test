(() => {
  "use strict";
  
  const sym = Symbol();
  const el = document.createElement("div");
  el.appendChild(document.createElement("div"));
  
  console.log("%cNodeList", "font-size: 2em");
  // NodeList
  // Supports indexed property getter, but no setter, nor named property support.
  const nodes = el.childNodes;

  // Supported property indices should be enumerated.
  console.log("Expected", ["0"]);
  console.log("Actual", Reflect.ownKeys(nodes));
  
  // Sets own properties, but Symbols are always last.
  nodes[sym] = 42;
  nodes.ownProp = 42;
  console.log("Expected", ["0", "ownProp", sym.toString()]);
  console.log("Actual", Reflect.ownKeys(nodes));
  // >>> EDGE: ["0", Symbol(), "ownProp"]

  // Sets an integer index property, but not an array index. Should be treated
  // as a named property, but since there isn't a named property setter it
  // should fall back to setting an own property. When getting all own property
  // keys it should be ordered chronologically instead of before other own
  // properties as in ordinary objects.
  nodes[1099511627776/*=2**40*/] = 42;
  nodes.ownProp2 = 42;
  console.log("Expected", [
    "0",
    "ownProp", "1099511627776", "ownProp2", sym.toString()
  ]);
  console.log("Actual", Reflect.ownKeys(nodes));

  // Adds another node.
  el.appendChild(document.createTextNode("42"));
  console.log("Expected", [
    "0", "1",
    "ownProp", "1099511627776", "ownProp2", sym.toString()
  ]);
  console.log("Actual", Reflect.ownKeys(nodes));
  
  // Sets an array index property. Because there is no setter for indexed
  // properties, it should fall back to setting an own property. Keys should be
  // ordered chronologically instead of before other own properties as in
  // ordinary objects.
  nodes[2] = 42;
  // >>> FIREFOX:   throws when setting nodes[2].
  // >>> CHROME 61: throws when setting nodes[2].
  nodes.ownProp3 = 42;
  console.log("Expected", [
    "0", "1",
    "ownProp", "1099511627776", "ownProp2", "2", "ownProp3", sym.toString()
  ]);
  console.log("Actual", Reflect.ownKeys(nodes));
  // >>> CHROME 60: ["2", "0", "1",
  //                 "ownProp", "1099511627776", "ownProp2", "ownProp3", Symbol()]
  // >>> EDGE:      ["0", "1", "2",
  //                 Symbol(), "ownProp", "1099511627776", "ownProp2", "ownProp3"]

  // Adds another node. Indexed properties should always shadow own properties,
  // since there isn't an "indexed property visibility algorithm".
  const text43 = document.createTextNode("43");
  el.appendChild(text43);
  console.log("Expected", text43);
  console.log("Actual", nodes[2]);
  console.log("Expected", [
    "0", "1", "2",
    "ownProp", "1099511627776", "ownProp2", "ownProp3", sym.toString()
  ]);
  console.log("Actual", Reflect.ownKeys(nodes));
  // >>> CHROME 60: ["2", "0", "1",
  //                 "ownProp", "1099511627776", "ownProp2", "ownProp3", Symbol()]
  // >>> EDGE:      ["0", "1", "2", "2",
  //                 Symbol(), "ownProp", "1099511627776", "ownProp2", "ownProp3"]
})();
