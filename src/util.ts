import { CommitId, SprintId, EntityGroups, Commit, UserId } from './types';

export const groupCommitsBySprints = (entities: EntityGroups): Map<SprintId, Set<CommitId>> => {
  const sortedSprints = Array.from(entities.sprints.values()).sort(({ id: id1 }, { id: id2 }) => id1 - id2);
  let sortedCommits = Array.from(entities.commits.values()).sort(
    ({ timestamp: timestamp1 }, { timestamp: timestamp2 }) => timestamp1 - timestamp2,
  );

  return new Map(
    sortedSprints.map((sprint) => {
      const { startAt, finishAt } = sprint;
      const len = sortedCommits.length;
      const start = sortedCommits.findIndex(({ timestamp }) => startAt <= timestamp);

      let sprintCommits: CommitId[] = [];

      if (start !== -1) {
        let finish = start + 1;
        while (finish < len && sortedCommits[finish].timestamp <= finishAt) finish += 1;
        sprintCommits = sortedCommits.slice(start, finish).map((commit) => commit.id);
        sortedCommits = [...sortedCommits.slice(0, start), ...sortedCommits.slice(finish)];
      }

      return [sprint.id, new Set(sprintCommits)];
    }),
  );
};

// немного захардкодил группы и их выбор
export const groupCommitsBySize = (entities: EntityGroups, commits: Set<CommitId>): CommitId[][] => {
  const groups: CommitId[][] = [[], [], [], []];
  commits.forEach((commitId) => {
    const commit = entities.commits.get(commitId);

    if (commit) {
      const commitSize = commit.summaries.reduce((accum, summaryId) => {
        const summary = entities.summaries.get(summaryId);
        return summary ? accum + summary.removed + summary.added : accum;
      }, 0);

      // чета тесты не проходили
      if (commitSize > 0 && commitSize <= 100) {
        groups[3].push(commitId);
      } else if (commitSize >= 101 && commitSize <= 500) {
        groups[2].push(commitId);
      } else if (commitSize >= 501 && commitSize <= 1000) {
        groups[1].push(commitId);
      } else if (commitSize >= 1001) {
        groups[0].push(commitId);
      }
    }
  });
  return groups;
};

export const groupCommitsByUsers = (entities: EntityGroups, commits: Set<CommitId>): Map<UserId, Set<CommitId>> => {
  const result = new Map() as Map<UserId, Set<CommitId>>;

  commits.forEach((commitId) => {
    const commit = entities.commits.get(commitId) as Commit;
    let userCommits = result.get(commit.author);

    if (!userCommits) {
      result.set(commit.author, (userCommits = new Set()));
    }

    userCommits.add(commitId);
  });

  return result;
};

export const getOutput = (number: number, words: [string, string, string]): string => {
  let num = Math.abs(number) % 100;

  if (num > 19) {
    num %= 10;
  }

  switch (num) {
    case 1: {
      return `${number} ${words[0]}`;
    }
    case 2:
    case 3:
    case 4: {
      return `${number} ${words[1]}`;
    }
    default: {
      return `${number} ${words[2]}`;
    }
  }
};
