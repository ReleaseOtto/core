import { Automate } from "./types/automator/Automate";
import * as path from 'path';
import { loadMetaConfig, writeMetaInformation } from "./utils/meta";
import { runAction } from "./commands/npm";
import { PackageAction } from "./types/automator/PackageAction";
import { fetchLocation } from "utils/location";
import { temporaryLocation } from "utils/globals";
import { getVersionChangeToDo, getVersionDiffs } from "utils/versionStrategies";
import * as Semver from 'semver';

export async function start(config: Automate) {
  const metaLocation = fetchLocation(config);
  const metaInfo = loadMetaConfig(metaLocation);
  const versionDiffs = await getVersionDiffs(config, metaInfo);
  const versionChangeToDo = getVersionChangeToDo(config, versionDiffs);

  if (versionChangeToDo !== null && config.location != undefined) {
    if (config.action?.type && config.action?.type === 'package') {
      runAction(config, config.action.config as PackageAction);
    }

    //Save new config file
    writeMetaInformation({
      config,
      versionDiffs
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

export async function check(config: Automate) {
  const metaLocation = fetchLocation(config);
  const metaInfo = loadMetaConfig(metaLocation);
  const versionDiffs = await getVersionDiffs(config, metaInfo);
  const versionChangeToDo = getVersionChangeToDo(config, versionDiffs);

  return versionChangeToDo !== null
}