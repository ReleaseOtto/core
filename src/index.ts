import { Automate } from "./models/Automate";
import * as path from 'path';
import * as fs from 'fs';
import Ajv from "ajv";
import { LocationType } from "./models/LocationType";
import { GithubLocationConfig } from "./models/GithubLocationConfig";
import { DependenciesType } from './models/DependenciesType';
import { cloneRepository, commit } from "./utils/git";
import { loadMetaInformation, writeMetaInformation } from "./utils/meta";
import * as Semver from 'semver';
import { GithubRepositoryPackage } from "./models/GithubRepositoryPackage";
import { loadPackageInformation, runScript } from "./utils/package";
import { PackageAction } from "./models/PackageAction";
import { formatCommit, toConventionalCommit } from "./utils/conventionalCommit";
const schema = require('../schemas/automator-options.json');
const ajv = new Ajv();
const validate = ajv.compile(schema);
const temporaryLocation = path.resolve(__dirname, './__temp');

/**
 * Automate something based on the config or input file
 */
export function automate(input: string | Automate) {
  if (input instanceof Automate) {
    return start(input);
  }

  const isFile = fs.existsSync(input);
  if (isFile) {
    return handleFile(input);
  }

  try {
    const json = JSON.parse(input);
    return handleJSON(json);
  } catch (e) { }

  throw new Error("Could not process input, was neither file path to a config file, instance of config, or JSON")
}

function handleFile(input: string) {
  const config = require(input);
  return handleJSON(config);
}

function handleJSON(input: object) {
  if (validate(input)) {
    return start(Automate.unmarshal(input))
  } else {
    console.log(validate.errors)
    throw new Error("Not a valid Automator config file", { cause: validate.errors });
  }
}

async function start(config: Automate) {
  let metaData;
  let location;
  let newMetaData: Record<string, string> = {};
  if (config.location?.type === LocationType.GITHUB) {
    location = GithubLocationConfig.unmarshal(JSON.stringify(config.location.config));
    console.debug(location);
    const ghLocation = path.resolve(temporaryLocation, location.repo);
    await cloneRepository({
      branch: location.branch,
      repository: location.repo,
      toLocation: ghLocation
    });
    const metaLocation = path.resolve(ghLocation, location.metaMinusLocation);
    try {
      metaData = await loadMetaInformation({ location: metaLocation });
    } catch (error) {
      console.warn("No existing metadata");
      metaData = {};
    }
  }
  const versionDiffs: Record<string, Semver.ReleaseType | null> = {};
  for (const dependency of config.dependencies || []) {
    if (dependency.type === DependenciesType.GITHUB_MINUS_REPOSITORY_MINUS_PACKAGE) {
      const githubPackageConf = GithubRepositoryPackage.unmarshal(JSON.stringify(dependency.config));
      const metaInformation = metaData[dependency.id] || '0.0.0';
      if (!metaInformation) {
        throw new Error("Expected meta information for pre-action, got nothing.");
      }
      const validVersion = Semver.valid(metaInformation);
      if (validVersion === null) {
        throw new Error("Expected semver version in meta information, got none");
      }
      const inUseVersion = Semver.clean(metaInformation);
      if (inUseVersion === null) {
        throw new Error("Could not clean semver version");
      }

      const location = path.resolve(temporaryLocation, githubPackageConf.repo);
      await cloneRepository({
        branch: githubPackageConf.branch,
        repository: githubPackageConf.repo,
        toLocation: location
      });
      const localPackageLocation = path.resolve(location, githubPackageConf.packageMinusLocation);
      const packageInfo = await loadPackageInformation({ location: localPackageLocation });
      const newVersion = packageInfo['version'];
      newMetaData[dependency.id] = newVersion;
      const diffVersion = Semver.diff(inUseVersion, newVersion);
      versionDiffs[dependency.id] = diffVersion;
    }
  }

  // Find which potential version change to do
  let versionChangeToDo: Semver.ReleaseType | null = null;
  for (const [id, version] of Object.entries(versionDiffs)) {
    const doMajor = version === 'major';
    const doMinor = version === 'minor' && versionChangeToDo !== 'major';
    const doPatch = version === 'patch' && versionChangeToDo !== 'major' && versionChangeToDo !== 'minor';
    if (doMajor ||
      doMinor ||
      doPatch ||
      versionChangeToDo === null) {
      versionChangeToDo = version;
    }
  }
  console.error(versionChangeToDo);

  if (versionChangeToDo !== null && location != undefined) {
    if (config.action?.type && config.action?.type === 'package') {
      const packageConfig = PackageAction.unmarshal(JSON.stringify(config.action.config));
      const packageDirLocation = path.dirname(path.resolve(temporaryLocation, location.repo, location.metaMinusLocation));
      runScript({
        location: packageDirLocation,
        script: packageConfig.script
      });
    }

    //Save new config file
    const metaLocation = path.resolve(temporaryLocation, location.repo, location.metaMinusLocation);
    writeMetaInformation({
      location: metaLocation,
      data: newMetaData
    });

    // for (const postAction of config.postMinusAction || []) {
    //   if (postAction?.type && postAction?.type === 'git-commit') {
    //     const commitConfig = GitCommit.unmarshal(JSON.stringify(postAction.config));
    //     let formattedCommit = commitConfig.commitMinusMessage;
    //     if (commitConfig.commitMinusType === 'conventional-commits') {
    //       formattedCommit = formatCommit(
    //         { 
    //           rawCommitMessage: formattedCommit, 
    //           context: { 
    //             commit: toConventionalCommit({ semver: versionChangeToDo }), 
    //             commitSentence: `${versionChangeToDo} version change` 
    //           } 
    //         });
    //     }
    //     commit({
    //       commitMessage: formattedCommit,
    //       location: path.dirname(metaLocation)
    //       // push: {
    //       //   branch: location.branch,
    //       //   origin: 'origin'
    //       // }
    //     });
    //   }
    // }
  }

}