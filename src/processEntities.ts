/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-param-reassign */
import {
  IssueId,
  ProjectId,
  CommentId,
  CommitId,
  UserId,
  SprintId,
  SummaryId,
  RawProject,
  RawUser,
  RawIssue,
  RawComment,
  RawCommit,
  RawSummary,
  RawEntity,
} from './raw-types';
import { Comment, Commit, Issue, Project, Summary, User, Sprint, EntityGroups } from './types';

function processSprint(result: EntityGroups, sprint: Sprint | SprintId): SprintId {
  if (typeof sprint === 'number') {
    return sprint;
  }

  const { id } = sprint;

  if (!result.sprints.has(id)) {
    result.sprints.set(id, { ...sprint });
  }

  return id;
}

function processSummary(result: EntityGroups, summary: RawSummary | SummaryId): SummaryId {
  if (typeof summary === 'number') {
    return summary;
  }

  const { id } = summary;

  if (!result.summaries.has(id)) {
    const comments = summary.comments?.map((comment) => processComment(result, comment)) ?? [];
    result.summaries.set(id, { ...summary, comments });
  }

  return id;
}

function processCommit(result: EntityGroups, commit: RawCommit | CommitId): CommitId {
  if (typeof commit === 'string') {
    return commit;
  }

  const { id } = commit;

  if (!result.commits.has(id)) {
    const author = processUser(result, commit.author);
    const summaries = commit.summaries.map((summary) => processSummary(result, summary));
    result.commits.set(id, { ...commit, author, summaries });
  }

  return id;
}

function processComment(result: EntityGroups, comment: RawComment | CommentId): CommentId {
  if (typeof comment === 'string') {
    return comment;
  }

  const { id } = comment;

  if (!result.comments.has(id)) {
    const author = processUser(result, comment.author);
    const likes = comment.likes.map((user) => processUser(result, user));
    result.comments.set(id, { ...comment, author, likes });
  }

  return id;
}

function processIssue(result: EntityGroups, issue: RawIssue | IssueId): IssueId {
  if (typeof issue === 'string') {
    return issue;
  }

  const { id } = issue;

  if (!result.issues.has(id)) {
    const comments = issue.comments?.map((comment) => processComment(result, comment)) ?? [];
    const castedIssue = { ...issue, comments } as Issue;

    if (issue.resolvedBy) {
      castedIssue.resolvedBy = processUser(result, issue.resolvedBy);
    }

    result.issues.set(id, castedIssue);
  }

  return id;
}

function processUser(result: EntityGroups, user: RawUser | UserId): UserId {
  if (typeof user === 'number') {
    return user;
  }

  const { id } = user;

  if (!result.users.has(id)) {
    const friends = user.friends.map((friend) => processUser(result, friend));
    const comments = user.comments?.map((comment) => processComment(result, comment)) ?? [];
    const commits = user.commits?.map((commit) => processCommit(result, commit)) ?? [];
    result.users.set(id, { ...user, friends, comments, commits });
  }

  return id;
}

function processProject(result: EntityGroups, project: RawProject | ProjectId): ProjectId {
  if (typeof project === 'string') {
    return project;
  }

  const { id } = project;

  if (!result.projects.has(id)) {
    const dependencies = project.dependencies.map((dep) => processProject(result, dep));
    const issues = project.issues.map((issue) => processIssue(result, issue));
    const commits = project.commits.map((commit) => processCommit(result, commit));
    result.projects.set(id, { ...project, dependencies, issues, commits });
  }

  return id;
}

export default function processEntities(entities: RawEntity[]): EntityGroups {
  const result: EntityGroups = {
    projects: new Map() as Map<ProjectId, Project>,
    users: new Map() as Map<UserId, User>,
    issues: new Map() as Map<IssueId, Issue>,
    comments: new Map() as Map<CommitId, Comment>,
    commits: new Map() as Map<CommitId, Commit>,
    summaries: new Map() as Map<SummaryId, Summary>,
    sprints: new Map() as Map<SprintId, Sprint>,
  };

  entities.forEach((entity) => {
    if (entity.type === 'Project') {
      processProject(result, entity);
    } else if (entity.type === 'User') {
      processUser(result, entity);
    } else if (entity.type === 'Issue') {
      processIssue(result, entity);
    } else if (entity.type === 'Comment') {
      processComment(result, entity);
    } else if (entity.type === 'Commit') {
      processCommit(result, entity);
    } else if (entity.type === 'Summary') {
      processSummary(result, entity);
    } else if (entity.type === 'Sprint') {
      processSprint(result, entity);
    }
  });

  return result;
}
