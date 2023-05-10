import * as fs from 'fs';
import { Automate } from '../types/automator/Automate';
import { Meta } from '../types/meta/Meta';
import { loadConfig } from './input';
import { SharedVersions } from './versionStrategies';
const schema = require('../schemas/meta-options.json');

/**
 * Load otto config file based on either data or location.
 */
export function loadMetaConfig(input: any): Meta {
  const obj = loadConfig(input, schema);
  if (obj instanceof Meta) {
    return obj;
  } else {
    return Meta.unmarshal(JSON.stringify(obj));
  }
}

export interface WriteMetaOptions {
  config: Automate,
  versionDiffs: SharedVersions
}

export function writeMetaInformation({
  config,
  versionDiffs
}: WriteMetaOptions) {
  const metaConfig = new Meta({});
  metaConfig.dependencies = {};
  for (const [id, version] of Object.entries(versionDiffs)) {
    metaConfig.dependencies[id] = version.remoteVersion;
  }
  const location = config.location?.config?.metaMinusLocation || './meta.conf';
  fs.writeFileSync(location, metaConfig.marshal());
}