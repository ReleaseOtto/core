import * as Semver from 'semver';

interface FormatOptions {
  rawCommitMessage: string,
  context: {
    commit: string,
    commitSentence: string
  }
}

export function formatCommit({
  rawCommitMessage,
  context
}: FormatOptions) {
  rawCommitMessage.replace("{commit}", context.commit);
  rawCommitMessage.replace("{commit-sentence}", context.commitSentence);
  return rawCommitMessage;
}

interface ToConventionalOptions {
  semver: Semver.ReleaseType
}

export function toConventionalCommit({
  semver
}: ToConventionalOptions) {
  switch (semver) {
    case 'major':
      return 'feat!';
    case 'minor':
      return 'feat';
    case 'patch':
      return 'fix';
    default:
      return 'feat';
  }
}