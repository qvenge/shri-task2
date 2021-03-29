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
  Sprint,
} from './raw-types';

export {
  IssueId,
  ProjectId,
  CommentId,
  CommitId,
  UserId,
  SprintId,
  SummaryId,
  Timestamp,
  EntityId,
  EntityType,
  Sprint,
} from './raw-types';

export type Project = Omit<RawProject, 'dependencies' | 'issues' | 'commits'> & {
  dependencies: ProjectId[];
  issues: IssueId[];
  commits: CommitId[];
};

export type User = Omit<RawUser, 'friends' | 'commits' | 'comments'> & {
  friends: UserId[];
  commits: CommitId[];
  comments: CommentId[];
};

export type Issue = Exclude<RawIssue, 'resolvedBy' | 'comments'> & {
  resolvedBy?: UserId;
  comments: CommentId[];
};

export type Comment = Omit<RawComment, 'author' | 'likes'> & {
  author: UserId;
  likes: UserId[];
};

export type Commit = Omit<RawCommit, 'author' | 'summaries'> & {
  author: UserId;
  summaries: SummaryId[];
};

export type Summary = Omit<RawSummary, 'comments'> & {
  comments: CommentId[];
};

export interface EntityGroups {
  projects: Map<ProjectId, Project>;
  users: Map<UserId, User>;
  issues: Map<IssueId, Issue>;
  comments: Map<CommitId, Comment>;
  commits: Map<CommitId, Commit>;
  summaries: Map<SummaryId, Summary>;
  sprints: Map<SprintId, Sprint>;
}

export type Entity = Project | User | Issue | Comment | Commit | Summary | Sprint;
