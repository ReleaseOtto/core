import * as Shell from 'shelljs';

interface CloneOptions {
    repository: string,
    toLocation: string,
    branch?: string,
}
export function cloneRepository({
    repository,
    branch,
    toLocation
}: CloneOptions ) {
    let options: string[] = [];
    if(branch !== undefined) {
        options.push(`--branch ${branch}`);
    }

    if (!Shell.which('git')) {
        Shell.echo('Sorry, this script requires git');
        Shell.exit(1);
    }

    const exec = Shell.exec(`git clone ${options.join(" ")} ${repository} ${toLocation}`);
    if(exec.code !== 0) {
        throw new Error(exec.stderr);
    }
}

interface CommitOptions {
    commitMessage: string,
    location: string,
    push?: {
        origin?: string
        branch?: string
    },
}
export function commit({
    location,
    commitMessage,
    push
}: CommitOptions ) {
    if (!Shell.which('git')) {
        Shell.echo('Sorry, this script requires git');
        Shell.exit(1);
    }
    Shell.cd(location);

    const somethingToCommit = Shell.exec('git diff-index --quiet HEAD --');
    if(somethingToCommit.code === 0) {
        console.info('Nothing to commit, exits');
        return;
    }

    const commit = Shell.exec(`git add --all && git commit -a -m"${commitMessage}"`);
    if(commit.code !== 0) {
        throw new Error(commit.stderr);
    }

    if(push) {
        const pushExec = Shell.exec(`git push --set-upstream ${push.origin} ${push.branch}`);
        if(pushExec.code !== 0) {
            throw new Error(pushExec.stderr);
        }
    }
}
