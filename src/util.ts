import { CommitId, SprintId, EntityGroups, Commit, UserId, Comment } from './types';

export const groupCommitsBySprints = (entities: EntityGroups): Map<SprintId, Commit[]> => {
  const sortedSprints = Array.from(entities.sprints.values()).sort(({ id: id1 }, { id: id2 }) => id1 - id2);
  let sortedCommits = Array.from(entities.commits.values()).sort(
    ({ timestamp: timestamp1 }, { timestamp: timestamp2 }) => timestamp1 - timestamp2,
  );

  return new Map(
    sortedSprints.map((sprint) => {
      const { startAt, finishAt } = sprint;
      const len = sortedCommits.length;
      const start = sortedCommits.findIndex(({ timestamp }) => startAt <= timestamp);

      let sprintCommits: Commit[] = [];

      if (start !== -1) {
        let finish = start + 1;
        while (finish < len && sortedCommits[finish].timestamp <= finishAt) finish += 1;
        sprintCommits = sortedCommits.slice(start, finish);
        sortedCommits = [...sortedCommits.slice(0, start), ...sortedCommits.slice(finish)];
      }

      return [sprint.id, sprintCommits];
    }),
  );
};

export const groupCommitsBySize = (entities: EntityGroups, commits: Commit[]): CommitId[][] => {
  const groups: CommitId[][] = [[], [], [], []];

  commits.forEach((commit) => {
    if (commit) {
      const commitSize = commit.summaries.reduce((accum, summaryId) => {
        const summary = entities.summaries.get(summaryId);
        return summary ? accum + summary.removed + summary.added : accum;
      }, 0);

      if (commitSize <= 100) {
        groups[3].push(commit.id);
      } else if (commitSize <= 500) {
        groups[2].push(commit.id);
      } else if (commitSize <= 1000) {
        groups[1].push(commit.id);
      } else {
        groups[0].push(commit.id);
      }
    }
  });

  return groups;
};

export const groupCommitsByUsers = (commits: Commit[]): Map<UserId, Commit[]> => {
  const result = new Map() as Map<UserId, Commit[]>;

  commits.forEach((commit) => {
    let userCommits = result.get(commit.author);

    if (!userCommits) {
      userCommits = [];
      result.set(commit.author, userCommits);
    }

    userCommits.push(commit);
  });

  return result;
};

export const groupCommentsByUsers = (comments: Comment[]): Map<UserId, Comment[]> => {
  const result = new Map() as Map<UserId, Comment[]>;

  comments.forEach((comment) => {
    let userCommits = result.get(comment.author);

    if (!userCommits) {
      userCommits = [];
      result.set(comment.author, userCommits);
    }

    userCommits.push(comment);
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
