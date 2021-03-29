import { Sprint, CommentId, UserId, EntityGroups, Comment, User } from './types';
import { VoteData } from './stories';
import { getOutput } from './util';

export default function getVoteData({
  entities,
  selectedSprintId,
}: {
  entities: EntityGroups;
  selectedSprintId: number;
}): VoteData {
  const currentSprint = entities.sprints.get(selectedSprintId) as Sprint;
  const sprintComments: Set<CommentId> = new Set();

  entities.comments.forEach((comment) => {
    if (currentSprint.startAt <= comment.createdAt && comment.createdAt <= currentSprint.finishAt) {
      sprintComments.add(comment.id);
    }
  });

  const commentsGroupedByUsers = new Map() as Map<UserId, Set<CommentId>>;

  sprintComments.forEach((commentId) => {
    const comment = entities.comments.get(commentId) as Comment;
    let comments = commentsGroupedByUsers.get(comment.author);

    if (!comments) {
      commentsGroupedByUsers.set(comment.author, (comments = new Set()));
    }

    comments.add(commentId);
  });

  const outputUsers = Array.from(commentsGroupedByUsers, ([userId, comments]) => {
    const userEntity = entities.users.get(userId) as User;
    let value = 0;

    comments.forEach((commentId) => {
      const comment = entities.comments.get(commentId) as Comment;
      value += comment.likes.length;
    });

    return {
      id: userId,
      name: userEntity.name,
      avatar: userEntity.avatar,
      valueText: getOutput(value, ['голос', 'голоса', 'голосов']),
    };
  });

  outputUsers.sort((user1, user2) => {
    let val1 = Number(user1.valueText.split(' ')[0]);
    let val2 = Number(user2.valueText.split(' ')[0]);

    if (val1 === val2) {
      val1 = user2.id;
      val2 = user1.id;
    }

    return val2 - val1;
  });

  return {
    title: 'Самый 🔎 внимательный разработчик',
    subtitle: currentSprint.name,
    emoji: '🔎',
    users: outputUsers,
  };
}
