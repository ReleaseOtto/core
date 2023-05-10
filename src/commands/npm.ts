import * as fs from 'fs';
import * as Shell from 'shelljs';
import { Automate } from '../types/automator/Automate';
import { PackageAction } from '../types/automator/PackageAction';
import { temporaryLocation } from '../utils/globals';
import * as path from 'path';
import { GithubLocationConfig } from '../types/automator/GithubLocationConfig';

export interface LoadPackageOptions {
    location: string
}

export async function loadPackageInformation({
    location
}: LoadPackageOptions) {
    try {
        const data = fs.readFileSync(location, 'utf8');
        const jsonData = JSON.parse(data);
        return jsonData;
    } catch(e) {
        throw new Error("Could not load package file");
    }
}
export interface RunScriptOptions {
    location: string
    script: string
}

export async function runScript({
    location,
    script
}: RunScriptOptions) {
    if (!Shell.which('npm')) {
        Shell.echo('Sorry, this script requires npm');
        Shell.exit(1);
    }
    Shell.cd(location);
    const install = Shell.exec(`npm ci`);
    if(install.code !== 0) {
        throw new Error(install.stderr);
    }
    const run = Shell.exec(`npm run ${script}`);
    if(run.code !== 0) {
        throw new Error(run.stderr);
    }
}

export async function runAction(config: Automate, packageConfig: PackageAction) {
    const location = config.location?.config as GithubLocationConfig;
    const packageDirLocation = path.dirname(path.resolve(temporaryLocation, location.repo, location.metaMinusLocation));
    runScript({
        location: packageDirLocation,
        script: packageConfig.script
    });
}