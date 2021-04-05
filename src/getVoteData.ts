import { Sprint, EntityGroups, User } from './types';
import { VoteData } from './stories';
import { getOutput, groupCommentsByUsers } from './util';

export default function getVoteData({
  entities,
  selectedSprintId,
}: {
  entities: EntityGroups;
  selectedSprintId: number;
}): VoteData {
  const currentSprint = entities.sprints.get(selectedSprintId) as Sprint;
  // комментарии за текущий спринт
  const currentSprintComments = Array.from(entities.comments.values()).filter(
    (comment) => currentSprint.startAt <= comment.createdAt && comment.createdAt <= currentSprint.finishAt,
  );
  // группирую комментарии по авторам
  const commentsGroupedByUsers = groupCommentsByUsers(currentSprintComments);

  const outputUsers = Array.from(commentsGroupedByUsers, ([userId, comments]) => {
    const userEntity = entities.users.get(userId) as User;
    const value = comments.reduce((total, comment) => total + comment.likes.length, 0);

    return {
      id: userId,
      name: userEntity.name,
      avatar: userEntity.avatar,
      valueText: getOutput(value, ['голос', 'голоса', 'голосов']),
    };
  });

  // сортируем пользователей по количеству голосов
  // если у пользователей одинаковое количество голосов, то сортируем их по id
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
