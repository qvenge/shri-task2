/** UUID-like unique key */
export type UUID = string;
/** 32 or 40 chars */
export type HASH = string;

export type IssueId = HASH;
export type ProjectId = UUID;
export type CommentId = UUID;
export type CommitId = UUID;
export type UserId = number;
export type SprintId = number;
export type SummaryId = number;

/** Epoch in ms */
export type Timestamp = number;

/** Проект (пакет/сервис/репозиторий) */
export interface RawProject {
  id: ProjectId;
  type: 'Project';
  name: string;
  dependencies: (RawProject | ProjectId)[]; // другие проекты
  issues: (RawIssue | IssueId)[]; // заведенные issue
  commits: (RawCommit | CommitId)[]; // коммиты
}

/** Пользователь */
export interface RawUser {
  id: UserId;
  type: 'User';
  name: string;
  login: string;
  avatar: string;
  friends: (RawUser | UserId)[];
  commits?: (RawCommit | CommitId)[];
  comments?: (RawComment | CommentId)[];
}

/** Проблема */
export interface RawIssue {
  id: IssueId;
  type: 'Issue';
  name: string;
  status: 'open' | 'inProgress' | 'closed';
  resolution?: 'fixed' | 'cancelled' | 'duplicate';
  resolvedBy?: RawUser | UserId;
  comments: (RawComment | CommentId)[];
  createdAt: Timestamp;
  finishedAt?: Timestamp;
}

/** Комментарий */
export interface RawComment {
  id: CommentId;
  type: 'Comment';
  author: RawUser | UserId;
  message: string;
  likes: (RawUser | UserId)[];
  createdAt: Timestamp;
}

/** Коммит */
export interface RawCommit {
  id: CommitId;
  type: 'Commit';
  author: RawUser | UserId;
  message: string;
  summaries: (RawSummary | SummaryId)[];
  timestamp: Timestamp;
}

/** Файл внутри коммита ? */
export interface RawSummary {
  id: SummaryId;
  type: 'Summary';
  path: string;
  added: number;
  removed: number;
  comments?: (RawComment | CommentId)[];
}

/** Спринт */
export interface Sprint {
  id: SprintId;
  type: 'Sprint';
  name: string;
  startAt: Timestamp;
  finishAt: Timestamp;
}

export type RawEntity = RawProject | RawUser | RawIssue | RawComment | RawCommit | RawSummary | Sprint;

export type EntityId = RawEntity['id'];
export type EntityType = RawEntity['type'];
