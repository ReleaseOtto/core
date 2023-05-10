import { Automate } from 'types/automator/Automate';
import { createOttoConfig } from 'factories/Otto';
import { loadConfig } from './input';
const schema = require('../schemas/automator-options.json');

/**
 * Load otto config file based on either data or location.
 */
export function loadOttoConfig(input: any): Automate {
  const obj = loadConfig(input, schema);
  if (obj instanceof Automate) {
    return obj;
  } else {
    return createOttoConfig(JSON.stringify(obj));
  }
}
