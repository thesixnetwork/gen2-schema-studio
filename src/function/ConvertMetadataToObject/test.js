// var then_parser = require("./action_then");
// var when_parser = require("./action_when");
import then_parser from "./action_then";

class CustomTracer {
  indentLevel = 0;

  trace(event) {
    const space = Array(this.indentLevel).join("   ");

    if (event.type === "rule.enter") {
      // create space character based on number of indentLevel
      console.log(`${space}Entering rule: ${event.rule}`);
      this.indentLevel++;
    } else if (event.type === "rule.match") {
      console.log(`${space}Matched rule: ${event.rule}`);
      this.indentLevel--;
    } else if (event.type === "rule.fail") {
      console.log(`${space}Failed to match rule: ${event.rule}`);
      this.indentLevel--;
    }
  }
}

// https://ipfsgw.sixnetwork.io/ipfs/QmduQCAjDZPLVZ43gPtJrEQuwfieeMrCDL9PY1VQ89bW9L/gold_bear.png
const tracer = new CustomTracer();

const string_input = "meta.SetImage('https://ipfsgw.sixnetwork.io/ipfs/QmduQCAjDZPLVZ43gPtJrEQuwfieeMrCDL9PY1VQ89bW9L/gold_'+ params['power'].GetString() +'.png')"
console.log("INPUT   :",string_input)
const parsedObject = then_parser.parse(string_input)
console.log(JSON.stringify(parsedObject, null, 2));
// console.log(parsedObject);
// const object = Factory.createObject(parsedObject)
// console.log("OUTPUT  :",object.toString())
