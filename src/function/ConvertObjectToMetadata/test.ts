import { Factory } from "../ConvertObjectToMetadata/Factory";

const result = Factory.createObject({
    type: "boolean_compare_oper",
    value: "==",
    left: {
      type: "meta_function",
      functionName: "GetString",
      attributeName: {
        type: "param_function",
        functionName: "GetNumber",
        attributeName: {
          type: "constant",
          dataType: "string",
          value: "number"
        }
      }
    },
    right: {
      type: "constant",
      dataType: "string",
      value: "zxcsdsdczcxcxz"
    }
  }).toString();


console.log(result)