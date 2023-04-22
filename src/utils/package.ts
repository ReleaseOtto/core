import * as fs from 'fs';
import * as Shell from 'shelljs';

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