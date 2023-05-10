import * as fs from 'fs';
import Ajv from "ajv";
const ajv = new Ajv();

function loadFromFile(location: string): any  {
  return require(location);
}

function validateConfig(input: any, schema: any) {
  const validate = ajv.compile(schema);
  if (validate(input)) {
    return true;
  } else {
    console.log(validate.errors)
    throw new Error("Not a valid Otto config file", { cause: validate.errors });
  }
}

/**
 * Load otto config file based on either data or location.
 */
export function loadConfig(input: any, schema: any): object {
  if(typeof input === 'string') {
    const isFile = fs.existsSync(input);
    let jsonObj;
    if (isFile) {
      jsonObj = loadFromFile(input);
    } else {
      jsonObj = JSON.parse(input);
    }
    
    if(validateConfig(jsonObj, schema)) {
      return jsonObj;
    }
  } else if(typeof input === 'object') {
    return input;
  }
  throw new Error("Unable to load otto configuration");
}