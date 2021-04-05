import { Sprint, SprintId, Commit, EntityGroups, User } from './types';
import { LeadersData } from './stories';
import { groupCommitsByUsers } from './util';

export default function getLeadersData({
  entities,
  groupedCommits,
  selectedSprintId,
}: {
  entities: EntityGroups;
  groupedCommits: Map<SprintId, Commit[]>;
  selectedSprintId: number;
}): LeadersData {
  const currentSprint = entities.sprints.get(selectedSprintId) as Sprint;
  // ids коммитов текущего спринта
  const currentCommits = groupedCommits.get(selectedSprintId) as Commit[];
  const commitsGroupedByUsers = groupCommitsByUsers(currentCommits);

  const outputUsers = Array.from(commitsGroupedByUsers, ([userId, commits]) => {
    const userEntity = entities.users.get(userId) as User;
    return {
      id: userId,
      name: userEntity.name,
      avatar: userEntity.avatar,
      valueText: String(commits.length),
    };
  });

  // сортируем пользователей по количеству коммитов
  // если у пользователей одинаковое количество коммитов, то сортируем по их id
  outputUsers.sort((user1, user2) => {
    let val1 = Number(user1.valueText);
    let val2 = Number(user2.valueText);

    if (val1 === val2) {
      val1 = user2.id;
      val2 = user1.id;
    }

    return val2 - val1;
  });

  return {
    title: 'Больше всего коммитов',
    subtitle: currentSprint.name,
    emoji: '👑',
    users: outputUsers,
  };
}
