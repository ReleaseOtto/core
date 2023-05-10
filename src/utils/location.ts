import { Automate } from "../types/automator/Automate";
import { GithubLocationConfig } from "../types/automator/GithubLocationConfig";
import { LocationType } from "../types/automator/LocationType";
import * as path from 'path';
import { cloneRepository } from "../commands/git";
import { temporaryLocation } from "./globals";

export function fetchLocation(config: Automate): string {
  const location = config.location;
  if (location !== undefined) {
    if (config.location?.type === LocationType.GITHUB) {
      const githubLocation = config.location?.config as GithubLocationConfig;
      const ghLocation = path.resolve(temporaryLocation, githubLocation.repo);
      cloneRepository({
        branch: githubLocation.branch,
        repository: githubLocation.repo,
        toLocation: ghLocation
      });
      return path.resolve(ghLocation, githubLocation.metaMinusLocation);
    }
  }
  throw new Error("Unable to find defined location");
}