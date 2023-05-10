import { Automate } from "types/automator/Automate";
import { DependenciesType } from "types/automator/DependenciesType";
import { GithubLocationConfig } from "types/automator/GithubLocationConfig";
import { GithubRepositoryPackage } from "types/automator/GithubRepositoryPackage";
import { LocationType } from "types/automator/LocationType";

export function createOttoConfig(obj: any): Automate {
  const otto = Automate.unmarshal(obj);
  switch (otto.location?.type) {
    case LocationType.GITHUB:
      otto.location.config = GithubLocationConfig.unmarshal(JSON.stringify(otto.location.config));
      break;
    default:
      break;
  }
  for (const dependency of otto.dependencies || []) {
    switch (dependency.type) {
      case DependenciesType.GITHUB_MINUS_REPOSITORY_MINUS_PACKAGE:
        dependency.config = GithubRepositoryPackage.unmarshal(JSON.stringify(dependency.config))
        break;
      default:
        break;
    }
  }
  return otto;
}
