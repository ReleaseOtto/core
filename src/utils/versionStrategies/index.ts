import * as Semver from 'semver';
import { getSemverVersionChangeToDo } from "./semver";
import { Automate } from "../../types/automator/Automate";
import { GithubLocationConfigVersionType } from '../../types/automator/GithubLocationConfigVersionType';
import { LocationType } from '../../types/automator/LocationType';
import { DependenciesType } from '../../types/automator/DependenciesType';
import { Meta } from '../../types/meta/Meta';
import { GithubRepositoryPackage } from '../../types/automator/GithubRepositoryPackage';
import { GithubRepositoryPackageVersionType } from '../../types/automator/GithubRepositoryPackageVersionType';
import { temporaryLocation } from '../globals';
import * as path from 'path';
import { cloneRepository } from '../../commands/git';
import { loadPackageInformation } from '../../commands/npm';

type VersionDiff = {
  /**
   * Current version stored in the meta config
   */
  localVersion: string,
  /**
   * Remote version in the dependent library/package
   */
  remoteVersion: string
}
export type SharedVersions = Record<string, VersionDiff>;
export type VersionChangeToDo = Semver.ReleaseType | null;

export function getVersionChangeToDo(config: Automate, dependencyVersions: SharedVersions): VersionChangeToDo {
  const locationType = config.location?.type;
  switch (locationType) {
    case LocationType.GITHUB:
      if (config.location?.config?.versionType === GithubLocationConfigVersionType.SEMVER || config.location?.config?.versionType === undefined) {
        return getSemverVersionChangeToDo(config, dependencyVersions);
      }
      throw new Error("Unable to determine versioning type for location");
    default:
      throw new Error("Unable to determine location type");
  }
}

function checkVersion(version: string, versionType: GithubRepositoryPackageVersionType | undefined) {
  if(versionType === GithubRepositoryPackageVersionType.SEMVER) {
    const validVersion = Semver.valid(version);
    if (validVersion === null) {
      throw new Error(`Expected semver version but didn't get that, value was ${versionType}`);
    }
    const inUseVersion = Semver.clean(version);
    if (inUseVersion === null) {
      throw new Error("Could not clean semver version");
    }
    return inUseVersion;
  }
  return version;
}

/**
 * Get version diffs between the versions of the generated code is relying on, vs what the remote version is.
 * 
 * This is a generic function that 
 */
export async function getVersionDiffs(config: Automate, metaInfo: Meta): Promise<SharedVersions> {
  const versionDiffs: Record<string, VersionDiff> = {};
  for (const dependency of config.dependencies || []) {
    if (dependency.type === DependenciesType.GITHUB_MINUS_REPOSITORY_MINUS_PACKAGE) {
      const githubPackageConf = GithubRepositoryPackage.unmarshal(JSON.stringify(dependency.config));
      let oldVersion = metaInfo.dependencies[dependency.id] || '0.0.0';
      if (!oldVersion) {
        throw new Error("Expected meta information for dependency, got nothing.");
      }
      oldVersion = checkVersion(oldVersion, githubPackageConf.versionType);

      const location = path.resolve(temporaryLocation, githubPackageConf.repo);
      cloneRepository({
        branch: githubPackageConf.branch,
        repository: githubPackageConf.repo,
        toLocation: location
      });
      const localPackageLocation = path.resolve(location, githubPackageConf.packageMinusLocation);
      const packageInfo = await loadPackageInformation({ location: localPackageLocation });
      const newVersion = packageInfo['version'];
      versionDiffs[dependency.id] = {
        localVersion: oldVersion,
        remoteVersion: newVersion
      };
    }
  }
  return versionDiffs;
}