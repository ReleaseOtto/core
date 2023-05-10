import * as Semver from 'semver';
import { Automate } from '../../types/automator/Automate';
import { SharedVersions, VersionChangeToDo } from '.';

export function getSemverVersionChangeToDo(config: Automate, dependencyVersions: SharedVersions): VersionChangeToDo {
  // Find which potential version change to do
  let versionChangeToDo: Semver.ReleaseType | null = null;
  for (const [id, versions] of Object.entries(dependencyVersions)) {
    const versionDiff = Semver.diff(versions.localVersion, versions.remoteVersion);
    const doMajor = versionDiff === 'major';
    const doMinor = versionDiff === 'minor' && versionChangeToDo !== 'major';
    const doPatch = versionDiff === 'patch' && versionChangeToDo !== 'major' && versionChangeToDo !== 'minor';
    if (doMajor ||
      doMinor ||
      doPatch ||
      versionChangeToDo === null) {
      versionChangeToDo = versionDiff;
    }
  }
  return versionChangeToDo;
}